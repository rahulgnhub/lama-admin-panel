"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// Function to get the end of month date in YYYY-MM-DD format
const getEndOfMonthDate = () => {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return endOfMonth.toISOString().split("T")[0];
};

// Function to create date array between two dates
const getDatesBetween = (startDate: string, endDate: string) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  // Add dates until we reach the end date
  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface FormErrors {
  task_name?: string;
  task_medium?: string;
  task_link?: string;
  start_date?: string;
  end_date?: string;
  task_reward?: string;
}

function BatchCreateTasks() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [creationStatus, setCreationStatus] = useState<string[]>([]);
  const [processingComplete, setProcessingComplete] = useState(false);

  const [formData, setFormData] = useState({
    task_name: "Watch Mini Video",
    task_medium: "Other",
    task_summary: "",
    task_link: "ads.com",
    start_date: getTodayDate(),
    end_date: getEndOfMonthDate(),
    is_active: "1",
    task_reward: "50000",
    task_image: "other.png",
    type: "Ad",
  });

  const options: Option[] = [
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
    {
      value: "Other",
      label: "Other",
      icon: "/images/social-icons/world.svg",
    },
  ];

  // Set default option on component mount
  useEffect(() => {
    const defaultOption = options.find(
      (opt) => opt.value === formData.task_medium,
    );
    if (defaultOption) {
      setSelectedOption(defaultOption);
    }
  }, []);

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setFormData({
      ...formData,
      task_medium: option.value,
    });
    setIsDropdownOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formValidation = () => {
    const errors: FormErrors = {};

    if (!formData.task_name) errors.task_name = "Enter Task Name";
    if (!formData.task_medium) errors.task_medium = "Select Task Medium";
    if (!formData.task_link) errors.task_link = "Enter Task Link";
    if (!formData.start_date) errors.start_date = "Select Start Date";
    if (!formData.end_date) errors.end_date = "Select End Date";
    if (!formData.task_reward) {
      errors.task_reward = "Enter Task Reward";
    } else if (isNaN(Number(formData.task_reward))) {
      errors.task_reward = "Enter a valid number for Task Reward";
    }

    // Check if end date is after start date
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate > endDate) {
        errors.end_date = "End date must be after start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createTask = async (date: string) => {
    const taskData = {
      ...formData,
      start_date: date,
      end_date: date,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/add-dailytasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        return { success: true, date, message: "Task created successfully" };
      } else {
        return {
          success: false,
          date,
          message: result?.message || "Failed to create task",
        };
      }
    } catch (error) {
      console.error("Error creating task for", date, error);
      return {
        success: false,
        date,
        message: "Error occurred while creating task",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValidation()) {
      return;
    }

    setLoading(true);
    setCreationStatus([]);
    setProcessingComplete(false);

    const dates = getDatesBetween(formData.start_date, formData.end_date);

    // Process each date sequentially
    for (const date of dates) {
      const result = await createTask(date);
      setCreationStatus((prev) => [
        ...prev,
        `${date}: ${result.success ? "✅" : "❌"} ${result.message}`,
      ]);
    }

    setProcessingComplete(true);
    setLoading(false);
  };

  return (
    <>
      <DefaultLayout>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Batch Create Daily Tasks
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Task name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.task_name}
                  onChange={handleChange}
                  name="task_name"
                />
                {formErrors.task_name && (
                  <small className="text-danger">{formErrors.task_name}</small>
                )}
              </div>

              <div className="relative mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Medium <span className="text-meta-1">*</span>
                </label>
                <div
                  className="flex w-full cursor-pointer items-center rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedOption ? (
                    <div className="flex items-center">
                      {selectedOption.icon && (
                        <Image
                          src={selectedOption.icon}
                          alt={selectedOption.label}
                          className="mr-3 h-5 w-5"
                          width={50}
                          height={50}
                        />
                      )}
                      <span>{selectedOption.label}</span>
                    </div>
                  ) : (
                    "Select your Medium"
                  )}
                  <span className="absolute right-4 top-14 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                {isDropdownOpen && (
                  <ul className="absolute z-50 w-full rounded border border-stroke bg-white dark:border-form-strokedark dark:bg-boxdark">
                    {options.map((option) => (
                      <li
                        key={option.value}
                        className="flex cursor-pointer items-center px-5 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option.icon && (
                          <Image
                            src={option.icon}
                            alt={option.label}
                            className="mr-3 h-5 w-5"
                            height={50}
                            width={50}
                          />
                        )}
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
                {formErrors.task_medium && (
                  <small className="text-danger">
                    {formErrors.task_medium}
                  </small>
                )}
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Summary
                </label>
                <input
                  type="text"
                  placeholder="Enter task summary"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.task_summary}
                  onChange={handleChange}
                  name="task_summary"
                />
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Reward <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task reward"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.task_reward}
                  onChange={handleChange}
                  name="task_reward"
                />
                {formErrors.task_reward && (
                  <small className="text-danger">
                    {formErrors.task_reward}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Link <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task link"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.task_link}
                  onChange={handleChange}
                  name="task_link"
                />
                {formErrors.task_link && (
                  <small className="text-danger">{formErrors.task_link}</small>
                )}
              </div>

              <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="sm:w-1/2">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Start Date <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.start_date}
                      onChange={handleChange}
                      name="start_date"
                    />
                  </div>
                  {formErrors.start_date && (
                    <small className="text-danger">
                      {formErrors.start_date}
                    </small>
                  )}
                </div>

                <div className="sm:w-1/2">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    End Date <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={formData.end_date}
                    onChange={handleChange}
                    name="end_date"
                  />
                  {formErrors.end_date && (
                    <small className="text-danger">{formErrors.end_date}</small>
                  )}
                </div>
              </div>

              {/* Task Creation Status */}
              {creationStatus.length > 0 && (
                <div className="mb-4.5 mt-5">
                  <div className="rounded border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4">
                    <h4 className="mb-2 font-medium text-black dark:text-white">
                      Task Creation Status
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      {creationStatus.map((status, index) => (
                        <div key={index} className="mb-1 text-sm">
                          {status}
                        </div>
                      ))}
                    </div>
                    {processingComplete && (
                      <div className="mt-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            (window.location.href =
                              "/daily-tasks/list-daily-tasks")
                          }
                          className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90"
                        >
                          Go to Task List
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-md border border-primary bg-primary p-3 text-base text-white transition hover:bg-opacity-90 disabled:bg-opacity-70"
                >
                  {loading ? "Creating Tasks..." : "Create Daily Tasks"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </DefaultLayout>
    </>
  );
}

export default BatchCreateTasks;
