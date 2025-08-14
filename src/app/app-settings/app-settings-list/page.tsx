"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import toast from "react-hot-toast";
import { Address } from "@ton/core";
import Swal from "sweetalert2";

type Admin = {
  _id: string;
  app_name: string;
  app_summary: string;
  app_description: string;
  signup_reward: string;
  farming_time_in_hour: string;
  farming_time_reward: string;
  ton_wallet_connect_reward: string;
  referral_reward: string;
  admin_wallet: string;
};

const AdminList = () => {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/appsettings`,
      );
      const result = response?.data?.data;
      setAdmin(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWalletAddress = useCallback(
    async (address: string) => {
      if (!admin.length) return;

      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BaseUrl}/admin/appsettings/update/${admin[0]._id}`,
          {
            admin_wallet: address,
          },
        );
        await getData(); // Refresh admin data after update
        toast.success("Wallet updated successfully! 🎉");
      } catch (error) {
        console.error("Error updating wallet address:", error);
        toast.error("Failed to update wallet address.");
      }
    },
    [admin],
  );

  // Effect to handle address updates when wallet is connected
  useEffect(() => {
    if (tonConnectUI.connected && userFriendlyAddress) {
      updateWalletAddress(userFriendlyAddress);
    }
  }, [userFriendlyAddress, tonConnectUI.connected, updateWalletAddress]);

  useEffect(() => {
    getData();
  }, []);

  const handleChangeWallet = async () => {
    try {
      // If a wallet is already connected, disconnect it first
      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect();
      }
      // Open the wallet connection modal
      await tonConnectUI.openModal();
    } catch (error) {
      console.error("Error with wallet action:", error);
      toast.error("Failed to open wallet connection");
    }
  };
  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
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
            App Info
          </h4>
          <div className="max-w-full overflow-x-auto">
            {admin.map((admin, key) => (
              <div
                key={key}
                className="mb-6 border-b border-[#eee] pb-4 dark:border-strokedark"
              >
                <table className="w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        App Name
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
                        {admin.app_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        App Summary
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
                        {admin.app_summary}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        App Description
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
                        {admin.app_description}
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        SignUp Reward
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
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
                          {admin.signup_reward}{" "}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        Admin Wallet
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-mono break-all">
                              {admin?.admin_wallet || "No wallet address set"}
                            </p>
                          </div>
                          <button
                            onClick={handleChangeWallet}
                            className="ml-4 rounded bg-blue-500 px-3 py-2 font-bold text-white transition-colors hover:bg-blue-700"
                          >
                            Change Wallet
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        Farming Time
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
                        {admin.farming_time_in_hour} Hrs
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        Farming Reward
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
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
                          {admin.farming_time_reward}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        Wallet Connect Reward
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
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
                          {admin.ton_wallet_connect_reward}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 px-4 py-2 font-medium text-black dark:text-white">
                        Referral Reward
                      </td>
                      <td className="w-2/3 px-4 py-2 text-black dark:text-white">
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
                          {admin.referral_reward}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default AdminList;
