import { test, expect } from '@playwright/test';
test('desktop navigation, complete baseline day and reload persistence',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'Sesine bir alan aç.'})).toBeVisible();
 await page.getByRole('button',{name:'Çalışmaya başla',exact:true}).click();await page.getByLabel('Adın (isteğe bağlı)').fill('Deniz');await page.getByRole('button',{name:'Başlangıç ölçümüne geç'}).click();await page.getByRole('button',{name:'Rahat hissediyorum'}).click();
 await page.getByLabel('Referans seslerini dinledim ve araçları kontrol ettim').selectOption('yes');await page.getByRole('button',{name:'Tamamladım'}).click();
 await page.getByLabel('Konuşmada en sık kaldığın nota').selectOption('48');await page.getByRole('button',{name:'Tamamladım'}).click();
 await page.getByLabel('En pes rahat nota').selectOption('45');await page.getByLabel('Rahat üst / falsetto nota').selectOption('57');await page.getByRole('button',{name:'Tamamladım'}).click();
 await page.getByLabel('Boğaz hissi').fill('1');await page.getByRole('button',{name:'Seansı kaydet',exact:true}).click();await expect(page.getByRole('heading',{name:'Merhaba, Deniz.'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Gün 2 · Başlangıç ölçümü'})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Gün 2 · Başlangıç ölçümü'})).toBeVisible();
 await page.locator('.sidebar').getByRole('button',{name:'Programım',exact:true}).click();await page.getByRole('button',{name:'H12',exact:true}).click();await expect(page.getByText('Tam şarkıyı kaydet',{exact:true})).toBeVisible();
 await page.locator('.sidebar').getByRole('button',{name:'Gelişimim',exact:true}).click();await expect(page.getByRole('heading',{name:'Hafta 0 raporu'})).toBeVisible();
 expect(errors).toEqual([]);await page.screenshot({path:'tmp/desktop.png',fullPage:true});
});
test('mobile, empty states, backup and offline shell',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('heading',{name:'Sesine bir alan aç.'})).toBeVisible();
 await expect(page.locator('body')).toHaveJSProperty('scrollWidth',390);await page.screenshot({path:'tmp/mobile.png',fullPage:true});
 await page.locator('.bottom-nav').getByRole('button',{name:'Araçlar'}).click();await expect(page.getByRole('button',{name:'Mikrofonu aç'})).toBeVisible();await page.getByRole('button',{name:'Nefes',exact:true}).click();await expect(page.getByText('Sakin bir başlangıç',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Menüyü aç'}).click();await page.locator('.sidebar').getByRole('button',{name:'Ayarlar',exact:true}).click();
 const [dl]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Tam yedek indir'}).click()]);expect(dl.suggestedFilename()).toContain('tam-yedek');await dl.saveAs('tmp/test-backup.zip');
 await page.getByRole('button',{name:'Yedek yükle'}).click();await page.locator('input[type=file]').setInputFiles('tmp/test-backup.zip');await expect(page.getByRole('dialog',{name:'Yedeği geri yükle'})).toBeVisible();await page.getByRole('button',{name:'Geri yükle',exact:true}).click();await expect(page.getByText('Yedek geri yüklendi.',{exact:true})).toBeVisible();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:'Sesine bir alan aç.'})).toBeVisible();
 await page.locator('.bottom-nav').getByRole('button',{name:'Araçlar'}).click();await expect(page.getByRole('button',{name:'Mikrofonu aç'})).toBeVisible();await context.setOffline(false);
});
test('microphone detects a controlled C3 and saves a playable recording',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await page.locator('.sidebar').getByRole('button',{name:'Araçlar',exact:true}).click();
 await page.getByRole('button',{name:'Mikrofonu aç',exact:true}).click();await expect(page.locator('.tuner-reading').getByText('C3',{exact:true})).toBeVisible({timeout:10000});
 await page.getByRole('button',{name:'Ses kaydı al',exact:true}).click();await expect(page.getByRole('button',{name:/Kaydı bitir/})).toBeVisible();await page.waitForTimeout(1300);await page.getByRole('button',{name:/Kaydı bitir/}).click();await expect(page.getByText('Kayıt arşivine eklendi.',{exact:true})).toBeVisible();
 await page.locator('.sidebar').getByRole('button',{name:'Kayıtlarım',exact:true}).click();await expect(page.locator('audio')).toHaveCount(1);expect(await page.locator('audio').evaluate((el:HTMLAudioElement)=>el.src.startsWith('blob:'))).toBe(true);expect(errors).toEqual([]);
});
