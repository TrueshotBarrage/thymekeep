import Link from "next/link";
import styles from "./layout.module.css"

const Layout = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.logo}><Link href="/">Scheduler-JK</Link></div>
    <div className={styles.navbar}>
      <Link href="/">Home</Link>
      {/* Clicking on the profile button load user onto profile page, defaulted
          to the events tab */}
      <Link href="/profile/events">Profile</Link>
      <Link href="/login">Login</Link>
    </div>
    <div className={styles.body}>
      <div>{children}</div>
    </div>
  </div >
)

export default Layout;