import React, { useState, useRef, useEffect } from "react";
import JSZip, { FileSaver } from "jszip";
import useDownloader from "react-use-downloader";
import "./styles.css";

export default function App() {
  const { download } = useDownloader();
  const [inputData, setInputData] = useState([""]);
  const [resultLink, setResultLink] = useState(null);
  const [resultLink1, setResultLink1] = useState(null);
  const [resultLink2, setResultLink2] = useState(null);
  const [resultLink3, setResultLink3] = useState(null);

  const [resultData1, setResultData1] = useState(null);
  const [resultData2, setResultData2] = useState(null);
  const [resultData3, setResultData3] = useState(null);

  console.log("resultLink", resultLink);
  console.log("resultLink1", resultLink1);

  /*   useEffect(() => {
    if (resultLink1 && resultLink2 && resultLink3) {
    }
  }, [resultLink1, resultLink2, resultLink3]); */
  const handleSave = () => {
    download(resultLink1, "1920x1080.mp4");
    download(resultLink2, "1080x1920.mp4");
    download(resultLink3, "1080x1080.mp4");
  };

  const handleInputChange = (e) => {
    if (!e.target.value) {
      setInputData([" "]);
    } else {
      setInputData(e.target.value.split(/\r?\n/));
    }
  };

  return (
    <div className="App">
      <h1 className="header">make _____ matter </h1>
      <p className="description"> past names below, one mane per line </p>
      <div className="displayElements">
        <textarea
          spellcheck="false"
          onChange={handleInputChange}
          className="input"
          id="w3review"
          name="w3review"
          rows="4"
          cols="50"
        />
        <Canvas names={inputData} setResultLink={setResultLink} />
      </div>

      <Canvas
        variant={1}
        isHidden
        names={inputData}
        setResultLink={setResultLink1}
      />
      <Canvas
        variant={2}
        isHidden
        names={inputData}
        setResultLink={setResultLink2}
        setResultData={setResultData1}
      />

      <Canvas
        variant={3}
        isHidden
        names={inputData}
        setResultLink={setResultLink3}
      />
      <button
        className={`${
          resultLink1 && resultLink2 && resultLink3 ? "button active" : "button"
        }`}
        onClick={handleSave}
      >
        {resultLink1 && resultLink2 && resultLink3 ? "Generate" : "Loading..."}
      </button>
      {/*  <button className="button active" onClick={handleSave}>
        "Generate"
      </button> */}
    </div>
  );
}

function Canvas({
  isHidden,
  names,
  variant = 0,
  setResultLink,
  setResultData,
}) {
  //initialize names

  const [wasRecordingBad, setWasRecordingBad] = useState(true);

  const canvas = useRef(null);
  const ctx = useRef(null);
  const videoStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef(null);

  const isNormalLaunch = useRef(false);

  const fontWeights = [90, 160, 130, 130];
  const fontWeight = fontWeights[variant];
  const gaps = [124, 194, 67, 113];
  const widths = [690, 1920, 1080, 1080];
  const heights = [390, 1080, 1920, 1080];

  let index = 0;
  const gap = gaps[variant];
  const width = widths[variant];
  const height = heights[variant];

  if (mediaRecorder.current) {
    mediaRecorder.current.onstop = function (e) {
      const blob = new Blob(chunks.current, { type: "video/mp4" });
      chunks.current = [];
      if (wasRecordingBad || names.length < 3) {
        setResultLink("");
      } else {
        // only 3 or more names will be rendered!
        setResultLink(URL.createObjectURL(blob));
        setResultData && setResultData(blob);
      }
    };
    mediaRecorder.current.ondataavailable = function (e) {
      chunks.current.push(e.data);
    };
  }

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      ctx.current.font = `700 ${fontWeight}px Bold, sans-serif`;
      ctx.current.textBaseline = "top";

      ctx.current.beginPath();
      ctx.current.rect(0, 0, width, height);
      ctx.current.fillStyle = "black";
      ctx.current.fill();

      ctx.current.fillStyle = "#FFFFFF";
      ctx.current.fillText("make", gap, (height - fontWeight * 3) / 2);
      ctx.current.fillText(
        "matter",
        gap,
        (height - fontWeight * 3) / 2 + fontWeight * 2
      );
      videoStream.current = canvas.current.captureStream(30);
      mediaRecorder.current = new MediaRecorder(videoStream.current);
      chunks.current = [];
    }
  }, []);

  useEffect(() => {
    function draw() {
      if (ctx?.current) {
        let name = names[index % names.length];
        //paint over old name
        ctx.current.beginPath();
        ctx.current.rect(
          gap - fontWeight / 10,
          (height - fontWeight * 3) / 2 + fontWeight,
          width - gap + fontWeight / 10,
          fontWeight
        );
        ctx.current.fillStyle = "black";
        ctx.current.fill();
        //paint new name
        ctx.current.fillStyle = "#FFFFFF";
        ctx.current.fillText(
          name,
          gap,
          (height - fontWeight * 3) / 2 + fontWeight
        );
        //iterate name counter
        index++;
      }
    }

    if (canvas.current) {
      if (mediaRecorder.current.state === "recording")
        mediaRecorder.current.stop();
      draw();
      mediaRecorder.current.start();

      setWasRecordingBad(true);

      const drawInterval = setInterval(draw, 1000);
      const captureInterval = setTimeout(function () {
        setWasRecordingBad(false);
      }, 3 * names.length * 1000);
      isNormalLaunch.current = true;

      return () => {
        clearInterval(drawInterval);
        clearInterval(captureInterval);
      };
    }
  }, [names]);

  useEffect(() => {
    console.log(
      "needed useeffect",
      wasRecordingBad,
      mediaRecorder.current.state
    );

    if (
      wasRecordingBad === false &&
      mediaRecorder.current.state === "recording"
    )
      mediaRecorder.current.stop();
  }, [wasRecordingBad]);

  return (
    <canvas
      className={isHidden && "isHidden"}
      ref={canvas}
      width={widths[variant]}
      height={heights[variant]}
    ></canvas>
  );
}
