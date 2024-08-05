"use client";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [state, setstate] = useState(false);

  let html5Qrcode;
  useEffect(() => {
      html5Qrcode = new Html5Qrcode("reader");
      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText) {
          document.getElementById("result").textContent = decodedText;
        }
        html5Qrcode.stop();
        setstate(false);
      };
      html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 6, qrbox: { width: 500}, aspectRatio: 1,},
        qrCodeSuccessCallback
      );
      setstate(true);
  }, []);
  function stop() {
    html5Qrcode.stop();
  }
  return (
    <>
      <div className="container">
        <h1>{state ? "Camera is running" : "Camera is closed"}</h1>
        <div id="result"></div>
        {/* <div id="result">{scanResult? scanResult : 'No Data Here'}</div> */}
        <h1 id="reader"> </h1>
        <button onClick={stop}>stop</button>
      </div>
    </>
  );
}