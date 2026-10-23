import httpx
from fastapi import APIRouter, Depends, HTTPException
from app.config import settings
from app.dependencies import get_current_user

router = APIRouter(prefix="/avatar", tags=["avatar"])


@router.post("/start")
async def start_avatar_conversation(
    user=Depends(get_current_user),
):
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://tavusapi.com/v2/conversations",
                headers={
                    "x-api-key": settings.TAVUS_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "replica_id": settings.TAVUS_REPLICA_ID,
                    "persona_id": settings.TAVUS_PERSONA_ID,
                    "conversation_name": f"Interview - {user['user_id']}",
                    "properties": {
                        "max_call_duration": 1800,
                        "participant_left_timeout": 60,
                        "participant_absent_timeout": 300,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to start avatar conversation: {e}")

    return {
        "conversation_id": data.get("conversation_id"),
        "conversation_url": data.get("conversation_url"),
    }


@router.get("/{conversation_id}/status")
async def get_conversation_status(
    conversation_id: str,
    user=Depends(get_current_user),
):
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"https://tavusapi.com/v2/conversations/{conversation_id}",
                params={"verbose": "true"},
                headers={"x-api-key": settings.TAVUS_API_KEY},
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch conversation status: {e}")

    shutdown_reason = data.get("shutdown_reason")
    if not shutdown_reason:
        for event in data.get("events") or []:
            if event.get("event_type") == "system.shutdown":
                props = event.get("properties") or {}
                shutdown_reason = props.get("shutdown_reason") or props.get("reason")

    return {"status": data.get("status"), "shutdown_reason": shutdown_reason}