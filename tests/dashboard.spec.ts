import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should display dashboard with stats", async ({ page }) => {
    await expect(page.locator("h2:has-text('Dashboard')")).toBeVisible();
    await expect(page.locator("text=Total Posts")).toBeVisible();
    await expect(page.locator("text=Published")).toBeVisible();
    await expect(page.locator("text=Automated")).toBeVisible();
    await expect(page.locator("text=URLs Used")).toBeVisible();
  });

  test("should display automation status card", async ({ page }) => {
    await expect(page.locator("text=Automation Status")).toBeVisible();
    await expect(page.locator("text=Sitemap Rotation")).toBeVisible();
  });

  test("should display recent posts", async ({ page }) => {
    await expect(page.locator("text=Recent Posts")).toBeVisible();
  });
});

test.describe("Posts Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should navigate to posts page", async ({ page }) => {
    await page.click('a[href="/dashboard/posts"]');
    await expect(page.locator("text=Posts")).toBeVisible();
    await expect(page.locator('input[placeholder="Search posts..."]')).toBeVisible();
  });

  test("should filter posts by status", async ({ page }) => {
    await page.goto("/dashboard/posts");
    await page.selectOption('select:near(:text("All Status"))', "published");
    await expect(page.locator('select:near(:text("All Status"))')).toHaveValue("published");
  });

  test("should filter posts by source", async ({ page }) => {
    await page.goto("/dashboard/posts");
    await page.selectOption('select:near(:text("All Sources"))', "automated");
    await expect(page.locator('select:near(:text("All Sources"))')).toHaveValue("automated");
  });
});

test.describe("Schedule Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should navigate to schedule page", async ({ page }) => {
    await page.click('a[href="/dashboard/schedule"]');
    await expect(page.locator("text=Schedule")).toBeVisible();
    await expect(page.locator("text=Schedule Post")).toBeVisible();
  });

  test("should open create post dialog", async ({ page }) => {
    await page.goto("/dashboard/schedule");
    await page.click("text=Schedule Post");
    await expect(page.locator("text=Schedule New Post")).toBeVisible();
    await expect(page.locator('input[placeholder="Enter post title"]')).toBeVisible();
    await expect(page.locator('input[placeholder="https://yourblog.com/post-url"]')).toBeVisible();
  });
});

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.click('a[href="/dashboard/settings"]');
    await expect(page.locator("text=Settings")).toBeVisible();
    await expect(page.locator("text=Blog Configuration")).toBeVisible();
    await expect(page.locator("text=Dev.to API")).toBeVisible();
    await expect(page.locator("text=Blogger API")).toBeVisible();
    await expect(page.locator("text=Tumblr API")).toBeVisible();
  });

  test("should display automation settings", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.locator("text=Automation Settings")).toBeVisible();
    await expect(page.locator("text=Automation Status")).toBeVisible();
    await expect(page.locator("text=Sitemap Sources")).toBeVisible();
  });

  test("should toggle automation enabled", async ({ page }) => {
    await page.goto("/dashboard/settings");
    const toggle = page.locator('input[type="checkbox"]:near(:text("Automation Status"))');
    const isChecked = await toggle.isChecked();
    await toggle.click();
    await expect(toggle).toBeChecked({ checked: !isChecked });
  });
});

test.describe("Responsive Design", () => {
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
    
    // Check mobile menu button exists
    await expect(page.locator('button[aria-label="Open navigation menu"]')).toBeVisible();
  });

  test("should work on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
    
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("should work on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/login");
    await page.fill('input[type="text"]', "sunny");
    await page.fill('input[type="password"]', "3424");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
    
    await expect(page.locator("text=Dashboard")).toBeVisible();
    await expect(page.locator("aside")).toBeVisible(); // Sidebar should be visible on desktop
  });
});

test.describe("API Endpoints", () => {
  test("should return posts from API", async ({ request }) => {
    const response = await request.get("/api/posts");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test("should return automation config", async ({ request }) => {
    const response = await request.get("/api/automation/config");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty("is_enabled");
    expect(data).toHaveProperty("interval_hours");
    expect(data).toHaveProperty("sitemap_urls");
  });
});