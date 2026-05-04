# JobAggregator

A full-stack job listing aggregator that scrapes job postings from multiple sources, stores them in a database, and exposes them through a filterable web interface.

Built with **Python** (scraper), **Spring Boot** (REST API), and **React** (frontend).

---

## Overview

JobAggregator automates the collection of job postings from public job boards. A Python scraper runs on a schedule and upserts normalized job data into a PostgreSQL database. A Spring Boot backend exposes a REST API that supports filtering, sorting, and pagination. Users interact with the data through a React frontend that allows real-time filtering by job title, company, location, posting date, and active status.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Scraper | Python 3, BeautifulSoup, requests, psycopg2 |
| Database | PostgreSQL |
| Backend | Java 17, Spring Boot 3, Spring Data JPA, Hibernate |
| Frontend | React, Vite, TypeScript, React Query |
| Infrastructure | Docker, Docker Compose |

---

## Project Structure

```
JobAggregator/
├── scraper/                    # Python scraping pipeline
│   ├── scrapers/
│   │   ├── base_scraper.py     # Abstract base class for all scrapers
│   │   ├── linkedin_scraper.py
│   │   └── indeed_scraper.py
│   ├── models/
│   │   └── job.py              # Job data model / schema
│   ├── db/
│   │   └── repository.py       # DB connection and upsert logic
│   ├── main.py                 # Entry point, orchestrates scraper runs
│   └── requirements.txt
│
├── src/                        # Spring Boot application
│   └── main/
│       ├── java/com/jobaggregator/
│       │   ├── controller/
│       │   │   └── JobController.java      # REST endpoints
│       │   ├── service/
│       │   │   └── JobService.java         # Business logic, filter handling
│       │   ├── repository/
│       │   │   └── JobRepository.java      # Spring Data JPA repository
│       │   ├── model/
│       │   │   └── Job.java                # JPA entity
│       │   ├── dto/
│       │   │   └── JobDTO.java             # API response shape
│       │   ├── spec/
│       │   │   └── JobSpecification.java   # Dynamic filter queries
│       │   └── scheduler/
│       │       └── ScraperScheduler.java   # Triggers Python scraper on cron
│       └── resources/
│           └── application.yml
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterPanel.tsx  # Filter controls (title, date, status…)
│   │   │   ├── JobCard.tsx      # Single job listing card
│   │   │   └── JobList.tsx      # Paginated list of JobCards
│   │   ├── hooks/
│   │   │   └── useJobs.ts       # React Query hook wrapping the API
│   │   ├── api/
│   │   │   └── jobs.ts          # Axios/fetch wrappers
│   │   └── App.tsx
│   └── package.json
│
├── docker-compose.yml           # Spins up Postgres + Spring Boot + React
├── pom.xml
└── README.md
```

---

## Job Data Model

Each scraped job posting is stored with the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `title` | String | Job title (e.g. "Backend Developer") |
| `company` | String | Hiring company name |
| `location` | String | City, country, or "Remote" |
| `description` | Text | Full job description |
| `source_url` | String | Original posting URL |
| `source` | String | Which board it was scraped from |
| `date_posted` | Date | When the posting was published |
| `date_scraped` | Timestamp | When our scraper collected it |
| `is_active` | Boolean | Whether the posting is still live |
| `tags` | String[] | Skills/keywords extracted from the description |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Returns paginated, filtered job listings |
| `GET` | `/api/jobs/{id}` | Returns a single job by ID |

### Filter Parameters (`GET /api/jobs`)

| Param | Type | Example |
|---|---|---|
| `title` | string | `?title=backend` |
| `company` | string | `?company=google` |
| `location` | string | `?location=remote` |
| `active` | boolean | `?active=true` |
| `dateFrom` | date | `?dateFrom=2025-01-01` |
| `dateTo` | date | `?dateTo=2025-12-31` |
| `page` | int | `?page=0` |
| `size` | int | `?size=20` |

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Java 17+
- Node.js 18+
- Python 3.10+

### Run with Docker Compose

```bash
git clone https://github.com/fcvetkovski/JobAggregator.git
cd JobAggregator
docker-compose up --build
```

This starts PostgreSQL, the Spring Boot API on `http://localhost:8080`, and the React frontend on `http://localhost:5173`.

### Run the scraper manually

```bash
cd scraper
pip install -r requirements.txt
python main.py
```

---

## Team

| Member | Responsibilities |
|---|---|
| Person A | Python scraper, database schema, JPA entities, filter query logic |
| Person B | Spring Boot REST API, DTOs, React frontend, React Query integration |

---

## License

This project is for educational purposes.
