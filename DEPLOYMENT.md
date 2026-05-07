# Pick-A-Date - Deployment Guide

This guide provides step-by-step instructions for deploying Pick-A-Date to a Raspberry Pi for production use.

**Deployment Strategy**: Build on your Mac (fast), transfer to Raspberry Pi (simple).

---

## Quick Overview

The deployment process is split into two parts:

1. **Build on your Mac** (Steps 1-3)
   - Install dependencies
   - Build production bundle
   - Transfer files to Pi

2. **Deploy on Raspberry Pi** (Steps 4-6)
   - Setup Raspberry Pi OS and Node.js
   - Install production dependencies
   - Start application with PM2

**Benefits of this approach**:
- ✅ Much faster builds (Mac is faster than Pi)
- ✅ Simpler Pi setup (no build tools needed)
- ✅ Smaller installation on Pi
- ✅ Same workflow for updates

---

## Prerequisites

### Development Machine (Mac)
- **Node.js v18+** (for building the application)
- **npm v9+**
- **SSH access** to Raspberry Pi

### Raspberry Pi Requirements
- **Raspberry Pi 3B+** (Cortex-A53 ARMv8 64-bit @ 1.4GHz, 1GB RAM)
- **Raspberry Pi OS** (Bookworm GNU/Linux)
- **Network connection** (Ethernet or WiFi)
- **Node.js v18 LTS** (runtime only - no build tools needed)

### Raspberry Pi Information
- **Current IP**: 192.168.1.154
- **SSH Access**: `ssh jesse@192.168.1.154` (password: `vogelvogel`)
- **Project Location**: `~/pick-a-date/`

---

## Part 1: Build on Your Mac

### Step 1: Install Dependencies

```bash
# Navigate to your project directory
cd /Users/jesse/code/pi-projects/pick-a-date

# Install all dependencies (including dev dependencies for building)
npm install
```

### Step 2: Build for Production

```bash
# Build the entire application for production
npm run build
```

This command:
1. Builds the React frontend with Vite → `dist/client/`
2. Compiles the TypeScript backend → `dist/server/`
3. Copies JSON data files to `dist/server/src/data/`

**Verify the build**:
```bash
ls -la dist/client/        # Should see index.html, assets/, etc.
ls -la dist/server/src/index.js  # Backend entry point
```

### Step 3: Transfer Built Application to Raspberry Pi

**From your Mac**, transfer the built application to your Raspberry Pi using rsync:

```bash
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '*.md' \
  --exclude '.env' \
  /Users/jesse/code/pi-projects/pick-a-date/ \
  jesse@192.168.1.154:~/code/pick-a-date/
```

**What gets transferred**:
- ✅ `dist/server/` - Compiled backend code
- ✅ `dist/client/` - Built React frontend
- ✅ `server/src/data/` - Data files (JSON templates)
- ✅ `package.json` - Dependency list
- ✅ All source code (for reference)
- ❌ `node_modules` - Will install on Pi
- ❌ `.git` - Not needed on Pi

---

## Part 2: Setup and Run on Raspberry Pi

### Step 4: Install Dependencies

**On the Raspberry Pi**, install the dependencies needed to run the app:

```bash
# SSH into your Pi
ssh jesse@192.168.1.154

# Navigate to project directory
cd ~/pick-a-date

# Install production dependencies
npm install --omit=dev
```

**What gets installed**:
- Runtime dependencies: express, cors, better-sqlite3, react, react-dom, etc.
- Skips dev dependencies: typescript, vite, tsx, etc. (already used during build)

**Note**: If you get module not found errors, run `npm install` (without --omit=dev) to install all dependencies.

### Step 5: Install and Configure PM2

PM2 is a process manager that keeps your app running and restarts it on crashes or reboots.

```bash
# On the Raspberry Pi
# Install PM2 globally (if not already installed)
sudo npm install -g pm2

# Check for any existing pick-a-date processes
pm2 status

# If you see duplicate "pick-a-date" processes, delete them:
# pm2 delete <id>  # Replace <id> with the process ID from pm2 status
```

### Step 6: Start the App with PM2

```bash
# On the Raspberry Pi
cd ~/pick-a-date

# Start the app with PM2
NODE_ENV=production pm2 start dist/server/src/index.js --name pick-a-date

# Save PM2 configuration to restart on reboot
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# Follow the instructions output by the command above
# It will look something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u jesse --hp /home/jesse
```

**Verify the application is running**:
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs pick-a-date --lines 30

# Test the API health endpoint
curl http://localhost:3000/api/health
# Should return: {"status":"ok"}
```

---

## Part 3: Access and Test

### Step 7: Access the Application

**From any browser** on the same network:
```
http://192.168.1.154:3000
```

### Step 8: Test the Application

1. Open the URL in your browser
2. You should see the Pick-A-Date interface
3. Click "Generate Random Date Idea" - verify a date idea appears
4. Mark a date as completed - verify it's tracked
5. Test on mobile devices on the same network
6. Refresh the page - completed dates should persist

---

## Part 4: Optional Configuration

### Optional - Use Port 80 (No Port Number in URL)

If you want to access the app as `http://192.168.1.154` instead of `http://192.168.1.154:3000`:

