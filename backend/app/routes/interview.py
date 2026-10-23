from app.arcjet_client import aj
from pydantic import BaseModel
import uuid
from datetime import datetime, timezone

import httpx
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Request
from imagekitio import ImageKit

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/interview", tags=["interview"])

imagekit = ImageKit(private_key=settings.IMAGEKIT_PRIVATE_KEY)


@router.get("/tokens")
async def get_remaining_tokens(
    request: Request,
    user=Depends(get_current_user),
):
    is_pro = user.get("plan") == "pro"
    if is_pro:
        return {"remaining": None, "capacity": None, "is_pro": True}

    try:
        decision = await aj.protect(request, characteristics={"userId": user["user_id"]}, requested=0)
        try:
            remaining = decision.results[0].remaining
        except Exception:
            remaining = 15
    except Exception:
        remaining = 15

    return {
        "remaining": remaining,
        "capacity": 15,
        "is_pro": False,
    }


@router.post("/resume")
async def start_interview_with_resume(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    is_pro = user.get("plan") == "pro"

    if not is_pro:
        decision = await aj.protect(request, characteristics={"userId": user["user_id"]}, requested=5)
        if decision.is_denied():
            raise HTTPException(
                status_code=429,
                detail="Not enough tokens. You need 5 tokens per interview. Tokens refill daily."
            )

    allowed_ext = (".pdf",)
    if not file.filename.lower().endswith(allowed_ext):
        raise HTTPException(status_code=400, detail="Only PDF is allowed")

    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"

    contents = await file.read()

    try:
        upload_response = imagekit.files.upload(
            file=contents,
            file_name=unique_name,
            folder="/resumes",
        )
        resume_url = upload_response.url
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to upload resume to ImageKit: {e}")

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                settings.N8N_WEBHOOK_URL,
                json={"resumeUrl": resume_url},
            )
            response.raise_for_status()
            result = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach n8n workflow: {e}")

    data = result[0] if isinstance(result, list) else result
    domain = data.get("domain", "General")
    seniority = data.get("seniority", "Unknown")
    questions = data.get("questions", [])

    if not questions:
        raise HTTPException(status_code=502, detail="No questions were generated. Try again.")

    session_doc = {
        "user_id": user["user_id"],
        "domain": domain,
        "seniority": seniority,
        "questions": questions,
        "answers": [],
        "current_question_index": 0,
        "status": "pending",
        "source": "resume",
        "resume_url": resume_url,
        "resume_filename": file.filename,
        "created_at": datetime.now(timezone.utc),
    }
    insert_result = await db.interview_sessions.insert_one(session_doc)

    return {
        "session_id": str(insert_result.inserted_id),
        "domain": domain,
        "seniority": seniority,
        "questions": questions,
    }


class JobDescriptionInput(BaseModel):
    jobTitle: str
    jobDescription: str
    experience: str


@router.post("/job-description")
async def start_interview_with_job_description(
    request: Request,
    payload: JobDescriptionInput,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    is_pro = user.get("plan") == "pro"

    if not is_pro:
        decision = await aj.protect(request, characteristics={"userId": user["user_id"]}, requested=5)
        if decision.is_denied():
            raise HTTPException(
                status_code=429,
                detail="Not enough tokens. You need 5 tokens per interview. Tokens refill daily."
            )

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                settings.N8N_WEBHOOK_URL,
                json=payload.model_dump(),
            )
            response.raise_for_status()
            result = response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to reach n8n workflow: {e}")

    data = result[0] if isinstance(result, list) else result
    domain = data.get("domain", "General")
    seniority = data.get("seniority", "Unknown")
    questions = data.get("questions", [])

    if not questions:
        raise HTTPException(status_code=502, detail="No questions were generated. Try again.")

    session_doc = {
        "user_id": user["user_id"],
        "domain": domain,
        "seniority": seniority,
        "questions": questions,
        "answers": [],
        "current_question_index": 0,
        "status": "pending",
        "source": "job_description",
        "job_title": payload.jobTitle,
        "created_at": datetime.now(timezone.utc),
    }
    insert_result = await db.interview_sessions.insert_one(session_doc)

    return {
        "session_id": str(insert_result.inserted_id),
        "domain": domain,
        "seniority": seniority,
        "questions": questions,
    }


class AnswerInput(BaseModel):
    question_id: int
    answer: str


@router.post("/{session_id}/answer")
async def save_answer(
    session_id: str,
    payload: AnswerInput,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        oid = ObjectId(session_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session id")

    session = await db.interview_sessions.find_one(
        {"_id": oid, "user_id": user["user_id"]}
    )
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    is_last = payload.question_id >= len(session.get("questions", []))

    await db.interview_sessions.update_one(
        {"_id": oid},
        {
            "$push": {
                "answers": {
                    "question_id": payload.question_id,
                    "answer": payload.answer,
                    "answered_at": datetime.now(timezone.utc),
                }
            },
            "$set": {
                "current_question_index": payload.question_id,
                "status": "completed" if is_last else "in_progress",
            },
        },
    )

    return {"status": "saved", "completed": is_last}


@router.get("/{session_id}")
async def get_interview_session(
    session_id: str,
    db=Depends(get_db),
    user=Depends(get_current_user),
):
    doc = await db.interview_sessions.find_one({"_id": ObjectId(session_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Interview session not found")
    doc["_id"] = str(doc["_id"])
    return doc