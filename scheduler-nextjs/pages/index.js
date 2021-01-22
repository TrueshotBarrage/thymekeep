import Head from 'next/head'
import Schedule from '../components/schedule'
import utilStyles from '../styles/utils.module.css'

const name = "Dave"

export default function Home() {
  return (
    <div className={utilStyles.centered}>
      <h1>Schedule for {name}</h1>
      <Schedule />
    </div>
  )
}