import Link from "next/link";
import Layout from "../../components/layout";
import ProfileLayout from "../../components/profileLayout";
import Calendar from "../../components/calendar";

const Index = () => (
  <Layout>
    <ProfileLayout>
      <p>List of your calendars:</p>
      <Calendar />
    </ProfileLayout>
  </Layout>
);

export default Index;
