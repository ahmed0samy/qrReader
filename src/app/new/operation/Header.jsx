import Link from "next/link";
import styles from "./header.module.scss";
export default function Header({cameraStatus}) {
  return (
    <>
      <header className={styles.header}>
        <section>
          <div className="container">
            <div className={styles.logo}>SystemCom</div>
            <nav>
              <span>
                <Link href={'/new/product'}>Register New Product</Link>
              </span>
              <span>
                <Link href={'/'}>Main Page</Link>
              </span>
              <span>
                <Link href={'/settings'}>Settings</Link>
              </span>
              <span>
                <Link href={'/products'}>Products</Link>
              </span>
              <span>
                <Link href={'/settings'}>Ahmed Samy</Link>
              </span>
            </nav>
          </div>
        </section>
        <div className="container">
            <span id="toggleCameraBtn">{cameraStatus ? "Stop Camera" : "Open Camera"}</span>
            <span>Products</span>
            <span>Account</span>
            <span>Settings</span>
            <span>Users</span>
        </div>
      </header>
    </>
  );
}
