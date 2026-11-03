<#
.SYNOPSIS
Polls GitHub for approved enhancement issues and implements each one in a new Copilot terminal.

.DESCRIPTION
An issue is picked up when it is open, authored by $Author, and labeled "enhancement" and "approved".
Copilot is launched in a new window with a prompt to implement it and open a PR that closes the issue.
The issue counts as complete once it is closed or a pull request referencing it exists.
The Copilot window is then force closed.

The script then monitors the PR until it is merged or closed. A comment by $Author starting with "Request: "
launches a new Copilot window to address it. The agent comments "Resolved" after pushing, which closes that window.
Once the PR is completed, polling for new issues resumes.
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

function Start-Agent($name, $prompt) {
    $promptFile = Join-Path ([IO.Path]::GetTempPath()) "copilot-$name.txt"
    Set-Content -Path $promptFile -Value $prompt -Encoding UTF8

    $command = "Set-Location '$repoRoot'; `$p = Get-Content -Raw '$promptFile'; copilot --yolo -i `$p"
    $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-NoProfile', '-Command', $command) -PassThru
    Write-Log "Started Copilot window (PID $($proc.Id)) for $name"
    [pscustomobject]@{ Process = $proc; PromptFile = $promptFile }
}

function Stop-Agent($agent) {
    # /T kills the whole tree (copilot and its children)
    taskkill /PID $agent.Process.Id /T /F *> $null
    Remove-Item $agent.PromptFile -ErrorAction SilentlyContinue
    Write-Log 'Closed Copilot window'
}

function Wait-Agent([scriptblock]$IsDone, $label) {
    $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds $CompletionPollSeconds
        try {
            if (& $IsDone) { return $true }
        }
        catch { Write-Log "Completion check failed: $_" }
    }
    Write-Log "Timed out waiting for $label"
    return $false
}

function Get-PullRequest($pr) {
    $json = gh pr view $pr --json state,comments
    if ($LASTEXITCODE -ne 0) { throw 'gh pr view failed' }
    $json | ConvertFrom-Json
}

function Test-ResolvedAfter($comments, $commentId) {
    $comments = @($comments)
    $index = [array]::FindIndex($comments, [Predicate[object]]{ param($c) $c.id -eq $commentId })
    if ($index -lt 0) { return $false }
    foreach ($c in ($comments | Select-Object -Skip ($index + 1))) {
        if ($c.author.login -eq $Author -and $c.body.Trim() -match '^Resolved\b') { return $true }
    }
    return $false
}

function Get-PendingRequest($comments) {
    foreach ($c in @($comments)) {
        if ($c.author.login -ne $Author -or $c.body -notmatch '^Request: ') { continue }
        if ($script:HandledRequests -contains $c.id) { continue }
        if (Test-ResolvedAfter $comments $c.id) { continue }
        return $c
    }
}

function Invoke-Issue($issue) {
    $number = $issue.number
    gh issue comment $number --body 'This issue was picked up by an agent. A pull request should eventually be created.'
    if ($LASTEXITCODE -ne 0) { Write-Log "Failed to comment on issue #$number" }

    $agent = Start-Agent "issue-$number" "Use the implement-issue skill to implement GitHub issue #$number ($($issue.title))."
    try {
        $done = Wait-Agent { Test-IssueComplete $number } "issue #$number"
        if ($done) { Write-Log "Issue #$number is complete" }
    }
    finally { Stop-Agent $agent }
}

function Invoke-Request($pr, $comment) {
    $prompt = "Pull request #$pr has a new change request from its owner:`n`n$($comment.body)`n`n" +
        "Run 'gh pr checkout $pr', address the request on the PR branch, make sure lint, build, unit tests and BDD tests pass, " +
        "then commit and push to the PR branch. After the push succeeds, run: gh pr comment $pr --body 'Resolved'. " +
        "The comment must be exactly Resolved. If you cannot address the request, comment explaining why instead of Resolved."
    $agent = Start-Agent "pr-$pr-comment-$($comment.id)" $prompt
    try {
        $done = Wait-Agent {
            $data = Get-PullRequest $pr
            $data.state -ne 'OPEN' -or (Test-ResolvedAfter $data.comments $comment.id)
        } "request on PR #$pr"
        if ($done) { Write-Log "Request on PR #$pr is resolved" }
    }
    finally { Stop-Agent $agent }
}

function Watch-PullRequest($pr) {
    Write-Log "Monitoring PR #$pr for 'Request: ' comments"
    while ($true) {
        try {
            $data = Get-PullRequest $pr
            if ($data.state -ne 'OPEN') {
                Write-Log "PR #$pr is $($data.state)"
                return
            }
            $request = Get-PendingRequest $data.comments
            if ($request) {
                Write-Log "New request on PR #$pr"
                $script:HandledRequests += $request.id
                Invoke-Request $pr $request
                continue
            }
        }
        catch { Write-Log "Error: $_" }
        Start-Sleep -Seconds $PollSeconds
    }
}

$script:Attempted = @()
$script:HandledRequests = @()
Write-Log "Watching for issues by $Author with labels: $($Labels -join ', ')"
while ($true) {
    try {
        $issue = Get-NextIssue
        if ($issue) {
            Write-Log "Found issue #$($issue.number): $($issue.title)"
            $script:Attempted += $issue.number
            Invoke-Issue $issue
            $pr = Get-LinkedPullRequests $issue.number | Select-Object -First 1
            if ($pr) { Watch-PullRequest $pr.number }
            continue
        }
    }
    catch { Write-Log "Error: $_" }
    Start-Sleep -Seconds $PollSeconds
}
