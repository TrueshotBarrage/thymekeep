import Head from 'next/head'
import Link from 'next/link'
import Schedule from '../components/schedule'
import utilStyles from '../styles/utils.module.css'

const name = "Dave"

export default function Home() {
  return (
    <div className={utilStyles.centered}>
      <h2>
        <Link href="/openProfile">
          <a>Profile</a>
        </Link>
      </h2>
      <h1>Schedule for {name}</h1>
      <Schedule />
    </div>
  )
}