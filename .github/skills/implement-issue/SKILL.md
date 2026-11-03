---
name: implement-issue
description: Implement a GitHub issue end to end and open a pull request. Use when asked to implement, work on, or fix a GitHub issue by number.
---

# Implement issue

1. Get the details: `gh issue view <number> --comments`. Read the body and comments for requirements and acceptance criteria.
2. Sync and branch: update the default branch, then create a branch such as `issue-<number>-<short-slug>`.
3. Implement following `AGENTS.md`: add or update BDD scenarios, domain logic and unit tests, and UI as needed. Keep changes focused on the issue.
4. Verify: `npm run lint`, `npm run build`, `npm test` and `npm run test:bdd` must pass. Update screenshot baselines only for intentional visual changes.
5. Commit with a clear message, including the trailer `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`, and push the branch.
6. Open a PR with `gh pr create`. The title should summarize the change, and the body should describe what changed and include `Closes #<number>`.
7. Report the PR URL.

If the issue is ambiguous or blocked, comment on the issue with `gh issue comment` explaining what is needed instead of guessing.
