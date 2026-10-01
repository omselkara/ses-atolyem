# Ses Atölyem

Türkçe ses ve diksiyon çalışmaları için Android'e kurulabilen, çevrimdışı çalışan kişisel PWA.

Hafta 0 başlangıç ölçümü ve 12 haftalık program; piyano/referans tonları, canlı tuner, ses kaydı, nefes sayacı, diksiyon metinleri, T1–T6 testleri, aşama kriterleri ve haftalık raporlar bir arada.

## Çalıştırma

Node.js 22.12+ veya 24 önerilir.

```sh
npm ci
npm run dev
```

`http://localhost:5173` adresini aç. Mikrofon yerelde localhost, yayında HTTPS üzerinde çalışır. Telefonun bilgisayarın HTTP IP adresinden açması mikrofon için yeterli değildir; telefonda yayın adresini kullan.

```sh
npm run test
npm run build
npm run preview
```

Tarayıcı akışlarını çalıştırmak için:

```sh
npx playwright install chromium
npm run test:e2e
```

## Kullanım

1. Başlangıç ölçümünü başlat ve üç günü tamamla.
2. Rahat ses aralığını ayarlardan kontrol et. P geçiş notan bilinmiyorsa boş bırak.
3. Ana ekrandaki sıradaki çalışmaya devam et. Kısmi/durdurulmuş seans programı ilerletmez.
4. Cumartesi ölçümlerini tamamla ve haftalık raporu kopyala.
5. Pazar dinlenmesi sonrası sıradaki haftaya geç. H3/6/9/12 kriterleri karşılanmamışsa bir tekrar haftası seç veya eksik testleri tamamla.
6. Ayarlardan düzenli olarak tam ZIP yedeği al. ZIP hem ilerlemeyi hem ses dosyalarını içerir.

Program günü ile takvim günü ayrı tutulur: uygulama seni kaçırdığın günler yüzünden otomatik ilerletmez. Ayarlardan indirilen takvim dosyası yalnızca çalışma hatırlatmasıdır.

## Android kurulumu

Yayın adresini Android Chrome'da aç → uygulamadaki **Telefonuna kur** seçeneği veya Chrome menüsü → **Uygulamayı yükle / Ana ekrana ekle**. İlk çevrimiçi yüklemede dosyalar hazırlandıktan sonra temel araçlar çevrimdışı çalışır.

Ekran kilidi veya uygulamadan çıkışta seans duraklar; çalışan kayıt tamamlanıp arşive kaydedilmeye çalışılır. Kilitli ekranda kesintisiz kayıt destek sözü verilmez.

## Veriler

- Hesap gerekmez. Ölçümler ve ses dosyaları cihazın IndexedDB alanındadır.
- Sesler veya raporlar sunucuya gönderilmez. Harici AI entegrasyonu yoktur; raporu kendin paylaşabilirsin.
- Tam ZIP yedeğinde ses bütünlüğü SHA-256 ile kontrol edilir. Geri yükleme öncesi önizleme ve birleştir/değiştir seçimi vardır.
- Tarayıcı verisini silmek kayıtları silebilir. Yeni alan adı başka bir veri alanıdır; önce yedek al.
- Kişisel PDF, sesler, yedekler ve anahtarlar Git'e dahil edilmez.

## Cloudflare yayını

Proje Cloudflare Workers Static Assets için hazırdır. `wrangler.jsonc` statik `dist` dizinini yayınlar. Veritabanı veya ücretli AI gerektirmez.

```sh
npx wrangler login
npm run deploy
```

GitHub üzerinden otomatik yayın için Cloudflare **Workers & Pages → Create application → Import a repository** ile bu depoyu seç. Build: `npm run build`; deploy: `npx wrangler deploy`; kök: `/`; Worker adı: `ses-atolyem`.

Otomatik yayın yalnızca seçili dalı izleyecek şekilde yapılandırılmalı. Aktif seans sırasında PWA güncellemesi uygulanmaz; kullanıcıya daha sonra güncelleme sunulur.

## Ölçüm yöntemleri ve sınırlar

Tuner YIN tabanlı temel frekans tespiti kullanır. A4=440 Hz; cent hesabı `1200 * log2(f / hedefHz)`. T3'te ses başlangıcından sonraki ilk 0,5 saniyedeki güvenilir karelerin medyanı alınır. Denemelerin mutlak cent sapması ortalanır; +40 ve −40 birbirini sıfırlamaz. Uygulamanın referans sesi çalınırken analiz puanlaması susturulur.

P, boğaz hissi, diksiyon hataları, geçiş kararlılığı ve final şarkı kriterleri kullanıcı değerlendirmesi gerektirir. Tuner tek başına ses sağlığı veya vokal tekniği teşhis etmez. Sessizlik ve belirsiz sinyal başarılı deneme sayılmaz. Hedef nota seti değişen testlerin ortalamaları doğrudan karşılaştırılmamalıdır.

PDF'deki aralık adları gerçek nota çiftleri esas alınarak düzenlendi. Zamanı belirtilmeyen egzersizler yaklaşık sürelerle gösterilir. Faz 3 için P ve rahat aralık kontrolü gereklidir. Her şarkının otomatik nota çıkarımı, bulut eşitleme, Web Push ve uygulama içi AI daha sonraki sürümlerin kapsamıdır.

## Doğrulama

Otomatik testler sentetik seslerde perde doğruluğunu, sessizlik/gürültü reddini, eksik kapı verilerini, farklı metin karşılaştırmalarını, program kapsamını ve sesli yedeklerin bütünlüğünü denetler. Playwright testleri masaüstü/mobil gezinme, ilk ölçüm günü, yeniden açılışta kalıcılık, ZIP geri yükleme ve çevrimdışı açılışı kontrol eder.

Gerçek Android mikrofonu, cihaz kesintileri ve insan sesi performansı kullanıcı cihazında ayrıca denenmelidir; tarayıcı emülasyonu fiziksel telefon testi değildir.

## Yapı

`src/content.ts`: kaynaklı egzersizler ve program · `music.ts`: nota/perde hesapları · `audio.ts`: mikrofon/ton/kayıt · `domain.ts`: kapılar/raporlar · `storage.ts`: IndexedDB/ZIP · `Session.tsx`: seans ve test akışı · `App.tsx`: uygulama ekranları.

Tasarım ve uygulama kodu MIT lisanslıdır. Kaynak eğitim programının klinik etkinliğine ilişkin bir garanti verilmez.
