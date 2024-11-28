import React from "react";
import html2canvas from "html2canvas";

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <img
        className="loading-icon__spinner"
        src={"./src/images/loading_icon.png"}
      ></img>
    </div>
  );
};

function createMarkup(result) {
  if (result) {
    return { __html: result.replace(/^\n+|\n+$/g, "").replace(/\n/g, "<br>") };
  }
  return;
}

function captureDivAsDataURL(div, callback) {
  div.classList.add("screenShot");
  html2canvas(div).then((canvas) => {
    const dataURL = canvas.toDataURL();
    callback(dataURL);
  });
  div.classList.remove("screenShot");
}

function downloadScreenshot(dataURL) {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDate = ("0" + day).slice(-2) + ("0" + month).slice(-2) + year;
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  const formattedTime = ('0' + hours).slice(-2) + ('0' + minutes).slice(-2) + ('0' + seconds).slice(-2);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = `TarotReading_${formattedDate}-${formattedTime}.png`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const ReadingBlock = ({
  card1,
  card2,
  card3,
  isLoading,
  question,
  result,
}) => {
  const captureDiv = React.useRef();

  const handleCaptureClick = () => {
    captureDivAsDataURL(captureDiv.current, downloadScreenshot);
  };

  return (
    <div>
      {
        <div>
          <div ref={captureDiv}>
            <div className="cards-container">
              <div className="card">
                <img className="card-image" src={card1}></img>
              </div>
              <div className="card">
                <img className="card-image" src={card2}></img>
              </div>
              <div className="card">
                <img className="card-image" src={card3}></img>
              </div>
            </div>
            <div className="question">{question}</div>

            <div className="reading-container">
              {isLoading ? (
                <LoadingIcon />
              ) : (
                <div dangerouslySetInnerHTML={createMarkup(result)}></div>
              )}
            </div>
          </div>
        </div>
      }
      {result ? (
        <button className="capture-button" onClick={handleCaptureClick}>
          <img src="../src/images/camera-icon.svg" />
        </button>
      ) : (
        ""
      )}
    </div>
  );
};
