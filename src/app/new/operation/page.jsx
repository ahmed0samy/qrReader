"use client";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [scanResult, setScanResult] = useState([]);
  const [state, setstate] = useState(false);
  const router = useRouter();
  let code;
  if (router.query){
    ({ code } = router.query);
  } else {
    code = 'You are not redirected'
  }

  useEffect(() => {
    if (window){
      const html5Qrcode = new Html5Qrcode("reader");
      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText) {
          // document.getElementById("result").textContent = decodedText;
          setScanResult((e) => [...e, decodedText])
          html5Qrcode.stop();
        }
        setstate(false);
      };
      let properties;
      if (window.localStorage.scanningCamera) {
        properties = [
          window.localStorage.scanningCamera,
          { fps: 10, qrbox: { width: 700, height: 700 }, aspectRatio: 1,},
          qrCodeSuccessCallback
        ];
      } else {
        properties = [
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 700, height: 700 }, aspectRatio: 1,},
          qrCodeSuccessCallback
        ];
      }
      // console.log(html5Qrcode.getState())
      console.log(properties)
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
    }
  }, []);
  return (
    <>
      <div className="container">
        <div>code is {code}</div>
        <h1>{state ? "Camera is running" : "Camera is closed"}</h1>
        <div id="result">{scanResult.map((e, i) => <p key={i}> {e} </p>)}</div>
        {/* <div id="result">{scanResult? scanResult : 'No Data Here'}</div> */}
        <h1 id="reader"> </h1>
        <button id="btn">{state ? "Stop Scanning" : "Start Scanning"}</button>
      </div>
    </>
  );
}
