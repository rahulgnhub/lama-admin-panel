"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

interface FormErrors {
  upgrade_title?: string;
  upgrade_summary?: string;
  upgrade_amount_in_token?: string;
  upgrade_amount_in_ton?: string;
  upgrade_boost?: string;
  upgrade_duration_in_days?: string;
  upgrade_image?: string;
}

function UpdateFarmingBooster() {
  const { _id } = useParams();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    upgrade_title: "",
    upgrade_summary: "",
    upgrade_amount_in_token: 0,
    upgrade_amount_in_ton: 0,
    upgrade_boost: 0,
    upgrade_duration_in_days: 0,
    upgrade_image: "",
  });

  const fetchFarmingBooster = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/farmingupgrades/${_id}`,
        {
          method: "GET",
        },
      );
      const result = await response.json();
      const data = result?.data;
      console.log("data", data);
      if (response.ok) {
        setFormData({
          upgrade_title: data.upgrade_title || "",
          upgrade_summary: data.upgrade_summary || "",
          upgrade_amount_in_token: data.upgrade_amount_in_token || 0,
          upgrade_amount_in_ton: data.upgrade_amount_in_ton || 0,
          upgrade_boost: data.upgrade_boost || 0,
          upgrade_duration_in_days: data.upgrade_duration_in_days || 0,
          upgrade_image: data.upgrade_image || "",
        });
      } else {
        Swal.fire({
          text: "Failed to fetch farming booster data.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching farming booster data:", error);
      Swal.fire({
        text: "An error occurred while fetching farming booster data.",
        icon: "error",
      });
    }
  }, [_id]);

  useEffect(() => {
    if (_id) {
      fetchFarmingBooster();
    }
  }, [_id, fetchFarmingBooster]);

  const formValidation = () => {
    const errors: FormErrors = {};

    if (!formData.upgrade_title) errors.upgrade_title = "Title is required.";
    if (!formData.upgrade_summary)
      errors.upgrade_summary = "Summary is required.";
    if (formData.upgrade_amount_in_token < 0)
      errors.upgrade_amount_in_token = "Token amount cannot be negative.";
    if (formData.upgrade_amount_in_ton < 0)
      errors.upgrade_amount_in_ton = "TON amount cannot be negative.";
    if (formData.upgrade_boost <= 0)
      errors.upgrade_boost = "Boost must be greater than 0.";
    if (formData.upgrade_duration_in_days <= 0)
      errors.upgrade_duration_in_days = "Duration must be greater than 0.";
    if (!formData.upgrade_image)
      errors.upgrade_image = "Image URL is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name.includes("amount") ||
        name.includes("boost") ||
        name.includes("duration")
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValidation()) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BaseUrl}/admin/farmingupgrades/update/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          text: "Farming Booster Updated Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        }).then(function () {
          window.location.href = "/farming-upgrades/farming-upgrades-list";
        });
      } else {
        Swal.fire({
          text: result?.message || "An error occurred. Please try again.",
          icon: "error",
        });
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
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Update Farming Booster
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter booster title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_title}
                  onChange={handleChange}
                  name="upgrade_title"
                />
                {formErrors.upgrade_title && (
                  <small className="text-danger">
                    {formErrors.upgrade_title}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Summary <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter booster summary"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_summary}
                  onChange={handleChange}
                  name="upgrade_summary"
                />
                {formErrors.upgrade_summary && (
                  <small className="text-danger">
                    {formErrors.upgrade_summary}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Amount in Token <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount in token"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_amount_in_token}
                  onChange={handleChange}
                  name="upgrade_amount_in_token"
                />
                {formErrors.upgrade_amount_in_token && (
                  <small className="text-danger">
                    {formErrors.upgrade_amount_in_token}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Amount in TON <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount in TON"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_amount_in_ton}
                  onChange={handleChange}
                  name="upgrade_amount_in_ton"
                />
                {formErrors.upgrade_amount_in_ton && (
                  <small className="text-danger">
                    {formErrors.upgrade_amount_in_ton}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Boost Multiplier (x) <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter boost multiplier (e.g. 2 for 2x)"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_boost}
                  onChange={handleChange}
                  name="upgrade_boost"
                />
                {formErrors.upgrade_boost && (
                  <small className="text-danger">
                    {formErrors.upgrade_boost}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Duration (in days) <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter duration in days"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_duration_in_days}
                  onChange={handleChange}
                  name="upgrade_duration_in_days"
                />
                {formErrors.upgrade_duration_in_days && (
                  <small className="text-danger">
                    {formErrors.upgrade_duration_in_days}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Image URL <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.upgrade_image}
                  onChange={handleChange}
                  name="upgrade_image"
                />
                {formErrors.upgrade_image && (
                  <small className="text-danger">
                    {formErrors.upgrade_image}
                  </small>
                )}
              </div>

              <div className="mb-4.5">
                <div className="mb-4 rounded-sm border border-stroke p-4">
                  <h4 className="mb-2 font-medium text-black dark:text-white">
                    Image Preview
                  </h4>
                  {formData.upgrade_image ? (
                    <img
                      src={formData.upgrade_image}
                      alt="Booster preview"
                      className="max-h-48 w-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-gray-100 text-gray-500 dark:bg-boxdark-2">
                      No image URL provided
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <input
                  type="submit"
                  value={loading ? "Processing..." : "Update Farming Booster"}
                  className="w-full cursor-pointer rounded-md border border-primary bg-primary p-3 text-base text-white transition hover:bg-opacity-90"
                />
              </div>
            </div>
          </form>
        </div>
      </DefaultLayout>
    </>
  );
}

export default UpdateFarmingBooster;
