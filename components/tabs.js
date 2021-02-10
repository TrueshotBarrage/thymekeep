// imported with small edits from https://github.com/ugonnathelma/next-js-react-tabs-tutorial/blob/master/components/Tabs.js
import React from "react"
import Link from "next/link"
import { withRouter } from "next/router"
import styles from "./tabs.module.css"

const Tabs = ({ router }) => {
  const {
    query: { tab }
  } = router

  const isTabOne = tab === "1" || tab == null
  const isTabTwo = tab === "2"

  return (
    <div className={styles.TabContainer}>
      <div className={styles.TabHead}>
        <div className={styles.Tab} selected={isTabOne}>
          <Link href={{ pathname: "/profilepage", query: { tab: "1" } }}>
            <a>My Events</a>
          </Link>
        </div>
        <div className={styles.Tab} selected={isTabTwo}>
          <Link href={{ pathname: "/profilepage", query: { tab: "2" } }}>
            <a>Calendar</a>
          </Link>
        </div>
      </div>
      <div className={styles.TabBody}>
        {isTabOne && <>**list here of all events coming this following week**</>}
        {isTabTwo && <>**calender here that shows all events based on day, week,
        month**</>}
      </div>
    </div>
  )
}

export default withRouter(Tabs)