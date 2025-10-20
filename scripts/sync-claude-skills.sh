#!/bin/bash
# Sync skills to .claude/skills directory using symlinks

echo "🔗 Creating symlinks from skills/ to .claude/skills/"

# Create .claude/skills directory if it doesn't exist
mkdir -p .claude/skills

# Remove existing .claude/skills content (but keep the directory)
rm -rf .claude/skills/*

# Create symlinks for each skill
for skill_dir in skills/*/; do
    skill_name=$(basename "$skill_dir")
    echo "  Linking $skill_name..."
    ln -s "../../skills/$skill_name" ".claude/skills/$skill_name"
done

echo "✅ Done! .claude/skills now contains symlinks to skills/"
echo ""
echo "Benefits:"
echo "  - Single source of truth in skills/"
echo "  - Changes in either location affect both"
echo "  - No file duplication"
echo "  - Git tracks only the real files in skills/"
