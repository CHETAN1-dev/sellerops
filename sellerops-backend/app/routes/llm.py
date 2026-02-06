from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
import json
import os
from urllib import request, error

from app.security.deps import get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/llm", tags=["LLM"])


class LLMChatRequest(BaseModel):
    message: str = Field(min_length=1)


class LLMChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=LLMChatResponse)
def llm_chat(
    payload: LLMChatRequest,
    current_user: User = Depends(get_current_user),
):
    _ = current_user  # keep JWT validation explicit and stateless for now

    llm_api_key = os.getenv("LLM_API_KEY")
    if not llm_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM provider is not configured",
        )

    llm_base_url = os.getenv("LLM_API_BASE_URL", "https://api.openai.com/v1")
    llm_model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    body = json.dumps(
        {
            "model": llm_model,
            "messages": [{"role": "user", "content": payload.message}],
            "stream": False,
        }
    ).encode("utf-8")

    req = request.Request(
        f"{llm_base_url.rstrip('/')}/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {llm_api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=30) as resp:
            provider_data = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM provider error: {exc.reason}",
        ) from exc
    except error.URLError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to reach LLM provider",
        ) from exc

    message = (
        provider_data.get("choices", [{}])[0]
        .get("message", {})
        .get("content")
    )

    if not message:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Invalid response from LLM provider",
        )

    return LLMChatResponse(response=message)
