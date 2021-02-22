import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "./layout.module.css";

const Layout = function ({ children }) {
  const [session, loading] = useSession();

  return (
    <p
      className={`nojs-show ${
        !session && loading ? styles.loading : styles.loaded
      }`}
    >
      {!session && (
        <>
          <span className={styles.notSignedInText}>You are not signed in</span>
          <a
            href={`/api/auth/signin`}
            className={styles.buttonPrimary}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign in
          </a>
        </>
      )}
      {session && (
        <>
          {session.user.image && (
            <span
              style={{ backgroundImage: `url(${session.user.image})` }}
              className={styles.avatar}
            />
          )}
          <span className={styles.signedInText}>
            <small>Signed in as</small>
            <br />
            <strong>{session.user.email || session.user.name}</strong>
          </span>
          <a
            href={`/api/auth/signout`}
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
        </>
      )}
      <header className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Scheduler-JK</Link>
        </div>

        <nav className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/profile/events">Profile</Link>
          <Link href="/login">Login</Link>
        </nav>
        <div className={styles.body}>
          <div>{children}</div>
        </div>
      </header>
    </p>
  );
};

export default Layout;
