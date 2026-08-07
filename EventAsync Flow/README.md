# ⚡ Async Queue Dashboard

A browser-based asynchronous task management and monitoring dashboard built with **HTML5, CSS3, and Vanilla JavaScript**.

The application demonstrates an event-driven asynchronous queue architecture with retry handling, exponential backoff, rate limiting, task filtering, live metrics, keyboard shortcuts, and activity logging.

---

## 📌 Executive Summary

Modern web applications frequently process asynchronous operations such as API requests, background synchronization, file processing, and batch operations.

**Async Queue Dashboard** provides a visual environment for creating, managing, and monitoring asynchronous tasks through a custom `AsyncQueue` and `EventEmitter` architecture.

The dashboard allows users to add tasks, start and pause queue execution, monitor task states, retry failed operations, and observe queue activity in real time.

The entire application runs on the client side without requiring a backend server.

---

## 🎯 Key Features & Capabilities

### ⚙️ Asynchronous Queue Management

The custom `AsyncQueue` class manages the complete task execution lifecycle.

- Add asynchronous tasks dynamically.
- Sequential task processing.
- Configurable maximum queue capacity.
- Pause queue processing.
- Resume queue processing.
- Remove queued tasks.
- Track task lifecycle states.
- Detect when the queue is completely processed.

### Task States
Pending
   ↓
Running
   ↓
Retrying
   ↓
Completed / Failed

🔄 Exponential Backoff Retry

Failed asynchronous tasks can automatically retry up to a configured maximum number of attempts.

The retry mechanism increases the waiting period after every failure.

Task Fails
    ↓
Check Retry Count
    ↓
Retry Available?
   /       \
 Yes        No
  ↓          ↓
Backoff     Failed
  ↓
Wait
  ↓
Retry Task
Retry Flow
Attempt 1
   ↓
Failure
   ↓
Wait
   ↓
Attempt 2
   ↓
Failure
   ↓
Longer Wait
   ↓
Attempt 3
   ↓
Success / Final Failure

This approach helps prevent repeated immediate requests when an asynchronous operation temporarily fails.

⏱️ Rate Limiting

The queue controls the execution speed of tasks by introducing a configurable delay between task executions.

Task 1
   ↓
Execute
   ↓
Cooldown
   ↓
Task 2
   ↓
Execute
   ↓
Cooldown
   ↓
Task 3

Rate limiting provides controlled and predictable asynchronous task processing.

📡 Event-Driven Architecture

The application uses a custom EventEmitter to communicate between the queue engine and the user interface.

Instead of tightly coupling the queue logic with the UI, the queue emits events whenever its state changes.

Supported Events
taskAdded
taskStarted
taskRetry
taskCompleted
taskFailed
taskRemoved
queueStarted
queuePaused
queueResumed
queueDrained
Event Flow
AsyncQueue
    │
    ├── taskAdded
    ├── taskStarted
    ├── taskRetry
    ├── taskCompleted
    ├── taskFailed
    └── queueDrained
          │
          ▼
      EventEmitter
          │
          ▼
       UIManager
          │
          ▼
    Dashboard Update
🧠 Queue Architecture

The complete queue processing architecture works as follows:

┌────────────────────────────────────────────┐
│          User Action / Keyboard            │
│     Add Task / Start / Pause / Demo        │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ AsyncQueue.add() │
              └────────┬─────────┘
                       │
                       ▼
               taskAdded Event
                       │
                       ▼
              ┌──────────────────┐
              │ AsyncQueue.start │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Execute Task   │
              └────────┬─────────┘
                       │
                ┌──────┴──────┐
                ▼             ▼
             Success       Failure
                │             │
                ▼             ▼
        taskCompleted     Retry Check
                │             │
                ▼        ┌────┴────┐
             History      ▼         ▼
                       Retry     Max Retries
                         │           │
                         ▼           ▼
                   Backoff Delay  taskFailed
                         │           │
                         ▼           ▼
                   Execute Again  History
🔄 Task Lifecycle

Each task moves through multiple states during its execution.

                  ┌───────────┐
                  │  Pending  │
                  └─────┬─────┘
                        │
                        ▼
                  ┌───────────┐
                  │  Running  │
                  └─────┬─────┘
                        │
                ┌───────┴────────┐
                │                │
                ▼                ▼
           ┌─────────┐      ┌──────────┐
           │ Success │      │ Failure  │
           └────┬────┘      └────┬─────┘
                │                │
                ▼                ▼
          ┌───────────┐    ┌──────────┐
          │ Completed │    │ Retrying │
          └───────────┘    └────┬─────┘
                                │
                                ▼
                         Backoff Delay
                                │
                                ▼
                            Running
                                │
                                ▼
                      Retry Limit Reached
                                │
                                ▼
                           ┌────────┐
                           │ Failed │
                           └────────┘
🔁 Retry & Backoff Flow

The retry system checks the current retry count after every failed task.

              Task Execution
                    │
                    ▼
                 Failure
                    │
                    ▼
           Check Retry Count
                    │
             ┌──────┴──────┐
             │             │
          Available     Exhausted
             │             │
             ▼             ▼
       Calculate Delay   Mark Failed
             │
             ▼
       Exponential Backoff
             │
             ▼
          Wait Delay
             │
             ▼
        Retry Execution
⏳ Rate-Limited Queue Flow
┌──────────┐
│  Task 1  │
└────┬─────┘
     │
     ▼
┌────────────┐
│  Execute   │
└────┬───────┘
     │
     ▼
┌────────────┐
│  Cooldown  │
└────┬───────┘
     │
     ▼
┌──────────┐
│  Task 2  │
└────┬─────┘
     │
     ▼
┌────────────┐
│  Execute   │
└────┬───────┘
     │
     ▼
┌────────────┐
│  Cooldown  │
└────┬───────┘
     │
     ▼
┌──────────┐
│  Task 3  │
└──────────┘