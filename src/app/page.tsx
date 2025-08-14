import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AdminList from "./admin/admin-list/page";
import SignIn from "./signin/page";

export const metadata: Metadata = {
  title: "Lama Admin Panel",
  description: "This is LAMA Admin Panel",
};

export default function Home() {
  return (
    // <DefaultLayout>
    //   <h1>Hello! Admin</h1>
    // </DefaultLayout>
    <SignIn />
  );
}
