import React, { useState, useRef, useEffect } from "react";
import useDownloader from "react-use-downloader";
import { get1080x1080 } from "./api/1080x1080";
import { periods, repeats } from "./constants";
import "./styles.css";

export default function App() {
  const { download } = useDownloader();
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState([""]);

  const [period, setPeriod] = useState(1);

  const [repeatNumber, setRepeatNumber] = useState(2);

  const handlePeriodChange = ({ target: { value } }) => {
    setPeriod(value);
  };

  const handleRepeatNumberChange = ({ target: { value } }) => {
    setRepeatNumber(value);
  };

  const mp4Indexes = [
    "1080x1920.mp4",
    "1080x1080.mp4",
    "1920x1080.mp4",
    "1080x1920.gif",
    "1080x1080.gif",
    "1920x1080.gif"
  ];

  const fetchSquareVideo = async () => {
    setIsLoading(true);
    /*     const url = await get1080x1080(inputData);
    download(url, "1920x1080.gif"); */
    Promise.all([
      await get1080x1080(inputData, "small", "mp4", period, repeatNumber)
      /*       await get1080x1080(inputData, "medium", "mp4"),
      await get1080x1080(inputData, "large", "mp4"),
      await get1080x1080(inputData, "small", "gif"),
      await get1080x1080(inputData, "medium", "gif"),
      await get1080x1080(inputData, "large", "gif") */
    ]).then((values) => {
      values.forEach((value, index) => {
        console.log("result in promice", value);

        download(value, mp4Indexes[index]);
      });
      setIsLoading(false);
    });
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
      {isLoading && (
        <div className="preloaderContainer">
          <div class="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <h1 className="header">make _____ matter </h1>
      <p className="description"> paste names below, one name per line </p>
      <div className="displayElements">
        <textarea
          spellCheck="false"
          onChange={handleInputChange}
          className="input"
          id="w3review"
          name="w3review"
          rows="4"
          cols="50"
        />
        <Canvas names={inputData} />
      </div>
      <div className="controlls">
        <select
          name="periods"
          id="periods"
          className="button active"
          value={period}
          onChange={handlePeriodChange}
        >
          {periods.map((period) => (
            <option value={period}>repeat period: {period}s</option>
          ))}
        </select>
        <button
          className={`${
            inputData.length < 3
              ? "button"
              : isLoading
              ? "button"
              : "button active"
          }`}
          onClick={fetchSquareVideo}
        >
          {inputData.length < 3
            ? "type at least 3 names"
            : isLoading
            ? "loading"
            : "Generate"}
        </button>
        <select
          name="repeats"
          id="repeats"
          className="button active"
          value={repeatNumber}
          onChange={handleRepeatNumberChange}
        >
          {repeats.map((repeat) => (
            <option value={repeat}>repeat number: {repeat}x</option>
          ))}
        </select>
      </div>

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
  setResultData
}) {
  //initialize names

  const [wasRecordingBad, setWasRecordingBad] = useState(true);

  const canvas = useRef(null);
  const ctx = useRef(null);
  const videoStream = useRef(null);
  const chunks = useRef(null);

  const isNormalLaunch = useRef(false);

  const fontWeights = [70, 160, 130, 130];
  const fontWeight = fontWeights[variant];
  const gaps = [124, 194, 67, 113];
  const widths = [690, 1920, 1080, 1080];
  const heights = [390, 1080, 1920, 1080];

  let index = 0;
  const gap = gaps[variant];
  const width = widths[variant];
  const height = heights[variant];

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current.getContext("2d");
      ctx.current.font = `700 ${fontWeight}px Bold, sans-serif`;
      ctx.current.textBaseline = "top";
    }
  }, []);

  useEffect(() => {
    function draw() {
      if (ctx?.current) {
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

  return (
    <canvas
      className={isHidden && "isHidden"}
      ref={canvas}
      width={widths[variant]}
      height={heights[variant]}
    ></canvas>
  );
}
