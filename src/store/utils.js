class Scheduler {
  constructor() {
    this.scheduledTasks = []; // Store active tasks
    this.remainingDelays = []; // Track remaining delays for each task
    this.isPaused = false;
    this.startPauseTime = null;
    this.currentTickOrders = []; // Store orders that are not yet executed within the current tick
  }

  // Schedule tasks
  scheduleRelativeTasks(duration, orders, callback, threshold = 0.875) {
    this.clearAllTasks(); // Clear any existing tasks before rescheduling

    this.currentTickOrders = orders; // Store orders for the current tick
    orders.forEach((order) => {
      const relativeTime = Math.min(parseFloat(order.relativeTime), threshold);
      const delay = duration * relativeTime * 1000; // Convert delay to milliseconds

      const timeoutId = setTimeout(() => {
        if (!this.isPaused) {
          callback(order);
        }
      }, delay);

      // Track the task
      this.scheduledTasks.push({ id: timeoutId, delay, start: Date.now(), order });
    });
  }

  // Pause all tasks
  pauseTasks() {
    if (this.isPaused) return;

    this.isPaused = true;
    this.startPauseTime = Date.now();

    // Clear all active tasks and calculate remaining delays
    this.remainingDelays = [];
    this.scheduledTasks.forEach((task) => {
      clearTimeout(task.id);
      const elapsed = Date.now() - task.start; // Time elapsed since the task was scheduled
      const remaining = task.delay - elapsed; // Remaining delay for the task
      if (remaining > 0) {
        this.remainingDelays.push({ order: task.order, remaining });
      }
    });
    console.debug('REMAINING DELAYS:', this.remainingDelays);
    this.scheduledTasks = []; // Clear active tasks
  }

  // Resume all tasks
  resumeTasks(callback) {
    if (!this.isPaused) return;

    this.isPaused = false;
    const pauseDuration = Date.now() - this.startPauseTime;
    console.debug('AFTER RESUMING::: REMAINING DELAYS:', this.remainingDelays);
    // Reschedule tasks with updated remaining delays
    this.remainingDelays.forEach((task) => {
      const updatedDelay = task.remaining - pauseDuration;
      if (updatedDelay > 0) {
        const timeoutId = setTimeout(() => {
          callback(task.order);
        }, updatedDelay);

        this.scheduledTasks.push({ id: timeoutId, delay: updatedDelay, start: Date.now(), order: task.order });
      }
    });

    // Clear remaining delays as tasks are rescheduled
    this.remainingDelays = [];
  }

  // Clear all active tasks
  clearAllTasks() {
    this.scheduledTasks.forEach((task) => clearTimeout(task.id));
    this.scheduledTasks = [];
    this.remainingDelays = [];
    this.currentTickOrders = []; // Clear orders for the current tick
  }
};

export default Scheduler;