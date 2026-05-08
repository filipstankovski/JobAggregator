# RabotekaMK 🔧

A job aggregator web application that scrapes and displays job listings from three major Macedonian job portals — all in one place.

## Live Sources

| Site | Jobs Scraped |
|------|-------------|
| [kariera.mk](https://kariera.mk) | ✅ |
| [vrabotuvanje.com.mk](https://www.vrabotuvanje.com.mk) | ✅ |
| [najdirabota.com.mk](https://www.najdirabota.com.mk) | ✅ |

---

## Project Structure

```
JobAggregator/
│
├── jobaggregator-frontend/         # React + Vite frontend
│   ├── public/
│   │   ├── logo-dark.png           # Logo for dark mode
│   │   └── logo-light.png          # Logo for light mode
│   ├── src/
│   │   ├── App.jsx                 # Main app component (filters, cards, dark mode)
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles & CSS variables
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite config with API proxy
│   └── package.json
│
├── scraper/                        # Python scrapers
│   ├── kariera-mk-scraper.py       # Scraper for kariera.mk
│   ├── najdirabota-scraper.py      # Scraper for najdirabota.com.mk
│   └── vrabotuvanje-scraper.py     # Scraper for vrabotuvanje.com.mk
│
├── src/
│   └── main/
│       ├── java/mk/ukim/finki/nvd/jobaggregator/
│       │   ├── config/
│       │   │   └── DataInitializer.java
│       │   ├── model/domain/
│       │   │   └── Job.java                # JPA entity
│       │   ├── repository/
│       │   │   └── JobRepository.java      # Spring Data JPA repository
│       │   ├── service/domain/
│       │   │   ├── JobService.java         # Service interface
│       │   │   └── impl/
│       │   │       └── JobServiceImpl.java # Service implementation
│       │   ├── web/
│       │   │   └── JobController.java      # REST API controller
│       │   └── JobAggregatorApplication.java
│       └── resources/
│           └── application.properties      # DB config, JPA settings
│
├── docker-compose.yaml             # PostgreSQL database container
├── pom.xml                         # Maven dependencies (Spring Boot 4.0.0)
└── README.md
```

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 4.0.0
- Spring Data JPA
- PostgreSQL 17
- Springdoc OpenAPI (Swagger UI)
- Lombok

**Frontend**
- React 18
- Vite
- Plain CSS with CSS variables (light/dark theme)

**Scrapers**
- Python 3.12
- BeautifulSoup4
- Requests / Cloudscraper

**Infrastructure**
- Docker + Docker Compose (PostgreSQL)

---

## Getting Started

### Prerequisites
- Java 21
- Docker Desktop
- Node.js 18+
- Python 3.12+

### 1. Clone the repository

```bash
git clone https://github.com/filipstankovski/JobAggregator.git
cd JobAggregator
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Run the Spring Boot backend

```bash
./mvnw spring-boot:run
```

API available at: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 4. Install Python dependencies

```bash
pip3 install requests beautifulsoup4 cloudscraper --break-system-packages
```

### 5. Run the scrapers

> Make sure Spring Boot is running before executing scrapers.

```bash
python3 scraper/kariera-mk-scraper.py
python3 scraper/najdi_rabota-scraper.py
python3 scraper/vrabotuvanje-scraper.py
```

### 6. Start the frontend

```bash
cd jobaggregator-frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## Features

- 🔍 Search by job title or company name
- 📍 Filter by location
- 🗂️ Filter by category
- 📅 Filter by active until date range
- 🌐 Filter by source website
- 🌙 Dark / Light mode toggle
- 🔗 Direct apply links to original job postings

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/{id}` | Get job by ID |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/{id}` | Update a job |
| DELETE | `/api/jobs/{id}` | Delete a job |

---

## Database

PostgreSQL runs in Docker. Data persists via a Docker volume (`pgdata`) and survives container restarts.

```
Host:     localhost
Port:     5434
Database: nvd
User:     nvd
Password: nvd123
```

> ⚠️ Never run `docker compose down -v` — the `-v` flag deletes the volume and all data.
