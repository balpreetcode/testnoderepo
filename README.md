# testnoderepo

Here's a full set of **copy-paste-friendly commands** to set up **Prometheus and Grafana** as Docker sidecars on your **EC2 instance** — including directory creation, configuration files, Docker Compose setup, and container startup.

---

## ✅ Step-by-Step Commands (Run on EC2)

### 1. 🔧 Create Monitoring Directory

```bash
mkdir -p ~/monitoring
cd ~/monitoring
```

---

### 2. 📄 Create `prometheus.yml`

```bash
cat > prometheus.yml <<EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['172.17.0.1:3000']
EOF
```

> 🔁 If your app runs inside Docker Compose, you can replace the target with:
> `- targets: ['app:3000']`

---

### 3. 📄 Create `docker-compose.yml`

```bash
cat > docker-compose.yml <<EOF
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus
    restart: unless-stopped
EOF
```

---

### 4. 🧩 Install Docker Compose v2 Plugin

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins/

COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)

sudo curl -SL https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

docker compose version
```

---

### 5. 🚀 Start Prometheus & Grafana

From inside the `~/monitoring` directory:

```bash
docker compose up -d
```

---

### ✅ Access Services in Browser

| Service     | URL                    | Notes                  |
| ----------- | ---------------------- | ---------------------- |
| Node.js App | `http://<EC2-IP>:3000` | Your Express app       |
| Prometheus  | `http://<EC2-IP>:9090` | Metrics backend        |
| Grafana     | `http://<EC2-IP>:3001` | Login: `admin / admin` |

---

Let me know if you'd like to:

* Add dashboards to Grafana
* Monitor EC2 system metrics using `node_exporter`
* Auto-start everything on reboot

Ready when you are!
