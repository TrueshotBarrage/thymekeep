import React from "react";
import Link from "next/link";
import styles from "./layout.module.css";
import ActiveLink from "./activeLink";
import { useSession, signIn, signOut } from "next-auth/client";

const Layout = ({ children, className }) => {
  const [session, loading] = useSession();

  return (
    <div className={!session && loading ? styles.loading : styles.loaded}>
      {session && (
        <>
          <header className={styles.container}>
            <div className={styles.logo}>
              <Link href="/">ThymeKeep</Link>
            </div>
            <nav className={styles.navbar}>
              <ActiveLink href="/">Home</ActiveLink>
              <ActiveLink href="/profile/events">Profile</ActiveLink>
              <button onClick={() => signOut()}>Log Out</button>
            </nav>
          </header>
          <div className={styles.body}>
            <>{children}</>
          </div>
        </>
      )}
      {!session && (
        <>
          <header className={styles.container}>
            <div className={styles.logo}>
              <Link href="/">ThymeKeep</Link>
            </div>
            <nav className={styles.navbar}>
              <button onClick={signIn}>Login</button>
            </nav>
          </header>
          <div className={styles.body}>
            <>{children}</>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
