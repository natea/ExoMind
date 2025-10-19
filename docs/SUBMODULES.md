# Git Submodules Management

This project uses git submodules to include external projects and dependencies.

## Included Submodules

All submodules are located in the `modules/` directory:

- **superpowers** - Enhanced Claude Code skills and capabilities
  - Path: `modules/superpowers`
  - Repository: https://github.com/natea/superpowers

- **mcp-getgather** - MCP server for gathering context
  - Path: `modules/mcp-getgather`
  - Repository: https://github.com/natea/mcp-getgather

- **Skill_Seekers** - Skill acquisition and management system
  - Path: `modules/Skill_Seekers`
  - Repository: https://github.com/natea/Skill_Seekers

- **life-os** - Personal operating system and productivity tools
  - Path: `modules/life-os`
  - Repository: https://github.com/natea/life-os

## Initial Setup

When cloning this repository for the first time, initialize and update all submodules:

```bash
# Clone the repository
git clone <this-repo-url>
cd ExoMind

# Initialize and update all submodules
git submodule init
git submodule update

# Or do both in one command
git submodule update --init --recursive
```

## Quick Clone with Submodules

Clone the repository with all submodules in one command:

```bash
git clone --recurse-submodules <this-repo-url>
```

## Working with Submodules

### Update All Submodules

Pull the latest changes from all submodule repositories:

```bash
# Update all submodules to latest commit on their tracked branch
git submodule update --remote --recursive

# Update and merge changes
git submodule update --remote --merge
```

### Update a Specific Submodule

```bash
# Update specific submodule
git submodule update --remote modules/superpowers

# Or navigate to the submodule and pull
cd modules/superpowers
git pull origin main
cd ../..
```

### Check Submodule Status

```bash
# Show current commit for each submodule
git submodule status

# Show detailed information
git submodule foreach git status
```

### Make Changes in a Submodule

```bash
# Navigate to the submodule
cd modules/superpowers

# Make your changes and commit
git checkout -b feature-branch
# ... make changes ...
git add .
git commit -m "Your changes"
git push origin feature-branch

# Return to parent repository
cd ../..

# Update parent repository to track the new commit
git add modules/superpowers
git commit -m "Update superpowers submodule"
git push
```

### Change Submodule Branch

```bash
# Set submodule to track a specific branch
git config -f .gitmodules submodule.modules/superpowers.branch develop

# Update to the new branch
git submodule update --remote modules/superpowers
```

## Common Commands

### Add New Submodule
```bash
git submodule add <repository-url> modules/<module-name>
```

### Remove a Submodule
```bash
# Remove from .gitmodules and .git/config
git submodule deinit -f modules/<module-name>

# Remove from working tree and .git/modules
git rm -f modules/<module-name>

# Commit the changes
git commit -m "Remove <module-name> submodule"
```

### Reset Submodule to Tracked Commit
```bash
# Reset a submodule to the commit tracked by the parent repo
git submodule update --init modules/<module-name>
```

### Update All Submodules to Latest
```bash
# Update all submodules to their latest commits
git submodule update --remote --recursive

# Commit the updates
git add .
git commit -m "Update all submodules to latest"
```

## Troubleshooting

### Submodule Shows Modified but No Changes

```bash
# This often happens with line ending differences
cd modules/<module-name>
git diff
git checkout -- .
```

### Submodule in Detached HEAD State

```bash
cd modules/<module-name>
git checkout main  # or appropriate branch
cd ../..
git add modules/<module-name>
git commit -m "Update submodule branch"
```

### Clean Submodule State

```bash
# Clean all submodules
git submodule foreach --recursive git clean -xfd
git submodule foreach --recursive git reset --hard
git submodule update --init --recursive
```

## CI/CD Integration

When using CI/CD pipelines, ensure submodules are initialized:

```bash
# In your CI/CD script
git submodule update --init --recursive
```

## Best Practices

1. **Always commit submodule updates**: After updating a submodule, commit the change in the parent repository
2. **Document submodule purposes**: Keep this file updated with the purpose of each submodule
3. **Pin to specific commits**: Avoid tracking branches in production; pin to specific commits
4. **Regular updates**: Periodically update submodules to get bug fixes and improvements
5. **Test after updates**: Always test the parent project after updating submodules
6. **Communicate changes**: When updating submodules, communicate changes to your team

## Automation Scripts

### Update All and Test
```bash
#!/bin/bash
# update-submodules.sh

echo "Updating all submodules..."
git submodule update --remote --recursive

echo "Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo "Tests passed! Committing updates..."
    git add .
    git commit -m "Update submodules to latest versions"
    echo "Done! Remember to push: git push"
else
    echo "Tests failed. Rolling back..."
    git submodule update --recursive
fi
```

### Status Check
```bash
#!/bin/bash
# submodule-status.sh

echo "Checking submodule status..."
git submodule foreach '
    echo "=== $name ==="
    git fetch
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})

    if [ $LOCAL = $REMOTE ]; then
        echo "✓ Up to date"
    else
        echo "⚠ Updates available"
        git log --oneline $LOCAL..$REMOTE
    fi
    echo ""
'
```

## Resources

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub Submodules Guide](https://github.blog/2016-02-01-working-with-submodules/)
