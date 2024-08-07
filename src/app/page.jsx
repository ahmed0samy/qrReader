"use client";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styles from './home.module.css'

export default function Home() {
    const router = useRouter();
    function redirectForNewOperation(code) {
      router.push({
        pathname: '/new/operation',
        query: {code}
      });
    }
  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      if (decodedText) {
        redirectForNewOperation(decodedText)
        html5Qrcode.stop();
      }
    };
    let properties;
    if (window.localStorage.scanningCamera){
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
    html5Qrcode.start(...properties);
  }, []);
  return (
    <>
      <div className="container">
        <h1 className={styles.reader} id="reader"></h1>
      </div>
    </>
  );
}
