# AR Claude Skills Symlink Script

## Overview

This script safely creates symlinks from `modules/ar-claude-skills/` subdirectories into `.claude/skills/` without overwriting existing skills.

## Usage

### Dry Run (Preview Changes)

```bash
./scripts/symlink-ar-skills.sh --dry-run
```

This will show what symlinks would be created without making any changes.

### Create Symlinks

```bash
./scripts/symlink-ar-skills.sh
```

This will create the symlinks for real.

## What It Does

The script symlinks all subdirectories from these source locations:

1. **C-Level Advisors** (`modules/ar-claude-skills/c-level-advisor/`)
   - ceo-advisor
   - cto-advisor

2. **Marketing Skills** (`modules/ar-claude-skills/marketing-skill/`)
   - content-creator
   - marketing-strategy-pmm
   - marketing-demand-acquisition

3. **Product Team** (`modules/ar-claude-skills/product-team/`)
   - agile-product-owner
   - product-manager-toolkit
   - product-strategist
   - ux-researcher-designer
   - ui-design-system

## Safety Features

✓ **Non-destructive**: Never overwrites existing files or symlinks
✓ **Dry-run mode**: Preview changes before applying
✓ **Relative paths**: Uses `../../modules/ar-claude-skills/...` for portability
✓ **Error reporting**: Clear status for each operation
✓ **Color-coded output**: Easy to see what happened

## Output Legend

- `✓ CREATE` (green) - Symlink will be/was created
- `⊘ SKIP` (yellow) - Target already exists
- `✗ ERROR` (red) - Operation failed

## Example Output

```
=== DRY RUN MODE - No changes will be made ===

Project Root: /path/to/ExoMind
Target Directory: /path/to/ExoMind/.claude/skills
Source Base: /path/to/ExoMind/modules/ar-claude-skills

Processing: c-level-advisor
✓ CREATE ceo-advisor -> ../../modules/ar-claude-skills/c-level-advisor/ceo-advisor
✓ CREATE cto-advisor -> ../../modules/ar-claude-skills/c-level-advisor/cto-advisor

Processing: marketing-skill
✓ CREATE content-creator -> ../../modules/ar-claude-skills/marketing-skill/content-creator
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created:  10 symlinks
Skipped:  0 (already exist)
Errors:   0
```

## Verifying Symlinks

After running the script, verify the symlinks were created:

```bash
ls -la .claude/skills/
```

You should see symlinks pointing to `../../modules/ar-claude-skills/...`

## Removing Symlinks

If you need to remove the symlinks later:

```bash
# Remove specific skill
rm .claude/skills/ceo-advisor

# Or use find to remove all ar-claude-skills symlinks
find .claude/skills -type l -lname "../../modules/ar-claude-skills/*" -delete
```

## Troubleshooting

### "Source directory not found" error

Ensure the git submodule is initialized:

```bash
git submodule update --init --recursive modules/ar-claude-skills
```

### Permission errors

Make sure the script is executable:

```bash
chmod +x scripts/symlink-ar-skills.sh
```

## Integration with Git

These symlinks should be committed to version control. Add to `.gitignore` if you want to exclude them:

```gitignore
# Add to .gitignore if you want to exclude symlinks
.claude/skills/ceo-advisor
.claude/skills/cto-advisor
# etc...
```

However, it's recommended to commit the symlinks so team members automatically get access to these skills.
