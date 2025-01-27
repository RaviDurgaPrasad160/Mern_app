const wd = require('wd');
const logger = require('../utils/logger');

class AppiumService {
    constructor() {
        this.driver = null;
        this.WAIT_TIMEOUT = 10000; // 10 seconds timeout
    }

    async initializeDriver(platform) {
        const capabilities = this.getCapabilities(platform);
        
        try {
            this.driver = await wd.promiseChainRemote('localhost', 4723);
            await this.driver.init(capabilities);
            logger.info('Appium driver initialized successfully');
            return true;
        } catch (error) {
            logger.error('Failed to initialize Appium driver:', error);
            return false;
        }
    }

    getCapabilities(platform) {
        const baseCapabilities = {
            platformName: 'Android',
            automationName: 'UiAutomator2',
            deviceName: process.env.DEVICE_NAME || 'Android Device',
            noReset: true,
            newCommandTimeout: 3600
        };

        if (platform === 'reddit') {
            return {
                ...baseCapabilities,
                appPackage: 'com.reddit.frontpage',
                appActivity: 'com.reddit.launch.MainActivity'
            };
        } else if (platform === 'twitter') {
            return {
                ...baseCapabilities,
                appPackage: 'com.twitter.android',
                appActivity: 'com.twitter.android.StartActivity'
            };
        }
    }

    async waitForElement(selector, timeout = this.WAIT_TIMEOUT) {
        try {
            await this.driver.waitForElementById(selector, timeout);
            return true;
        } catch (error) {
            logger.error(`Element not found: ${selector}`);
            return false;
        }
    }

    async clickElement(selector) {
        try {
            await this.waitForElement(selector);
            const element = await this.driver.elementById(selector);
            await element.click();
            return true;
        } catch (error) {
            logger.error(`Failed to click element: ${selector}`, error);
            return false;
        }
    }

    async typeText(selector, text) {
        try {
            await this.waitForElement(selector);
            const element = await this.driver.elementById(selector);
            await element.clear();
            await element.sendKeys(text);
            return true;
        } catch (error) {
            logger.error(`Failed to type text in element: ${selector}`, error);
            return false;
        }
    }

    // Reddit-specific implementations
    async redditLogin({ username, password }) {
        try {
            await this.clickElement('login_button');
            await this.typeText('username', username);
            await this.typeText('password', password);
            await this.clickElement('login');
            
            // Wait for home feed to verify login
            const loginSuccess = await this.waitForElement('home_feed');
            return loginSuccess;
        } catch (error) {
            logger.error('Reddit login failed:', error);
            return false;
        }
    }

    async redditPost({ subreddit, title, text, media }) {
        try {
            // Navigate to subreddit
            await this.clickElement('subreddit_search');
            await this.typeText('search_bar', subreddit);
            await this.clickElement('search_result');

            // Create post
            await this.clickElement('create_post_button');
            await this.typeText('post_title', title);
            await this.typeText('post_text', text);

            if (media && media.length > 0) {
                for (const mediaPath of media) {
                    await this.clickElement('add_media_button');
                    await this.typeText('media_path', mediaPath);
                }
            }

            await this.clickElement('post_submit');
            return true;
        } catch (error) {
            logger.error('Reddit post failed:', error);
            return false;
        }
    }

    async redditComment(postId, content) {
        try {
            // Navigate to post
            await this.clickElement('post_' + postId);
            await this.clickElement('comment_button');
            await this.typeText('comment_text', content);
            await this.clickElement('comment_submit');
            return true;
        } catch (error) {
            logger.error('Reddit comment failed:', error);
            return false;
        }
    }

    // Twitter-specific implementations
    async twitterLogin({ username, password }) {
        try {
            await this.clickElement('login_button');
            await this.typeText('username_or_email', username);
            await this.clickElement('next_button');
            await this.typeText('password', password);
            await this.clickElement('login_submit');
            
            // Wait for home timeline to verify login
            const loginSuccess = await this.waitForElement('home_timeline');
            return loginSuccess;
        } catch (error) {
            logger.error('Twitter login failed:', error);
            return false;
        }
    }

    async twitterPost({ text, media, hashtags }) {
        try {
            await this.clickElement('compose_tweet');
            
            const fullText = `${text} ${hashtags.map(tag => `#${tag}`).join(' ')}`;
            await this.typeText('tweet_text', fullText);

            if (media && media.length > 0) {
                for (const mediaPath of media) {
                    await this.clickElement('add_media');
                    await this.typeText('media_path', mediaPath);
                }
            }

            await this.clickElement('tweet_submit');
            return true;
        } catch (error) {
            logger.error('Twitter post failed:', error);
            return false;
        }
    }

    async twitterComment(tweetId, content) {
        try {
            await this.clickElement('tweet_' + tweetId);
            await this.clickElement('reply_button');
            await this.typeText('reply_text', content);
            await this.clickElement('reply_submit');
            return true;
        } catch (error) {
            logger.error('Twitter comment failed:', error);
            return false;
        }
    }

    async closeDriver() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }
}

module.exports = new AppiumService();
