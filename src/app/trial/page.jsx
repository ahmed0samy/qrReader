"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Tesseract from "tesseract.js";
import styles from "./CameraOCR.module.scss";

export default function CameraOCR() {
  const [text, setText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [camera, setCamera] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");

    const startCamera = () => {
      html5Qrcode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          if (decodedText) {
            processImage(decodedText);
          }
        },
        (error) => {
          console.error("Error scanning QR code:", error);
        }
      ).then((camera) => {
        setCamera(camera);
        setIsScanning(true);
      }).catch((err) => {
        console.error("Unable to start camera:", err);
      });
    };

    const stopCamera = () => {
      if (camera) {
        camera.stop().then(() => {
          setIsScanning(false);
        }).catch((err) => {
          console.error("Error stopping camera:", err);
        });
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [camera]);

  const processImage = async (imageUrl) => {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageUrl,
        'eng',
        { logger: (info) => console.log(info) }
      );
      setText(text);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div id="reader" className={styles.reader}></div>
      <div className={styles.textContainer}>
        <h2>Detected Text:</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
