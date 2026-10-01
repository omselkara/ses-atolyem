# v1.0 doğrulama ve yayın durumu

2 Ekim 2026

- Canlı uygulama: https://ses-atolyem.omselkara.workers.dev
- Kaynak kodu: https://github.com/omselkara/ses-atolyem
- İlk yayın: Cloudflare Workers Static Assets, Wrangler OAuth ile.
- GitHub CI: birim testleri, üretim derlemesi ve Playwright testleri başarılı.

## Kontrol edilenler

19 birim testi: A4=440 Hz, nota/cent hesapları, 110–880 Hz sentetik perde algılama, sessizlik/gürültü reddi, mutlak sapma, üç başlangıç günü ve 12 haftanın kapsamı, kapı testlerinin varlığı, rahat aralık, eksik P ve eksik kapı verileri, metin karşılaştırması, yerel veri ve sesli ZIP yedeği bütünlüğü.

3 Playwright akışı: masaüstü başlangıç günü, profil/ilerleme kalıcılığı ve program gezinmesi; 390 px mobil görünüm, yedek geri yükleme ve çevrimdışı kabuk; kontrollü mikrofon sinyalinden C3 algılama ve ses kaydının arşive eklenmesi.

Canlı HTTPS adresinde ayrıca manifest/service worker/ikon dosyaları, mobil açılış, kontrollü C3 algılama, ses kaydının tarayıcı tarafından çözümlenmesi/oynatılabilirliği ve çevrimdışı yeniden açılış doğrulandı. Kontrollerde sayfa JavaScript hatası yoktu.

## Kalan cihaz ve yayın işleri

Fiziksel Android telefonu ve kullanıcının gerçek sesi bu bilgisayardaki testlerle doğrulanamaz. Telefonda ilk açılışta mikrofon, kayıt ve ekran kesintileri denenmelidir.

Cloudflare'ın GitHub deposunu otomatik izlemesi henüz bağlanmadı. GitHub CI otomatik çalışıyor; Cloudflare yayın güncellemeleri şu an `npm run deploy` ile yapılır. Otomatik Cloudflare bağlantısının adımları README'de var; bağlantı, Cloudflare GitHub uygulamasına depo erişimi verilmesini gerektirir.

API ile AI yorumlama ve bulut eşitleme, planın sonraki sürüm aşamalarıdır. v1.0 rapor kopyalama, yerel kayıt ve ses dosyalarını içeren tam yedek sağlar.
