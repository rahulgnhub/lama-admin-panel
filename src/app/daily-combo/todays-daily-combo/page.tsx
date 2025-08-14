"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type DailyCombo = {
  _id: string;
  combo_name: string;
  item_1: number;
  item_2: number;
  item_3: number;
  combo_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ComboItem = {
  id: string;
  item_icon: string;
};

const DailyComboList = () => {
  const [dailyCombos, setDailyCombos] = useState<DailyCombo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comoboItem, setComboItem] = useState<ComboItem[]>([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/dailycombo/currentdailycombo`,
        // "http://localhost:8000/api/admin/dailycombo/currentdailycombo",
      );
      const result = response?.data?.data;
      setDailyCombos(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getComoboItem = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/dailycomboitems`,
      );
      const result = response?.data?.data;
      setComboItem(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
    getComoboItem();
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
            Daily Combos
          </h4>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Item 1
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Item 2
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Item 3
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Reward
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyCombos.map((combo, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {combo.combo_name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {comoboItem
                          .filter((item) => Number(item.id) === combo.item_1)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-black dark:text-white">
                                {item.id}
                              </span>
                              <Image
                                src={item.item_icon}
                                alt={`Icon for ${item.id}`}
                                width={32}
                                height={32}
                                className="rounded"
                              />
                            </div>
                          ))}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {comoboItem
                          .filter((item) => Number(item.id) === combo.item_2)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-black dark:text-white">
                                {item.id}
                              </span>
                              <Image
                                src={item.item_icon}
                                alt={`Icon for ${item.id}`}
                                width={32}
                                height={32}
                                className="rounded"
                              />
                            </div>
                          ))}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {comoboItem
                          .filter((item) => Number(item.id) === combo.item_3)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-black dark:text-white">
                                {item.id}
                              </span>
                              <Image
                                src={item.item_icon}
                                alt={`Icon for ${item.id}`}
                                width={32}
                                height={32}
                                className="rounded"
                              />
                            </div>
                          ))}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {combo.combo_reward}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(combo.start_date).toLocaleDateString()}
                      </p>
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

export default DailyComboList;
