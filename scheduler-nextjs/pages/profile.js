import Profile from "../components/profile"
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'


export default function Start() {
  return (
    <div className={utilStyles.centered}>
      <h2>
        <Link href="/">
          <a>Home</a>
        </Link>
      </h2>
      <Profile />
    </div>
  )

}