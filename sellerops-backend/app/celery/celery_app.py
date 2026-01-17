# from celery import Celery
# import os

# from app.routes import uploads

# REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# celery_app = Celery(
#     "sellerops",
#     broker=REDIS_URL,
#     backend=REDIS_URL,
# )

# celery_app.autodiscover_tasks(["app"])

# import os
# from celery import Celery

# REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# celery_app = Celery(
#     "sellerops",
#     broker=REDIS_URL,
#     backend=REDIS_URL,
# )

# celery_app.autodiscover_tasks(["app.celery.worker"])


import os
from celery import Celery

REDIS_URL = os.getenv(
    "REDIS_URL",
    "redis://redis:6379/0"   # 👈 Docker hostname
)

celery_app = Celery(
    "sellerops",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.autodiscover_tasks(["app.celery.worker"])
import app.celery.worker.sales_csv_processor