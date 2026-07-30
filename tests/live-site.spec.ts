import { test, expect } from '@playwright/test';

const BASE = 'https://backlink-automation.netlify.app';

test.describe('Login Page', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Xylos Backlinks/i);
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('wrong credentials dont login', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('wrong');
    await page.locator('input[type="password"]').first().fill('wrong');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/dashboard');
  });

  test('correct credentials login', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
  });

  test('dashboard heading visible', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
  });

  test('all nav links exist', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.locator('a[href="/dashboard/posts"]')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/schedule"]')).toBeVisible();
    await expect(page.locator('a[href="/dashboard/settings"]')).toBeVisible();
  });

  test('logout button exists', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page.locator('button[title="Log out"]')).toBeVisible();
  });
});

test.describe('Posts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await page.goto(`${BASE}/dashboard/posts`);
    await page.waitForTimeout(1500);
  });

  test('posts page heading', async ({ page }) => {
    await expect(page.locator('h2:has-text("Posts")')).toBeVisible();
  });

  test('New Post button exists', async ({ page }) => {
    const btn = page.locator('button:has-text("New Post")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('search input exists', async ({ page }) => {
    await expect(page.locator('input[placeholder="Search posts..."]')).toBeVisible();
  });

  test('filter dropdown exists', async ({ page }) => {
    await expect(page.locator('button:has-text("All Status")')).toBeVisible();
  });

  test('posts table or empty state exists', async ({ page }) => {
    const table = page.locator('table');
    const empty = page.locator('text=/no posts|No posts/i');
    expect((await table.count()) > 0 || (await empty.count()) > 0).toBeTruthy();
  });

  test('New Post dialog opens with all fields', async ({ page }) => {
    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=New Post').first()).toBeVisible();
    await expect(page.locator('input[placeholder="Blog post title"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="yourblog"]')).toBeVisible();
    await expect(page.locator('text=devto').first()).toBeVisible();
    await expect(page.locator('text=blogger').first()).toBeVisible();
    await expect(page.locator('text=tumblr').first()).toBeVisible();
  });

  test('schedule picker exists in dialog', async ({ page }) => {
    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=Schedule (optional)')).toBeVisible();
    await expect(page.locator('button:has-text("Select date")')).toBeVisible();
  });

  test('calendar opens on schedule click', async ({ page }) => {
    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Select date")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Jul 2026')).toBeVisible();
  });

  test('Cancel closes dialog', async ({ page }) => {
    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Cancel")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('input[placeholder="Blog post title"]')).not.toBeVisible();
  });

  test('Post Now button shows in dialog', async ({ page }) => {
    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);
    await expect(page.locator('button:has-text("Post Now")')).toBeVisible();
  });
});

test.describe('Schedule Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await page.goto(`${BASE}/dashboard/schedule`);
    await page.waitForTimeout(1500);
  });

  test('schedule page heading', async ({ page }) => {
    await expect(page.locator('h2:has-text("Schedule")')).toBeVisible();
  });

  test('scheduled posts or empty state', async ({ page }) => {
    const table = page.locator('table');
    const empty = page.locator('text=/no scheduled/i');
    expect((await table.count()) > 0 || (await empty.count()) > 0).toBeTruthy();
  });
});

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await page.goto(`${BASE}/dashboard/settings`);
    await page.waitForTimeout(1500);
  });

  test('settings heading', async ({ page }) => {
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible();
  });

  test('Dev.to section exists', async ({ page }) => {
    await page.locator('text=Dev.to API').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Dev.to API')).toBeVisible();
  });

  test('Blogger section exists', async ({ page }) => {
    await page.locator('text=Blogger API').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Blogger API')).toBeVisible();
  });

  test('Tumblr section exists', async ({ page }) => {
    await page.locator('text=Tumblr API').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Tumblr API')).toBeVisible();
  });

  test('Save Settings button', async ({ page }) => {
    await page.locator('button:has-text("Save Settings")').scrollIntoViewIfNeeded();
    await expect(page.locator('button:has-text("Save Settings")')).toBeVisible();
  });

  test('Blog URL field', async ({ page }) => {
    await page.locator('text=Blog Configuration').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Blog Configuration')).toBeVisible();
    await expect(page.locator('input[placeholder*="yourblog"]')).toBeVisible();
  });
});

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
  });

  test('navigate Posts -> Schedule -> Settings -> Dashboard', async ({ page }) => {
    await page.locator('a[href="/dashboard/posts"]').click();
    await page.waitForURL('**/posts**', { timeout: 5000 });
    expect(page.url()).toContain('/posts');

    await page.locator('a[href="/dashboard/schedule"]').click();
    await page.waitForURL('**/schedule**', { timeout: 5000 });
    expect(page.url()).toContain('/schedule');

    await page.locator('a[href="/dashboard/settings"]').click();
    await page.waitForURL('**/settings**', { timeout: 5000 });
    expect(page.url()).toContain('/settings');

    await page.locator('a[href="/dashboard"]').first().click();
    await page.waitForURL('**/dashboard**', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });
});

test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('login page mobile', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('dashboard mobile', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
  });
});

test.describe('Post Create + Auto Post', () => {
  test('create post triggers auto posting', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('input[type="text"]').first().fill('sunny');
    await page.locator('input[type="password"]').first().fill('3424');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard**', { timeout: 10000 });

    await page.goto(`${BASE}/dashboard/posts`);
    await page.waitForTimeout(1500);

    await page.locator('button:has-text("New Post")').click();
    await page.waitForTimeout(500);

    await page.locator('input[placeholder="Blog post title"]').fill('Playwright Auto Test Post');
    await page.locator('input[placeholder*="yourblog"]').fill('https://xylosai.vercel.app');

    const devtoBtn = page.locator('button:has-text("devto")').first();
    await devtoBtn.click();

    await page.locator('button:has-text("Post Now")').click();
    await page.waitForTimeout(3000);

    await expect(page.locator('input[placeholder="Blog post title"]')).not.toBeVisible();
  });
});
