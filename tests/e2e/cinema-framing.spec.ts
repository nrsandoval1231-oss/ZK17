import { expect,test } from '@playwright/test';

test('Act II always contains full monochrome film with accessible native controls',async({page})=>{
 await page.goto('/#film-room');
 const video=page.locator('#film-room video');
 await expect(video).toHaveAttribute('src','/media/zephyr-monochrome-full.mp4');
 await expect(video).toHaveJSProperty('controls',true);await expect(video).toHaveCSS('object-fit','contain');await expect(video).toHaveCSS('filter','grayscale(1)');
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(size);await page.locator('#film-room').evaluate(el=>el.scrollIntoView({behavior:'instant'}));
  await expect.poll(async()=>{
   const box=await video.boundingBox();
   return Boolean(box&&box.width<=size.width&&box.height<=Math.max(size.height,500));
  }).toBe(true);
  const box=(await video.boundingBox())!;expect(box.width).toBeLessThanOrEqual(size.width);expect(box.height).toBeLessThanOrEqual(Math.max(size.height,500));
  await expect(video).toHaveCSS('transform','none');
 }
 await expect(page.getByText(/WATCH WITH SOUND/i)).toHaveCount(0);
 await expect(page.locator('#film-room img')).toHaveCSS('filter','none');
 await expect(page.locator('#film-room img')).toHaveAttribute('src','/brand/zk17-monogram-512-v2.png');
});

test('Film route offers complete duration without autoplay or a scroll recut',async({page})=>{
 await page.goto('/film/');const video=page.locator('main video');await expect(video).toHaveJSProperty('controls',true);
 await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.duration)).toBeCloseTo(34.2,1);
 await expect(video).toHaveJSProperty('autoplay',false);await expect(video).toHaveCSS('filter','grayscale(1)');
 await video.evaluate((el:HTMLVideoElement)=>{el.currentTime=30;});await page.evaluate(()=>scrollTo(0,100));
 expect(await video.evaluate((el:HTMLVideoElement)=>el.currentTime)).toBeGreaterThan(29);
});
