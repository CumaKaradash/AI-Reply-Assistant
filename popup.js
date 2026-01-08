document.addEventListener('DOMContentLoaded', async () => {
  const setupScreen = document.getElementById('setup-screen');
  const mainScreen = document.getElementById('main-screen');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const resetSettingsBtn = document.getElementById('reset-settings');
  const generateBtn = document.getElementById('generate-btn');
  const toneSelect = document.getElementById('tone-select');
  const resultText = document.getElementById('result-text');

  // API Anahtarı kontrolü
  const checkKey = async () => {
    const data = await chrome.storage.local.get(['geminiKey']);
    if (data.geminiKey) {
      setupScreen.display = 'none'; // Alternatif gizleme
      setupScreen.setAttribute('style', 'display: none;');
      mainScreen.setAttribute('style', 'display: block;');
    } else {
      setupScreen.setAttribute('style', 'display: block;');
      mainScreen.setAttribute('style', 'display: none;');
    }
  };

  await checkKey();

  // Anahtarı Kaydet
  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      await chrome.storage.local.set({ geminiKey: key });
      await checkKey();
    } else {
      alert('Lütfen geçerli bir API anahtarı girin.');
    }
  });

  // Ayarları Sıfırla
  resetSettingsBtn.addEventListener('click', async () => {
    if (confirm('API anahtarını silmek istediğinize emin misiniz?')) {
      await chrome.storage.local.remove('geminiKey');
      apiKeyInput.value = '';
      await checkKey();
    }
  });

  // Cevap Üretme
  generateBtn.addEventListener('click', async () => {
    const data = await chrome.storage.local.get(['geminiKey']);
    const apiKey = data.geminiKey;
    const tone = toneSelect.value;

    resultText.value = 'E-posta içeriği okunuyor...';
    generateBtn.disabled = true;

    try {
      // Content script'ten e-posta metnini al
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('mail.google.com')) {
        resultText.value = 'Hata: Lütfen Gmail sekmesinde olduğunuzdan emin olun.';
        generateBtn.disabled = false;
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Gmail e-posta gövdesi seçicileri
          const selectors = ['.a3s.aiL', '.ii.gt', '.adP'];
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element.innerText;
          }
          return null;
        }
      });

      const emailBody = results[0].result;

      if (!emailBody) {
        resultText.value = 'E-posta içeriği bulunamadı. Lütfen bir e-posta açın.';
        generateBtn.disabled = false;
        return;
      }

      resultText.value = 'Cevap oluşturuluyor...';

      // Gemini API İsteği (Model gemini-2.5-flash olarak güncellendi)
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sen profesyonel bir e-posta asistanısın. Aşağıdaki e-posta içeriğine ${tone} bir tonda yanıt yaz. Sadece yanıt metnini döndür:\n\n${emailBody}`
            }]
          }]
        })
      });

      const resultData = await response.json();
      
      if (!response.ok) {
        const errorMsg = resultData.error?.message || 'Bilinmeyen bir API hatası oluştu.';
        resultText.value = `HATA: ${errorMsg}`;
        generateBtn.disabled = false;
        return;
      }

      if (!resultData.candidates || resultData.candidates.length === 0) {
        resultText.value = 'Yapay zeka mantıklı bir cevap üretemedi.';
        generateBtn.disabled = false;
        return;
      }

      const generatedText = resultData.candidates[0].content?.parts?.[0]?.text;
      if (generatedText) {
        resultText.value = generatedText;
      } else {
        resultText.value = 'Yapay zeka mantıklı bir cevap üretemedi.';
      }

    } catch (error) {
      console.error(error);
      resultText.value = 'Hata oluştu: ' + error.message;
    } finally {
      generateBtn.disabled = false;
    }
  });
});
