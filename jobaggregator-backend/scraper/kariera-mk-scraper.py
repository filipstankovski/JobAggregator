import requests
from bs4 import BeautifulSoup
import time
import datetime

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


BASE_URL = "https://kariera.mk"

headers = {
    "User-Agent": "Mozilla/5.0"
}

API_URL = "http://localhost:8080/api/jobs"


def create_driver():

    options = Options()

    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)

    return driver


def scroll_until_end(driver):

    last_height = driver.execute_script(
        "return document.body.scrollHeight"
    )

    while True:

        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);"
        )

        time.sleep(3)

        new_height = driver.execute_script(
            "return document.body.scrollHeight"
        )

        if new_height == last_height:
            break

        last_height = new_height


def get_job_details(url):

    res = requests.get(url, headers=headers)

    soup = BeautifulSoup(res.text, "html.parser")


    title_tag = soup.select_one("h1")

    full_title = (
        title_tag.get_text(strip=True)
        if title_tag else None
    )


    desc_tag = soup.select_one(
        "div.job-desc:not(.d-none)"
    )

    description = (
        desc_tag.get_text(separator="\n", strip=True)
        if desc_tag else None
    )

    # DETAILS
    active_until = None
    category = None

    for li in soup.select("ul.details li"):

        text = li.get_text(strip=True)

        if "Активен до" in text:
            active_until = text.replace("Активен до", "").strip()

        if "Позиција:" in text:

            category = (text.replace("Позиција:", "") .strip())

    return (full_title,description,active_until,category)


def get_jobs():

    driver = create_driver()

    driver.get(BASE_URL)

    time.sleep(5)

    # Infinite scroll
    scroll_until_end(driver)

    soup = BeautifulSoup(
        driver.page_source,
        "html.parser"
    )

    driver.quit()

    jobs = []

    seen_urls = set()

    for job in soup.select("ul.thumbgalleries li"):
        link = job.select_one("a")
        title_tag = job.select_one("h3")
        company_tag = job.select_one("p.company")
        location_tag = job.select_one(".job-info")

        if not link or not title_tag:
            continue

        url = BASE_URL + link["href"]

        # Skip duplicates
        if url in seen_urls:
            continue

        seen_urls.add(url)

        title = title_tag.get_text(strip=True)

        company = (
            company_tag.get_text(strip=True)
            if company_tag else None
        )

        full_title, description, active_until, category = (
            get_job_details(url)
        )

        # LOCATION
        location = None

        if location_tag:

            location = next(
                location_tag.stripped_strings,
                None
            )

        # FORMAT DATE
        active_until_formatted = None

        if active_until:

            try:

                parsed_date = datetime.datetime.strptime(
                    active_until,
                    "%d.%m.%Y"
                ).date()

                active_until_formatted = parsed_date.strftime(
                    "%Y-%m-%d"
                )

            except ValueError:
                active_until_formatted = active_until

        job_data = {
            "title": full_title if full_title else title,
            "company": company,
            "location": location,
            "description": description,
            "activeUntil": active_until_formatted,
            "category": category,
            "source": "kariera.mk",
            "url": url
        }

        jobs.append(job_data)

        try:

            response = requests.post(
                API_URL,
                json=job_data
            )

            print(
                f"Sent: {response.status_code} | "
                f"{title}"
            )

        except Exception as e:

            print("Error sending:", e)

        time.sleep(1)

    return jobs


if __name__ == "__main__":

    jobs = get_jobs()

    print(f"\nTotal jobs: {len(jobs)}")