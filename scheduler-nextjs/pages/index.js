import Head from 'next/head'
import Link from 'next/link'
import Schedule from '../components/schedule'
import utilStyles from '../styles/utils.module.css'
import Navbar from '../components/navbar'

const name = "Dave"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={utilStyles.centered}>
        <h1>Schedule for {name}</h1>
        <Schedule />
      </div>
    </>
  )
}