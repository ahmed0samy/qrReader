"use client";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import styles from "./home.module.css";

export default function Home() {
  function redirectForNewOperation(code) {
    if (window) {
      window.sessionStorage.setItem("temp-code", code);
      window.location.replace("/new/operation");
    }
  }

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      if (decodedText) {
        redirectForNewOperation(decodedText);
        html5Qrcode.stop();
      }
    };
    if (window) {
      let properties;
      if (window.localStorage.scanningCamera) {
        properties = [
          window.localStorage.scanningCamera,
          {
            fps: 10,
            qrbox: {
              width: window.innerWidth / 2,
              height: window.innerWidth / 4,
            },
            aspectRatio: 2,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.AZTEC,
              Html5QrcodeSupportedFormats.CODABAR,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.CODE_93,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.DATA_MATRIX,
              Html5QrcodeSupportedFormats.MAXICODE,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.ITF,
              Html5QrcodeSupportedFormats.PDF_417,
              Html5QrcodeSupportedFormats.RSS_14,
              Html5QrcodeSupportedFormats.RSS_EXPANDED,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
            ],
          },
          qrCodeSuccessCallback,
        ];
      } else {
        properties = [
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: window.innerWidth / 2,
              height: window.innerWidth / 4,
            },
            aspectRatio: 2,
           
          },
          qrCodeSuccessCallback,
        ];
      }
      html5Qrcode.start(...properties);
    }
  }, []);
  return (
    <>
      <div className="container">
        <div>
          <h1 className={styles.reader} id="reader"></h1>
        </div>
      </div>
    </>
  );
}
