import os
import httpx
from fastapi import HTTPException, Header

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.clerk.com/v1/tokens/verify",
            headers={
                "Authorization": f"Bearer {os.getenv('CLERK_SECRET_KEY')}",
                "Content-Type": "application/json"
            },
            json={"token": token}
        )
    
    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    data = res.json()
    return {
        "user_id": data.get("sub"),
        "email": data.get("email")
    }