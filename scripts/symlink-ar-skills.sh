#!/bin/bash

# Script to symlink ar-claude-skills subdirectories into .claude/skills
# Usage: ./scripts/symlink-ar-skills.sh [--dry-run]
#
# This script safely creates symlinks without overwriting existing skills

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${BLUE}=== DRY RUN MODE - No changes will be made ===${NC}\n"
fi

# Base directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_TARGET_DIR="$PROJECT_ROOT/.claude/skills"
AR_SKILLS_BASE="$PROJECT_ROOT/modules/ar-claude-skills"

# Source directories to process
SOURCE_DIRS=(
    "c-level-advisor"
    "marketing-skill"
    "product-team"
)

# Counters
CREATED=0
SKIPPED=0
ERRORS=0

echo "Project Root: $PROJECT_ROOT"
echo "Target Directory: $SKILLS_TARGET_DIR"
echo "Source Base: $AR_SKILLS_BASE"
echo ""

# Ensure target directory exists
if [[ ! -d "$SKILLS_TARGET_DIR" ]]; then
    echo -e "${YELLOW}Creating target directory: $SKILLS_TARGET_DIR${NC}"
    if [[ "$DRY_RUN" == false ]]; then
        mkdir -p "$SKILLS_TARGET_DIR"
    fi
fi

# Function to create symlink
create_symlink() {
    local source_path="$1"
    local target_name="$2"
    local target_path="$SKILLS_TARGET_DIR/$target_name"

    # Calculate relative path from .claude/skills to the source
    # .claude/skills -> ../../modules/ar-claude-skills/...
    local relative_source="../../modules/ar-claude-skills/$(echo "$source_path" | sed "s|^$AR_SKILLS_BASE/||")"

    # Check if target already exists
    if [[ -e "$target_path" || -L "$target_path" ]]; then
        if [[ -L "$target_path" ]]; then
            local existing_target=$(readlink "$target_path")
            echo -e "${YELLOW}⊘ SKIP${NC} $target_name (already exists, points to: $existing_target)"
        else
            echo -e "${YELLOW}⊘ SKIP${NC} $target_name (exists as regular file/directory)"
        fi
        ((SKIPPED++))
        return
    fi

    # Create symlink
    echo -e "${GREEN}✓ CREATE${NC} $target_name -> $relative_source"
    if [[ "$DRY_RUN" == false ]]; then
        if ln -s "$relative_source" "$target_path"; then
            ((CREATED++))
        else
            echo -e "${RED}✗ ERROR${NC} Failed to create symlink for $target_name"
            ((ERRORS++))
        fi
    else
        ((CREATED++))
    fi
}

# Process each source directory
for source_category in "${SOURCE_DIRS[@]}"; do
    source_dir="$AR_SKILLS_BASE/$source_category"

    echo -e "\n${BLUE}Processing: $source_category${NC}"

    if [[ ! -d "$source_dir" ]]; then
        echo -e "${RED}✗ ERROR${NC} Source directory not found: $source_dir"
        ((ERRORS++))
        continue
    fi

    # Find all subdirectories (not files) in this category
    while IFS= read -r -d '' skill_dir; do
        skill_name=$(basename "$skill_dir")
        create_symlink "$skill_dir" "$skill_name"
    done < <(find "$source_dir" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z) || true
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Created:${NC}  $CREATED symlinks"
echo -e "${YELLOW}Skipped:${NC}  $SKIPPED (already exist)"
echo -e "${RED}Errors:${NC}   $ERRORS"
echo ""

if [[ "$DRY_RUN" == true ]]; then
    echo -e "${BLUE}This was a dry run. Run without --dry-run to apply changes.${NC}"
fi

# Exit with error code if there were errors
if [[ $ERRORS -gt 0 ]]; then
    exit 1
fi
