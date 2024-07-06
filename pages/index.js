import Schedule from "../components/schedule";
import Layout from "../components/layout";
import styles from "../styles/utils.module.css";
import { useSession } from "next-auth/react";
import React from "react";

export default function Index() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <>
      {!session && (
        <Layout>
          <div className={styles.mainBody}>
            <div className={styles.mainTitle}>Welcome to ThymeKeep!</div>
            <div className={styles.mainText}>
              Create a schedule to send to your group
            </div>
          </div>
        </Layout>
      )}
      {session && (
        <Layout>
          <Schedule />
        </Layout>
      )}
    </>
  );
}
