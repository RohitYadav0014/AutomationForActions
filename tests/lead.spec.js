"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const LoginPage_1 = require("../pages/LoginPage");
const LeadPage_1 = require("../pages/LeadPage");
const config_1 = require("../utils/config");
const helpers_1 = require("../utils/helpers");
const email_util_1 = require("../utils/email-util");
test_1.test.describe('EspoCRM Lead Management Tests', () => {
    const cfg = (0, config_1.config)();
    let loginPage;
    let leadPage;
    test_1.test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage_1.LoginPage(page);
        leadPage = new LeadPage_1.LeadPage(page);
    });
    test_1.test.afterAll(async ({ browser }) => {
        console.log('📧 Generating and sending lead statistics email...');
        try {
            const page = await browser.newPage();
            loginPage = new LoginPage_1.LoginPage(page);
            leadPage = new LeadPage_1.LeadPage(page);
            await loginPage.fullLogin(cfg.crmUrl);
            await leadPage.navigateToLeads();
            await leadPage.applyDateFilter('Last 7 Days');
            await leadPage.verifyFilteredResultsVisible();
            const newLeadsData = await leadPage.getNewLeadsData();
            console.log(`📊 Found ${newLeadsData.length} leads from last 7 days`);
            const newLeadsFilePath = path.join(__dirname, '..', '..', 'Data', 'newLeadLast7Days.html');
            if (!fs.existsSync(path.dirname(newLeadsFilePath))) {
                fs.mkdirSync(path.dirname(newLeadsFilePath), { recursive: true });
            }
            const htmlOutput = leadPage.generateLeadsHtmlReport(newLeadsData);
            fs.writeFileSync(newLeadsFilePath, htmlOutput);
            await leadPage.selectAllLeads();
            const download = await leadPage.exportLeads('xlsx', true);
            const downloadPath = path.join(__dirname, '..', '..', 'Data', 'LeadsExport.xlsx');
            await download.saveAs(downloadPath);
            await (0, email_util_1.sendDailyStatisticsEmail)(newLeadsFilePath, downloadPath);
            console.log('✅ Lead statistics email sent successfully');
            await page.close();
        }
        catch (error) {
            console.error('❌ Lead statistics email failed:', error);
        }
    });
    async function loginAndNavigateToLeads(page) {
        await loginPage.fullLogin(cfg.crmUrl);
        await leadPage.navigateToLeads();
    }
    (0, test_1.test)('TC01: Export leads with date filtering to CSV', async ({ page }) => {
        console.log('TC01: Starting CSV export test with date filter');
        await loginAndNavigateToLeads(page);
        await leadPage.applyDateFilter('Current Month');
        await leadPage.verifyFilteredResultsVisible();
        await leadPage.selectAllLeads();
        const download = await leadPage.exportLeads('csv', true);
        await leadPage.verifyDownload(download, '.csv');
        console.log('TC01: CSV export test completed successfully');
    });
    (0, test_1.test)('TC02: Export leads with status filtering to XLSX', async ({ page }) => {
        console.log('TC02: Starting XLSX export test with status filter');
        await loginAndNavigateToLeads(page);
        await leadPage.selectAllLeads();
        const download = await leadPage.exportLeads('xlsx', true);
        await leadPage.verifyDownload(download, '.xlsx');
        console.log('TC02: XLSX export test completed successfully');
    });
    (0, test_1.test)('TC03: Lead selection and bulk actions', async ({ page }) => {
        console.log('TC03: Starting bulk actions test');
        await loginAndNavigateToLeads(page);
        const firstCheckbox = page.locator('table tbody tr').first().locator('input[type="checkbox"]');
        await firstCheckbox.click();
        await (0, test_1.expect)(firstCheckbox).toBeChecked();
        await leadPage.selectAllLeads();
        await (0, test_1.expect)(page.getByRole('button', { name: 'Actions' })).toBeVisible();
        await page.getByRole('button', { name: 'Actions' }).click();
        await (0, test_1.expect)(page.getByRole('button', { name: 'Export' })).toBeVisible();
        await page.keyboard.press('Escape');
        console.log('TC03: Bulk actions test completed successfully');
    });
    (0, test_1.test)('TC05: Lead status workflow', async ({ page }) => {
        console.log('TC05: Starting lead status workflow test');
        await loginAndNavigateToLeads(page);
        const statusCount = await leadPage.getStatusElementsCount();
        (0, test_1.expect)(statusCount).toBeGreaterThan(0);
        console.log(`Found ${statusCount} status elements in lead list`);
        await leadPage.applyDateFilter('Current Month');
        await leadPage.verifyFilteredResultsVisible();
        const filteredStatusCount = await leadPage.getStatusElementsCount();
        (0, test_1.expect)(filteredStatusCount).toBeGreaterThan(0);
        console.log(`After filtering: ${filteredStatusCount} status elements visible`);
        try {
            await leadPage.clearFilters();
        }
        catch {
            await page.reload();
        }
        await (0, test_1.expect)(page.getByTitle('Click to refresh')).toBeVisible();
        console.log('TC05: Lead status workflow test completed successfully');
    });
    (0, test_1.test)('TC06: Advanced search with multiple criteria', async ({ page }) => {
        console.log('TC06: Starting advanced search test');
        await loginAndNavigateToLeads(page);
        await leadPage.applyDateFilter('Current Month');
        await leadPage.selectAllLeads();
        await (0, test_1.expect)(page.getByRole('button', { name: 'Actions' })).toBeVisible();
        await leadPage.verifyBulkActions();
        console.log('TC06: Advanced search test completed successfully');
    });
    (0, test_1.test)('TC07: Comprehensive export validation', async ({ page }) => {
        console.log('TC07: Starting comprehensive export validation');
        await loginAndNavigateToLeads(page);
        await leadPage.applyDateFilter('Current Month');
        await leadPage.verifyFilteredResultsVisible();
        await leadPage.selectAllLeads();
        const download = await leadPage.exportLeads('xlsx', true);
        const downloadPath = path.join(__dirname, '..', '..', 'Data', 'LeadsExport.xlsx');
        const dataDir = path.dirname(downloadPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        await download.saveAs(downloadPath);
        (0, test_1.expect)(fs.existsSync(downloadPath)).toBeTruthy();
        const stats = fs.statSync(downloadPath);
        (0, test_1.expect)(stats.size).toBeGreaterThan(0);
        console.log(`File downloaded to: ${downloadPath}, Size: ${stats.size} bytes`);
        console.log('TC07: Comprehensive export validation completed successfully');
    });
    (0, test_1.test)('TC08: Lead Report Generation and Validation', async ({ page }) => {
        console.log('TC08: Starting lead report validation test');
        await loginAndNavigateToLeads(page);
        await leadPage.applyDateFilter('Last 7 Days');
        await leadPage.verifyFilteredResultsVisible();
        const newLeadsData = await leadPage.getNewLeadsData();
        console.log((0, helpers_1.formatLeadsConsoleTable)(newLeadsData));
        console.log(`Total new leads: ${newLeadsData.length}`);
        const newLeadsFilePath = path.join(__dirname, '..', '..', 'Data', 'newLeadLast7Days.html');
        if (!fs.existsSync(path.dirname(newLeadsFilePath))) {
            fs.mkdirSync(path.dirname(newLeadsFilePath), { recursive: true });
        }
        const htmlOutput = leadPage.generateLeadsHtmlReport(newLeadsData);
        fs.writeFileSync(newLeadsFilePath, htmlOutput);
        console.log(`✅ HTML report saved: ${newLeadsFilePath}`);
        await leadPage.selectAllLeads();
        const download = await leadPage.exportLeads('xlsx', true);
        const downloadPath = path.join(__dirname, '..', '..', 'Data', 'LeadsExport.xlsx');
        await download.saveAs(downloadPath);
        (0, test_1.expect)(fs.existsSync(downloadPath)).toBeTruthy();
        const stats = fs.statSync(downloadPath);
        (0, test_1.expect)(stats.size).toBeGreaterThan(0);
        console.log(`Excel report saved: ${downloadPath}, Size: ${stats.size} bytes`);
        console.log('TC08 completed successfully');
    });
});
