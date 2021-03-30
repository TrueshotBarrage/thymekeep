import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./activeLink.module.css";

const ActiveLink = ({ children, href }) => {
  const router = useRouter();
  let id = router.pathname === href ? styles.tabActive : styles.tab;
  return (
    <Link href={href}>
      <a className={id}>{children}</a>
    </Link>
  );
};

export default ActiveLink;
