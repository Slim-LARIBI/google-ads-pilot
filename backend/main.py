from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import time
import json
import re
from urllib.parse import urlparse, urlunparse
import socket
import ipaddress
from collections import deque
from typing import Deque, Dict, Tuple

app = FastAPI(title="Marketing Command Center API")

# =========================
# CORS (frontend Next.js)
# =========================
# IMPORTANT: en dev
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# =========================
# Rate limit simple (in-memory)
# =========================
# Exemple: max 10 scans / 5 minutes / IP
RATE_LIMIT_MAX = 10
RATE_LIMIT_WINDOW_S = 300

_ip_hits: Dict[str, Deque[float]] = {}

def rate_limit_or_429(ip: str):
    now = time.time()
    q = _ip_hits.setdefault(ip, deque())
    # purge old
    while q and (now - q[0]) > RATE_LIMIT_WINDOW_S:
        q.popleft()

    if len(q) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail=f"Too many scans. Try later. ({RATE_LIMIT_MAX}/{RATE_LIMIT_WINDOW_S}s)"
        )

    q.append(now)

# =========================
# Validation INPUT (URL/email/IP)
# =========================
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def _looks_like_email(s: str) -> bool:
    return bool(EMAIL_RE.match(s.strip().lower()))

def normalize_url(raw: str) -> str:
    """
    - refuse email
    - add https:// if missing
    - allow only http/https
    - strip fragments
    """
    raw = (raw or "").strip()
    if not raw:
        raise HTTPException(status_code=400, detail="URL is required")

    if _looks_like_email(raw):
        raise HTTPException(status_code=400, detail="Email is not a valid URL")

    # if scheme missing => assume https
    if "://" not in raw:
        raw = "https://" + raw

    parsed = urlparse(raw)

    if parsed.scheme not in ("http", "https"):
        raise HTTPException(status_code=400, detail="Only http/https URLs are allowed")

    if not parsed.netloc:
        raise HTTPException(status_code=400, detail="Invalid URL (missing host)")

    # remove fragment
    parsed = parsed._replace(fragment="")

    # optional: normalize empty path
    if parsed.path == "":
        parsed = parsed._replace(path="/")

    return urlunparse(parsed)

def host_is_blocked(host: str) -> bool:
    """
    Block localhost / private IP / loopback / link-local / multicast / reserved.
    If host is a domain, resolve and block if any resolved IP is private.
    """
    h = host.strip().lower()

    # Block obvious local hostnames
    if h in ("localhost",):
        return True

    # If host is already an IP
    try:
        ip_obj = ipaddress.ip_address(h)
        if (
            ip_obj.is_private
            or ip_obj.is_loopback
            or ip_obj.is_link_local
            or ip_obj.is_multicast
            or ip_obj.is_reserved
            or ip_obj.is_unspecified
        ):
            return True
        return False
    except ValueError:
        pass

    # Domain -> resolve IPs -> block if any is private/loopback/etc
    try:
        infos = socket.getaddrinfo(h, None)
        ips = set()
        for info in infos:
            sockaddr = info[4]
            ip = sockaddr[0]
            ips.add(ip)

        for ip in ips:
            ip_obj = ipaddress.ip_address(ip)
            if (
                ip_obj.is_private
                or ip_obj.is_loopback
                or ip_obj.is_link_local
                or ip_obj.is_multicast
                or ip_obj.is_reserved
                or ip_obj.is_unspecified
            ):
                return True

        return False
    except Exception:
        # If DNS fails -> refuse
        return True

def validate_target_url(raw: str) -> str:
    url = normalize_url(raw)
    parsed = urlparse(url)
    host = parsed.hostname or ""

    if host_is_blocked(host):
        raise HTTPException(status_code=403, detail="Blocked host (localhost/private IP/DNS invalid)")

    return url

# =========================
# Routes
# =========================
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/seo/scan/stream")
def seo_scan_stream(
    request: Request,
    url: str = Query(..., description="Target website URL (domain or full URL)")
):
    # Client IP
    client_ip = request.client.host if request.client else "unknown"
    rate_limit_or_429(client_ip)

    # Validate URL (blocks email, localhost, private IP, bad scheme)
    safe_url = validate_target_url(url)
    parsed = urlparse(safe_url)
    host = parsed.hostname or ""

    def event_generator():
        # IMPORTANT: en SSE, on envoie aussi des pings pour garder la connexion
        def send_progress(pct: int, label: str):
            return {"event": "progress", "data": json.dumps({"progress": pct, "label": label})}

        # Etape 1: start
        yield send_progress(5, "Starting scan")

        # Etape 2: fetch/crawl (ici tu mettras ton vrai crawler)
        yield send_progress(10, "Fetching & crawling pages")

        # Simule crawl pages (10 pages)
        max_pages = 10
        for i in range(1, max_pages + 1):
            yield send_progress(10 + int((60 * i) / max_pages), f"Crawling pages ({i}/{max_pages})")
            time.sleep(0.6)

        # Analyse (simulé)
        yield send_progress(75, "Checking internal links")
        time.sleep(0.7)

        # Ping keepalive (optionnel)
        yield {"event": "ping", "data": json.dumps({"ts": time.time()})}

        yield send_progress(85, "Computing SEO score")
        time.sleep(0.7)

        yield send_progress(100, "Scan completed")

        # DONE payload (format attendu par ton front)
        payload = {
            "kpis": {
                "pages_crawled": max_pages,
                "critical_issues": 0,
                "missing_meta_descriptions": 0,
                "thin_pages": 2,
            },
            "health": {
                "score": 91,
                "main_issue": "Thin content pages on 2 item(s)",
            },
            "issues": {
                "missing_meta_descriptions": [],
                "broken_links": [],
                "duplicate_titles": {},
                "thin_pages": [
                    {"url": f"https://{host}/contact/", "words": 123},
                    {"url": f"https://{host}/category/google-ads-sea/", "words": 228},
                ],
                "missing_h1": [],
            },
            "meta": {
                "target_url": safe_url,
                "host": host,
                "max_pages": max_pages,
                "thin_words_threshold": 250,
                "duration_s": 3.14,
                "finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "client_ip": client_ip,
            },
        }

        yield {"event": "done", "data": json.dumps(payload)}

    return EventSourceResponse(event_generator())