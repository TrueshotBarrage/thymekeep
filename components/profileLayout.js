import styles from "./profileLayout.module.css";
import ActiveLink from "./activeLink";
import { useSession } from "next-auth/client";

const ProfileLayout = ({ children }) => {
  const [session, loading] = useSession();

  return (
    <div className={styles.container}>
      {session && (
        <>
          <div className={styles.proPic}>
            {session.user.image && (
              <img src={session.user.image} alt="profile" />
            )}
            {!session.user.image && <img src="/default.png" alt="profile" />}
          </div>
          <div className={styles.body}>
            <h2>Name: {session.user.name}</h2>
            <h2>Email: {session.user.email}</h2>
          </div>

          <div className={styles.tabs}>
            <ActiveLink href="/profile/events">Events</ActiveLink>
            <ActiveLink href="/profile/calendar">Calendar</ActiveLink>
          </div>
          <div className={styles.tabInfo}>{children}</div>
        </>
      )}
      {!session && <p>Please login first.</p>}
    </div>
  );
};

export default ProfileLayout;
