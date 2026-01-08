# 🤖 AI Email Replier

Google'ın **Gemini API** gücünü kullanarak, Gmail üzerindeki e-postalarınızı okuyan ve seçtiğiniz tonda (Resmi, Arkadaşça vb.) saniyeler içinde yanıt taslağı oluşturan yapay zeka asistanı.

## ✨ Özellikler

- **Gmail Entegrasyonu:** Açık olan e-postanın içeriğini otomatik algılar.
- **Gemini 2.5 Flash Model:** Hızlı ve akıllı yanıtlar için en güncel Google modelini kullanır.
- **Ton Seçimi:** Yanıtın üslubunu belirleyebilirsiniz (Örn: Profesyonel, Samimi, Kızgın, vb.).
- **Güvenli API Saklama:** API anahtarınızı yerel tarayıcı hafızasında (`chrome.storage.local`) şifrelemeden saklar (sunucuya göndermez).
- **Hata Yönetimi:** API hatalarını veya boş içerikleri kullanıcıya bildirir.

## ⚙️ Kurulum ve Ayarlar

### 1. API Anahtarı Alma
Bu eklentiyi kullanmak için Google AI Studio üzerinden ücretsiz bir API anahtarı almanız gerekir:
- [Google AI Studio](https://aistudio.google.com/) adresine gidin.
- Bir API Key oluşturun.

### 2. Eklentiyi Yükleme
- Proje klasörünü Chrome'a "Paketlenmemiş öğe" olarak yükleyin.

### 3. Kullanım
1. Eklenti ikonuna tıklayın.
2. İlk açılışta API anahtarınızı girin ve "Kaydet"e basın.
3. Gmail'de yanıtlamak istediğiniz bir e-postayı açın.
4. Bir ton seçin ve **"Cevap Oluştur"** butonuna basın.
5. Yapay zekanın ürettiği cevabı kopyalayıp kullanın.

## ⚠️ Gizlilik Notu
Bu eklenti e-posta içeriğinizi **sadece** yanıt oluşturmak amacıyla o anlık olarak Google Gemini API'sine gönderir. Verileriniz başka bir sunucuda depolanmaz.
