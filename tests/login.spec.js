"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("../pages/LoginPage");
const config_1 = require("../utils/config");
test_1.test.describe('Login & Authentication Tests', () => {
    const cfg = (0, config_1.config)();
    (0, test_1.test)('TC01: Login and authentication flow', async ({ page }) => {
        console.log('TC04: Starting login and authentication test');
        const loginPage = new LoginPage_1.LoginPage(page);
        await loginPage.navigate(cfg.crmUrl);
        await loginPage.verifyLoginPage();
        const selectedValue = await loginPage.getSelectedUsername();
        (0, test_1.expect)(selectedValue).toBe('admin');
        console.log('Login page validation completed');
        await loginPage.login();
        await loginPage.verifyLoginSuccess();
        console.log('TC04: Login and authentication test completed successfully');
    });
});
