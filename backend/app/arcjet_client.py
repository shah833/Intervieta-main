from arcjet import arcjet, token_bucket, Mode
from app.config import settings

aj = arcjet(
    key=settings.ARCJET_KEY,
    rules=[
        token_bucket(
            mode=Mode.DRY_RUN,
            characteristics=["userId"],
            refill_rate=15,
            interval=1,
            capacity=15,
        )
    ],
)