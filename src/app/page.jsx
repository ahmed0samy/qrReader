"use client";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState(null);
  const [state, setstate] = useState(false);
  // useEffect(() => {
  //   const scanner = new Html5QrcodeScanner("reader", {
  //     qrbox: {
  //       width: 250,
  //       height: 250,
  //     },
  //     fps: 30,
  //     rememberLastUsedCamera: true,
  //     useBarCodeDetectorIfSupported: true,
  //   });
  //   scanner.render(
  //     (result) => {
  //       scanner.clear();
  //       setScanResult(result);
  //       console.log("done succesfully");
  //     },
  //     (err) => {
  //       console.log(er);
  //     }
  //   );
  // });
  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      if (decodedText) {
        document.getElementById("result").textContent = decodedText;
        html5Qrcode.stop();
      }
      setstate(false);
    };
    const properties = [
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 700, height: 700 }, aspectRatio: 1,},
      qrCodeSuccessCallback
    ];
    // console.log(html5Qrcode.getState())
    html5Qrcode.start(...properties);
    document.getElementById("btn").addEventListener("click", () => {
      if (html5Qrcode.isScanning) {
        html5Qrcode.stop();
        setstate(false);
      } else {
        html5Qrcode.start(...properties);
        setstate(true);
      }
    });
    setstate(true);
  }, []);
  return (
    <>
      <div className="container">
        <h1>{state ? "Camera is running" : "Camera is closed"}</h1>
        <div id="result"></div>
        {/* <div id="result">{scanResult? scanResult : 'No Data Here'}</div> */}
        <h1 id="reader"> </h1>
        <button id="btn">{state ? "Stop Scanning" : "Start Scanning"}</button>
      </div>
    </>
  );
}
