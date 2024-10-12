import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const AllCameras = () => {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  const capturePhoto = React.useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUrl(imageSrc);
      console.log(imageSrc);
    }
  }, [webcamRef]);

  const onUserMedia = (e) => {
    console.log(e);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={true}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
        className="w-60"
      />
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={() => setUrl(null)}>Refresh</button>
      {url && (
        <div>
          <img src={url} alt="Screenshot" className="w-60" />
        </div>
      )}
    </>
  );
};

export default AllCameras;
