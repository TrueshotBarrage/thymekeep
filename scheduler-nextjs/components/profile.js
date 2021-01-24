import { Component } from "react";
import Schedule from "../components/schedule"
import utilStyles from '../styles/utils.module.css'
import Tabs from '../components/tabs'

const name = "Justin Kang"

class Events extends Component {

}

export default function Profile() {
  return (
    <div className={utilStyles.heading2X1}>
      <h1>{name}</h1>
      <Tabs />
      <h4>test</h4>
    </div>
  )
}