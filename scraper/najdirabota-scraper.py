"""
najdirabota-scraper.py
Scrapes job listings from najdirabota.com.mk and sends them to the Spring Boot API.

Site structure:
  Homepage    : https://www.najdirabota.com.mk/          (featured jobs)
  Search page : https://www.najdirabota.com.mk/vacancy/search?page=1
  Detail page : https://www.najdirabota.com.mk/vacancy/view/id={encrypted_id}
"""

import time
import re
import requests
from bs4 import BeautifulSoup



BASE_URL   = "https://www.najdirabota.com.mk"
HOME_URL   = f"{BASE_URL}/"
SEARCH_URL = f"{BASE_URL}/vacancy/search"
API_URL    = "http://localhost:8080/api/jobs"
DELAY      = 1.2

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


SKIP_TITLES = {"кон огласот", "kon oglasite", "огласи", "пребарај", "аплицирај"}

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


def is_valid_title(title):
    if not title:
        return False
    if title.lower().strip() in SKIP_TITLES:
        return False
    if len(title.strip()) < 3:
        return False
    return True


def extract_job_links(soup):
    """Extract unique job detail URLs from a page, skipping UI button links."""
    links = {}  
    for a in soup.find_all("a", href=re.compile(r"/vacancy/view/id=")):
        href = a.get("href", "")
        title = a.get_text(strip=True)

        if not is_valid_title(title):
            continue

        url = BASE_URL + href if href.startswith("/") else href


        if url not in links:
            links[url] = title

    return links  



def get_job_detail(url, title_fallback, company_fallback=None, location_fallback=None, category_fallback=None):
    soup = fetch(url)
    if not soup:
        return None

    def next_text(heading_text):
        for h4 in soup.find_all("h4"):
            if heading_text.lower() in h4.get_text(strip=True).lower():
                sib = h4.find_next_sibling()
                return sib.get_text(separator="\n", strip=True) if sib else None
        return None

    title    = next_text("Позиција")     or title_fallback
    company  = next_text("Организација") or company_fallback
    category = next_text("Индустрија")   or category_fallback
    location = location_fallback

    desc_raw  = next_text("Опис на работната позиција") or ""
    quals_raw = next_text("Потребни квалификации") or ""
    description = (desc_raw + ("\n\nПотребни квалификации:\n" + quals_raw if quals_raw else "")).strip()

    full_text    = soup.get_text()
    active_until = None
    m = re.search(r"Краен рок за пријавување:\s*(\d{2}/\d{2}/\d{4})", full_text)
    if m:
        active_until = m.group(1)

    return {
        "title":       title,
        "company":     company,
        "location":    location or None,
        "description": description or None,
        "activeUntil": active_until,
        "category":    category,
        "source":      "najdirabota.com.mk",
        "url":         url,
    }




def collect_all_links():
    """
    Collect job links from:
    1. Homepage (featured jobs)
    2. /vacancy/search?page=N (paginated full listing)
    """
    all_links = {}  

    
    print("  Scanning homepage…")
    soup = fetch(HOME_URL)
    if soup:
        found = extract_job_links(soup)
        print(f"    Found {len(found)} links on homepage")
        all_links.update(found)

   
    page = 1
    while True:
        url = f"{SEARCH_URL}?page={page}"
        print(f"  Scanning search page {page}…")
        soup = fetch(url)
        if not soup:
            break

        found = extract_job_links(soup)
        if not found:
            print(f"    No jobs found on page {page}, stopping.")
            break

        new = {k: v for k, v in found.items() if k not in all_links}
        print(f"    Found {len(found)} links ({len(new)} new)")
        all_links.update(new)


        has_next = soup.find("a", href=re.compile(rf"page={page+1}"))
        if not has_next:
            break

        page += 1
        time.sleep(DELAY)

    return all_links




def run():
    print("Collecting job links from najdirabota.com.mk…\n")
    all_links = collect_all_links()
    print(f"\nTotal unique jobs found: {len(all_links)}\n")

    total_sent = 0
    total_failed = 0

    for url, title in all_links.items():
        print(f"  Scraping: {title[:60]}")

        job_data = get_job_detail(url, title_fallback=title)
        if not job_data:
            print("    → skipped (fetch failed)")
            total_failed += 1
            continue

        try:
            resp = requests.post(API_URL, json=job_data, timeout=10)
            status = resp.status_code
            if status == 201:
                print(f"    → saved ✓")
                total_sent += 1
            else:
                print(f"    → API returned {status}: {resp.text[:100]}")
                total_failed += 1
        except Exception as e:
            print(f"    → API error: {e}")
            total_failed += 1

        time.sleep(DELAY)

    print(f"\n{'='*50}")
    print(f"Done. Saved: {total_sent} | Failed: {total_failed} | Total: {len(all_links)}")


if __name__ == "__main__":
    run()
