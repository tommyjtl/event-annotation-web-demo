import json
import random
from datetime import datetime, timedelta

DATA_TYPES = ["Deployment", "MetricAnomoly", "LogAnomoly"]

USERS = {
    "Deployment": ["alice", "bob", "carol", "daniel"],
    "MetricAnomoly": ["eve", "frank", "grace"],
    "LogAnomoly": ["heidi", "ivan", "judy"],
}

SHORT_DESC = {
    "Deployment": [
        (
            "Checkout service blue green deploy",
            "Blue-green deployment of checkout-service v{version} to production.",
        ),
        (
            "Payments rollout version {version}",
            "Payments-service v{version} rolled out to 100% of traffic after canary.",
        ),
        (
            "User service hotfix deploy",
            "Deployed urgent hotfix v{version} for user-service to patch login bug.",
        ),
        (
            "Frontend CDN update",
            "Updated frontend static assets on CDN with cache busting for v{version}.",
        ),
    ],
    "MetricAnomoly": [
        (
            "Cron scheduler miss frequency rising",
            "Missed scheduled jobs climbed from 0 to {count} per hour.",
        ),
        (
            "API error rate surge checkout",
            "Checkout API error rate spiked from {min_rate}% to {max_rate}% over 10 minutes.",
        ),
        (
            "Memory usage climbing product pods",
            "Product-service pods memory usage increased steadily, approaching resource limits.",
        ),
        (
            "Pod restarts spike auth service",
            "Auth pods restarting repeatedly due to readinessProbe failures.",
        ),
    ],
    "LogAnomoly": [
        (
            "gRPC status unauthenticated internal",
            "Internal gRPC calls returning UNAUTHENTICATED status—token not propagated.",
        ),
        (
            "Filesystem read-only remount mysql",
            "MySQL instance remounted root filesystem read-only after I/O errors.",
        ),
        (
            "Unexpected 502s on cart API",
            "Cart API logs showing intermittent 502 Bad Gateway responses from upstream.",
        ),
        (
            "JWT signature validation failures",
            "Observed spike in JWT signature validation errors on public endpoints.",
        ),
    ],
}

# Metric keys only for MetricAnomoly type
METRIC_KEYS = [
    "scheduler_missed_runs",
    "api_checkout_error_rate",
    "product_memory_usage_mb",
    "auth_pod_restart_count",
]


def random_datetime(start: datetime, end: datetime):
    delta = end - start
    int_delta = int(delta.total_seconds())
    random_sec = random.randint(0, int_delta)
    return (start + timedelta(seconds=random_sec)).isoformat() + "Z"


def generate_event(data_type, start_time, end_time):
    event = {"type": data_type}
    short, desc = random.choice(SHORT_DESC[data_type])
    version = f"{random.randint(1,4)}.{random.randint(0,9)}.{random.randint(0,20)}"
    count = random.randint(5, 20)
    min_rate = round(random.uniform(0.1, 1.5), 1)
    max_rate = round(random.uniform(2.0, 12.0), 1)

    # Format placeholders if present
    short_fmt = short.format(
        version=version, count=count, min_rate=min_rate, max_rate=max_rate
    )
    desc_fmt = desc.format(
        version=version, count=count, min_rate=min_rate, max_rate=max_rate
    )

    event["short"] = short_fmt
    event["description"] = desc_fmt
    event["time"] = random_datetime(start_time, end_time)

    # Add user
    event["user"] = (
        random.choice(USERS.get(data_type, ["system"]))
        if data_type == "Deployment"
        else None
    )

    # Add metric key if MetricAnomoly
    if data_type == "MetricAnomoly":
        event["metric"] = random.choice(METRIC_KEYS)

    # Remove "user" for non-Deployment
    if data_type != "Deployment":
        event.pop("user")
    return event


def generate_events(n, start_time, end_time):
    events = []
    for _ in range(n):
        data_type = random.choice(DATA_TYPES)
        events.append(generate_event(data_type, start_time, end_time))
    return events


if __name__ == "__main__":
    start_time = datetime(2025, 7, 1)
    end_time = datetime(2025, 7, 15)
    n_events = 2000

    events = generate_events(n_events, start_time, end_time)

    # Save to file
    with open("random_events_big.json", "w") as f:
        json.dump(events, f, indent=4)
    print("Generated random_events.json")
