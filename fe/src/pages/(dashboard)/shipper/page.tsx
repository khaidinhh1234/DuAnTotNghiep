import React, { useRef } from "react";
import Webcam from "react-webcam";

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
      // console.log(imageSrc);
    }
  }, [webcamRef]);

  const onUserMedia = (e: any) => {
    console.log(e);
  };
  console.log(url, "url");
  return (
    <div className="mx-auto">
      {" "}
      {url ? null : (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={onUserMedia}
          className="w-60"
          audio={false}
        />
      )}
      {url ? (
        <div>
          <img src={url} alt="Screenshot" className="w-60" />
        </div>
      ) : null}{" "}
      <div className="">
        {url ? null : (
          <button
            onClick={capturePhoto}
            className="px-3 py-2 rounded-full text-3xl bg-white mx-2 "
          >
            <i className="fa-regular fa-camera"></i>
          </button>
        )}

        {url ? (
          <button
            onClick={() => setUrl(null)}
            className="px-4 py-2 rounded-full text-2xl bg-white mx-2 "
          >
            <i className="fa-regular fa-trash"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AllCameras;
