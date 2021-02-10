import { Component } from "react";
import Schedule from "../components/schedule"
import utilStyles from '../styles/utils.module.css'
import styles from "./profile.module.css"
import Tabs from '../components/tabs'
import Navbar from "./navbar"

const user = {
  userID: 123,
  name: "Justin Kang",
  email: "jk2375@cornell.edu",
  schedules: null,
}
class Events extends Component {

}

export default function Profile() {
  return (
    <>
      <div className={styles.centered}>
        <h1>Name: {user.name}</h1>
        <h1>Email: {user.email}</h1>
      </div>
      <Tabs />
    </>
  )
}