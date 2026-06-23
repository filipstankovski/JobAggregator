"""
vrabotuvanje-scraper.py
Scrapes job listings from vrabotuvanje.com.mk and sends them to the Spring Boot API.

Site structure:
  Listing page : https://www.vrabotuvanje.com.mk/rabotni-mesta
  Job URL      : https://www.vrabotuvanje.com.mk/rabota/{uuid}/{slug}

If you still get 403 errors, install cloudscraper:
    pip install cloudscraper
and swap the session lines below (see comment).
"""

import time
import re
import requests
from bs4 import BeautifulSoup
import datetime


BASE_URL  = "https://www.vrabotuvanje.com.mk"
LIST_URL  = f"{BASE_URL}/rabotni-mesta"
API_URL   = "http://localhost:8080/api/jobs"
DELAY     = 1.2
MAX_PAGES = 10

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "mk,en-US;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Referer": "https://www.google.com/",
}


session = requests.Session()
session.headers.update(HEADERS)


def fetch(url):
    try:
        r = session.get(url, timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"  [WARN] Failed to fetch {url}: {e}")
        return None


def get_job_detail(url):
    """
    Scrape a vrabotuvanje detail page.
    """
    soup = fetch(url)
    if not soup:
        return None, None, None, None, None

    company = None

    el = soup.find("h6", class_=lambda c: c and "job__employer" in c)
    if el:
        company = el.get_text(strip=True)

    if not company:
        for cls in ["mp-text--h6--bold", "employer", "company"]:
            el = soup.find(class_=lambda c: c and cls in c)
            if el:
                t = el.get_text(strip=True)
                if t and len(t) < 120:
                    company = t
                    break

    # LOCATION
    location = None
    full_text = soup.get_text(separator="\n")

    loc_match = re.search(r"Локација на работа:\s*(.+)", full_text)
    if loc_match:
        location = loc_match.group(1).strip().split("\n")[0].strip()

    if not location:
        loc_match = re.search(r"Локација:\s*(.+)", full_text)
        if loc_match:
            location = loc_match.group(1).strip().split("\n")[0].strip()

    description = None

    for sel in [
        ".jd-body",
        "div[class*='job-desc']:not(.d-none)",
        ".job-description",
        ".ad-description",
        ".job-body"
    ]:

        tag = soup.select_one(sel)
        if tag:
            description = tag.get_text(separator="\n", strip=True)
            break

    category = None

    category_span = soup.select_one(
        "div.card span.mp-text.mp-text__default"
    )

    if category_span:

        text = category_span.get_text(strip=True)

        if text and len(text) > 2:
            category = text

    if not category:

        possible_keywords = [
            "услуги",
            "продажба",
            "маркетинг",
            "администрација",
            "ИТ",
            "финансии",
            "производни"
        ]

        for span in soup.find_all("span"):

            text = span.get_text(" ", strip=True)

            if any(
                    keyword.lower() in text.lower()
                    for keyword in possible_keywords
            ):
                category = text
                break

    # ACTIVE UNTIL
    active_until = None

    match = re.search(
        r"(?:Пријава до[:\s]+)([\d]{1,2}[\.\s]+[\d]{2}[\.\s]+[\d]{4})",
        full_text
    )
    if match:
        active_until = match.group(1).strip()
    if not active_until:

        match = re.search(
            r"до\s*([\d]{1,2}\.\s*[\d]{2}\.\s*[\d]{4})",
            full_text
        )

        if match:
            active_until = match.group(1).strip()

    return company, location, description, category, active_until


def get_listing_page(page=1):
    url = LIST_URL if page == 1 else f"{LIST_URL}?page={page}"
    soup = fetch(url)
    if not soup:
        return []

    jobs = []
    seen_urls = set()

    for a in soup.find_all("a", href=re.compile(r"/rabota/[a-f0-9\-]+")):
        href = a.get("href", "")
        if href in seen_urls:
            continue
        seen_urls.add(href)

        clean_href = href.split("?")[0]

        job_url = (
            BASE_URL + clean_href
            if clean_href.startswith("/")
            else clean_href
        )

        title = a.get_text(strip=True)
        if not title:
            h = a.find(["h2", "h3", "h4"])
            title = h.get_text(strip=True) if h else None
        if not title:
            continue

        jobs.append({
            "title": title,
            "url": job_url
        })

    return jobs


def run():
    total_saved  = 0
    total_skip   = 0
    total_failed = 0

    for page in range(1, MAX_PAGES + 1):

        print(f"\n-- Page {page} --------------------------------------------------")

        listings = get_listing_page(page)

        if not listings:
            print("  No jobs found — stopping.")
            break

        for partial in listings:
            url   = partial["url"]
            title = partial["title"]
            print(f"  {title[:55]}")

            (
                company,
                location,
                description,
                category,
                active_until
            ) = get_job_detail(url)

            # Parse active_until to yyyy-MM-dd format
            active_until_formatted = None

            if active_until:

                try:
                    parsed_date = datetime.datetime.strptime(
                        active_until,
                        "%d. %m. %Y"
                    ).date()

                    active_until_formatted = parsed_date.strftime("%Y-%m-%d")

                except ValueError:

                    try:
                        parsed_date = datetime.datetime.strptime(
                            active_until,
                            "%d.%m.%Y"
                        ).date()

                        active_until_formatted = parsed_date.strftime("%Y-%m-%d")

                    except ValueError:
                        active_until_formatted = active_until

            job_data = {
                "title":       title,
                "company":     company,
                "location":    location,
                "description": description,
                "activeUntil": active_until_formatted,
                "category":    category,
                "source":      "vrabotuvanje.com.mk",
                "url":         url,
            }

            try:

                resp = requests.post(
                    API_URL,
                    json=job_data,
                    timeout=10
                )

                if resp.status_code == 201:

                    print(
                        f"    → saved ✓  "
                        f"[{company or '?'}] "
                        f"[{location or '?'}] "
                        f"[{category or '?'}]"
                    )

                    total_saved += 1
                elif resp.status_code == 500:
                    print(f"    → already exists, skipping")
                    total_skip += 1
                else:

                    print(
                        f"    → API {resp.status_code}: "
                        f"{resp.text[:80]}"
                    )

                    total_failed += 1
            except Exception as e:
                print(f"    → API error: {e}")
                total_failed += 1

            time.sleep(DELAY)

    print(f"\n{'=' * 50}")
    print(
        f"Done. Saved: {total_saved} | "
        f"Skipped: {total_skip} | "
        f"Failed: {total_failed}"
    )


if __name__ == "__main__":
    run()