#!/usr/bin/env python3
"""
Sillycone Silicon Intelligence Pipeline: Geekbench & Spec Radar
Crawls benchmark submissions, normalizes hardware metrics, and updates Supabase.
Runs autonomously via GitHub Actions cron ($0/month).
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("sillycone-radar")

# Environmental Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Search keywords targeting unannounced & newly spotted silicon
TARGET_KEYWORDS = [
    "Snapdragon 8 Elite",
    "Dimensity 9400",
    "Apple A18 Pro",
    "Core Ultra 9 285K",
    "Ryzen 9 9950X",
    "Xiaomi 25",  # Prototype identifier for upcoming Xiaomi hardware
    "Arrow Lake",
    "Panther Lake"
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 SillyconeBot/1.0"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}


def search_geekbench_browser(query: str, max_pages: int = 1) -> List[Dict[str, Any]]:
    """
    Scrapes Geekbench Browser for real-time benchmark submissions matching query.
    Returns normalized test records.
    """
    results = []
    base_url = "https://browser.geekbench.com/v6/cpu/search"
    
    logger.info(f"Scanning Geekbench browser for keyword: '{query}'...")
    try:
        response = requests.get(
            base_url,
            params={"q": query, "utf8": "✓"},
            headers=HEADERS,
            timeout=15
        )
        if response.status_code != 200:
            logger.warning(f"Geekbench search returned status {response.status_code} for query: {query}")
            return results

        soup = BeautifulSoup(response.text, "html.parser")
        rows = soup.select("table.table-striped tbody tr")

        for row in rows:
            try:
                cols = row.find_all("td")
                if len(cols) < 4:
                    continue

                # Parse device name and model link
                device_cell = cols[0]
                device_link = device_cell.find("a")
                device_name = device_link.text.strip() if device_link else device_cell.text.strip()
                submission_path = device_link.get("href") if device_link else ""
                submission_id = submission_path.split("/")[-1] if submission_path else ""

                # Parse processor info
                desc_div = device_cell.find("div", class_="device-description")
                processor_raw = desc_div.text.strip() if desc_div else ""

                # Single-core and Multi-core scores
                single_core_str = cols[1].text.strip().replace(",", "")
                multi_core_str = cols[2].text.strip().replace(",", "")

                single_score = float(single_core_str) if single_core_str.isdigit() else 0.0
                multi_score = float(multi_core_str) if multi_core_str.isdigit() else 0.0

                if single_score > 0 and multi_score > 0:
                    results.append({
                        "device_name": device_name,
                        "processor_raw": processor_raw,
                        "single_core": single_score,
                        "multi_core": multi_score,
                        "submission_id": submission_id,
                        "source_url": f"https://browser.geekbench.com{submission_path}" if submission_path else "",
                        "timestamp": datetime.utcnow().isoformat()
                    })
            except Exception as parse_err:
                logger.debug(f"Failed parsing row: {parse_err}")
                continue

    except Exception as e:
        logger.error(f"Error querying Geekbench browser for '{query}': {e}")

    logger.info(f"Found {len(results)} valid benchmark submissions for '{query}'")
    return results


def push_to_supabase(records: List[Dict[str, Any]]):
    """
    Pushes normalized benchmark results to Supabase REST endpoint.
    If no credentials are set, prints formatted dry-run JSON.
    """
    if not records:
        logger.info("No records to persist.")
        return

    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.warning(
            "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment. "
            "Performing DRY-RUN output to console."
        )
        print(json.dumps(records[:3], indent=2))
        return

    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/benchmarks"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    # Transform payload for the schema
    payload = []
    for r in records:
        payload.append({
            "benchmark_name": "Geekbench 6.3.0",
            "category": "cpu_ipc_geekbench6",
            "single_core_or_primary_score": r["single_core"],
            "multi_core_or_secondary_score": r["multi_core"],
            "sample_type": "engineering_sample",
            "test_device_name": r["device_name"],
            "submission_id": r["submission_id"],
            "source_url": r["source_url"]
        })

    try:
        res = requests.post(endpoint, headers=headers, json=payload, timeout=20)
        if res.status_code in (200, 201, 204):
            logger.info(f"Successfully uploaded {len(payload)} records to Supabase!")
        else:
            logger.error(f"Supabase write returned {res.status_code}: {res.text}")
    except Exception as e:
        logger.error(f"Failed to post data to Supabase: {e}")


def main():
    logger.info("Starting Sillycone Cloud Radar Worker...")
    all_records = []
    for kw in TARGET_KEYWORDS:
        records = search_geekbench_browser(kw)
        all_records.extend(records)

    logger.info(f"Total entries discovered: {len(all_records)}")
    push_to_supabase(all_records)
    logger.info("Sillycone Cloud Radar Worker cycle completed.")


if __name__ == "__main__":
    main()
