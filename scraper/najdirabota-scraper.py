import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urljoin

BASE_URL = "https://www.najdirabota.com.mk/vacancy/search"
DOMAIN = "https://www.najdirabota.com.mk"

API_URL = "http://localhost:8080/api/jobs"

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json"
}



REGION_MAP = {
    "Скопски": "Скопје",
    "Охридски": "Охрид",
    "Струшки": "Струга",
    "Битолски": "Битола",
    "Прилепски": "Прилеп",
    "Кумановски": "Куманово",
    "Тетовски": "Тетово",
    "Штипски": "Штип"
}


def normalize_location(location):
    if not location:
        return location

    for key in REGION_MAP:
        if key in location:
            return REGION_MAP[key]

    return location



session = requests.Session()
session.headers.update(HEADERS)


def get_job_details(url):
    try:
        res = session.get(url, timeout=10)

        if res.status_code != 200:
            return None, None

        soup = BeautifulSoup(res.text, "html.parser")

        container = soup.select_one(".vacanciesSection")
        description_blocks = container.select(".description-row") if container else []

        description = "\n\n".join(
            block.get_text(separator=" ", strip=True)
            for block in description_blocks
        )


        if description and len(description) > 3000:
            description = description[:3000]

        active_until = None
        for p in soup.select("p.fw-bold"):
            text = p.get_text(strip=True)
            if "Краен рок за пријавување:" in text:
                active_until = text.replace("Краен рок за пријавување:", "").strip()

        return description, active_until

    except Exception as e:
        print("⚠️ Error fetching details:", url, e)
        return None, None


def send_to_api(job_data):
    try:
        res = session.post(API_URL, json=job_data, timeout=10)

        if res.status_code in (200, 201):
            print(f" Saved: {job_data['title']}")
        elif res.status_code == 409:
            print(f" Duplicate skipped: {job_data['title']}")
        else:
            print(f" Failed {res.status_code}: {job_data['title']}")
            print(res.text)

    except Exception as e:
        print(" API Error:", e)


def scrape_page(page):
    url = f"{BASE_URL}?page={page}"
    print(f"\n🔎 Scraping page {page}...")

    try:
        res = session.get(url, timeout=10)

        if res.status_code != 200:
            return []

        soup = BeautifulSoup(res.text, "html.parser")
        job_cards = soup.select(".vacancy_box.lift.rounded.text-center.shadow-1.my-2")

        jobs = []

        for job in job_cards:
            link = job.select_one("a")
            title_tag = job.select_one(".vacancy-title")

            if not link or not title_tag:
                continue

            job_url = urljoin(DOMAIN, link["href"])
            title = title_tag.get_text(strip=True)

            company = None
            location = None
            category = None

            for p in job.select("p"):
                text = p.get_text()

                if "Фирма" in text:
                    span = p.select_one("span")
                    company = span.get_text(strip=True) if span else None

                elif "Регион" in text:
                    span = p.select_one("span")
                    location = span.get_text(strip=True) if span else None

                elif "Индустрија" in text:
                    span = p.select_one("span")
                    category = span.get_text(strip=True) if span else None

            description, active_until = get_job_details(job_url)

            full_title = f"{company}: {title}" if company else title
            normalized_location = normalize_location(location)

            job_data = {
                "title": full_title,
                "company": company,
                "location": normalized_location,
                "description": description,
                "activeUntil": active_until,
                "category": category,
                "source": "najdirabota.com.mk",
                "url": job_url
            }

            jobs.append(job_data)


            send_to_api(job_data)

            time.sleep(0.5)

        return jobs

    except Exception as e:
        print("⚠️ Page error:", page, e)
        return []


def run_scraper(max_pages=5, global_limit=100):
    all_jobs = []

    for page in range(1, max_pages + 1):
        jobs = scrape_page(page)

        if not jobs:
            print("🛑 No more jobs.")
            break

        all_jobs.extend(jobs)

        if len(all_jobs) >= global_limit:
            print("🛑 Limit reached.")
            break

    return all_jobs


if __name__ == "__main__":
    jobs = run_scraper(max_pages=10, global_limit=200)
    print(f"\n Total jobs scraped: {len(jobs)}")