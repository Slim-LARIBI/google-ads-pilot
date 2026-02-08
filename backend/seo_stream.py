# backend/seo_stream.py
import asyncio
import json
from typing import AsyncGenerator, Dict, Any

from fastapi import APIRouter, Query
from sse_starlette.sse import EventSourceResponse  # pip install sse-starlette

# IMPORTANT: ici tu appelles ta fonction existante
# qui fait le scan et retourne le résultat final (dict)
from backend.seo_crawler import run_seo_scan  # adapte si ton import diffère

router = APIRouter(prefix="/seo", tags=["seo"])

def sse_event(data: Dict[str, Any], event: str = "message") -> str:
    # SSE format
    payload = json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n"

@router.get("/scan/stream")
async def seo_scan_stream(
    url: str = Query(..., description="Target URL"),
    max_pages: int = Query(25, ge=1, le=200),
):
    """
    Stream progress events (SSE) while running SEO scan.
    """

    async def event_generator() -> AsyncGenerator[str, None]:
        # 1) start
        yield sse_event({"stage": "start", "progress": 1, "message": "Initialisation…"}, event="progress")
        await asyncio.sleep(0.05)

        # 2) run scan in a thread (so we can keep streaming)
        loop = asyncio.get_running_loop()

        # We'll simulate real phases and keep the UI alive.
        # (If you later refactor run_seo_scan to accept a callback, we’ll emit true granular progress)
        yield sse_event({"stage": "fetch", "progress": 10, "message": "Connexion au site…"}, event="progress")

        # Run scan in executor
        scan_task = loop.run_in_executor(None, lambda: run_seo_scan(url=url, max_pages=max_pages))

        # While running, emit "heartbeat" + soft progress based on time
        progress = 10
        while not scan_task.done():
            await asyncio.sleep(0.4)
            progress = min(progress + 1, 85)  # never go beyond 85 until done
            yield sse_event(
                {"stage": "crawl", "progress": progress, "message": "Crawl & analyse en cours…"},
                event="progress",
            )

        # 3) done -> result
        result = await scan_task
        yield sse_event({"stage": "finalize", "progress": 95, "message": "Finalisation & scoring…"}, event="progress")
        await asyncio.sleep(0.15)

        yield sse_event({"stage": "done", "progress": 100, "result": result}, event="done")

    return EventSourceResponse(event_generator())