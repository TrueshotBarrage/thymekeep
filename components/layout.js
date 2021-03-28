import React from "react";
import Link from "next/link";
import styles from "./layout.module.css";
import ActiveLink from "./activeLink";
import { useSession, signIn, signOut } from "next-auth/client";

const Layout = ({ children, className }) => {
  const [session, loading] = useSession();

  if (session) {
    return (
      <header className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">ThymeKeep</Link>
        </div>
        <nav className={styles.navbar}>
          <ActiveLink href="/">Home</ActiveLink>
          {/* Clicking on the profile button load user onto profile page, defaulted
          to the events tab */}
          <ActiveLink href="/profile/events">Profile</ActiveLink>
          <button onClick={() => signOut()}>Log Out</button>
        </nav>
        <div className={styles.body}>
          <div>{children}</div>
        </div>
      </header>
    );
  }
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">ThymeKeep</Link>
      </div>
      <nav className={styles.navbar}>
        <button onClick={signIn}>Login</button>
      </nav>
      <div className={styles.body}>
        <div>{children}</div>
      </div>
    </header>
  );
};

export default Layout;
