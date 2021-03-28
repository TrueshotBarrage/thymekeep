import { useRouter } from "next/router";
import styles from "./profileLayout.module.css";
import ActiveLink from "./activeLink";
import { useSession } from "next-auth/client";

const ProfileLayout = ({ children }) => {
  const [session, loading] = useSession();
  const profile = session.user.image;

  return (
    <div className={styles.container}>
      <div className={styles.proPic}>
        <img src={profile} alt="profile" />
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
    </div>
  );
};

export default ProfileLayout;
