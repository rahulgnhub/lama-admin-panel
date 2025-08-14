"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Admin = {
  combo_name: string;
  item_1: number;
  item_2: number;
  item_3: number;
  combo_reward: string;
  start_date: string;
  end_date: string;
};

type ComboItem = {
  id: string;
  item_icon: string;
};

type SortDirection = "asc" | "desc" | null;
type SortField = "start_date" | "end_date" | null;

const AdminList = () => {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [filteredAdmin, setFilteredAdmin] = useState<Admin[]>([]);
  const [comoboItem, setComboItem] = useState<ComboItem[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sorting states - initialize with start_date and ascending order
  const [sortField, setSortField] = useState<SortField>("start_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Current date for initialization
  const today = new Date();
  const fifteenDaysLater = new Date(today);
  fifteenDaysLater.setDate(today.getDate() + 15);

  const [formData, setFormData] = useState<Admin>({
    combo_name: "Daily Combo",
    item_1: Math.floor(Math.random() * 9) + 1,
    item_2: Math.floor(Math.random() * 9) + 1,
    item_3: Math.floor(Math.random() * 9) + 1,
    combo_reward: "125000",
    start_date: today.toISOString().split("T")[0],
    end_date: fifteenDaysLater.toISOString().split("T")[0],
  });

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/dailycombo`,
      );
      const result = response?.data?.data;
      setAdmin(result);
      // Apply initial sorting by start_date in ascending order
      applySorting(result, "start_date", "asc");
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

  // Apply sorting to the admin data
  const applySorting = (
    data: Admin[],
    field: SortField,
    direction: SortDirection,
  ) => {
    if (!field || !direction) {
      setFilteredAdmin(data);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a[field]).getTime();
      const dateB = new Date(b[field]).getTime();

      if (direction === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredAdmin(sortedData);
  };

  // Handle sort when clicking on table headers
  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = null;

    // If clicking on the same field, toggle direction
    if (field === sortField) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      } else {
        newDirection = "asc";
      }
    } else {
      // If clicking on a new field, start with ascending
      newDirection = "asc";
    }

    setSortField(newDirection ? field : null);
    setSortDirection(newDirection);
    applySorting(admin, newDirection ? field : null, newDirection);
  };

  const openModal = () => {
    if (admin.length > 0) {
      // Find the latest start_date
      const latestStartDate = admin
        .map((item) => new Date(item.start_date))
        .sort((a, b) => b.getTime() - a.getTime())[0]; // Get the most recent date

      // Calculate new start_date (next day after the latest start_date)
      const newStartDate = new Date(latestStartDate);
      newStartDate.setDate(newStartDate.getDate() + 1);

      // Calculate end_date (15 days from newStartDate)
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + 15);

      setFormData((prevData) => ({
        ...prevData,
        combo_name: "Daily Combo",
        start_date: newStartDate.toISOString().split("T")[0],
        end_date: newEndDate.toISOString().split("T")[0],
      }));
    } else {
      // Default case if no data exists
      const today = new Date();
      const fifteenDaysLater = new Date(today);
      fifteenDaysLater.setDate(today.getDate() + 15);

      setFormData((prevData) => ({
        ...prevData,
        combo_name: "Daily Combo",
        start_date: today.toISOString().split("T")[0],
        end_date: fifteenDaysLater.toISOString().split("T")[0],
      }));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    getData();
    getComoboItem();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name.startsWith("item_")
      ? Math.max(1, Math.min(9, Number(value)))
      : value;
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  // Function to generate a random number between 1 and 9
  const getRandomNumber = () => Math.floor(Math.random() * 9) + 1;

  // Function to create a date range array between start and end dates
  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Render sort icon based on current sort state
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="ml-2 text-lg text-gray-400">&#8645;</span>;
    } else if (sortDirection === "asc") {
      return (
        <span className="ml-1 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
          </svg>
        </span>
      );
    } else {
      return (
        <span className="ml-1 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
          </svg>
        </span>
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true); // Start loading animation
  
    try {
      // Get array of dates between start_date and end_date
      const dateRange = getDatesBetween(formData.start_date, formData.end_date);
      
      // Find which dates already have combos
      const existingDates = new Set(admin.map(item => item.start_date));
      
      // Filter out dates that already have combos
      const datesToGenerate = dateRange.filter(date => !existingDates.has(date));
      
      // If all dates already have combos, show message and return early
      if (datesToGenerate.length === 0) {
        setIsGenerating(false);
        closeModal();
        
        Swal.fire({
          title: "Info",
          text: "All selected dates already have daily combos!",
          icon: "info",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
  
      // Get the current highest combo number to start sequential naming
      let highestComboNumber = 0;
  
      admin.forEach((item) => {
        const match = item.combo_name.match(/Daily Combo (\d+)/);
        if (match && match[1]) {
          const comboNumber = parseInt(match[1]);
          if (!isNaN(comboNumber) && comboNumber > highestComboNumber) {
            highestComboNumber = comboNumber;
          }
        }
      });
  
      // Create a combo for each day that doesn't already have one
      const comboPromises = datesToGenerate.map((date, index) => {
        // Sequential number for each combo starting from highestComboNumber + 1
        const comboNumber = highestComboNumber + index + 1;
  
        const dailyCombo = {
          combo_name: `Daily Combo ${comboNumber}`,
          item_1: getRandomNumber(),
          item_2: getRandomNumber(),
          item_3: getRandomNumber(),
          combo_reward: formData.combo_reward,
          start_date: date,
          end_date: date, // Each combo lasts for one day
        };
  
        return axios.post(
          `${process.env.NEXT_PUBLIC_BaseUrl}/admin/dailycombo/create`,
          dailyCombo,
        );
      });
  
      await Promise.all(comboPromises);
      closeModal();
      getData();
  
      // Update success message to show how many were generated and how many were skipped
      const skippedCount = dateRange.length - datesToGenerate.length;
      Swal.fire({
        title: "Success",
        text: `${datesToGenerate.length} daily combos generated successfully! (${skippedCount} existing combos skipped)`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to generate daily combos",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsGenerating(false); // Stop loading animation
    }
  };

  return (
    <DefaultLayout>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Combo
            </h4>
            <button
              onClick={openModal}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-600"
            >
              <span className="pr-1">+</span> Generate Daily Combo
            </button>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-black">
                  Generate Daily Combo
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  
                  <div className="flex items-center">
                    <label className="w-36 text-black">Start Date:</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full border p-2 text-black"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-black">End Date:</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full border p-2 text-black"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-center text-sm text-gray-600">
                      This will generate{" "}
                      {
                        getDatesBetween(formData.start_date, formData.end_date)
                          .length
                      }{" "}
                      daily combos.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="bg-gray-200 px-4 py-2 text-black"
                    onClick={closeModal}
                    disabled={isGenerating} // Disable cancel button while generating
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-blue-500 px-4 py-2 text-white ${
                      isGenerating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                    disabled={isGenerating} // Disable generate button while generating
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">Generating</span>
                        <span className="ml-2 animate-bounce">...</span>
                      </span>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
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
                  <th className="px-12 py-4 font-medium text-black dark:text-white">
                    Reward
                  </th>
                  <th
                    className="cursor-pointer px-0 py-4 font-medium text-black dark:text-white"
                    onClick={() => handleSort("start_date")}
                  >
                    <div className="flex items-center">
                      Start Date
                      {renderSortIcon("start_date")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer px-0 py-4 font-medium text-black dark:text-white"
                    onClick={() => handleSort("end_date")}
                  >
                    <div className="flex items-center">
                      End Date
                      {renderSortIcon("end_date")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmin.map((admin, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {admin.combo_name}
                      </h5>
                    </td>
                    {/* Item 1 */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {comoboItem
                        .filter((item) => Number(item.id) === admin.item_1)
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
                    </td>
                    {/* Item 2 */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {comoboItem
                        .filter((item) => Number(item.id) === admin.item_2)
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
                    </td>
                    {/* Item 3 */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      {comoboItem
                        .filter((item) => Number(item.id) === admin.item_3)
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
                    </td>
                    <td className="border-b border-[#eee] px-6 py-4 dark:border-strokedark">
                      <div className="text-black dark:text-white">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 430 430"
                            className="mr-2"
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
                          {admin.combo_reward}
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.start_date}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {admin.end_date}
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

export default AdminList;
