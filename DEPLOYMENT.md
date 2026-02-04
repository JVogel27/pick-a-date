# Deploying Pick-A-Date to Raspberry Pi

This guide walks you through deploying the Pick-A-Date application to your Raspberry Pi 3B+.

## Raspberry Pi Information

- **Model**: Raspberry Pi 3B+ (Cortex-A53 ARMv8 64-bit @ 1.4GHz, 1GB RAM)
- **OS**: GNU/Linux (Bookworm)
- **Current IP**: 192.168.1.154
- **SSH Access**: `ssh jesse@192.168.1.154` (password: `vogelvogel`)

## Prerequisites

### On Your Raspberry Pi

1. **SSH into your Pi**:
   ```bash
   ssh jesse@192.168.1.154
   ```

2. **Install Node.js** (if not already installed):
   ```bash
   # Check if Node.js is installed
   node --version

   # If not installed or version is < 18, install Node.js 18 LTS:
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

3. **Install Git** (if not already installed):
   ```bash
   sudo apt-get update
   sudo apt-get install -y git
   ```

4. **Install PM2** (process manager to keep app running):
   ```bash
   sudo npm install -g pm2
   ```

## Deployment Steps

### 1. Transfer the Project to Raspberry Pi

**Option A: Clone from Git Repository** (if using version control)
```bash
# On Raspberry Pi
cd ~
git clone <your-repo-url> pick-a-date
cd pick-a-date
```

**Option B: Transfer via SCP** (from your laptop)
```bash
# On your laptop, from the project parent directory
scp -r pick-a-date jesse@192.168.1.154:~/
```

### 2. Install Dependencies on Raspberry Pi

```bash
# SSH into Pi if not already
ssh jesse@192.168.1.154

# Navigate to project
cd ~/pick-a-date

# Install dependencies
npm install
```

### 3. Build the Application

```bash
# Build both client and server
npm run build
```

This will:
- Build the React frontend with Vite → `dist/client/`
- Compile the TypeScript server → `dist/server/`
- Copy JSON data files to `dist/server/src/data/`

### 4. Start the Application with PM2

```bash
# Start the app with PM2
NODE_ENV=production pm2 start dist/server/src/index.js --name pick-a-date

# Save PM2 configuration to restart on reboot
pm2 save

# Enable PM2 to start on system boot
pm2 startup
# Follow the instructions output by the command above
```

### 5. Verify the Application is Running

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs pick-a-date

# Test the API health endpoint
curl http://localhost:3000/api/health
```

You should see: `{"status":"ok"}`

## Accessing the Application

### Local Access (on Raspberry Pi network)

From any device on your local network, open a browser and navigate to:
```
http://192.168.1.154:3000
```

### Setting up External Access (Optional)

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

## Useful PM2 Commands

```bash
# View application status
pm2 status

# View logs (live tail)
pm2 logs pick-a-date

# View last 100 lines of logs
pm2 logs pick-a-date --lines 100

# Restart the application
pm2 restart pick-a-date

# Stop the application
pm2 stop pick-a-date

# Delete the application from PM2
pm2 delete pick-a-date

# Monitor CPU/Memory usage
pm2 monit
```

## Updating the Application

When you make changes to the app:

### Option A: From Git
```bash
# SSH into Pi
ssh jesse@192.168.1.154

# Navigate to project
cd ~/pick-a-date

# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart with PM2
pm2 restart pick-a-date
```

### Option B: Transfer Updated Files
```bash
# On your laptop (build first)
cd /Users/jesse/code/pi-projects/pick-a-date
npm run build

# Transfer to Pi
scp -r dist jesse@192.168.1.154:~/pick-a-date/

# SSH into Pi and restart
ssh jesse@192.168.1.154
pm2 restart pick-a-date
```

## Troubleshooting

### Check if Port 3000 is in Use
```bash
sudo lsof -i :3000
```

### View System Resources
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Monitor system resources
htop
```

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs pick-a-date --err

# Check if Node.js process is running
ps aux | grep node

# Check file permissions
ls -la ~/pick-a-date/dist/server/
```

### Cannot Access Externally
1. Verify port forwarding is configured correctly
2. Check firewall on Raspberry Pi:
   ```bash
   sudo iptables -L
   ```
3. Test from inside network first
4. Verify your ISP allows incoming connections on port 3000

## Performance Considerations

The Raspberry Pi 3B+ has limited resources (1GB RAM). To optimize:

1. **Monitor memory usage**:
   ```bash
   pm2 monit
   ```

2. **Limit PM2 instances**:
   - Don't use cluster mode on a Pi 3B+
   - Run only one instance

3. **Reduce build size** (if needed):
   - The built assets should be small enough for the Pi
   - Consider enabling gzip compression in Express

## Data Persistence

The application stores date ideas and tracking data in:
- **Runtime**: `dist/server/src/data/date-ideas.json`
- **Source**: `server/src/data/date-ideas.json` and `server/src/data/date-ideas-template.json`

**Important**: When you rebuild the application, the data files are copied from `server/src/data/` to `dist/server/src/data/`. Any changes made during runtime (completed dates, new ideas) are stored in `dist/server/src/data/date-ideas.json`.

To preserve your data when updating:
1. **Before rebuilding**, backup the runtime data:
   ```bash
   cp dist/server/src/data/date-ideas.json server/src/data/date-ideas-backup.json
   ```
2. Rebuild the application
3. If needed, restore your data:
   ```bash
   cp server/src/data/date-ideas-backup.json dist/server/src/data/date-ideas.json
   pm2 restart pick-a-date
   ```

## Backup the Application

```bash
# On Raspberry Pi, backup runtime data file
cp ~/pick-a-date/dist/server/src/data/date-ideas.json ~/date-ideas-backup.json

# On your laptop, backup data periodically
scp jesse@192.168.1.154:~/pick-a-date/dist/server/src/data/date-ideas.json \
  /Users/jesse/code/pi-projects/pick-a-date-backup/
```

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Port Forwarding Guide for Verizon FiOS](https://portforward.com/verizon/fios-quantum-gateway/)
