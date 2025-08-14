"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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

type Transaction = {
  id: number;
  _id: string;
  telegram_id: number;
  title: string;
  reward: number;
  is_credit: number;
  mode: string;
  added_date: string;
};

const UserList = () => {
  const [user, setUser] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/user`,
      );
      const result = response?.data?.data;
      console.log("referral", result?.referral_count);
      setUser(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const deleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/user/delete/${selectedUserId}`,
      );
      setUser((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUserId),
      );
      closeModal();
      Swal.fire({
        text: "User Deleted Successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
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

  const openTransactionModal = async (telegramId: string, page = 1) => {
    try {
      setLoadingUserId(telegramId); // Set loading for the specific user
      setSelectedUserId(telegramId);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/user/userlog/${telegramId}?page=${page}`,
      );
      const { docs, totalPages, hasNextPage, hasPrevPage } = response.data.data;
      console.log("Transaction data:", docs);

      setTransactions(docs);
      setCurrentPage(page); // Update the current page
      setTotalPages(totalPages); // Update total pages from response
      setHasNextPage(hasNextPage); // Update next page availability
      setHasPrevPage(hasPrevPage); // Update previous page availability
      setIsTransactionModalOpen(true);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingUserId(null); // Clear loading state
    }
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setTransactions([]);
  };

  // Navigate to the next page of transactions
  const goToNextPage = () => {
    if (hasNextPage && selectedUserId) {
      openTransactionModal(selectedUserId, currentPage + 1); // Ensure selectedUserId is passed here
    }
  };

  // Navigate to the previous page of transactions
  const goToPreviousPage = () => {
    if (hasPrevPage && selectedUserId) {
      openTransactionModal(selectedUserId, currentPage - 1); // Ensure selectedUserId is passed here
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    });
  };

  return (
    <DefaultLayout>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            User List
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
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Telegram ID
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Balance
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Ton Wallet Connected
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Booster Activated
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Referral Count
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white ">
                    Last Active Date
                  </th>
                  <th className="px-4 py-4 pl-14 font-medium text-black dark:text-white">
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
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24" // Adjust size as needed
                          height="24" // Adjust size as needed
                          fill="none"
                          viewBox="0 0 430 430"
                          className="mr-1" // Adds spacing between the SVG and the text
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
                          {user.total_balance}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.is_tonwallet_connected ? "Yes" : "No"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p
                        className="text-black dark:text-white"
                        title={
                          user.is_farming_booster_activated
                            ? `Start: ${formatDate(user.farming_booster_start_datetime)} | End: ${formatDate(user.farming_booster_active_until)}`
                            : ""
                        }
                      >
                        {user.is_farming_booster_activated ? "Yes" : "No"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.referral_count}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {user.last_active_date}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
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
                        <button
                          className="hover:text-primary"
                          onClick={() => openModal(user._id)}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-2 text-center text-sm text-white hover:bg-opacity-90 lg:px-4 xl:px-3"
                          onClick={() => openTransactionModal(user.telegram_id)}
                          disabled={loadingUserId === user.telegram_id} // Disable button only for the loading user
                          style={{ width: "100px" }} // Ensure consistent width
                        >
                          {loadingUserId === user.telegram_id ? (
                            <span className="flex w-full items-center justify-center">
                              <span className="animate-pulse">•</span>
                              <span className="mx-1 animate-pulse">•</span>
                              <span className="animate-pulse">•</span>
                            </span>
                          ) : (
                            "Transactions"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                onClick={deleteUser}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-[1000] flex w-full items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-[90%] max-w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:w-[600px]">
            <button
              onClick={closeTransactionModal}
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-black hover:text-red-500"
              aria-label="Close"
            >
              ✖
            </button>

            <h2 className="mb-4 text-lg font-semibold text-black">
              Transactions
            </h2>

            <table className="w-full border-collapse border border-gray-200 text-left">
              <thead>
                <tr>
                  <th className="border-b p-2">Title</th>
                  <th className="border-b p-2">Amount</th>
                  <th className="border-b p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">{transaction.title}</td>
                    <td
                      className={`flex border-b p-2 ${
                        transaction.is_credit === 1
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.mode === "booster" ? (
                        <Image
                          src="/images/ton-logo.svg"
                          alt="ton"
                          width={19}
                          height={19}
                          className="mr-1"
                        />
                      ) : (
                        <Image
                          src="/images/coin.svg"
                          alt="ton"
                          width={20}
                          height={20}
                          className="mr-1"
                        />
                      )}
                      {transaction.is_credit === 1 ? "+" : "-"}
                      {transaction.reward}
                    </td>
                    <td className="border-b p-2">
                      {new Date(transaction.added_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={goToPreviousPage}
                disabled={!hasPrevPage}
                className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={!hasNextPage}
                className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default UserList;
