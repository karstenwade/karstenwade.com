#!/bin/bash

################################################################################
# DreamHost GitHub Pages Sync Script
#
# Purpose: Synchronizes website content from GitHub Pages to DreamHost
# Author: Karsten Wade (via Claude Code)
# Usage: Run via cron every 5 minutes
#
# Cron Configuration:
# */5 * * * * cd /home/quaid/karstenwade.com && /home/quaid/karstenwade.com/scripts/sync-from-github.sh >> /home/quaid/logs/sync.log 2>&1
################################################################################

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
REPO_URL="https://github.com/karstenwade/karstenwade.com.git"
BRANCH="gh-pages"
DEPLOY_DIR="/home/quaid/karstenwade.com"
TEMP_DIR="${DEPLOY_DIR}/.sync-temp"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

# Logging functions
log_info() {
    echo "${LOG_PREFIX} INFO: $*"
}

log_error() {
    echo "${LOG_PREFIX} ERROR: $*" >&2
}

log_success() {
    echo "${LOG_PREFIX} SUCCESS: $*"
}

# Error handling
trap 'log_error "Script failed at line $LINENO"' ERR

# Main sync function
sync_from_github() {
    log_info "Starting GitHub Pages sync"

    # Create temp directory if it doesn't exist
    mkdir -p "${TEMP_DIR}"

    # Clone or pull the gh-pages branch
    if [ -d "${TEMP_DIR}/.git" ]; then
        log_info "Updating existing repository"
        cd "${TEMP_DIR}"

        # Fetch latest changes
        if ! git fetch origin "${BRANCH}"; then
            log_error "Failed to fetch from GitHub"
            return 1
        fi

        # Reset to match remote exactly
        if ! git reset --hard "origin/${BRANCH}"; then
            log_error "Failed to reset to origin/${BRANCH}"
            return 1
        fi

        log_info "Repository updated successfully"
    else
        log_info "Cloning repository for the first time"

        # Remove temp dir if it exists but isn't a git repo
        rm -rf "${TEMP_DIR}"

        # Clone only the gh-pages branch
        if ! git clone --depth 1 --single-branch --branch "${BRANCH}" "${REPO_URL}" "${TEMP_DIR}"; then
            log_error "Failed to clone repository"
            return 1
        fi

        log_info "Repository cloned successfully"
    fi

    # Sync files from temp to deploy directory
    log_info "Syncing files to ${DEPLOY_DIR}"

    # Use rsync to sync files, excluding .git directory and sync-temp
    if ! rsync -av --delete --exclude='.git' --exclude='.sync-temp' --exclude='scripts' --exclude='logs' "${TEMP_DIR}/" "${DEPLOY_DIR}/"; then
        log_error "Failed to sync files"
        return 1
    fi

    log_success "Sync completed successfully"
    return 0
}

# Main execution
main() {
    log_info "=== DreamHost Sync Script Started ==="

    # Check if git is available
    if ! command -v git &> /dev/null; then
        log_error "git command not found. Please install git."
        exit 1
    fi

    # Check if rsync is available
    if ! command -v rsync &> /dev/null; then
        log_error "rsync command not found. Please install rsync."
        exit 1
    fi

    # Run the sync
    if sync_from_github; then
        log_success "=== DreamHost Sync Script Completed Successfully ==="
        exit 0
    else
        log_error "=== DreamHost Sync Script Failed ==="
        exit 1
    fi
}

# Run main function
main "$@"
