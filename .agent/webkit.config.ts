import { defineConfig, devices } from '@playwright/test';
import base from '../playwright.config';
export default defineConfig({
  ...base,
  testDir: '../tests/e2e',
  projects: [{ name: 'mobile-webkit', use: { ...devices['iPhone 13'], browserName: 'webkit', trace: 'retain-on-failure' } }],
});
