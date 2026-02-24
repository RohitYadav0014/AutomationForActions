# 🚀 Client Setup Guide

## Initial Setup

### 1. Configure Environment Variables

The framework requires environment configuration for email notifications and CRM access.

**Copy the template:**
```bash
copy .env.example .env
```

**Edit `.env` and update:**

#### Required Email Settings:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
PWG_EMAIL_FROM=your-email@gmail.com
PWG_EMAIL_ID=recipient@example.com
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Playwright Framework"
4. Copy the 16-character password
5. Paste it into `GMAIL_APP_PASSWORD` (remove spaces)

#### Optional CRM Settings:
```env
PWG_CRM_URL=https://your-crm.example.com/
# Add credentials if needed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Browser

```bash
npx playwright install chromium
```

## Running Tests

### Using Jenkins
1. Open Jenkins job: `demo-client-pipeline`
2. Click **"Build Now"**
3. View reports after completion

### Using Command Line
```bash
# Run all tests
node framework.obf.js run --config configs/clientEG.json

# Run in headed mode (see browser)
node framework.obf.js run --config configs/clientEG.json --headed

# Check version
node framework.obf.js version
```

## Reports

After test execution, find reports in:
- **Playwright Report:** `playwright-report/index.html`
- **Allure Report:** `allure-report/index.html`

## Email Notifications

Two emails are sent after test completion:

1. **Lead Statistics Email** 📊
   - Subject: "Daily Statistics - [Date]"
   - Contains: HTML table of leads + Excel attachment
   
2. **Test Execution Report** 📋
   - Subject: "[Project] Test Execution Completed. Pass-X Fail-Y"
   - Contains: Test summary + Playwright HTML report

## Troubleshooting

### Emails not sending?
- Verify `GMAIL_APP_PASSWORD` is correct (16 characters, no spaces)
- Check `PWG_EMAIL_ID` has valid email addresses
- Ensure Gmail "Less secure app access" is not blocking (use App Password instead)

### Tests failing?
- Verify `.env` file exists and has correct values
- Check `configs/clientEG.json` for client-specific settings
- Review Jenkins console output for error details

## Support

For issues or questions, contact your framework administrator.
