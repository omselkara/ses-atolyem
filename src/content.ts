import type { Exercise, Profile, Cursor, Step } from './model';
import { localDate } from './model';

export const reading = `Sabahın ilk ışıkları pencerenin önündeki küçük masaya düştü. Deniz, çayını alıp açık pencerenin yanına oturdu. Sokakta hayat yavaş yavaş uyanıyordu. Bir bisikletli köşeyi döndü, fırından yeni çıkmış ekmeğin kokusu serin havaya karıştı. Her gün geçtiği bu sokakta, bugün daha önce fark etmediği ayrıntılar vardı.

Karşı evin balkonundaki saksılarda küçük çiçekler açmıştı. Yaşlı bir adam, kapısının önünü süpürürken komşusuna günaydın dedi. İki çocuk, okula yetişmek için adımlarını hızlandırdı. Deniz bütün bu sesleri dinledi; bir süre hiçbir şey söylemeden, yalnızca olan bitene dikkat etti.

Sonra defterini açıp bir cümle yazdı: Bir şeyi iyi yapmak, onu dikkatle yapmaya başlamakla mümkün olur. Bu düşünce ona, uzun zamandır ertelediği bir yürüyüşü hatırlattı. Ayakkabılarını giydi, anahtarını aldı ve dışarı çıktı.

Parkın yolu ağaçların arasından geçiyordu. Yaprakların arasındaki ışık, yerde küçük desenler oluşturuyordu. Deniz acele etmeden yürüdü. Her adımda nefesini ve çevresindeki sesleri fark etti. Yolun sonunda geniş bir bank vardı. Oturduğunda, başladığı yere dönmek için henüz zamanı olduğunu düşündü. Günün geri kalanını planlamak yerine, birkaç dakika daha orada kalmaya karar verdi.`;
export const twisters = ['Şu köşe yaz köşesi, şu köşe kış köşesi, ortada su şişesi.', 'Bir berber bir berbere, gel beraber bir berber dükkânı açalım demiş.', 'Kırk kırık küp, kırkının da kulpu kırık kara küp.'];
export const topics = ['Küçük bir alışkanlığın hayatına etkisi', 'Bir arkadaşına yaşadığın şehri anlat', 'Yeni bir şey öğrenirken seni motive eden ne?', 'Sevdiğin bir kitabı neden önerirsin?', 'Bir günlüğüne internet olmasaydı', 'Çocukluğundan hatırladığın bir yer', 'Güzel bir gün senin için nasıl başlar?'];
export const days = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
export const phaseNames = ['Başlangıç ölçümü','Temel ve rahat aralık','Aralık genişletme','Geçiş bölgesi','Entegrasyon'];
export const phaseOf = (week:number) => week === 0 ? 0 : Math.ceil(week/3);
export const defaultProfile = (): Profile => ({name:'',started:false,startDate:localDate(),time:'19:00',theme:'light',fontSize:16,low:45,high:57,transition:null,transpose:0,reading,textVersion:'original-v1',tongueTwisters:twisters,cursor:{week:0,day:0,repeat:0}});
const ex = (id:string,name:string,category:Exercise['category'],seconds:number,description:string,steps:string[],tip:string,page:number,optional=false):Exercise => ({id,name,category,seconds,description,steps,tip,page,optional});
export const exercises: Record<string,Exercise> = Object.fromEntries([
 ex('E1','Sabit ton · vvv','Isınma',90,'Yumuşak bir başlangıçla sesini uyandır.', ['Alt dudağını üst dişlerine hafifçe değdir.','Rahat bir notada sesli “vvv” çıkar.','20 saniyeye kadar tut, bırak ve dinlen. Üç kez tekrarla.'],'Titreşimi dudakta hisset. Rahat süreyi aşma.',2),
 ex('E2','Yumuşak siren','Isınma',90,'Sesini kesintisiz bir dalga gibi gezdir.', ['“vvv” veya “ng” ile rahat bir perdeden başla.','Yavaşça yukarı, sonra aşağı kay.','Şiddeti düşük tut; zorlanan notada ısrar etme.'],'Kayma yumuşak olsun. Çatlamayı zorlayarak düzeltmeye çalışma.',2),
 ex('E3','Dudak trili','Isınma',60,'Gevşek dudaklarla hafif titreşim.', ['Dudaklarını serbest bırak.','Nefesle “brrr” titreşimi oluştur.','Olmuyorsa E1 veya E2 kullan.'],'İsteğe bağlı. Atlamak sorun değil.',2,true),
 ex('E4','Humming · mmm','Ses',90,'Rahat bir notada küçük, dengeli bir ses.', ['Ağzın kapalı “mmm” söyle.','Burun ve dudak çevresindeki titreşimi fark et.','Her tekrardan sonra nefesini normalleştir.'],'Tuner çizgisi yardımcıdır. Süreyi tamamlamak için sıkma.',2),
 ex('E5','Notayı yakala','Ses',240,'Dinlediğin notaya doğrudan gir.', ['Notayı 1 saniye dinle.','2 saniye bekle ve notayı zihninde tut.','“nu” ile tek girişte söyle, 2 saniye tut.','Giriş sonucunu gör, dinlen ve tekrarla.'],'Aşağıdan kayarak arama; ilk giriş ölçülür.',2),
 ex('E6','Nota sıçraması','Ses',180,'İki nota arasında net bir geçiş.', ['İki hedef notayı dinle.','İlk notayı yaklaşık 2 saniye tut.','Aradaki sesleri taramadan ikinciye geç.'],'İkinci notaya ilk girişini dinle.',2),
 ex('E7','Arpej · mum','Ses',240,'Üç notalık bir merdiven.', ['1–3–5 dizisini dinle.','Her notaya “mum” ile ayrı gir.','Sonra 1–3–5–3–1 olarak dön.'],'Hızlı değil, net. Rahat aralıkta kal.',2),
 ex('E8','Kulak taklidi','Ses',240,'Önce kulağına güven, sonra kontrol et.', ['Rastgele nota dizisini dinle.','Tuner sonucuna bakmadan tekrar et.','Sonucu aç ve hangi notada zorlandığını not et.'],'Gösterge cevap bitene kadar gizlenir.',2),
 ex('E9a','Geçiş sireni · ng','Ses',180,'Kendi geçiş bölgen çevresinde yumuşak kayma.', ['Profilindeki P notasını doğrula.','Haftana ait alt ve üst sınırlar arasında “ng” ile kay.','Düşük şiddet kullan, her denemeden sonra dinlen.'],'P kullanıcı değerlendirmesidir. Bilinmiyorsa bu çalışmayı ertele.',2),
 ex('E9b','Geçiş arpeji · gee','Ses',240,'Geçiş bölgesine adım adım yaklaş.', ['“gee” ile 1–3–5–3–1 dizisini söyle.','Başlangıç notasını yarım ses adımlarla değiştir.','Çeneyi serbest ve ses şiddetini düşük tut.'],'Dizinin en üst notasının da rahat aralığında olması gerekir.',2),
 ex('E10','Nefesin ritmi','Isınma',96,'Eşit ve sakin bir hava akışı.', ['Burnundan yaklaşık 4 saniyede nefes al.','Alt kaburgalarının genişlemesini hisset.','“sss” ile rahatça, 15–20 saniyeye kadar ver.'],'Omuzlarını kaldırma. Süreyi zorlayarak uzatma.',2),
 ex('E11','Melodiden şarkıya','Ses',300,'Bir cümleyi dinle, söyle, yeniden dinle.', ['Rahat aralığındaki bir melodiyi seç.','Önce referans notaları dinle, sonra söyle.','Kaydını dinle ve bir cümleye odaklan.'],'Kendi şarkın için referans notalarını düzenleyebilirsin.',3),
 ex('D1','S ve Ş netliği','Diksiyon',60,'İki sesi yavaşça birbirinden ayır.', ['Dil ucunu alt dişlerinin arkasında tut.','Yavaşça “s – ş – s – ş” söyle.','Aynada dilin dişler arasına çıkıp çıkmadığına bak.'],'Netlik hızdan önce gelir.',3),
 ex('D2','Dikkatli okuma','Diksiyon',180,'Her kelimeye alan aç.', ['Sabit metni yavaş ve anlaşılır oku.','Kaydını dinle.','Yutulan veya net olmayan kelimeleri işaretle.'],'Karşılaştırmalar için aynı metni kullan.',3),
 ex('D3','İki okuma karşılaştırması','Diksiyon',240,'İsteğe bağlı kalemli/kalemsiz okuma.', ['PDF’deki isteğe bağlı yöntemi tercih ediyorsan iki okuma kaydı al.','İlk okuma 2 dakika, ardından normal okuma 2 dakika.','Fark yoksa devam etme; normal okumayı seçebilirsin.'],'Zorunlu değil; atlaman ilerlemeni düşürmez.',3,true),
 ex('D4','Tekerleme atölyesi','Diksiyon',180,'Önce doğru, sonra akıcı.', ['Tekerlemeyi yavaş tempoda oku.','Doğru olduğunda temponu biraz artır.','Hata yaptığın kelimeyi üç kez net tekrar et.'],'Hız yarışına dönüştürme.',3),
 ex('D5','Es ve vurgu','Diksiyon',300,'Cümleye anlamıyla yön ver.', ['Metindeki önemli kelimeleri seç.','Cümle içinde yaklaşık 1 saniyelik bilinçli duraklar ver.','Önemli kelimeleri vurgula, kaydı dinle.'],'Vurgu sadece daha yüksek ses değildir.',3),
 ex('D6','Ünsüz çalışması','Diksiyon',180,'P, T, K ve B, D, G seslerini belirginleştir.', ['P–T–K ve B–D–G dizilerini onar kez söyle.','“Kırk kırık küp” gibi kombinasyonlara geç.','Netliği koruyarak tekrar et.'],'Çene ve dili gereksiz yere sıkma.',3),
 ex('D7','Dinamik okuma','Diksiyon',300,'Aynı cümlenin üç farklı rengi.', ['Bir cümleyi yumuşak sesle oku.','Ardından orta ve rahat güçlü şiddette oku.','Kaydını dinle; kelimeler her düzeyde net mi?'],'Güçlü ses, bağırmak anlamına gelmez.',3),
 ex('D8','Konuşma melodisi','Diksiyon',300,'Konuşmana doğal inişler ve çıkışlar kat.', ['Metni rahat pes perdeden tize doğru oku.','Aynı cümleyi ters yönde dene.','Anlamı koruyarak doğal tonlamaya dön.'],'Perde çizgisini izle; rahat aralıkta kal.',3),
 ex('D9','Bir konu, senin sesin','Diksiyon',180,'Kısa bir konuşmayı dinleyerek geliştir.', ['Verilen konuda küçük bir topluluğa anlatır gibi konuş.','Kaydı dinle ve aksayan üç yeri yaz.','Ertesi çalışmanda aynı noktaları yeniden dene.'],'Başlangıç, bir ana fikir ve kısa bir bitiş seç.',3),
 ex('CAL','Ses araçlarını tanı','Ölçüm',60,'Referans sesi ve mikrofonu kontrol et.', ['A4 notasını dinle: 440 Hz.','A2 notasını dinle: 110 Hz.','Tuner ve kayıt araçlarını dene.'],'Nota isimleri A4=440 standardındadır.',3),
 ex('T1','Konuşma perden','Ölçüm',30,'30 saniyelik doğal bir okuma.', ['Sabit metinden 30 saniye doğal sesle oku.','En sık kaldığın notayı ölç veya elle gir.'],'Konuşmanı nota tutmak için değiştirme.',4),
 ex('T2','Rahat aralığın','Ölçüm',120,'Alt nota, geçiş bölgesi ve üst notanı kaydet.', ['Rahat şiddette “ng” ile bir kez aşağıdan yukarı kay.','En pes rahat notayı, P’yi ve falsetto üst notayı işaretle.'],'P otomatik teşhis edilmez; emin değilsen boş bırak.',4),
 ex('T3','Nota eşleme testi','Ölçüm',240,'Her hedef için üç giriş denemesi.', ['Hedefi dinle ve 2 saniye bekle.','“nu” ile doğrudan gir.','İlk 0,5 saniyelik giriş değerlendirilir.'],'Zorlandığın hedefi atla; boş değer başarı sayılmaz.',4),
 ex('T4','Sürdürme süreleri','Ölçüm',180,'ah, sss ve zzz için ikişer deneme.', ['Rahatça ah, sss ve zzz seslerini ayrı ayrı sürdür.','İki deneme arasında dinlen.','Geçerli iki süreden en iyisi rapora alınır.'],'sss için perde ölçülmez. Zorlayarak süre uzatma.',4),
 ex('T5','Diksiyon başlangıcın','Ölçüm',180,'Aynı metin ve aynı üç tekerleme.', ['Sabit metni 2 dakika oku; biterse baştan devam et.','Üç sabit tekerlemeyi kaydet.','Dinleyip hata, S/Ş ve kelime sonu sayılarını gir.'],'Bu sayılar dinleyerek değerlendirilir.',4),
 ex('GATE','Aşama kontrolü','Ölçüm',180,'Bu fazın ek ölçümlerini tamamla.', ['İlgili geçiş kriterini dene.','Kaydını ve ölçümlerini incele.','Emin olmadığın sonucu boş bırak.'],'Eksik veriyle otomatik geçiş yapılmaz.',8),
].map(e=>[e.id,e]));

