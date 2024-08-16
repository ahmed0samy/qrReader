"use client";
import styles from './settings.module.scss'
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Settings(params) {
  const [cameras, setCameras] = useState([]);
  // const [savedCam, setSavedCam] = useState(undefined)
  // let savedCam
  let savedCam;
  if (typeof document != "undefined") {
    savedCam = window.localStorage.scanningCamera;
  }
  useEffect(() => {
    if (window) {
      const html5Qrcode = new Html5Qrcode("reader");
      html5Qrcode.start(
        savedCam,
        {
          fps: 10,
          qrbox: {
            width: window.innerWidth / 2,
            height: window.innerWidth / 4,
          },
          aspectRatio: 2,
        },
        () => {
          console.log("Done");
        }
      );
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
  }, [savedCam]);

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
      Available Cameras:
      <ul>
        {cameras.map((e, i) => {
          return (
            <li key={i} className={e.id == savedCam ? "active" : ""}>
              {e.label}
            </li>
          );
        })}
      </ul>
      <div id="reader" className={styles.reader}></div>
    </>
  );
}
