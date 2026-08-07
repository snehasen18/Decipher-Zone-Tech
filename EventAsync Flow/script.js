(() => {
   "use strict";
   const emitter = new EventEmitter();
   const queue = new AsyncQueue({
      emitter,
      delayMs: 1000,
      maxRetries: 3,
      maxQueueSize: 50
   });
   const ui = new UIManager(queue);
   const addTaskBtn = document.getElementById("addTaskBtn");
   const addFlakyBtn = document.getElementById("addFlakyBtn");
   const startBtn = document.getElementById("startBtn");
   const pauseBtn = document.getElementById("pauseBtn");
   const clearLogsBtn = document.getElementById("clearLogsBtn");
   const demoBtn = document.getElementById("demoBtn");
   let taskCounter = 0;
   let totalCreated = 0;
   let totalSuccess = 0;
   let totalFailed = 0;
   let demoRunning = false;
   const emojiPool = [
      "📦",
      "🚀",
      "🛠",
      "⚙",
      "📊",
      "💾",
      "🌐",
      "🔧",
      "📨",
      "🧩",
      "⚡",
      "🔥"
   ];
   let emojiIndex = 0;
   function nextEmoji() {
      const emoji =
         emojiPool[
         emojiIndex %
         emojiPool.length
         ];
      emojiIndex++;
      return emoji;
   }
   document.addEventListener(
      "keydown",
      (e) => {
         if (e.target.tagName === "INPUT") return;
         switch (e.key.toLowerCase()) {
            case "a":
               addTask();
               break;
            case "f":
               addFlakyTask();
               break;
            case "s":
               startQueue();
               break;
            case "p":
               togglePause();
               break;
            case "c":
               ui.clearLogs();
               break;
            case "d":
               runDemoMode();
               break;
         }
      }
   );
   function randomDelay() {
      return Math.floor(
         Math.random() * 1000
      ) + 500;
   }
   function randomFailure() {
      return Math.random() * 0.4;
   }
   ui.addLog(
      "system",
      " Premium Dashboard Loaded"
   );
   ui.showToast(
      "Welcome Back",
      "success"
   );
   function addTask() {
      taskCounter++;
      totalCreated++;
      const name = `Task ${taskCounter}`;
      try {
         queue.add(
            () => fakeApiCall({
               minDelay: randomDelay(),
               maxDelay: randomDelay() + 600,
               failureRate: 0.20,
               label: name,
               tickMs: 50
            }),
            {
               name,
               emoji: nextEmoji(),
               priority: "normal",
               created: new Date()
            }
         );
         ui.addLog(
            "success",
            `📦 ${name} added to queue`
         );
      }
      catch (err) {
         ui.addLog(
            "error",
            `❌ ${escapeHtml(err.message)}`
         );
         ui.showToast(
            "Queue Full",
            "error"
         );
      }
   }
   function addFlakyTask() {
      taskCounter++;
      totalCreated++;
      const name = `Flaky Task ${taskCounter}`;
      try {
         queue.add(
            () => fakeApiCall({
               minDelay: 400,
               maxDelay: 1200,
               failureRate: .60,
               label: name,
               tickMs: 50
            }),
            {
               name,
               emoji: "⚠️",
               priority: "high",
               flaky: true,
               created: new Date()
            }
         );
         ui.addLog(
            "warning",
            `⚠️ ${name} added`
         );
      }
      catch (err) {
         ui.addLog(
            "error",
            escapeHtml(err.message)
         );
      }
   }
   function generateRandomTasks(count = 5) {
      for (
         let i = 0;
         i < count;
         i++
      ) {
         setTimeout(() => {
            Math.random() > .30
               ?
               addTask()
               :
               addFlakyTask();
         },
            i * 300);
      }
   }
   function runDemoMode() {
      if (demoRunning) {
         ui.showToast(
            "Demo Already Running",
            "warning"
         );
         return;
      }
      demoRunning = true;
      ui.showToast(
         "Starting Demo",
         "success"
      );
      ui.addLog(
         "system",
         "🚀 Demo Mode Started"
      );
      generateRandomTasks(10);
      setTimeout(() => {
         startQueue();
      }, 3500);
      setTimeout(() => {
         demoRunning = false;
         ui.addLog(
            "system",
            "✅ Demo Completed"
         );
         ui.showToast(
            "Demo Finished",
            "success"
         );
      }, 25000);
   }
   emitter.on(
      "taskCompleted",
      () => {
         totalSuccess++;
      }
   );
   emitter.on(
      "taskFailed",
      () => {
         totalFailed++;
      }
   );
   function dashboardSummary() {
      return {
         created: totalCreated,
         completed: totalSuccess,
         failed: totalFailed,
         pending: queue.size
      };
   }
   function startQueue() {
      queue.start();
      ui.showToast(
         "Queue Started",
         "success"
      );
      ui.addLog(
         "system",
         "▶ Queue Processing Started"
      );
   }
   function togglePause() {
      if (queue.isPaused) {
         queue.resume();
         ui.showToast(
            "Queue Resumed",
            "success"
         );
         ui.addLog(
            "info",
            "Queue Resumed"
         );
      }
      else {
         queue.pause();
         ui.showToast(
            "Queue Paused",
            "warning"
         );
         ui.addLog(
            "warning",
            "Queue Paused"
         );
      }
   }
   function updateButtonStates() {
      const hasPending = queue.size > 0;
      const running = queue.isRunning;
      const paused = queue.isPaused;
      startBtn.disabled =
         running || !hasPending;
      pauseBtn.disabled =
         !running;
      pauseBtn.innerHTML =
         paused
            ?
            "▶ Resume"
            :
            "⏸ Pause";
   }
   [
      "taskAdded",
      "taskRemoved",
      "taskStarted",
      "taskCompleted",
      "taskFailed",
      "queueStarted",
      "queuePaused",
      "queueResumed",
      "queueDrained",
      "queueCleared"
   ]
      .forEach(event => {
         emitter.on(
            event,
            () => {
               updateButtonStates();
               ui.updateStats();
            }
         );
      });
   emitter.on(
      "queueDrained",
      () => {
         const report =
            dashboardSummary();
         ui.addLog(
            "success",
            `🎉 Queue Finished
Created :
${report.created}
Completed :
${report.completed}
Failed :
${report.failed}`
         );
         ui.showToast(
            "All Tasks Completed",
            "success"
         );
         console.table(report);
      }
   );
   document
      .querySelector(".queue-card")
      .addEventListener(
         "click",
         e => {
            const btn =
               e.target.closest(
                  "[data-remove]"
               );
            if (!btn) return;
            const id =
               Number(
                  btn.dataset.remove
               );
            if (
               Number.isFinite(id)
            ) {
               queue.remove(id);
               ui.showToast(
                  "Task Removed",
                  "warning"
               );
            }
         }
      );
   addTaskBtn.onclick = addTask;
   addFlakyBtn.onclick = addFlakyTask;
   startBtn.onclick = startQueue;
   pauseBtn.onclick = togglePause;
   clearLogsBtn.onclick = () => {
      ui.clearLogs();
   };
   demoBtn.onclick = runDemoMode;
   updateButtonStates();
   ui.updateStats();
   ui.addLog(
      "system",
      "Premium Async Queue Dashboard Ready"
   );
   ui.showToast(
      "Dashboard Ready",
      "success"
   );
   window.AsyncDashboard = {
      queue,
      ui,
      emitter,
      addTask,
      addFlakyTask,
      runDemoMode,
      dashboardSummary
   };
})();