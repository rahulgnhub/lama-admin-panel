"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Stake = {
  id: number;
  stake_duration: number;
  stake_return: number;
  stake_fee: number;
  stake_title: string;
};

function Stake() {
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/stake`,
      );
      console.log("response", response);
      const result = response?.data?.data;
      setStakes(result);
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
            Stakes
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Title
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Duration
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Return
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Fees
                  </th>
                </tr>
              </thead>
              <tbody>
                {stakes.map((stake, index) => (
                  <tr key={stake.id}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {stake.stake_title}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {stake.stake_duration}{" "}
                        {stake.stake_duration === 1 ? "day" : "days"}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {stake.stake_return} %
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {/* <p className="text-black dark:text-white">
                      {stake.stake_fee}
                    </p> */}
                      <span className="flex items-center gap-2 text-black dark:text-white">
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
                        {stake.stake_fee}
                      </span>
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
}

export default Stake;
