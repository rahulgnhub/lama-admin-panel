"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type AdRequest = {
  _id: string;
  title: string;
  summary: string;
  link: string;
  email: string;
  contact: number;
  telegram_id: number;
  username: string;
};

const AdminList = () => {
  const [admin, setAdmin] = useState<AdRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/adrequest`,
        // "http://localhost:8000/api/admin/adrequest",
      );
      const result = response?.data?.data;
      console.log("result", result);
      setAdmin(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <DefaultLayout>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Ad Requests
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Sr No.
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Telegram ID
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Username
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Title
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Summary
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Link
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Contact
                  </th>
                  <th className="px-6 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admin.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#eee] dark:border-strokedark"
                  >
                    <td className="px-6 py-4 text-black dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {item.telegram_id}
                    </td>
                    <Link
                      href={`t.me/${item.username}`}
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <td className="px-6 py-4 text-black dark:text-white">
                        {item.username}
                      </td>
                    </Link>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {item.summary}
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      <Link
                        href={item.link}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {item.contact}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/daily-tasks/ad-req-tasks/${item._id}`}>
                        <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-black p-2 text-xs text-white transition hover:bg-gray-800">
                          Add Task
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default AdminList;
