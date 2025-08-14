"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  contact_no: string;
  telegram_id: string;
  is_premium: boolean;
  is_tonwallet_connected: boolean;
  tonwallet_address: string;
  tonwallet_connect_date: string;
  total_balance: number;
  last_active_date: string;
  referral_count: number;
  is_farming_booster_activated: boolean;
  farming_booster_start_datetime: Date;
  farming_booster_active_until: Date;
};

const UserList = () => {
  const [user, setUser] = useState<User[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/user`,
      );
      const result = response?.data?.data;
      // Filter out users with 0 referral_count and sort by referral_count in descending order
      const filteredAndSortedUsers = result
        .filter((user: User) => user.referral_count > 0)
        .sort((a: User, b: User) => b.referral_count - a.referral_count);
      setUser(filteredAndSortedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
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
            Top Referral Users
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Username
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Telegram ID
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Referral Count
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.map((user, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.first_name} {user.last_name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.username}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.telegram_id}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.referral_count}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <button
                        className="hover:text-primary"
                        onClick={() => openDetailsModal(user)}
                      >
                        <svg
                          width="16px"
                          height="16px"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-eye"
                        >
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-[90%] max-w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:w-[600px]">
            <h2 className="mb-4 text-lg font-semibold text-black">
              {selectedUser.first_name} {selectedUser.last_name}&apos;s Details
            </h2>
            <button
              onClick={closeDetailsModal}
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-black hover:text-red-500"
              aria-label="Close"
            >
              ✖
            </button>
            <table className="w-full border-collapse border border-gray-200 text-left">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Username:</td>
                  <td className="p-2">{selectedUser.username}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Email:</td>
                  <td className="p-2">{selectedUser.email}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Contact No:</td>
                  <td className="p-2">{selectedUser.contact_no}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Telegram ID:</td>
                  <td className="p-2">{selectedUser.telegram_id}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Is Premium:</td>
                  <td className="p-2">
                    {selectedUser.is_premium ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Ton Wallet Connected:</td>
                  <td className="p-2">
                    {selectedUser.is_tonwallet_connected ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Ton Wallet Address:</td>
                  <td className="p-2">{selectedUser.tonwallet_address}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">
                    Ton Wallet Connect Date:
                  </td>
                  <td className="p-2">{selectedUser.tonwallet_connect_date}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Total Balance:</td>
                  <td className="p-2">{selectedUser.total_balance}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2 font-semibold">Last Active Date:</td>
                  <td className="p-2">{selectedUser.last_active_date}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeDetailsModal}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default UserList;
