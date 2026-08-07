class UIManager {
  constructor(queue) {
    this.queue = queue;
    this.pendingList = document.getElementById("pendingList");
    this.runningSection = document.getElementById("runningSection");
    this.historyList = document.getElementById("historyList");
    this.emptyHint = document.getElementById("emptyHint");
    this.logsPanel = document.getElementById("logsPanel");
    this.pendingCountEl = document.getElementById("pendingCount");
    this.runningCountEl = document.getElementById("runningCount");
    this.completedCountEl = document.getElementById("completedCount");
    this.failedCountEl = document.getElementById("failedCount");
    this.progressBar = document.getElementById("progressBar");
    this.progressPercent = document.getElementById("progressPercent");
    this.toast = document.getElementById("toast");
    this.clock = document.getElementById("clock");
    this.searchInput = document.getElementById("searchInput");
    this.exportBtn = document.getElementById("exportLogs");
    this.startClock();
    this.bindQueueEvents();
    this.bindUIEvents();
    this.updateStats();
  }
  bindUIEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.filterTasks(e.target.value);
      });
    }
    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => {
        this.exportLogs();
      });
    }
  }
  bindQueueEvents() {
    const emitter = this.queue.emitter;
    emitter.on("taskAdded", ({ snapshot }) => {
      this.addPendingItem(snapshot);
      this.toggleEmptyHint(false);
      this.updateStats();
      this.showToast("Task Added Successfully", "success");
    });
    emitter.on("taskStarted", ({ snapshot, attempt }) => {
      this.moveToRunning(snapshot);
      this.updateStats();
      this.addLog("info", `<b>${escapeHtml(snapshot.name)}</b> started`);
      if (attempt > 1) {
        this.showToast("Retry Attempt " + attempt, "warning");
      }
    });
    emitter.on("taskRetry", ({ snapshot, attempt }) => {
      this.moveToRunning(snapshot, true);
      this.updateStats();
      this.addLog(
        "warning",
        `<b>${escapeHtml(snapshot.name)}</b> retry ${attempt}`,
      );
      this.showToast("Retrying Task...", "warning");
    });
    emitter.on("taskCompleted", ({ snapshot, result }) => {
      this.clearRunning();
      this.addHistoryItem(snapshot, "success");
      this.updateStats();
      this.addLog("success", `<b>${escapeHtml(snapshot.name)}</b> completed`);
      this.showToast("Task Completed", "success");
    });
    emitter.on("taskFailed", ({ snapshot, error }) => {
      this.clearRunning();
      this.addHistoryItem(snapshot, "failed");
      this.updateStats();
      this.addLog(
        "error",
        `<b>${escapeHtml(snapshot.name)}</b> ${escapeHtml(error.message)}`,
      );
      this.showToast("Task Failed", "error");
    });
    emitter.on("taskRemoved", ({ snapshot }) => {
      this.removePendingItem(snapshot.id);
      this.updateStats();
      this.addLog("system", `${escapeHtml(snapshot.name)} removed`);
      this.showToast("Task Removed", "warning");
    });
    emitter.on("queueStarted", () => {
      this.addLog("info", "Queue Started");
      this.showToast("Queue Running", "success");
    });
    emitter.on("queuePaused", () => {
      this.addLog("warning", "Queue Paused");
      this.showToast("Queue Paused", "warning");
    });
    emitter.on("queueResumed", () => {
      this.addLog("info", "Queue Resumed");
      this.showToast("Queue Resumed", "success");
    });
    emitter.on("queueDrained", ({ completed, failed }) => {
      this.addLog(
        "system",
        `Queue Finished (${completed} completed | ${failed} failed)`,
      );
      this.showToast("Queue Finished", "success");
    });
  }
  addPendingItem(snapshot) {
    const placeholder = this.pendingList.querySelector(".placeholder-text");
    if (placeholder) placeholder.remove();
    const card = document.createElement("div");
    card.className = "task pending";
    card.dataset.taskId = snapshot.id;
    card.innerHTML = `
        <h4>${snapshot.meta?.emoji || "📄"} ${escapeHtml(snapshot.name)}</h4>
        <p>
            Waiting in Queue
        </p>
        <span class="badge pending">
            Pending
        </span>
    `;
    card.style.animation = "fadeIn .4s ease";
    this.pendingList.appendChild(card);
  }
  removePendingItem(id) {
    const task = this.pendingList.querySelector(`[data-task-id="${id}"]`);
    if (task) {
      task.remove();
    }
  }
  moveToRunning(snapshot, retry = false) {
    this.removePendingItem(snapshot.id);
    this.runningSection.innerHTML = "";
    const card = document.createElement("div");
    card.className = retry ? "task running retry" : "task running";
    card.dataset.taskId = snapshot.id;
    card.innerHTML = `
        <h4>
            ${snapshot.meta?.emoji || "⚡"}
            ${escapeHtml(snapshot.name)}
        </h4>
        <p>
            ${retry ? "Retrying..." : "Currently Executing"}
        </p>
        <span class="badge running">
            ${retry ? "Retry" : "Running"}
        </span>
    `;
    card.style.animation = "pulse 1s infinite";
    this.runningSection.appendChild(card);
  }
  clearRunning() {
    this.runningSection.innerHTML = `
        <div class="placeholder-text">
            No Running Task
        </div>
    `;
  }
  addHistoryItem(snapshot, status) {
    const placeholder = this.historyList.querySelector(".placeholder-text");
    if (placeholder) {
      placeholder.remove();
    }
    const icon =
      status === "success" ? "✅" : status === "failed" ? "❌" : "⚪";
    const badgeClass = status === "success" ? "success" : "failed";
    const card = document.createElement("div");
    card.className = `task ${badgeClass}`;
    card.dataset.taskId = snapshot.id;
    card.innerHTML = `
        <h4>
            ${icon}
            ${escapeHtml(snapshot.name)}
        </h4>
        <p>
            Attempts :
            ${snapshot.attempts}
        </p>
        <span class="badge ${badgeClass}">
            ${status.toUpperCase()}
        </span>
    `;
    card.style.animation = "slideUp .4s ease";
    this.historyList.prepend(card);
    while (this.historyList.children.length > 10) {
      this.historyList.lastElementChild.remove();
    }
  }
  filterTasks(keyword) {
    keyword = keyword.toLowerCase();
    const allTasks = document.querySelectorAll(".task");
    allTasks.forEach((task) => {
      const text = task.innerText.toLowerCase();
      task.style.display = text.includes(keyword) ? "" : "none";
    });
  }
  updateStats() {
    const pending = this.queue.size;
    const running = this.queue._current ? 1 : 0;
    const completed = this.queue.completedCount;
    const failed = this.queue.failedCount;
    this.pendingCountEl.textContent = pending;
    this.runningCountEl.textContent = running;
    this.completedCountEl.textContent = completed;
    this.failedCountEl.textContent = failed;
    const total = pending + running + completed + failed;
    let percent = 0;
    if (total > 0) {
      percent = Math.round(((completed + failed) / total) * 100);
    }
    if (this.progressBar) {
      this.progressBar.style.width = percent + "%";
    }
    if (this.progressPercent) {
      this.progressPercent.textContent = percent + "%";
    }
    this.toggleEmptyHint(pending === 0 && running === 0);
  }
  toggleEmptyHint(show) {
    if (!this.emptyHint) return;
    this.emptyHint.style.display = show ? "block" : "none";
  }
  addLog(type = "info", message) {
    const div = document.createElement("div");
    div.className = `log ${type}`;
    div.innerHTML = `
        <strong>
            ${this.getTime()}
        </strong>
        ${message}
    `;
    this.logsPanel.appendChild(div);
    this.logsPanel.scrollTop = this.logsPanel.scrollHeight;
    while (this.logsPanel.children.length > 60) {
      this.logsPanel.firstElementChild.remove();
    }
  }
  clearLogs() {
    this.logsPanel.innerHTML = "";
    this.showToast(
      "Logs Cleared",
      "success",
    );
  }
  showToast(message, type = "success") {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.className = "show";
    switch (type) {
      case "success":
        this.toast.style.background = "#10b981";
        break;
      case "error":
        this.toast.style.background = "#ef4444";
        break;
      case "warning":
        this.toast.style.background = "#f59e0b";
        break;
      default:
        this.toast.style.background = "#6366f1";
    }
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }
  startClock() {
    if (!this.clock) return;
    const update = () => {
      const now = new Date();
      this.clock.textContent = now.toLocaleTimeString();
    };
    update();
    setInterval(update, 1000);
  }
  exportLogs() {
    let text = "";
    document
      .querySelectorAll("#logsPanel .log")
      .forEach((log) => {
        text += log.innerText + "\n";
      });
    const blob = new Blob(
      [text],
      {
        type: "text/plain",
      },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "queue-logs.txt";
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(
      "Logs Exported",
      "success",
    );
  }
  getTime() {
    const d = new Date();
    return d.toLocaleTimeString();
  }
}
