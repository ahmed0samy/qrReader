'use client'
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeReader = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    const startBarcodeScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', true); // Required to play video in iOS
          videoRef.current.play();
        }

        // Continuously scan the video feed
        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result) {
            setBarcode(result.getText());
          }
        });
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startBarcodeScanner();

    return () => {
      codeReader.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>Fast Barcode Reader</h1>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      {barcode && (
        <div>
          <h2>Barcode Detected:</h2>
          <p>{barcode}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeReader;
