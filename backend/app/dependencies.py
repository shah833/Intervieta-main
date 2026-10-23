from fastapi import Depends
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials

from app.config import settings

clerk_config = ClerkConfig(jwks_url=settings.CLERK_JWKS_URL)
clerk_auth_guard = ClerkHTTPBearer(config=clerk_config)


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(clerk_auth_guard),
):
    decoded = creds.decoded
    return {
        "user_id": decoded.get("sub"),
        "email": decoded.get("email"),
    }