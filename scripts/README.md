# DreamHost Sync Scripts

## sync-from-github.sh

Synchronizes website content from GitHub Pages to DreamHost hosting.

### Purpose

This script mirrors the GitHub Pages deployment to DreamHost, ensuring both hosting locations serve identical content. It runs automatically via cron every 5 minutes.

### How It Works

1. **Clone/Update**: Clones or updates the `gh-pages` branch to a temporary directory
2. **Sync**: Uses `rsync` to copy files from temp directory to the web root
3. **Cleanup**: Excludes `.git`, scripts, and logs from the sync
4. **Logging**: Outputs timestamped logs for monitoring

### Prerequisites

- `git` command installed
- `rsync` command installed
- SSH access to DreamHost
- Write permissions to deployment directory

### Installation on DreamHost

1. **Clone this repository to DreamHost:**
   ```bash
   cd /home/quaid
   git clone https://github.com/karstenwade/karstenwade.com.git
   cd karstenwade.com
   ```

2. **Make the script executable:**
   ```bash
   chmod +x scripts/sync-from-github.sh
   ```

3. **Create log directory:**
   ```bash
   mkdir -p /home/quaid/logs
   ```

4. **Test the script manually:**
   ```bash
   cd /home/quaid/karstenwade.com
   ./scripts/sync-from-github.sh
   ```

5. **Add to crontab:**
   ```bash
   crontab -e
   ```

   Add this line:
   ```bash
   */5 * * * * cd /home/quaid/karstenwade.com && /home/quaid/karstenwade.com/scripts/sync-from-github.sh >> /home/quaid/logs/sync.log 2>&1
   ```

### Configuration

Edit the script to customize these variables:

```bash
REPO_URL="https://github.com/karstenwade/karstenwade.com.git"
BRANCH="gh-pages"
DEPLOY_DIR="/home/quaid/karstenwade.com"
TEMP_DIR="${DEPLOY_DIR}/.sync-temp"
```

### Cron Schedule Explanation

```
*/5 * * * *
│   │ │ │ │
│   │ │ │ └─── Day of week (0-7, Sun=0 or 7)
│   │ │ └───── Month (1-12)
│   │ └─────── Day of month (1-31)
│   └───────── Hour (0-23)
└─────────── Minute (0-59)

*/5 = Every 5 minutes
```

### Monitoring

**View recent sync logs:**
```bash
tail -f /home/quaid/logs/sync.log
```

**Check last sync status:**
```bash
tail -n 20 /home/quaid/logs/sync.log | grep -E "(SUCCESS|ERROR)"
```

**Verify cron is running:**
```bash
crontab -l
```

### Troubleshooting

**Script not running:**
- Check cron is active: `systemctl status cron` or `ps aux | grep cron`
- Verify crontab entry: `crontab -l`
- Check script permissions: `ls -l scripts/sync-from-github.sh`

**Sync failing:**
- Check git is installed: `git --version`
- Check rsync is installed: `rsync --version`
- Verify network access to GitHub: `curl -I https://github.com`
- Check log file for errors: `tail -n 50 /home/quaid/logs/sync.log`

**Permission errors:**
- Ensure deploy directory is writable: `ls -ld /home/quaid/karstenwade.com`
- Check temp directory permissions: `ls -ld /home/quaid/karstenwade.com/.sync-temp`

### Manual Sync

To manually trigger a sync:

```bash
cd /home/quaid/karstenwade.com
./scripts/sync-from-github.sh
```

### Stopping Automatic Sync

To disable the cron job:

```bash
crontab -e
# Comment out or delete the sync line
```

### Security Notes

- The script uses HTTPS clone (no SSH keys required)
- Read-only access to GitHub (pulls only)
- Script uses `set -euo pipefail` for safe error handling
- Logs are append-only to preserve history

### Maintenance

**Rotate logs monthly:**
Add to crontab:
```bash
0 0 1 * * mv /home/quaid/logs/sync.log /home/quaid/logs/sync-$(date +\%Y-\%m).log && touch /home/quaid/logs/sync.log
```

**Clean old temp files:**
```bash
rm -rf /home/quaid/karstenwade.com/.sync-temp
```

### Support

For issues or questions:
- Check logs first: `/home/quaid/logs/sync.log`
- Review this README
- Contact: karsten@karstenwade.com
