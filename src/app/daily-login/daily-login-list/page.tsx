"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Admin = {
  id: string;
  daily_login_name: string;
  daily_login_title: string;
  daily_login_reward: string;
};

const AdminList = () => {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null); // Admin ID to delete
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/dailylogin`,
      );
      const result = response?.data?.data;
      setAdmin(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (id: string) => {
    console.log("Selected Admin ID:", id);
    setSelectedAdminId(id); // Store the selected admin ID
    setIsModalOpen(true); // Show modal
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAdminId(null);
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
            Daily Login
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    ID
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Reward
                  </th>
                </tr>
              </thead>
              <tbody>
                {admin.map((admin, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {admin.id}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.daily_login_name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-5 dark:border-strokedark">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24" // Adjust size as needed
                          height="24" // Adjust size as needed
                          fill="none"
                          viewBox="0 0 430 430"
                          className="mr-2" // Adds spacing between the SVG and the text
                        >
                          <path
                            fill="#ffc738"
                            d="M375.12 215a160.222 160.222 0 0 1-273.513 113.393A160.23 160.23 0 0 1 66.895 153.74 160.22 160.22 0 0 1 215 54.88 159.34 159.34 0 0 1 375.12 215"
                          />
                          <path
                            fill="#ffc738"
                            d="M375.12 215a160.222 160.222 0 0 1-273.513 113.393A160.23 160.23 0 0 1 66.895 153.74 160.22 160.22 0 0 1 215 54.88 159.34 159.34 0 0 1 375.12 215"
                            opacity=".5"
                            style={{ mixBlendMode: "multiply" }}
                          />
                          <path
                            fill="#ffc738"
                            d="M353.45 295.48a160.76 160.76 0 0 1-75.51 66.8l-28.49-32.22L105 166.72l-28.47-32.2a160.76 160.76 0 0 1 75.51-66.8l28.49 32.22L325 263.28z"
                          />
                          <path
                            stroke="#b26836"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="7"
                            d="M299.912 299.916c46.898-46.898 46.898-122.934 0-169.832s-122.935-46.898-169.833 0-46.898 122.934 0 169.832c46.898 46.899 122.935 46.899 169.833 0"
                          />
                        </svg>
                        <p className="text-black dark:text-white">
                          {admin.daily_login_reward}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* 
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-black">Confirm Delete</h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to delete this admin? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-black hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={deleteAdmin}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
    </DefaultLayout>
  );
};

export default AdminList;
