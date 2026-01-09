# Git Workflow & Branching Strategy

Last Updated: 2026-01-09

## Overview

This document outlines the git branching strategy and workflow for the Bluenode project. Following this workflow ensures code quality, proper review processes, and a clean git history.

## Branch Structure

### Main Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | Protected - No direct commits |
| `new-feature` | Feature development branch | Merge to main via merge request |
| `bugfix/*` or `hotfix/*` | Bug fixes and patches | Merge to main via merge request |

### Branch Naming Conventions

```
new-feature              # For new features
bugfix/description       # For bug fixes (e.g., bugfix/form-validation)
hotfix/description       # For urgent production fixes
feature/description      # For specific features (alternative to new-feature)
```

## Workflow

### 1. Starting New Work

**For New Features:**
```bash
# Switch to new-feature branch
git checkout new-feature

# Pull latest changes
git pull origin new-feature

# Create your feature (or work directly on new-feature)
# ... make changes ...
```

**For Bug Fixes:**
```bash
# Create a new bugfix branch from main
git checkout main
git pull origin main
git checkout -b bugfix/short-description

# ... make changes ...
```

**For Hotfixes (Urgent Production Issues):**
```bash
# Create a hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# ... make changes ...
```

### 2. Making Changes

1. Make your code changes
2. Test thoroughly
3. Update documentation (CHANGELOG.md, PROJECT-STATUS.md)
4. Commit with meaningful messages

**Commit Message Format:**
```
<type>: <subject>

<optional body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 3. Pushing Changes

**Push to Feature Branch:**
```bash
git push origin new-feature
```

**Push to Bugfix Branch:**
```bash
git push origin bugfix/short-description
```

**Push to Hotfix Branch:**
```bash
git push origin hotfix/critical-issue
```

### 4. Creating Merge Requests

**For GitLab (current setup):**
```bash
# After pushing your branch, create a merge request via GitLab UI
# Or use GitLab CLI if installed
```

**Merge Request Checklist:**
- [ ] Code is tested and working
- [ ] CHANGELOG.md is updated
- [ ] PROJECT-STATUS.md is updated (if applicable)
- [ ] Commit messages follow convention
- [ ] No conflicts with target branch
- [ ] Documentation is complete

### 5. Code Review & Merge

1. Create merge request from your branch to `main`
2. Wait for review (or self-review if solo developer)
3. Address any feedback
4. Merge when approved
5. Delete feature/bugfix branch after merge (optional but recommended)

## Rules

### ❌ DON'T:
- **Never commit directly to `main`**
- Don't push untested code
- Don't skip documentation updates
- Don't use generic commit messages ("fix", "update", etc.)
- Don't merge branches with conflicts

### ✅ DO:
- Always work on a feature/bugfix branch
- Write descriptive commit messages
- Update documentation with every change
- Test before pushing
- Keep commits atomic (one logical change per commit)
- Pull latest changes before starting work

## Common Commands

### Starting Work
```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b new-feature
# OR switch to existing feature branch
git checkout new-feature
git pull origin new-feature

# Create bugfix branch
git checkout -b bugfix/issue-description
```

### During Development
```bash
# Check status
git status

# Stage changes
git add <files>

# Commit
git commit -m "feat: add new feature description"

# Push to branch
git push origin <branch-name>
```

### Syncing with Main
```bash
# While on your feature branch
git checkout new-feature

# Pull latest from main and merge
git pull origin main

# Resolve any conflicts
# Then push
git push origin new-feature
```

### After Merge
```bash
# Switch back to main
git checkout main

# Pull merged changes
git pull origin main

# Delete local feature branch (optional)
git branch -d bugfix/issue-description
```

## Example: Bug Fix Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create bugfix branch
git checkout -b bugfix/console-logs

# 3. Make changes
# ... fix the bug ...

# 4. Update documentation
# ... update CHANGELOG.md ...

# 5. Commit
git add js/main.js CHANGELOG.md
git commit -m "fix: remove production console.log statements

- Remove console.log from main.js:257
- Remove console.log from onboarding.js:1091
- Update CHANGELOG.md with fix

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 6. Push to bugfix branch
git push origin bugfix/console-logs

# 7. Create merge request in GitLab UI
# Merge bugfix/console-logs → main

# 8. After merge, cleanup
git checkout main
git pull origin main
git branch -d bugfix/console-logs
```

## Example: Feature Workflow

```bash
# 1. Switch to new-feature branch
git checkout new-feature
git pull origin new-feature

# 2. Make changes
# ... add new feature ...

# 3. Update documentation
# ... update CHANGELOG.md, PROJECT-STATUS.md ...

# 4. Commit
git add <files>
git commit -m "feat: add dark mode toggle

- Implement theme switching
- Add localStorage persistence
- Update documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 5. Push to feature branch
git push origin new-feature

# 6. Create merge request in GitLab UI
# Merge new-feature → main

# 7. After merge, update local main
git checkout main
git pull origin main
```

## Emergency Hotfix Workflow

For critical production issues that need immediate fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-issue

# 2. Make minimal changes to fix the issue
# ... fix only the critical issue ...

# 3. Test thoroughly
# ... verify fix works ...

# 4. Update CHANGELOG.md with hotfix entry

# 5. Commit
git add <files>
git commit -m "fix(security): patch XSS vulnerability

Critical security fix for production

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 6. Push and create urgent merge request
git push origin hotfix/critical-security-issue

# 7. Merge to main immediately after review
# 8. Tag the release if needed
git checkout main
git pull origin main
git tag -a v2.1.1 -m "Hotfix: Security patch"
git push origin v2.1.1
```

## Notes

- This is a **solo developer project** currently, but following these practices prepares for team collaboration
- GitLab is used for remote hosting: `https://gitlab.lennyhomelab.net/bluenode-technlogies/bluenode.git`
- Adjust workflow as needed for project scale
- Consider using GitLab merge request templates for consistency

## Resources

- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitLab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)

---

**Remember:** The `main` branch should always be stable and deployable. All development happens in feature/bugfix branches!
