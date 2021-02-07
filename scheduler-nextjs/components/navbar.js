import { Component } from "react";
import Link from "next/link";
import styles from "./navbar.module.css"

class Navbar extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>Scheduler-JK</div>
        <div className={styles.navbar}>
          <Link href="/"><a>Home</a></Link>
          <Link href="../profilepage"><a>Profile</a></Link>
        </div>
      </div>
    );
  }
}

export default Navbar;