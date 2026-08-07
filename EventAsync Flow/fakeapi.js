function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}
const messages = [
    "Data Synced",
    "User Verified",
    "Database Updated",
    "Invoice Generated",
    "Cloud Upload Complete",
    "Analytics Ready",
    "Backup Successful",
    "Image Processed",
    "Cache Refreshed",
    "Security Check Passed"
];

async function fakeApiCall({
    minDelay = 500,
    maxDelay = 2000,
    failureRate = .25,
    label = "",
    tickMs = 80,
    onProgress = null
} = {}) {
    const totalDelay =
        random(
            minDelay,
            maxDelay
        );
    let elapsed = 0;
    let progress = 0;
    while (
        elapsed < totalDelay
    ) {
        await sleep(
            Math.min(
                tickMs,
                totalDelay - elapsed
            )
        );
        elapsed += tickMs;
        progress = Math.min(
            100,
            Math.floor(
                (elapsed / totalDelay) * 100
            )
        );
        if (
            typeof onProgress === "function"
        ) {
            onProgress(progress);
        }
    }
    const failed =
        Math.random() < failureRate;
    if (failed) {
        const err =
            new Error(
                `${label || "Task"} failed after ${totalDelay}ms`
            );
        err.code = "NETWORK_ERROR";
        err.label = label;
        err.latencyMs = totalDelay;
        err.progress = progress;
        throw err;
    }
    return {
        ok: true,
        status: 200,
        label,
        latency: totalDelay,
        progress: 100,
        timestamp: new Date()
            .toLocaleTimeString(),
        message:
            messages[
            random(
                0,
                messages.length - 1
            )
            ]
    };
}
function createFakeApiTask(options = {}) {
    return () => fakeApiCall(options);
}
