"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState } from "react";
import Swal from "sweetalert2";

interface FormErrors {
  name?: string;
  email?: String;
  contact?: String;
  password?: String;
  confirm_password?: string;
  is_active?: Boolean;
}

function CreateAdmin() {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirm_password: "",
    is_active: "1",
  });

  const formValidation = () => {
    const errors: FormErrors = {};

    if (!formData.name || formData.name.length < 3)
      errors.name = "Name must be at least 3 characters long.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    if (
      !formData.contact ||
      isNaN(Number(formData.contact)) ||
      formData.contact.length < 10
    )
      errors.contact = "Valid phone number is required.";
    if (!formData.password || formData.password.length < 6)
      errors.password = "Password must be at least 6 characters long.";
    if (formData.password !== formData.confirm_password)
      errors.confirm_password = "Passwords do not match.";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formValidation()) {
      return;
    }
    setLoading(true);

    const submissionData = {
      ...formData,
      contact: Number(formData.contact), // Ensuring contact is sent as a number
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BaseUrl}/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          text: "Admin Registered Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        }).then(function () {
          window.location.href = "/admin/admin-list";
        });
      } else {
        if (result?.message) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            email: result.message,
          }));
        } else {
          Swal.fire({
            text: "An error occurred. Please try again.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
              Create Admin
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
                {formErrors.name && (
                  <small className="text-danger">{formErrors.name}</small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
                {formErrors.email && (
                  <small className="text-danger">{formErrors.email}</small>
                )}
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Contact No
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your contact number"
                    className="w-full rounded-md border border-stroke bg-transparent py-3 pl-5 pr-10 text-base text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={formData.contact}
                    onChange={handleChange}
                    name="contact"
                    maxLength={10}
                  />
                </div>
                {formErrors.contact && (
                  <small className="text-danger">{formErrors.contact}</small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Password <span className="text-meta-1">*</span>
                </label>
                <input
                  type="Password"
                  placeholder="Enter password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                />
                {formErrors.password && (
                  <small className="text-danger">{formErrors.password}</small>
                )}
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Re-Type Password <span className="text-meta-1">*</span>
                </label>
                <input
                  type="Password"
                  placeholder="Enter password again"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  name="confirm_password"
                />
                {formErrors.confirm_password && (
                  <small className="text-danger">
                    {formErrors.confirm_password}
                  </small>
                )}
              </div>

              <div className="mb-2">
                <input
                  type="submit"
                  value={loading ? "Processing..." : "Create Account"}
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

export default CreateAdmin;
