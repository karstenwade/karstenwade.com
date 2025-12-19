# Port Management Rule

## CRITICAL: Before starting ANY dev server

1. **READ** `~/.claude/port-registry.json` first
2. **CHECK** if the assigned port is available
3. **USE** the assigned port, never default ports

## karstenwade.com Port Assignments

| Service | Port | Command |
|---------|------|---------|
| Next.js dev server | **3001** | `npm run dev:next` |
| Strapi CMS | **1337** | `npm run develop` (in cms/) |

## Commands

```bash
# Check if port 3001 is available
lsof -i :3001 2>/dev/null | grep LISTEN || echo "Port 3001 is free"

# Start dev server (uses port 3001 via npm script)
npm run dev:next

# Check all dev servers
ss -tlnp | grep -E ':(3000|3001|1337)'
```

## Never

- Start a server without checking port availability
- Use port 3000 (reserved for ainative-nextjs)
- Kill processes without user permission
