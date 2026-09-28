const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{const {freshFlags}=await import('../src/engine.mjs');const {roomIds,relics}=await import('../src/world.mjs');
const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/game/');
const move=async(key,ms)=>{await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);};
const close=()=>page.locator('#choices button').first().click();const interact=()=>page.keyboard.press('KeyE');
await page.click('#start');await close();
await move('KeyD',900);await move('KeyW',530);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'목록 카드를 맞추다');await close();
await move('KeyW',1200);await move('KeyD',1000);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'받침을 바로 놓다');await close();
await move('KeyD',1500);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'없는 직원');await close();
await move('KeyD',1200);await move('KeyS',1700);await interact();await page.waitForTimeout(150);assert.match(await page.locator('#room-name').textContent(),/지하/);
await move('KeyS',350);await move('KeyD',2400);await move('KeyW',650);await move('KeyD',1600);await move('KeyW',1400);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'꺼진 불');await close();
console.log('Actual keyboard: archive sorting, director and mirror passed');
await move('KeyS',2050);await move('KeyA',4500);await interact();await page.waitForTimeout(200);assert.match(await page.locator('#room-name').textContent(),/사무실/);
await move('KeyW',1750);await move('KeyD',3500);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'Rhast');await page.screenshot({path:'game/qa/rhast-desktop.png',fullPage:true});await close();
await move('KeyD',1700);await interact();await move('KeyW',1200);await move('KeyD',2400);await move('KeyS',1450);await move('KeyD',500);await interact();await page.waitForTimeout(200);assert.match(await page.locator('#dialog-title').textContent(),/꺼지지 않은/);await close();await page.screenshot({path:'game/qa/hub-played.png',fullPage:true});
console.log('Actual keyboard: Rhast and Jack escape to safe hub passed');
const seed=async(room,extra={})=>{await page.evaluate(save=>localStorage.setItem('backroomvania-v1',JSON.stringify(save)),{version:1,room,flags:{...freshFlags(),work:2,artifact1:true,artifact2:true,directorTalk:true,mirror:true,rhast:true,armed:true,relics:relics.map(r=>r.id),reveal:true,mind:true,...extra}});await page.reload();await page.click('#continue');if(await page.locator('#dialog').evaluate(d=>d.open))await close();await page.waitForTimeout(120);};
for(const room of roomIds){await seed(room);await page.screenshot({path:`game/qa/room-${room}.png`,fullPage:true});}
console.log('Captured all '+roomIds.length+' rooms using saved-checkpoint fixtures');
await seed('cathedral',{bossDown:true,watch:true});await move('KeyW',1450);await interact();assert.equal(await page.locator('#dialog-title').textContent(),'그의 이름은 셜록 홈즈였다');await page.screenshot({path:'game/qa/true-ending.png',fullPage:true});
for(const width of [768,375]){await page.setViewportSize({width,height:900});await page.screenshot({path:`game/qa/ending-${width}.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);}
fs.writeFileSync('game/qa/browser-report.json',JSON.stringify({errors,rooms:roomIds,opening:'real keyboard passed',ending:'checkpoint fixture plus keyboard passed',viewports:[1280,768,375]},null,2));assert.deepEqual(errors,[]);await browser.close();})();
