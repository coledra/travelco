# TravelCo · Premier India Travel & Itinerary Platform

TravelCo is an enterprise-grade web application engineered to solve the logistical, geographical, and safety challenges of exploring the Indian subcontinent. The platform features an **instantaneous location-reactive architecture**: changing your starting hub re-indexes transit schedules, road distances, regional dining recommendations, and weather forecasts across every service in real time.

---

## 1. Core Service Architecture

### 1.1 Dynamic Location Engine
- **Instant Multi-Service Reactivity**: Selecting an origin (e.g. *New Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Jaipur, Kochi, Varanasi, Srinagar*) automatically re-indexes:
  - **Distance Calculator**: Straight-line and realistic highway kilometers via Haversine calculation with driving duration and recommended transit mode (*Flight*, *Express Train*, *Highway Cab*).
  - **Meteorological & AQI Feeds**: Synchronizes local microclimate, seasonal monsoonal patterns, and National Air Quality Index (AQI) with health recommendations.
  - **Regional Gastronomy**: Brings local regional breakfast and street food specialties for that specific state and city to the top of the culinary directory.
  - **Transit Timetables**: Prioritizes live departing trains (*Vande Bharat*, *Rajdhani*, *Shatabdi*), metro corridors, and airport connections from that origin.
  - **Cartography & Offline Packs**: Dynamically positions the map origin pin and recalculates vector route trajectories.

### 1.2 Multi-Day Itinerary Organizer
- Sequential day-by-day planner with natural circadian flow (*Sunrise $\rightarrow$ Morning $\rightarrow$ Midday $\rightarrow$ Sunset $\rightarrow$ Night Illuminations*).
- Interactive re-ordering (`Move Earlier` / `Move Later`), budget tracking in ₹ INR, task completion check-offs, and export/print functionality.
- Curated pre-configured templates (*Golden Triangle Classical Odyssey*, *Kerala Backwaters & Evergreen Coast*).

### 1.3 Regional Food Availability & Dietary Safety
- Classified by dietary requirements: **Pure Veg (100% Vegetarian)**, **Jain Friendly (No onion/garlic/root veg)**, **Non-Veg**, **Seafood**, and **Vegan**.
- Thermal safety and water hygiene tips for street stalls and historic sweetshops.

### 1.4 Real-Time Transit Grid & PNR Simulator
- Status tracker for Indian Railways, metropolitan networks (Delhi Metro, Mumbai Metro Line 1), and interstate luxury buses (KSRTC Airavat).
- Simulated 10-digit IRCTC PNR checker for coach and live delay verification.
- Seasonal travel warnings (winter dense fog delays in North India, monsoon ghat advisories, Ladakh Inner Line Permit rules).

### 1.5 Offline Vector Cartography & Emergency Command
- 100% in-browser offline capability with downloadable regional map packs (*Golden Triangle*, *Kerala Coastal*, *Ladakh High Passes*).
- **Direct 24x7 Helplines**: 112 (National Emergency), 1363 (Tourist Police), 1091 (Women Safety), 139 (Rail Madad), 108 (Ambulance).
- **Web Audio Siren Beacon**: Generates an audible distress alarm directly via the browser Web Audio API without requiring any internet connection.
- **Offline Hindi Phrasecards**: Phonetic romanized guide and browser-synthesized voice pronunciation for emergency communication with locals.

---

## 2. Server Hosting & Production Deployment

TravelCo is fully decoupled and optimized for production deployment on any Linux VPS, Docker cluster, or Cloud container service.

### 2.1 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Port 3000)
npm run dev

# 3. Compile and verify production build
npm run build
```

---

### 2.2 Production Hosting via Node.js / PM2 on a VPS

#### Prerequisites:
- Ubuntu 22.04 / 24.04 LTS or Debian 12
- Node.js v20+ & npm installed
- PM2 process manager (`npm install -g pm2`)
- Nginx for reverse proxy & SSL termination

#### Step 1: Clone & Build on Server
```bash
cd /var/www
git clone <your-repository-url> travelco
cd travelco

# Install dependencies
npm install

# Build static assets
npm run build
```

#### Step 2: Start Background Service with PM2
```bash
# Start production Express server
pm2 start server.ts --name "travelco" --interpreter npx --interpreter-args "tsx"

# Configure PM2 to restart on system reboot
pm2 startup
pm2 save
```

#### Step 3: Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/travelco`)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static frontend assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/travelco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install free SSL certificate via Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### 2.3 Containerized Deployment via Docker

```bash
# 1. Build the production Docker image
docker build -t travelco:latest .

# 2. Run container in background on port 3000
docker run -d \
  --name travelco-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  travelco:latest
```

#### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  travelco:
    build: .
    container_name: travelco-production
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Run with:
```bash
docker compose up -d
```

---

## 3. Migration Plan (Roadmap to Scaled Production)

The current implementation utilizes high-performance, offline-first client storage (`localStorage` / memory caching) for resilient field usage in areas with unstable cell connectivity. Below is the multi-phase roadmap for scaling to millions of concurrent users.

### Phase 1: Database & Remote Sync Migration (Months 1–2)
1. **Relational Database Provisioning**:
   - Deploy a managed PostgreSQL instance (AWS RDS, GCP Cloud SQL, or Supabase).
   - Use **Drizzle ORM** or **Prisma** for schema definition:
     - `users`: Account identities and preferences.
     - `itineraries`: Multi-day trips, activities, estimated costs.
     - `forum_posts` & `forum_comments`: Community reviews, upvotes, moderation flags.
     - `offline_packs`: Vector tile metadata and version tracking.
2. **Offline-First Synchronization (CRDT / SQLite-Sync)**:
   - Implement WatermelonDB or TanStack DB for two-way sync between client-side IndexedDB and PostgreSQL when internet reconnects.

### Phase 2: Live External API Integrations (Months 3–4)
1. **Real-time Rail & Transit**:
   - Integrate the official CRIS / IRCTC National Train Enquiry System (NTES) API or RapidAPI IRCTC endpoints for live GPS train coordinates and PNR status.
   - Integrate OpenTripPlanner or Delhi Metro DMRC API for live gate & interchange guidance.
2. **Real-time Air Quality & Weather Feeds**:
   - Connect the Central Pollution Control Board (CPCB) India API and Open-Meteo for hourly localized PM2.5 / PM10 / AQI metrics.
3. **Cartography & Routing**:
   - Migrate SVG vector canvas to Mapbox GL JS / MapLibre GL with pre-cached vector MBTiles for full street-level offline exploration.

### Phase 3: Identity & Multi-Tenancy (Months 4–5)
1. **Authentication**:
   - Support Google Sign-In, Apple ID, and SMS OTP verification for Indian phone numbers (+91).
2. **Collaborative Itinerary Planning**:
   - Implement WebSocket / WebRTC room sharing so groups of travelers can co-edit an itinerary in real time.

### Phase 4: Performance & Edge CDN (Months 5–6)
1. **Global Edge Caching**:
   - Route static assets and destination images through Cloudflare or CloudFront with edge caching in Mumbai, Chennai, and Delhi points of presence (PoP).
2. **Redis In-Memory Cache**:
   - Cache train delays, weather forecasts, and distance calculations in Redis to achieve sub-10ms response times.

---

## 4. Verification & Health Monitoring

The application includes an integrated health probe at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{
  "status": "healthy",
  "app": "TravelCo",
  "timestamp": "2026-11-09T03:17:00.000Z",
  "uptime": 128.4,
  "environment": "production"
}
```

---

## 5. Admin Portal & Data Update Console

TravelCo includes a dedicated Master Admin Control Deck for managing live catalog data across all platform modules.

### 5.1 Admin Credentials
- **Access**: Click **Admin Portal** in the header or footer
- **Email**: `admin@travelco.in`
- **Password**: `TravelCo#Admin2026`
- *Tip: The login modal includes a **1-Click Instant Login** button for frictionless demo testing.*

### 5.2 Module Management Capabilities
- **Destinations Module**: Create, edit, and delete tourist spots, GPS coordinates, entry fees in ₹ INR, operating timings, and weather profiles.
- **Regional Food Module**: Add and edit regional delicacies, dietary categories (*Pure Veg, Jain Friendly, Non-Veg, Seafood, Vegan*), spice scales, and hygiene notes.
- **Live Transit Module**: Manage train routes (*Vande Bharat, Rajdhani, Shatabdi*), metro corridors, departure/arrival schedules, platforms, and toggle real-time delay status.
- **Travel Advisories**: Publish, edit, and remove official regional travel advisories (e.g. winter fog, monsoon landslides, high-altitude permits).
- **Emergency Directory**: Update national 24x7 toll-free emergency helplines and apex trauma hospitals.
- **Community Forum Moderation**: Moderate traveler reviews and delete spam or obsolete reports.
- **Backup & Snapshot Synchronization**: One-click JSON snapshot download of all catalog customizations, external JSON restore, and factory baseline reset.

---

## 6. License & Credits
Licensed under the Apache-2.0 License. Designed and built for seamless travel across India.