#### Option A: Port Forwarding with iptables (Recommended)
```bash
# Redirect port 80 to 3000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Make it persistent across reboots
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

#### Option B: Change Port in PM2 Configuration
```bash
# Delete existing PM2 process
pm2 delete pick-a-date

# Start on port 80 (requires sudo)
sudo NODE_ENV=production pm2 start dist/server/src/index.js --name pick-a-date -- --port 80

# Save configuration
sudo pm2 save
```

**Note**: Running on port 80 requires root privileges. Option A (port forwarding) is recommended.

### Optional - External Access (Outside Home Network)

To access the app from outside your home network:

#### 1. Set Static IP for Raspberry Pi

Edit DHCP configuration:
```bash
sudo nano /etc/dhcpcd.conf
```

Add at the end:
```
interface eth0
static ip_address=192.168.1.154/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

Restart networking:
```bash
sudo systemctl restart dhcpcd
```

#### 2. Configure Port Forwarding on Verizon Router

1. Go to https://myfiosgateway.com/#/network
2. Login (admin / gleeful725eyelet)
3. Navigate to **Port Forwarding** section
4. Add a new rule:
   - **Device**: Select your Raspberry Pi (192.168.1.154)
   - **Port Range**: 3000-3000
   - **Protocol**: TCP
   - **Description**: Pick-A-Date App
5. Save the rule

#### 3. Find Your Public IP Address

```bash
curl ifconfig.me
```

You can then access your app at: `http://YOUR_PUBLIC_IP:3000`

**Security Note**: Exposing port 3000 publicly is not recommended without additional security measures. Consider:
- Using a reverse proxy (nginx) with SSL/HTTPS
- Setting up authentication
- Using a VPN instead

---

## Part 5: Managing and Updating

### PM2 Commands

**On the Raspberry Pi**:
```bash
# View logs
pm2 logs pick-a-date

# View last 100 lines of logs
pm2 logs pick-a-date --lines 100

# Restart app
pm2 restart pick-a-date

# Stop app
pm2 stop pick-a-date

# Start app
pm2 start pick-a-date

# Remove from PM2
pm2 delete pick-a-date

# View status
pm2 status

# Monitor CPU/memory
pm2 monit
```

### Updating the Application

When you make changes to your code, **rebuild on your Mac** and transfer the new build to the Pi:

#### On Your Mac:

```bash
# Navigate to project directory
cd /Users/jesse/code/pi-projects/pick-a-date

# Pull latest changes (if using git)
git pull

# Install new dependencies (if package.json changed)
npm install

# Rebuild for production
npm run build

# Transfer to Raspberry Pi
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  /Users/jesse/code/pi-projects/pick-a-date/ \
  jesse@192.168.1.154:~/pick-a-date/
```

#### On the Raspberry Pi:

```bash
# SSH into Pi
ssh jesse@192.168.1.154

# Navigate to project
cd ~/pick-a-date

# Install new dependencies (if package.json changed)
npm install --omit=dev

# Restart with PM2
pm2 restart pick-a-date

# Check logs to verify
pm2 logs pick-a-date
```

### Data Backup

The application stores date ideas and tracking data in JSON files:
- **Runtime**: `dist/server/src/data/date-ideas.json`
- **Source**: `server/src/data/date-ideas.json` and `server/src/data/date-ideas-template.json`

**Important**: When you rebuild the application, data files are copied from `server/src/data/` to `dist/server/src/data/`. Any runtime changes (completed dates, new ideas) are stored in `dist/server/src/data/date-ideas.json`.

#### Backup Your Data Before Updating

```bash
# On Raspberry Pi - backup runtime data before rebuilding
cp ~/pick-a-date/dist/server/src/data/date-ideas.json ~/date-ideas-backup.json

# After update, if needed, restore your data
cp ~/date-ideas-backup.json ~/pick-a-date/dist/server/src/data/date-ideas.json
pm2 restart pick-a-date
```

#### Regular Backups to Your Mac

```bash
# On your Mac - backup data periodically
scp jesse@192.168.1.154:~/pick-a-date/dist/server/src/data/date-ideas.json \
  /Users/jesse/code/pi-projects/pick-a-date-backup/date-ideas-$(date +%Y%m%d).json
```

#### Create Automated Backup Script on Pi

```bash
# Create backup script
nano ~/backup-pick-a-date.sh
```

```bash
#!/bin/bash
# Backup script for Pick-A-Date
BACKUP_DIR=~/pick-a-date-backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
cp ~/pick-a-date/dist/server/src/data/date-ideas.json $BACKUP_DIR/date-ideas_$DATE.json
echo "Backup created: $BACKUP_DIR/date-ideas_$DATE.json"

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs rm -f
```