export function workNotes(p:Profile, week:number) {
 const base = week===1 ? [45,48,50,52] : week===2 ? [45,48,50,52,55] : [45,48,50,52,55,57];
 return base.map(n=>n+p.transpose).filter(n=>n>=p.low && n<=p.high && (week<4||week>6||p.transition===null||n<=p.transition-2));
}
export function getSteps(cursor:Cursor,p:Profile):Step[] {
 const {week:w,day:d}=cursor; let i=0;
 const s=(exercise:string,seconds=exercises[exercise].seconds,detail='',notes?:number[],repeats?:number):Step=>({id:`${i++}-${exercise}`,exercise,seconds,detail,notes,repeats});
 const notes=workNotes(p,w), trans=(a:number[])=>a.map(n=>n+p.transpose).filter(n=>n>=p.low&&n<=p.high&&(w<4||w>6||p.transition===null||n<=p.transition-2));
 if(w===0) return d===0?[s('CAL'),s('T1'),s('T2')]:d===1?[s('T3',300,'Her nota için 3 deneme',workNotes(p,3)),s('T4')]:[s('T5')];
 if(d===6) return [];
 if(d===5) return [s('T1'),...(w%3===0?[s('T2')]:[]),s('T3',w%3===0?300:180,'Her nota için 3 deneme',w%3===0?notes:notes.slice(0,3)),...(w%3===0?[s('T4'),s('T5'),s('GATE')]:[])];
 if(w<=3) {
   const hum=[15,20,25][w-1], read=w===1?180:240;
   const warm=()=>[s('E1',90,'3 × 20 sn; aralarda dinlen',undefined,3),s('E2',90,'3 yumuşak kayma',undefined,3)];
   const pair=trans(d===2?[48,52]:[48,50]);
   if(d===0||d===3) return [...warm(),s('E5',300,'Nota başına 5 tekrar',notes,5),s('D1'),s('D2',read)];
   if(d===1) return [s('E2',180,'5 tekrar',undefined,5),s('E4',hum*3+30,`3 × ${hum} sn; rahat süreyi aşma`,notes.slice(0,1),3),s('E6',180,'Nota çiftleri arasında doğrudan geçiş',pair,5),s('D3')];
   if(d===2) return [...warm(),s('E6',240,'Üçlü sıçrama',pair,5),s('D4',240,w===1?'Çok yavaş, 5 tur':w===2?'Orta tempo, 5 tur':'Orta tempo; hatalı kelimeyi 3 kez tekrarla',undefined,5)];
   return [s('E10',96,'4 nefes döngüsü',undefined,4),s('E2',90),s('E4',hum*3+30,`3 × ${hum} sn`,notes.slice(0,1),3),s('E6',180,'Doğrudan geçiş',pair,5),s('D4'),s('D2',120)];
 }
 if(w<=6) {
  const arp=trans([48,52,55]), jump=trans([48,55]), ear=trans([45,48,50,52,55,57]).slice(0,w===4?3:4);
  if(d===0) return [s('E2',240,'5 rahat kayma',undefined,5),s('E7',480,w===4?'C3 başlangıcı':w===5?'A2, C3, D3 başlangıçlarını rahat aralıkta dene':'4 farklı rahat başlangıç',arp,5),s('D5')];
  if(d===1) return [s('E1'),s('E2',150),{...s('E8',480,`${w===4?3:4} nota, 8 tur`,ear,8),hidden:true},s('D7')];
  if(d===2) return [s('E4',60,'2 × 20 sn',notes.slice(0,1),2),s('E2',180),s('E6',480,w===6?'4 farklı rahat çift':'Beşli sıçrama',jump,5),s('D6',150),s('D5',150)];
  if(d===3) return [s('E2',240),s('E7',240,'1–3–5–3–1',trans([48,52,55,52,48]),5),{...s('E8',240,'Önce söyle, sonra kontrol et',ear,4),hidden:true},s('D4',300)];
  return [s('E1',90,'3 × 20 sn',undefined,3),s('E11',480,'Sevdiğin şarkıdan rahat bir cümle',arp),s('D9',(w-3)*30+30,'Konuş, kaydet, aksayan bir yeri yaz')];
 }
 if(w<=9) {
  const P=p.transition;
  const guarded=(step:Step):Step=>({...step,blocked:P===null?'Önce ayarlardan P geçiş notanı kaydet.':step.notes?.some(n=>n<p.low||n>p.high)?'Bu dizi rahat aralığının dışına çıkıyor. Hedefleri değerlendirmeden uygulama.':undefined});
  const ng=()=>guarded(s('E9a',180,`P−4 ile P+${w-5}; ${w===7?'çok yumuşak':'yumuşak'}`,P===null?[]:[P-4,P+(w-5)],6));
  const gee=()=>guarded(s('E9b',300,`Başlangıç P−5…P+${w-7}; 6–8 tekrar`,P===null?[]:[P-5,P-1,P+2,P-1,P-5],6));
  if(d===0||d===2) return [s('E2',120),ng(),gee(),s('E2',60,'Aşağı yönlü soğuma')];
  if(d===1||d===3) return [s('E4',90),s('E2',90),s('D8'),s('D6',240),s('D2',120)];
  return [s('E2',120),ng(),s('E11',300,'Önce ng, sonra normal hecelerle söyle',trans([48,52,55]))];
 }
 return [s('E1',120,'Kısa tutuşlar ve dinlenme'),s('E2',60),s('E4',120,'Kısa tutuşlar ve dinlenme'),s('E11',480,w===10?'Bir kıta':w===11?'Tam şarkı':'Tam şarkıyı kaydet',trans([48,50,52,55,52,50,48])),s('D9',420,'3 dk konuş, dinle ve üç aksama yaz')];
}
export const weekDescription = (w:number) => w===0?'Önce sesini tanı. Üç küçük adımda başlangıç noktanı oluştur.':w<=3?'Rahat ses, net başlangıçlar ve yavaş diksiyon.':w<=6?'Notalar arasında güvenle hareket et, kulağını geliştir.':w<=9?'Kendi geçiş bölgeni yumuşak ve kontrollü keşfet.':'Öğrendiklerini şarkına ve konuşmana taşı.';
