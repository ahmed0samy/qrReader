'use client'
import { useEffect, useRef, useState } from 'react';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    let dataCaptureView = null;

    const loadScanditSDK = async () => {
      // Create script elements to load Scandit SDK
      const scriptCore = document.createElement('script');
      scriptCore.src = 'https://cdn.jsdelivr.net/npm/@scandit/web-datacapture-core@6.5.0/build/scandit-datacapture-core.min.js';
      scriptCore.async = true;
      document.body.appendChild(scriptCore);

      const scriptBarcode = document.createElement('script');
      scriptBarcode.src = 'https://cdn.jsdelivr.net/npm/@scandit/web-datacapture-barcode@6.5.0/build/scandit-datacapture-barcode.min.js';
      scriptBarcode.async = true;
      document.body.appendChild(scriptBarcode);

      // Wait for the SDK scripts to load
      await new Promise((resolve) => {
        scriptCore.onload = scriptBarcode.onload = resolve;
      });

      // Initialize Scandit SDK
      if (typeof window.Scandit !== 'undefined') {
        const { DataCaptureContext, Camera, CameraSettings, BarcodeCapture, BarcodeCaptureSettings, BarcodeCaptureOverlay, DataCaptureView } = window.Scandit;

        // Initialize Camera
        const camera = Camera.default;
        const cameraSettings = new CameraSettings();
        camera.applySettings(cameraSettings);
        await camera.switchToDesiredState('on');

        // Initialize Data Capture Context
        const context = new DataCaptureContext('YOUR_SCANDIT_LICENSE_KEY_HERE');

        // Create Barcode Capture Settings and Barcode Capture
        const barcodeCaptureSettings = new BarcodeCaptureSettings();
        const barcodeCaptureInstance = BarcodeCapture.forDataCaptureContext(context, barcodeCaptureSettings);

        // Add Barcode Capture Listener
        barcodeCaptureInstance.addListener('didScan', (event) => {
          setBarcode(event.data);
        });

        // Create Barcode Capture Overlay
        const overlayInstance = BarcodeCaptureOverlay.withBarcodeCaptureForDataCaptureContext(barcodeCaptureInstance, context);

        // Attach to the DOM
        if (videoRef.current) {
          dataCaptureView = DataCaptureView.forContext(context);
          videoRef.current.innerHTML = ''; // Clear any previous content
          videoRef.current.appendChild(dataCaptureView);
        }
      } else {
        console.error('Scandit SDK is not loaded.');
      }
    };

    loadScanditSDK();

    return () => {
      if (dataCaptureView) {
        // Cleanup the data capture view
        dataCaptureView.remove();
      }
    };
  }, []);

  return (
    <div>
      <h1>Scandit Barcode Scanner</h1>
      <div
        ref={videoRef}
        style={{ width: '100%', height: '400px', border: '1px solid black', position: 'relative' }}
      >
        {/* The Scandit camera view will be attached here */}
      </div>
      {barcode && (
        <div>
          <h2>Barcode Detected:</h2>
          <p>{barcode}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
