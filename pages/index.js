import Schedule from '../components/schedule'
import utilStyles from '../styles/utils.module.css'
import Layout from '../components/layout'

const name = "Dave"

const Index = () => (
  <Layout>
    <div className={utilStyles.centered}>
      <h1>Schedule for {name}</h1>
      <Schedule />
    </div>
  </Layout>
)

export default Index