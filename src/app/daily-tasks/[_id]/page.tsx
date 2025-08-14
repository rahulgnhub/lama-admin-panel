"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

interface FormErrors {
  task_name?: string;
  task_medium?: string;
  task_summary?: string;
  task_link?: string;
  start_date?: string;
  end_date?: string;
  is_active?: string;
  task_reward?: string;
}

interface Option {
  value: string;
  label: string;
  icon?: string;
}

function UpdateDailyTask() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalFormData, setOriginalFormData] = useState<any>({});

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
    { value: "Other", label: "Other", icon: "/images/social-icons/world.svg" },
  ];

  const { _id } = useParams();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    task_name: "",
    task_medium: "",
    task_summary: "",
    task_link: "",
    start_date: "",
    end_date: "",
    is_active: "1",
    task_reward: "",
  });

  const fetchDailyTask = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/dailytasks/${_id}`,
        {
          method: "GET",
        },
      );
      const result = await response.json();
      const data = result?.data;
      if (response.ok) {
        const mediumOption = options.find(
          (option) => option.value === data.task_medium,
        );
        const fetchedData = {
          task_name: data.task_name || "",
          task_medium: data.task_medium || "",
          task_summary: data.task_summary || "",
          task_link: data.task_link || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          is_active: data.is_active ? "1" : "0",
          task_reward: data.task_reward || "",
        };
        setFormData(fetchedData);
        setOriginalFormData(fetchedData);
        setSelectedOption(mediumOption || null);
      } else {
        Swal.fire({
          text: "Failed to fetch admin data.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      Swal.fire({
        text: "An error occurred while fetching admin data.",
        icon: "error",
      });
    }
  }, [_id]);

  useEffect(() => {
    if (_id) {
      fetchDailyTask();
    }
  }, [_id, fetchDailyTask]);

  const formValidation = () => {
    const errors: FormErrors = {};

    if (!formData.task_name) errors.task_name = "Enter Task Name";
    if (!formData.task_medium) errors.task_medium = "Enter Task Medium";
    // if (!formData.task_summary) errors.task_summary = "Enter Task Summary";
    if (!formData.task_link) errors.task_link = "Enter Task Link";
    if (!formData.start_date) errors.start_date = "Select Start Date";
    if (!formData.end_date) errors.end_date = "Select End Date";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setFormData({
      ...formData,
      task_medium: option.value,
    });
    setIsDropdownOpen(false);
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      setFormData(originalFormData);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValidation()) {
      return;
    }
    setLoading(true);

    const submissionData = {
      ...formData,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/tasks/update-dailytasks/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          text: "Daily Task Updated Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        }).then(function () {
          window.location.href = "/daily-tasks/list-daily-tasks";
        });
      } else {
        if (result?.message) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
          }));
        } else {
          Swal.fire({
            text: "An error occurred. Please try again.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error during updation:", error);
      Swal.fire({
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DefaultLayout>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Daily Task
            </h3>
            <button
              type="button"
              onClick={handleEditToggle}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {isEditMode ? "Cancel" : "Edit"}
            </button>
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
                  disabled={!isEditMode}
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
                  className={`flex w-full cursor-pointer items-center rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${
                    isEditMode ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={() =>
                    isEditMode ? setIsDropdownOpen(!isDropdownOpen) : null
                  }
                >
                  {selectedOption ? (
                    <div className="flex items-center">
                      {selectedOption.icon && (
                        <Image
                          src={selectedOption.icon}
                          alt={selectedOption.label}
                          className="mr-3 h-5 w-5"
                          height={50}
                          width={50}
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
                  </span>{" "}
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
                  disabled={!isEditMode}
                />
                {formErrors.task_summary && (
                  <small className="text-danger">
                    {formErrors.task_summary}
                  </small>
                )}
              </div>

              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Task Reward <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task summary"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.task_reward}
                  onChange={handleChange}
                  name="task_reward"
                  disabled={!isEditMode}
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
                  disabled={!isEditMode}
                />
                {formErrors.task_link && (
                  <small className="text-danger">{formErrors.task_link}</small>
                )}
              </div>

              <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="sm:w-1/2">
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Enter start date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={formData.start_date}
                      onChange={handleChange}
                      name="start_date"
                      disabled={!isEditMode}
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
                    placeholder="Enter end date"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={formData.end_date}
                    onChange={handleChange}
                    name="end_date"
                    disabled={!isEditMode}
                  />
                  {formErrors.end_date && (
                    <small className="text-danger">{formErrors.end_date}</small>
                  )}
                </div>
              </div>

              {/* <div className="mb-2">
                <input
                  type="submit"
                  disabled={!isEditMode || loading}
                  value={loading ? "Processing..." : "Update Daily Task"}
                  className="w-full cursor-pointer rounded-md border border-primary bg-primary p-3 text-base text-white transition hover:bg-opacity-90"
                />
              </div> */}

              <button
                type="submit"
                className="mt-4 w-full rounded bg-primary px-4 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={!isEditMode || loading}
              >
                {loading ? "Updating..." : "Update Daily Task"}
              </button>
            </div>
          </form>
        </div>
      </DefaultLayout>
    </>
  );
}

export default UpdateDailyTask;
