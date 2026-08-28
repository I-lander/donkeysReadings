import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <img className="loading-icon__spinner" src="/assets/images/loading_icon.png" alt="" />
    </div>
  );
};

// The reading is plain LLM text: escape any HTML before injecting the <br> tags.
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function createMarkup(result?: string) {
  if (result) {
    return { __html: escapeHtml(result.replace(/^\n+|\n+$/g, '')).replace(/\n/g, '<br>') };
  }
  return undefined;
}

function getScreenshotFileName(): string {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = ('0' + day).slice(-2) + ('0' + month).slice(-2) + year;
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedTime =
    ('0' + hours).slice(-2) + ('0' + minutes).slice(-2) + ('0' + seconds).slice(-2);

  return `TarotReading_${formattedDate}-${formattedTime}.png`;
}

async function captureDivAsDataURL(div: HTMLElement): Promise<string> {
  div.classList.add('screenShot');
  try {
    const canvas = await html2canvas(div);
    return canvas.toDataURL();
  } finally {
    div.classList.remove('screenShot');
  }
}

// In the Android WebView, <a download> is inert: write the file then open the share sheet.
async function saveScreenshot(dataURL: string) {
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

interface ReadingBlockProps {
  card1: string;
  card2: string;
  card3: string;
  isLoading: boolean;
  question?: string;
  result?: string;
}

export const ReadingBlock = ({
  card1,
  card2,
  card3,
  isLoading,
  question,
  result,
}: ReadingBlockProps) => {
  const captureDiv = useRef<HTMLDivElement>(null);

  const handleCaptureClick = async () => {
    if (!captureDiv.current) return;
    try {
      const dataURL = await captureDivAsDataURL(captureDiv.current);
      await saveScreenshot(dataURL);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <div ref={captureDiv}>
          <div className="cards-container">
            <div className="card">
              <img className="card-image" src={card1} alt="" />
            </div>
            <div className="card">
              <img className="card-image" src={card2} alt="" />
            </div>
            <div className="card">
              <img className="card-image" src={card3} alt="" />
            </div>
          </div>
          <div className="question">{question}</div>

          <div className="reading-container">
            {isLoading ? <LoadingIcon /> : <div dangerouslySetInnerHTML={createMarkup(result)} />}
          </div>
        </div>
      </div>
      {result && (
        <button className="capture-button" onClick={handleCaptureClick}>
          <img src="/assets/images/camera-icon.svg" alt="capture" />
        </button>
      )}
    </div>
  );
};
