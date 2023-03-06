import React, { useState, useRef, useEffect } from "react";
import useDownloader from "react-use-downloader";
import { get1080x1080 } from "./api/1080x1080";
import { periods, repeats } from "./constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [data1, setData11] = useState(null);
  const [data2, setData12] = useState(null);
  const [data3, setData13] = useState(null);
  const [data4, setData14] = useState(null);
  const [data5, setData15] = useState(null);
  const [data6, setData16] = useState(null);

  useEffect(() => {
    if (
      data1?.url &&
      data2?.url &&
      data3?.url &&
      data4?.url &&
      data5?.url &&
      data6?.url
    ) {
      try {
        download(data1.url, data1.name);
        download(data2.url, data2.name);
        download(data3.url, data3.name);
        download(data4.url, data4.name);
        download(data5.url, data5.name);
        download(data6.url, data6.name);
        setData11({ name: "1080x1920.mp4", url: "" });
        setData12({ name: "1080x1920.mp4", url: "" });
        setData13({ name: "1080x1920.mp4", url: "" });
        setData14({ name: "1080x1920.mp4", url: "" });
        setData15({ name: "1080x1920.mp4", url: "" });
        setData16({ name: "1080x1920.mp4", url: "" });
        setIsLoading(false);
      } catch (error) {
        toast(
          `Downloading goes wrong, please contact your administrator. ${error}`,
          { type: "error", autoClose: false }
        );
      }
    }
  }, [data1, data2, data3, data4, data5, data6, download]);

  const download1 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "small",
        "mp4",
        period,
        repeatNumber
      );
      setData11({ name: "1080x1920.mp4", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const download2 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "medium",
        "mp4",
        period,
        repeatNumber
      );
      setData12({ name: "1080x1080.mp4", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const download3 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "large",
        "mp4",
        period,
        repeatNumber
      );
      setData13({ name: "1920x1080.mp4", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const download4 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "small",
        "gif",
        period,
        repeatNumber
      );
      setData14({ name: "1080x1920.gif", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const download5 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "medium",
        "gif",
        period,
        repeatNumber
      );
      setData15({ name: "1080x1080.gif", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const download6 = async () => {
    try {
      const url = await get1080x1080(
        inputData,
        "large",
        "gif",
        period,
        repeatNumber
      );
      setData16({ name: "1920x1080.gif", url: url });
    } catch (error) {
      setIsLoading(false);
      toast(
        `Something goes wrong, please contact your administrator. ${error}`,
        { type: "error", autoClose: false }
      );
    }
  };

  const fetchSquareVideo = async () => {
    setIsLoading(true);
    setData11(null);
    setData12(null);
    setData13(null);
    setData14(null);
    setData15(null);
    setData16(null);
    download1();
    download2();
    download3();
    download4();
    download5();
    download6();
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
      <ToastContainer />
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
          {periods.map((period, index) => (
            <option value={period} key={index}>
              repeat period: {period}s
            </option>
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
          {repeats.map((repeat, index) => (
            <option value={repeat} key={index}>
              repeat number: {repeat}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Canvas({ isHidden, names, variant = 0 }) {
  const canvas = useRef(null);
  const ctx = useRef(null);

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
  }, [fontWeight]);

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
      return () => {
        clearInterval(drawInterval);
      };
    }
  }, [fontWeight, gap, height, index, names, width]);

  return (
    <canvas
      className={isHidden && "isHidden"}
      ref={canvas}
      width={widths[variant]}
      height={heights[variant]}
    ></canvas>
  );
}
