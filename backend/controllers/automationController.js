const AutomationTask = require('../models/AutomationTask');
const SocialAccount = require('../models/SocialAccount');
const AppiumService = require('../services/AppiumService');
const logger = require('../utils/logger');

// Create a new automation task
exports.createTask = async (req, res) => {
    try {
        const { socialAccountId, taskType, schedule, content } = req.body;

        // Validate social account
        const socialAccount = await SocialAccount.findById(socialAccountId);
        if (!socialAccount) {
            return res.status(404).json({ message: 'Social account not found' });
        }

        // Create task
        const task = await AutomationTask.create({
            user: req.user._id,
            socialAccount: socialAccountId,
            taskType,
            schedule,
            content,
            status: 'pending'
        });

        res.status(201).json(task);
    } catch (error) {
        logger.error('Create task error:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Execute a specific task
exports.executeTask = async (task) => {
    try {
        const socialAccount = await SocialAccount.findById(task.socialAccount);
        if (!socialAccount) {
            throw new Error('Social account not found');
        }

        // Initialize Appium
        const initialized = await AppiumService.initializeDriver(socialAccount.platform);
        if (!initialized) {
            throw new Error('Failed to initialize Appium');
        }

        // Login
        const loggedIn = await AppiumService[`${socialAccount.platform}Login`](socialAccount.credentials);
        if (!loggedIn) {
            throw new Error('Login failed');
        }

        // Execute task based on type
        let success = false;
        switch (task.taskType) {
            case 'post':
                success = await AppiumService[`${socialAccount.platform}Post`](task.content);
                break;
            case 'comment':
                success = await AppiumService[`${socialAccount.platform}Comment`](
                    task.content.targetPosts[0],
                    task.content.text
                );
                break;
            // Add other task types here
        }

        // Update task status
        task.status = success ? 'completed' : 'failed';
        task.lastRun = new Date();
        task.executionLogs.push({
            timestamp: new Date(),
            action: task.taskType,
            status: task.status,
            message: success ? 'Task completed successfully' : 'Task execution failed'
        });

        await task.save();
        await AppiumService.closeDriver();

        return success;
    } catch (error) {
        logger.error('Task execution error:', error);
        task.status = 'failed';
        task.executionLogs.push({
            timestamp: new Date(),
            action: task.taskType,
            status: 'failed',
            message: error.message
        });
        await task.save();
        await AppiumService.closeDriver();
        return false;
    }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await AutomationTask.find({ user: req.user._id })
            .populate('socialAccount', 'platform username')
            .sort('-createdAt');
        res.json(tasks);
    } catch (error) {
        logger.error('Get tasks error:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const task = await AutomationTask.findOneAndUpdate(
            { _id: taskId, user: req.user._id },
            updates,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        logger.error('Update task error:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await AutomationTask.findOneAndDelete({ _id: taskId, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error('Delete task error:', error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};
