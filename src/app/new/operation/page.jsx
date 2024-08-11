"use client";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import styles from "./operation.module.scss";
const data = [];
export default function Home() {
  const [scanResult, setScanResult] = useState([
    {
      name: "Bivatracin 150 ml",
      price: 150,
      code: "6224000588007",
      count: "1",
    },
    {
      name: "Bivatracin 150 ml Bivatracin 150 ml Bivatracin 150 ml",
      price: 150,
      code: "6224000588007",
      count: "1",
    },
    {
      name: "Bivatracin 150 ml",
      price: 150,
      code: "6224000588007",
      count: "1",
    },
    {
      name: "Bivatracin 150 ml",
      price: 150,
      code: "6224000588007",
      count: "1",
    },
  ]);
  let results = [];
  const [state, setstate] = useState(false);
  const code = window.sessionStorage.getItem("temp-code");
  useEffect(() => {
    if (window) {
      if (code) {
        setScanResult((prev) => [...prev, {code, name: 'placeholder', count: 0,}]);
        results.push(code);
        window.sessionStorage.removeItem("temp-code");
      }
      const html5Qrcode = new Html5Qrcode("reader");
      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText) {
          console.log(
            decodedText,
            "should not be equal to",
            results[results.length - 1]
          );
          if (decodedText != results[results.length - 1]) {
            
            setScanResult((e) => [{name: 'placeholder', price: '00', code: decodedText, count: 1}, ...e]);
            results.push(decodedText);
          }
          // html5Qrcode.stop();
        }
        setstate(false);
      };
      let properties;
      if (window.localStorage.scanningCamera) {
        properties = [
          window.localStorage.scanningCamera,
          { fps: 10, qrbox: { width: 300, height: 150 }, aspectRatio: 2 },
          qrCodeSuccessCallback,
        ];
      } else {
        properties = [
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 150 }, aspectRatio: 2 },
          qrCodeSuccessCallback,
        ];
      }
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
      <div className={`container ${styles.container}`}>
        <h1>{state ? "Camera is running" : "Camera is closed"}</h1>
        <div id="result">
          {scanResult.map((e, i) => (
            <div className={`${styles.row} w-full bg-slate-100`} key={i}>
              <span>{e.name}</span>
              <span>{e.price}</span>
              <span>{e.count}</span>
              <span>{e.code}</span>
            </div>
          ))}
        </div>
        <div className={styles.reader}>
          <h1 id="reader"> </h1>
        </div>
        <button id="btn">{state ? "Stop Scanning" : "Start Scanning"}</button>

        <br />
        <button
          onClick={() => {
            window.location.assign("/");
          }}
        >
          Done
        </button>
      </div>
    </>
  );
}
