import requests
from bs4 import BeautifulSoup
import time

BASE_URL = "https://kariera.mk"

headers = {
    "User-Agent": "Mozilla/5.0"
}

API_URL = "http://localhost:8080/api/jobs"


def get_job_details(url):
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")


    title_tag = soup.select_one("h1")
    full_title = title_tag.get_text(strip=True) if title_tag else None


    desc_tag = soup.select_one("div.job-desc:not(.d-none)")
    description = desc_tag.get_text(separator="\n", strip=True) if desc_tag else None


    active_until = None
    category = None

    for li in soup.select("ul.details li"):
        text = li.get_text(strip=True)

        if "Активен до" in text:
            active_until = text.replace("Активен до", "").strip()

        if "Позиција:" in text:
            category = text.replace("Позиција:", "").strip()

    return full_title, description, active_until, category


def get_jobs():
    res = requests.get(BASE_URL, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")

    jobs = []

    for job in soup.select("ul.thumbgalleries li"):
        link = job.select_one("a")
        title_tag = job.select_one("h3")
        company_tag = job.select_one("p.company")
        location_tag = job.select_one(".job-info")

        if not link or not title_tag:
            continue

        url = BASE_URL + link["href"]

        title = title_tag.get_text(strip=True)
        company = company_tag.get_text(strip=True) if company_tag else None

        full_title, description, active_until, category = get_job_details(url)


        location = None
        if location_tag:
            location = next(location_tag.stripped_strings, None)

        job_data = {
            "title": full_title if full_title else title,
            "company": company,
            "location": location,
            "description": description,
            "activeUntil": active_until,
            "category": category,
            "source": "kariera.mk",
            "url": url
        }

        jobs.append(job_data)


        try:
            response = requests.post(API_URL, json=job_data)
            print("Sent:", response.status_code, url)
        except Exception as e:
            print("Error sending:", e)

        time.sleep(1)
    return jobs


if __name__ == "__main__":
    jobs = get_jobs()
    print("Total jobs:", len(jobs))