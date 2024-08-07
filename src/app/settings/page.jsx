"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Settings(params) {
  const [cameras, setCameras] = useState([]);
  const [savedCam, setSavedCam] = useState(undefined)
  useEffect(() => {
    if (window) {
      setSavedCam(window.localStorage.scanningCamera)
      const html5Qrcode = new Html5Qrcode("reader");
      Html5Qrcode.getCameras()
        .then((cameras) => {
          if (cameras && cameras.length) {
            console.log(cameras);
            setCameras(cameras);
          }
        })
        .catch((err) => {
          console.log(`Error in getting cameras: ${err}`);
        });
    }
  }, []);

  if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
      cameras.forEach((camera) => {
        if (camera.label == e.target.innerText) {
          console.log(camera.id);
          window.localStorage.setItem("scanningCamera", camera.id);
          window.location.reload();
        }
      });
    });
  }
  return (
    <>
      <div id="reader" className="none"></div>
      <ul>
        {cameras.map((e, i) => {
          return <li key={i} className={e.id == savedCam? 'active': ''}>
            {e.label}
          </li>;
        })}
      </ul>
    </>
  );
}
