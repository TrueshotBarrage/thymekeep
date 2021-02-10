import Profile from "../components/profile"
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'
import Navbar from '../components/navbar'


export default function Start() {
  return (
    <div>
      <Navbar />
      <div className={utilStyles.centered}>
        <Profile />
      </div>
    </div>
  )

}