import Layout from "../../components/layout";
import ProfileLayout from "../../components/profileLayout";
import Event from "../../components/event";

const Index = () => (
  <Layout>
    <ProfileLayout>
      <p>This week's events:</p>
      <Event />
    </ProfileLayout>
  </Layout>
);

export default Index;
