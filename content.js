/**
 * Gmail e-posta içeriğini çekmek için yardımcı fonksiyonlar.
 */

function getEmailBody() {
  // Gmail'in yaygın e-posta gövdesi seçicileri
  const selectors = ['.a3s.aiL', '.ii.gt', '.adP'];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.trim().length > 0) {
      return element.innerText.trim();
    }
  }
  return null;
}

// Popup'tan mesaj gelirse içeriği gönder
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEmailContent") {
    const content = getEmailBody();
    sendResponse({ content: content });
  }
});