```bash
# Make executable
chmod +x ~/backup-pick-a-date.sh

# Run manually
~/backup-pick-a-date.sh

# Or schedule with cron (daily at 3 AM)
crontab -e
# Add line: 0 3 * * * /home/jesse/backup-pick-a-date.sh
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs pick-a-date

# Check if port 3000 is already in use
sudo lsof -i :3000

# Verify Node.js version
node --version  # Should be v18.x.x

# Verify build exists
ls -la dist/server/src/index.js
ls -la dist/client/index.html

# Check file permissions
ls -la ~/pick-a-date/dist/server/
```

### Can't Connect from Other Devices
```bash
# Check if server is running
pm2 status

# Verify Pi's IP address
hostname -I

# Test from Pi itself
curl http://localhost:3000/api/health
# Should return: {"status":"ok"}

# Check firewall (if enabled)
sudo ufw status
sudo ufw allow 3000
```

### Frontend Not Loading
- Verify `dist/client/` contains built files
- Check PM2 logs: `pm2 logs pick-a-date`
- Look at browser console for errors
- Verify backend is serving static files

### Data File Issues
```bash
# Check data file exists
ls -la dist/server/src/data/date-ideas.json

# Check data file permissions
chmod 644 dist/server/src/data/date-ideas.json
chmod 755 dist/server/src/data/

# View data file content
cat dist/server/src/data/date-ideas.json
```

### Module Not Found Errors
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```
**Solution**: Run `npm install --omit=dev` on the Pi. If still failing, run `npm install` (without --omit=dev).

### Frontend Shows Blank Page
**Solution**:
- Check backend is serving static files
- Look at browser console for errors
- Verify `dist/client/` exists and contains files
- Check that API calls are succeeding

---

## Performance Monitoring

### Monitor Resource Usage
```bash
# PM2 monitoring
pm2 monit

# System resources
htop  # Install with: sudo apt install htop

# Check memory usage
free -h

# Check disk space
df -h
```

### Expected Resource Usage (Raspberry Pi 3B+)
- **RAM**: 100-200 MB (depends on data size)
- **CPU**: <5% idle, 10-20% during active use
- **Disk**: ~30 MB for app + data

### Performance Considerations

The Raspberry Pi 3B+ has limited resources (1GB RAM). To optimize:

1. **Monitor memory usage**:
   ```bash
   pm2 monit
   ```

2. **Limit PM2 instances**:
   - Don't use cluster mode on a Pi 3B+
   - Run only one instance

3. **Recommended Limits**:
   - **Concurrent users**: 5-10 on Raspberry Pi 3B+
   - **Data size**: JSON files handle well up to several MB

---

## Security Considerations

### Network Security
- App is designed for **local network use only** (date night planning for household)
- Do **NOT** expose to the public internet without proper security measures
- If you must expose externally:
  - Set up HTTPS with Let's Encrypt
  - Use a reverse proxy (nginx)
  - Implement authentication
  - Use a VPN instead

---

## Testing Checklist

Before regular use, test these features:

- [ ] App loads on Pi (`http://192.168.1.154:3000`)
- [ ] App loads on mobile devices on same network
- [ ] Generate random date idea - displays correctly
- [ ] Mark date as completed - persists to data file
- [ ] View date ideas by category - filters work
- [ ] Refresh page - completed dates persist
- [ ] Reboot Pi - app auto-starts with PM2

---

## Common Issues

### Port 3000 Already in Use
**Solution**:
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in PM2 start command
NODE_ENV=production PORT=3001 pm2 start dist/server/src/index.js --name pick-a-date
```

### PM2 App Keeps Restarting
**Solution**:
- Check logs: `pm2 logs pick-a-date --lines 50`
- Make sure build was successful
- Verify `dist/server/src/index.js` exists
- Check that all dependencies are installed
- Look for data file errors (check permissions)

---

## Summary

**Quick Deployment Checklist**:

### On Your Mac:
1. ✅ Install dependencies: `npm install`
2. ✅ Build for production: `npm run build`
3. ✅ Transfer to Pi: `rsync -avz --exclude 'node_modules' ... jesse@192.168.1.154:~/pick-a-date/`

### On Raspberry Pi:
4. ✅ Install Raspberry Pi OS + Node.js v18
5. ✅ Install production dependencies: `npm install --omit=dev`
6. ✅ Start with PM2: `NODE_ENV=production pm2 start dist/server/src/index.js --name pick-a-date`
7. ✅ Configure auto-start: `pm2 startup` + `pm2 save`
8. ✅ Access from network: `http://192.168.1.154:3000`

**That's it!** The app is now running and ready for date night planning!

**Common Deployment Paths**:
- Project on Pi: `~/pick-a-date/`
- Data files: `~/pick-a-date/dist/server/src/data/`
- Backend: `~/pick-a-date/dist/server/`
- Frontend: `~/pick-a-date/dist/client/`

---

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Port Forwarding Guide for Verizon FiOS](https://portforward.com/verizon/fios-quantum-gateway/)

---

**Document Version**: 2.0
**Last Updated**: 2026-05-07
**Tested On**: Raspberry Pi 3B+ (Node.js v18.x)
**Build Strategy**: Build on Mac, deploy to Pi
