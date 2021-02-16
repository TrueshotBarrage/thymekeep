import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './profileLayout.module.css';


const user = {
  userID: 123,
  name: "Justin Kang",
  email: "jk2375@cornell.edu",
  schedules: null,
}

{/* ActiveLink allows for changing of tabs using router */ }
const ActiveLink = ({ children, href, className }) => {
  const router = useRouter();
  return (
    <Link href={href}>
      <a className={`${router.pathname === href
        ? styles.tabActive
        : styles.tab
        }`}
      >
        {children}
      </a>
    </Link>

  );
};

const ProfileLayout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.proPic}>img will be here</div>
      <div className={styles.body}>
        <h2>Name: {user.name}</h2>
        <h2>Email: {user.email}</h2>
      </div>

      <div className={styles.tabs}>
        <ActiveLink href="/profile/events">
          Events
        </ActiveLink>
        <ActiveLink href="/profile/calendar">
          Calendar
        </ActiveLink>
      </div>
      <div className={styles.tabInfo}>
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;