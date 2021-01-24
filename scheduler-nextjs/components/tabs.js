// imported with small edits from https://github.com/ugonnathelma/next-js-react-tabs-tutorial/blob/master/components/Tabs.js
import React from "react"
import Link from "next/link"
import { withRouter } from "next/router"
import { TabHead, TabContainer, TabBody, Tab } from "./styles"

const Tabs = ({ router }) => {
  const {
    query: { tab }
  } = router

  const isTabOne = tab === "1" || tab == null
  const isTabTwo = tab === "2"

  return (
    <TabContainer>
      <TabHead>
        <Tab>
          <Link href={{ pathname: "/openProfile", query: { tab: "1" } }}>
            <a>My Events</a>
          </Link>
        </Tab>
        <Tab>
          <Link href={{ pathname: "/openProfile", query: { tab: "2" } }}>
            <a>Calender</a>
          </Link>
        </Tab>
      </TabHead>
      <TabBody>
        {isTabOne && <>**list here of all events coming this following week**</>}
        {isTabTwo && <>**calender here that shows all events based on day, week,
        month**</>}
      </TabBody>
    </TabContainer>
  )
}

export default withRouter(Tabs)