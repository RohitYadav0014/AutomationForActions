# Enterprise Playwright Framework v1.0.0

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```

2. Place your `license.json` in the project root

3. Configure your settings:
   - Copy `configs/sample-config.json` to `configs/my-config.json`
   - Update with your environment details

4. Run tests:
   ```bash
   npm test
   # or
   node cli.js run --config configs/my-config.json
   ```

## CLI Commands

| Command | Description |
|---------|-------------|
| `node cli.js run` | Run all tests |
| `node cli.js run --config <path>` | Run with client config |
| `node cli.js run --headed` | Run in headed mode |
| `node cli.js run --test <file>` | Run specific test file |
| `node cli.js run --grep "pattern"` | Filter tests by name |
| `node cli.js report` | Generate Allure report |
| `node cli.js license --validate` | Validate license |
| `node cli.js version` | Show version |

## Environment Variables

Create a `.env` file in the project root:

```
PWG_ENV_PROJECT=YourProject
PWG_ENV_SUITE_NAME=Your Test Suite
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
PWG_EMAIL_FROM=your-email@gmail.com
PWG_EMAIL_ID=recipient@email.com
PWG_EMAIL_CC=cc@email.com
```

## Reports

- **Playwright Report**: `playwright-report/index.html`
- **Allure Report**: Run `node cli.js report` then open `allure-report/index.html`

## Support

Contact your framework provider for license renewal or technical support.
