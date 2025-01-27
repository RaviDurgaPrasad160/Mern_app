const schedule = require('node-schedule');
const AutomationTask = require('../models/AutomationTask');
const { executeTask } = require('../controllers/automationController');
const logger = require('../utils/logger');

class TaskScheduler {
    constructor() {
        this.jobs = new Map();
    }

    async initializeScheduler() {
        try {
            // Get all pending tasks
            const tasks = await AutomationTask.find({
                status: 'pending',
                schedule: { $gt: new Date() }
            });

            // Schedule each task
            tasks.forEach(task => this.scheduleTask(task));
            
            logger.info(`Initialized scheduler with ${tasks.length} tasks`);
        } catch (error) {
            logger.error('Failed to initialize scheduler:', error);
        }
    }

    scheduleTask(task) {
        try {
            // Cancel existing job if any
            if (this.jobs.has(task._id.toString())) {
                this.jobs.get(task._id.toString()).cancel();
            }

            // Schedule new job
            const job = schedule.scheduleJob(task.schedule, async () => {
                try {
                    await executeTask(task);
                    
                    // If task is recurring, schedule next execution
                    if (task.nextRun) {
                        task.schedule = task.nextRun;
                        await task.save();
                        this.scheduleTask(task);
                    }
                } catch (error) {
                    logger.error(`Failed to execute task ${task._id}:`, error);
                }
            });

            // Store job reference
            this.jobs.set(task._id.toString(), job);
            logger.info(`Scheduled task ${task._id} for ${task.schedule}`);
        } catch (error) {
            logger.error(`Failed to schedule task ${task._id}:`, error);
        }
    }

    cancelTask(taskId) {
        const job = this.jobs.get(taskId);
        if (job) {
            job.cancel();
            this.jobs.delete(taskId);
            logger.info(`Cancelled task ${taskId}`);
        }
    }

    async rescheduleTask(taskId, newSchedule) {
        try {
            const task = await AutomationTask.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            task.schedule = newSchedule;
            await task.save();
            this.scheduleTask(task);
            
            logger.info(`Rescheduled task ${taskId} to ${newSchedule}`);
        } catch (error) {
            logger.error(`Failed to reschedule task ${taskId}:`, error);
            throw error;
        }
    }
}

module.exports = new TaskScheduler();
