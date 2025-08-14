"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ChangeEvent } from "react";

type DailyTaskList = {
  _id: string;
  task_name: string;
  task_summary: string;
  start_date: string;
  end_date: string;
  task_medium: string;
  task_reward: number;
  task_link: string;
};

const options = [
  {
    value: "Youtube",
    label: "Youtube",
    icon: "/images/social-icons/youtube.svg",
  },
  {
    value: "Telegram",
    label: "Telegram",
    icon: "/images/social-icons/telegram.svg",
  },
  { value: "X", label: "X", icon: "/images/social-icons/X-logo.svg" },
  {
    value: "Facebook",
    label: "Facebook",
    icon: "/images/social-icons/facebook.svg",
  },
  { value: "Other", label: "Other", icon: "/images/social-icons/world.svg" },
];

const DailyTaskList = () => {
  const [task, setTask] = useState<DailyTaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [sortField, setSortField] = useState<"start_date" | "end_date">(
    "start_date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/dailytasks`,
      );
      const result = response?.data?.data;
      setTask(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (id: string) => {
    setSelectedTaskId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  const deleteTask = async () => {
    if (!selectedTaskId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/delete-dailytasks/${selectedTaskId}`,
      );
      setTask((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTaskId),
      );
      closeModal();
      Swal.fire({
        text: "Task Deleted Successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedTasks = task
    .filter((t) => {
      // Search filter
      const searchMatch =
        t.task_name.toLowerCase().includes(searchText.toLowerCase()) ||
        t.task_summary.toLowerCase().includes(searchText.toLowerCase());
      // Date filters
      const startDateMatch = filterStartDate
        ? t.start_date >= filterStartDate
        : true;
      const endDateMatch = filterEndDate ? t.end_date <= filterEndDate : true;
      return searchMatch && startDateMatch && endDateMatch;
    })
    .sort((a, b) => {
      const field = sortField;
      if (sortOrder === "asc") {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });

  const getPlatformIcon = (platform: string) => {
    const option = options.find((opt) => opt.value === platform);
    return option?.icon || null; // Default icon if no match
  };

  return (
    <DefaultLayout>
      {/* Filters */}

      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white mb-0 pb-3">
              Daily Task List
            </h4>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                  Search
                </label>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by name or summary"
                  className="rounded border border-gray-300 px-3 py-2 text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="rounded border border-gray-300 px-3 py-2 text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                  End Date
                </label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="rounded border border-gray-300 px-3 py-2 text-black dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              {(filterStartDate || filterEndDate || searchText) && (
                <button
                  className="mt-6 rounded bg-gray-200 px-3 py-2 text-black hover:bg-gray-300 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3"
                  onClick={() => {
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setSearchText("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className=" px-4 py-4 font-medium text-black dark:text-white xl:pl-24">
                    Task Name
                  </th>
                  <th className="px-10 py-4 pl-18 font-medium text-black dark:text-white">
                    Task Summary
                  </th>
                  <th
                    className="cursor-pointer select-none px-10 py-4 font-medium text-black dark:text-white"
                    onClick={() => {
                      if (sortField === "start_date") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("start_date");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Start Date
                      <svg
                        className={`ml-1 inline h-3 w-3 transition-transform ${sortField === "start_date" && sortOrder === "desc" ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </th>
                  <th
                    className="cursor-pointer select-none px-10 py-4 font-medium text-black dark:text-white"
                    onClick={() => {
                      if (sortField === "end_date") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("end_date");
                        setSortOrder("desc");
                      }
                    }}
                  >
                    <span className="flex items-center gap-1">
                      End Date
                      <svg
                        className={`ml-1 inline h-3 w-3 transition-transform ${sortField === "end_date" && sortOrder === "desc" ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Task Reward
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTasks.map((task, key) => (
                  <tr key={key}>
                    <td className="group relative border-b border-[#eee] px-4 py-4 pl-9 dark:border-strokedark xl:pl-11">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(task.task_medium) && (
                          <Image
                            src={getPlatformIcon(task.task_medium)!}
                            alt={`${task.task_medium} logo`}
                            className="h-5 w-5"
                            height={50}
                            width={50}
                          />
                        )}
                        <Link
                          href={task.task_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h5 className="font-medium text-black group-hover:underline dark:text-white">
                            {task.task_name}

                            <span className="invisible absolute top-1/2 -translate-y-1/2 transform pl-4 group-hover:visible">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                className="h-3 w-4 text-gray-300"
                              >
                                <path d="m561.938 158.06-143.998-143.968c-30.014-30.014-81.94-8.995-81.94 33.94v57.198c-42.45 1.88-84.03 6.55-120.76 17.99-35.17 10.95-63.07 27.58-82.91 49.42-24.11 26.56-36.33 59.96-36.33 99.3 0 61.697 33.178 112.455 84.87 144.76 37.546 23.508 85.248-12.651 71.02-55.74-15.515-47.119-17.156-70.923 84.11-78.76v53.8c0 42.993 51.968 63.913 81.94 33.94l143.998-144c18.75-18.74 18.75-49.14 0-67.88zm-177.938 177.94v-103.84c-128.691 1.922-217.508 23.19-177.69 143.84-29.52-18.45-62.31-51.92-62.31-104.06 0-109.334 129.14-118.947 240-119.85v-104.09l144 144zm24.74 84.493a82.658 82.658 0 0 0 20.974-9.303c7.976-4.952 18.286.826 18.286 10.214v42.596c0 26.51-21.49 48-48 48h-352c-26.51 0-48-21.49-48-48v-352c0-26.51 21.49-48 48-48h132c6.627 0 12 5.373 12 12v4.486c0 4.917-2.987 9.369-7.569 11.152-13.702 5.331-26.396 11.537-38.05 18.585a12.138 12.138 0 0 1 -6.28 1.777h-86.101a6 6 0 0 0 -6 6v340a6 6 0 0 0 6 6h340a6 6 0 0 0 6-6v-25.966c0-5.37 3.579-10.059 8.74-11.541z" />
                              </svg>
                            </span>
                          </h5>
                        </Link>
                      </div>
                    </td>
                    {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {task.task_summary}
                    </p>
                  </td> */}
                    <td className="border-b border-[#eee] py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {task.task_summary}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-8 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {task.start_date}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-8 py-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {task.end_date}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
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
                          {task.task_reward}
                        </p>
                      </div>
                    </td>

                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <Link href={`/daily-tasks/${task._id}`}>
                          <button className="hover:text-primary">
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8.071 21.586l-7.071 1.414 1.414-7.071 14.929-14.929 5.657 5.657-14.929 14.929zm-.493-.921l-4.243-4.243-1.06 5.303 5.303-1.06zm9.765-18.251l-13.3 13.301 4.242 4.242 13.301-13.3-4.243-4.243z" />
                            </svg>
                          </button>
                        </Link>
                        <button
                          className="hover:text-primary"
                          onClick={() => openModal(task._id)}
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
                onClick={deleteTask}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default DailyTaskList;
