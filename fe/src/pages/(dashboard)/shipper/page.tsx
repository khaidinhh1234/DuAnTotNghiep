import React, { useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const AllCameras = () => {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  const capturePhoto = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  const onUserMedia = (e: any) => {
    console.log(e);
  };

  return (
    <div className="relative mx-auto">
      {/* Giao diện camera */}
      {url ? null : (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            className="w-60 rounded-lg"
            audio={false}
          />
          <div className="absolute bottom-[-30px] inset-x-0 flex justify-center items-center">
            <button
              onClick={capturePhoto}
              className="px-5 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
            >
              <i className="fa-regular fa-camera"></i>
            </button>
          </div>
        </div>
      )}
      {url ? (
        <div>
          <img src={url} alt="Ảnh chụp" className="w-60 rounded-lg" />
        </div>
      ) : null}
      {url ? (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setUrl(null)}
            className="px-4 py-2 rounded-full text-2xl bg-white mx-2"
          >
            <i className="fa-regular fa-trash"></i>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AllCameras;
