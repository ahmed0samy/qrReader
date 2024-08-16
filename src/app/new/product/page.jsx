'use client'
import { RegisterProduct } from "@/lib/action"
import styles from './newProduct.module.scss'
import { redirect } from "next/navigation"
export default function Page() {
  return (
    <>
      <div className="container">
    <div className={styles.form}>
      <label htmlFor="name">
        Product Name:
      </label>
        <input id="name" type="text" placeholder="Product Name"/>
      <label htmlFor="code">
        Product Code:
      </label>
        <input id="code" type="text" placeholder="Product Code"/>
      <label htmlFor="price">
        Product Price:
      </label>
        <input id="price" type="number" placeholder="Product Price"/>
      <label htmlFor="price">
        Product Amount in Stock:
      </label>
        <input id="amount" type="number" placeholder="Product Amount"/>
      <label htmlFor="img">
        Product Images:
      </label>
        <input id="img" type="image" placeholder="Product Image"/>
        <button onClick={() => {
          const name = document.getElementById('name').value
          const code = document.getElementById('code').value
          const price = document.getElementById('price').value
          const img = document.getElementById('img').value
          const amount = document.getElementById('amount').value
          if (name && code && price && amount){
            RegisterProduct({name, code, price, img, amount})
            window.location.assign('/')
          }
        }}>Save</button>
      </div>
    </div>
    </>
  )
}
