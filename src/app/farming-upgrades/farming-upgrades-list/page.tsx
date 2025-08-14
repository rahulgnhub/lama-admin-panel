"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Admin = {
  _id: string;
  upgrade_title: string;
  upgrade_summary: string;
  upgrade_image: string;
  upgrade_boost: string;
  upgrade_duration_in_days: string;
  upgrade_amount_in_token: string;
  upgrade_amount_in_ton: string;
};

const AdminList = () => {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null); // Admin ID to delete
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/farmingupgrades`,
      );
      const result = response?.data?.data;
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
            Farming Upgrades
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className=" px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Title
                  </th>
                  <th className=" px-4 py-4 font-medium text-black dark:text-white">
                    Summary
                  </th>
                  <th className=" px-4 py-4 font-medium text-black dark:text-white">
                    Image
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Boost
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Duration in Days
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Cost
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admin.map((admin, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {admin.upgrade_title}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.upgrade_summary}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.upgrade_image ? (
                          <Image
                            src={admin.upgrade_image}
                            alt="Upgrade"
                            className="h-16 w-16 rounded object-cover"
                            height={50}
                            width={50}
                          />
                        ) : (
                          <p>No Image Available</p>
                        )}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 pl-8 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.upgrade_boost}x
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 pl-18 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.upgrade_duration_in_days}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {parseFloat(admin.upgrade_amount_in_token) !== 0 ? (
                          <span className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 430 430"
                              className="ml-1"
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
                            {admin.upgrade_amount_in_token}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 56 56"
                              width="20"
                              height="20"
                              className="ml-1"
                            >
                              <style>
                                {`.st0 { fill: #0098EA; }
            .st1 { fill: #FFFFFF; }`}
                              </style>
                              <path
                                className="st0"
                                d="M28,56c15.5,0,28-12.5,28-28S43.5,0,28,0S0,12.5,0,28S12.5,56,28,56z"
                              />
                              <path
                                className="st1"
                                d="M37.6,15.6H18.4c-3.5,0-5.7,3.8-4,6.9l11.8,20.5c0.8,1.3,2.7,1.3,3.5,0l11.8-20.5
            C43.3,19.4,41.1,15.6,37.6,15.6L37.6,15.6z M26.3,36.8l-2.6-5l-6.2-11.1c-0.4-0.7,0.1-1.6,1-1.6h7.8L26.3,36.8L26.3,36.8z
            M38.5,20.7l-6.2,11.1l-2.6,5V19.1h7.8C38.4,19.1,38.9,20,38.5,20.7z"
                              />
                            </svg>
                            {admin.upgrade_amount_in_ton}
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <Link href={`/farming-upgrades/${admin._id}`}>
                        <button className="hover:text-primary">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8.071 21.586l-7.071 1.414 1.414-7.071 14.929-14.929 5.657 5.657-14.929 14.929zm-.493-.921l-4.243-4.243-1.06 5.303 5.303-1.06zm9.765-18.251l-13.3 13.301 4.242 4.242 13.301-13.3-4.243-4.243z" />
                          </svg>
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
