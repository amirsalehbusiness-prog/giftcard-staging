import html2canvas from 'html2canvas';

export async function generateGiftCardImage(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // Generate canvas from HTML element
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 600,
    height: 800,
    logging: false,
    imageTimeout: 0,
    removeContainer: true
  });

  // Convert to JPEG blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/jpeg', 0.95);
  });
}

export async function shareGiftCardImage(
  elementId: string,
  platform: 'telegram' | 'whatsapp' | 'copy',
  shareText: string,
  showPrice: boolean,
  recipientPhone: string | null
): Promise<void> {
  try {
    // Generate JPEG first
    const imageBlob = await generateGiftCardImage(elementId);
    
    // Prepare share text
    const finalText = showPrice ? shareText : shareText.replace(/💰 مبلغ:.*?\n/g, '');
    
    // Generate secure credentials for recipient
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };
    
    const tempPassword = generatePassword();
    const loginUrl = `${window.location.origin}/login`;
    
    const authInfo = recipientPhone ? `

🔐 اطلاعات ورود به حساب کاربری:
👤 نام کاربری: ${recipientPhone}
🔑 رمز موقت: ${tempPassword}
🌐 لینک ورود: ${loginUrl}

💡 برای امنیت بیشتر، پس از اولین ورود از رمز یکبار مصرف (OTP) استفاده کنید.` : '';
    
    const finalTextWithAuth = finalText + authInfo;
    
    switch (platform) {
      case 'telegram':
        // Download image and share text in Telegram
        downloadImage(imageBlob, 'gift-card.jpg');
        setTimeout(() => {
          const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(loginUrl)}&text=${encodeURIComponent(finalTextWithAuth)}`;
          window.open(telegramUrl, '_blank');
        }, 500);
        break;
        
      case 'whatsapp':
        // Download image and share text in WhatsApp
        downloadImage(imageBlob, 'gift-card.jpg');
        setTimeout(() => {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(finalTextWithAuth)}`;
          window.open(whatsappUrl, '_blank');
        }, 500);
        break;
        
      case 'copy':
        // Copy text and download image
        await navigator.clipboard.writeText(finalTextWithAuth);
        downloadImage(imageBlob, 'gift-card.jpg');
        alert('متن کپی شد و تصویر کارت هدیه دانلود شد!');
        break;
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
    alert('خطا در تولید تصویر. لطفاً دوباره تلاش کنید.');
  }
}

function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}