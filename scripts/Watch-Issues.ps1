<#
.SYNOPSIS
Polls GitHub for approved enhancement issues and implements each one in a new Copilot terminal.

.DESCRIPTION
An issue is picked up when it is open, authored by $Author, and labeled "enhancement" and "approved".
Copilot is launched in a new window with a prompt to implement it and open a PR that closes the issue.
The issue counts as complete once it is closed or a pull request referencing it exists.
The Copilot window is then force closed and polling resumes.
#>
[CmdletBinding()]
param(
    [string]$Author = 'devyndamonster',
    [string[]]$Labels = @('enhancement', 'approved'),
    [int]$PollSeconds = 60,
    [int]$CompletionPollSeconds = 30,
    [int]$TimeoutMinutes = 120
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Write-Log($message) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $message"
}

function Get-LinkedPullRequests($number) {
    $json = gh pr list --state all --search "#$number in:body" --json number,body,headRefName
    if ($LASTEXITCODE -ne 0) { throw 'gh pr list failed' }
    @($json | ConvertFrom-Json | Where-Object {
        $_.body -match "(?i)\b(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#$number\b" -or $_.headRefName -match "(^|[/-])$number([/-]|$)"
    })
}

function Get-NextIssue {
    $args = @('issue', 'list', '--state', 'open', '--author', $Author, '--json', 'number,title,body')
    foreach ($label in $Labels) { $args += @('--label', $label) }
    $json = gh @args
    if ($LASTEXITCODE -ne 0) { throw 'gh issue list failed' }
    foreach ($issue in ($json | ConvertFrom-Json | Sort-Object number)) {
        if ($script:Attempted -contains $issue.number) { continue }
        if ((Get-LinkedPullRequests $issue.number).Count -gt 0) { continue }
        return $issue
    }
}

function Test-IssueComplete($number) {
    $state = gh issue view $number --json state --jq '.state'
    if ($LASTEXITCODE -ne 0) { throw 'gh issue view failed' }
    return $state -eq 'CLOSED' -or (Get-LinkedPullRequests $number).Count -gt 0
}

function Invoke-Issue($issue) {
    $number = $issue.number
    $promptFile = Join-Path ([IO.Path]::GetTempPath()) "copilot-issue-$number.txt"
    $prompt = "Implement GitHub issue #$number ($($issue.title)) in this repository. " +
        "Read it with 'gh issue view $number'. Work on a new branch, follow the repo conventions, make sure lint, build and tests pass, " +
        "then open a pull request whose description contains 'Closes #$number'."
    Set-Content -Path $promptFile -Value $prompt -Encoding UTF8

    $command = "Set-Location '$repoRoot'; `$p = Get-Content -Raw '$promptFile'; copilot --yolo -i `$p"
    $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-NoProfile', '-Command', $command) -PassThru
    Write-Log "Started Copilot window (PID $($proc.Id)) for issue #$number"

    try {
        $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Seconds $CompletionPollSeconds
            try {
                if (Test-IssueComplete $number) {
                    Write-Log "Issue #$number is complete"
                    return
                }
            }
            catch { Write-Log "Completion check failed: $_" }
        }
        Write-Log "Timed out waiting for issue #$number"
    }
    finally {
        # /T kills the whole tree (copilot and its children)
        taskkill /PID $proc.Id /T /F *> $null
        Remove-Item $promptFile -ErrorAction SilentlyContinue
        Write-Log 'Closed Copilot window'
    }
}

$script:Attempted = @()
Write-Log "Watching for issues by $Author with labels: $($Labels -join ', ')"
while ($true) {
    try {
        $issue = Get-NextIssue
        if ($issue) {
            Write-Log "Found issue #$($issue.number): $($issue.title)"
            $script:Attempted += $issue.number
            Invoke-Issue $issue
            continue
        }
    }
    catch { Write-Log "Error: $_" }
    Start-Sleep -Seconds $PollSeconds
}
