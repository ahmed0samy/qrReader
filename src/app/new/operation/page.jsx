"use client";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useState } from "react";
import styles from "./operation.module.scss";
import { GetProductDetailsByCode, submitOperation } from "@/lib/action";
import Header from "./Header";

const data = [];
let results = [0];

export default function Home() {
  const [total, setTotal] = useState(0);

  const [audio] = useState(new Audio("/scanner-sound.mp3"));
  const playSound = useCallback(() => {
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, [audio]);
  function check(code) {
    const res = results[results.length - 1] != code;
    results.push(code);
    return res;
  }
  const [scanResult, setScanResult] = useState([
    // {
    //   name: "placeholder",
    //   code: "8888",
    //   count: 1,
    //   price: "0000",
    // },
  ]);
  function changeAmountof(code, newAmount) {
    function removeItemOnce(arr, value) {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }
  
    // Create a new array with updated values
    const updatedScanResult = scanResult.map(product => {
      if (product.code === code) {
        if (typeof newAmount === 'string') {
          if (newAmount[0] === '+') {
            product.count += parseFloat(newAmount.slice(1));
            console.log("Increased By One");
          } else if (newAmount[0] === '-') {
            product.count -= parseFloat(newAmount.slice(1));
            console.log("Decreased By One");
          } else {
            console.log("Added Input does not match requirements");
          }
        } else {
          product.count = newAmount;
        }
        
        if (product.count <= 0) {
          // Remove item if count is 0 or less
          results = removeItemOnce(results, product.code);
          return null;
        }
      }
      product.totalPrice = product.count * product.price
      return product;
    }).filter(item => item !== null); // Filter out null values
  
    return updatedScanResult;
  }
  const [state, setstate] = useState(false);
  useEffect(() => {
    if (window) {
      const code = window.sessionStorage.getItem("temp-code");
      if (code) {
        qrCodeSuccessCallback(code);
        results.push(code);
        window.sessionStorage.removeItem("temp-code");
      }
      const html5Qrcode = new Html5Qrcode("reader");
      async function qrCodeSuccessCallback(decodedText) {
        const codeNo = parseInt(decodedText);
        if (decodedText && codeNo == decodedText) {
          console.log(
            codeNo,
            "should not be equal to",
            results[results.length - 1]
          );
          if (check(codeNo)) {
            playSound();
            const productJSONDetails = await GetProductDetailsByCode(`${codeNo}`);

            if (productJSONDetails != "undefined") {
              const productDetails = JSON.parse(productJSONDetails);
              setTotal((old) => old + parseFloat(productDetails.price));
              setScanResult((e) => [
                {
                  name: productDetails.name,
                  price: productDetails.price,
                  code: codeNo,
                  count: 1,
                  totalPrice: productDetails.price
                },
                ...e,
              ]);
            } else {
              console.log(
                "element that has code of",
                codeNo,
                "does not exist in the database"
              );
              playSound();
            }
          }
          // html5Qrcode.stop();
        }
        // setstate(false);
      }
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
      document.addEventListener("click", (e) => {
        if (e.target == document.getElementById("toggleCameraBtn")) {
          if (html5Qrcode.isScanning) {
            html5Qrcode.stop();
            setstate(false);
          } else {
            html5Qrcode.start(...properties);
            setstate(true);
          }
        }
      });
      setstate(true);
    }
  }, []);
  let temptotal = 0
  scanResult.map((e) => temptotal += e.totalPrice)
  // scanResult.map((e) => temptotal += e.price * e.count)
  // setTotal(temptotal)
  return (
    <>
      <Header cameraStatus={state} />
      <div className={`container ${styles.container}`}>
        <div id="result" className={styles.gridContainer}>
          <div className={`${styles.row} ${styles.fixed} w-full bg-slate-100`}>
            <span>Product Name</span>
            <span>Product Price</span>
            <span>Product Amount</span>
            <span>Product Code</span>
          </div>

          {scanResult.map((e, i) => (
            <div className={`${styles.row} w-full bg-slate-100`} key={i}>
              <span>{e.name}</span>
              <span>{e.price}</span>
              <span className={styles.count}>
                <button
                  onClick={() => {
                    setScanResult(changeAmountof(e.code, "+1"));
                    console.log(scanResult)
                  }}
                >
                  +
                </button>
                <div id="count">
                  {e.count}
                </div>
                <button onClick={() => setScanResult(changeAmountof(e.code, "-1"))}>-</button>
              </span>
              <span>{e.code}</span>
            </div>
          ))}
          {total ? (
            <>
              <div className={`${styles.row} ${styles.total}`}>
                <span className={styles.spanfull}> Total: {temptotal} </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        {!total ? (
          <h1 className={styles.empty}>No Products Scanned Yet</h1>
        ) : (
          ""
        )}

        {total ? (
          <button
            className={styles.done}
            onClick={() => {
              submitOperation(scanResult).then(() => {
                window.location.assign('/')
              }).catch((err) => {
                console.log('error occured while saving to the database', err)
              })
              console.log(scanResult)
            }}
          >
            Done
          </button>
        ) : (
          ""
        )}
        <div className={styles.reader}>
          <h1 id="reader"> </h1>
        </div>
      </div>
    </>
  );
}
