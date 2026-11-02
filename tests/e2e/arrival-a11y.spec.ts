import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dark opening retains an accessible main heading before the visual statement', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await page.goto('/');
 const hero=page.locator('#arrival');
 await expect.poll(()=>hero.evaluate(el=>el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
 await expect(hero.locator('[data-arrival-statement]')).toHaveCSS('visibility','hidden');
 await expect(hero.getByRole('heading',{level:1})).toHaveText(/MAKE THEM\s*REMEMBER\./);
 const audit=await new AxeBuilder({page}).withRules(['page-has-heading-one','heading-order']).analyze();
 expect(audit.violations).toEqual([]);
});
