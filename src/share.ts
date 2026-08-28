import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';

function getScreenshotFileName(): string {
  const d = new Date();
  const date = `${('0' + d.getDate()).slice(-2)}${('0' + (d.getMonth() + 1)).slice(-2)}${d.getFullYear()}`;
  const time = `${('0' + d.getHours()).slice(-2)}${('0' + d.getMinutes()).slice(-2)}${('0' + d.getSeconds()).slice(-2)}`;
  return `TarotReading_${date}-${time}.png`;
}

export async function captureDivAsDataURL(div: HTMLElement): Promise<string> {
  div.classList.add('screenShot');
  try {
    const canvas = await html2canvas(div, { backgroundColor: '#15151f' });
    return canvas.toDataURL();
  } finally {
    div.classList.remove('screenShot');
  }
}

// In the Android WebView, <a download> is inert: write the file then open the share sheet.
export async function saveScreenshot(dataURL: string): Promise<void> {
  const fileName = getScreenshotFileName();

  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({
      path: fileName,
      data: dataURL.split(',')[1],
      directory: Directory.Cache,
    });
    await Share.share({ files: [uri] });
    return;
  }

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
