"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRegFilePdf } from "react-icons/fa";
import { InfinitySpin } from "react-loader-spinner";

const Page = ({ params }) => {
  const id = params.id;
  const [detail, setDetail] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    detail?.storeData?.action
  );
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail?_id=" + id);
      if (response.ok) {
        const detailData = await response.json();
        setDetail(detailData);
        setLoading(false);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  }, []);
  console.log(detail);
  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const fetchFiles = async () => {
    if (detail?.formDataContract?.file != null) {
      try {
        const uniId = detail?.formDataContract?.file;
        const response = await fetch("/api/uploadPdf?_id=" + uniId);
        if (response.ok) {
          const uniqueData = await response.json();
          setFilterData(uniqueData);
        } else {
          console.error("Failed to fetch plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    }
  };
  useEffect(() => {
    if (detail?.formDataContract?.file != null) {
      fetchFiles();
    }
  }, [detail?.formDataContract?.file != null]);
  const handleStatusChange = async () => {
    setLoadingButton(true);
    try {
      const updatedDetail = {
        ...detail,
        storeData: { ...detail.storeData, action: selectedStatus },
      };
      const response = await fetch("/api/submit-detail?_id=" + detail.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetail),
      });
      if (response.ok) {
        setDetail(updatedDetail);
        setLoadingButton(false);
        setSnackbarOpen(true);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  if (session && sessionStatus === "authenticated" && detail) {
    return (
      <>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity="success"
          >
            Update the order detail successfully
          </MuiAlert>
        </Snackbar>
        <div className="container-lg lg:max-w-7xl mx-auto mt-32">
          <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-10">
            Press Release Order
          </h1>
          <div>
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white shadow-xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Company Data
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg">Name: </span>
                        {detail?.formData?.companyName
                          ? detail?.formData?.companyName
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Email: </span>
                        {detail?.formData?.email
                          ? detail?.formData?.email
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Phone: </span>
                        {detail?.formData?.phone
                          ? detail?.formData?.phone
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Company Name:{" "}
                        </span>
                        {detail?.formData?.companyName
                          ? detail?.formData?.companyName
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">State: </span>
                        {detail?.formData?.state
                          ? detail?.formData?.state
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">City: </span>
                        {detail?.formData?.city
                          ? detail?.formData?.city
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Address 1: </span>
                        {detail?.formData?.address1
                          ? detail?.formData?.address1
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Address 2: </span>
                        {detail?.formData?.address2
                          ? detail?.formData?.address2
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg"> Website: </span>
                        {detail?.formData?.websiteUrl ? (
                          <Link
                            href={detail?.formData?.websiteUrl}
                            target="_blank"
                          >
                            {detail?.formData?.websiteUrl}
                          </Link>
                        ) : (
                          "Not Added Website Link"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Store Data Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Specific PR Balance
                    </h2>
                    <div className="text-gray-600 gap-1 flex flex-col">
                      <p>
                        <span className="font-bold text-lg me-1">Action: </span>
                        {detail?.storeData?.action || "Not Added Yet"}
                      </p>
                      <hr />
                      {detail?.storeData?.agencyName && (
                        <>
                          <p>
                            <span className="font-bold text-lg me-1">
                              Agency Name:{" "}
                            </span>
                            {detail?.storeData?.agencyName}
                          </p>
                          <hr />
                        </>
                      )}
                      <p>
                        <span className="font-bold text-lg me-1">
                          Category Subtotal:
                        </span>
                        ${detail?.storeData?.categorySubtotal}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg me-1">Cost: </span> $
                        {detail?.storeData?.cost}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg me-1">
                          Country Subtotal:
                        </span>
                        ${detail?.storeData?.countrySubTotal}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg me-1">
                          Country Translations Price:
                        </span>
                        ${detail?.storeData?.countryTranslationsPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matched Plan Data Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Buy Plan Data
                    </h2>
                    <div className="text-gray-600 gap-1 flex flex-col">
                      <p>
                        <span className="font-bold text-lg">Plan Name: </span>
                        {detail?.storeData?.matchedPlanData?.planName ||
                          "Not Added Yet"}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">
                          Plan Description:
                        </span>
                        {detail?.storeData?.matchedPlanData?.planDescription ||
                          "Not Added Yet"}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">
                          Price Single: $
                        </span>
                        {detail?.storeData?.matchedPlanData?.priceSingle ||
                          "Not Added Yet"}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">
                          Total Plan Price: $
                        </span>
                        {detail?.storeData?.matchedPlanData?.totalPlanPrice ||
                          "Not Added Yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Data Signup Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      USER Personal Data
                    </h2>
                    <div className="text-gray-600 gap-1 flex flex-col">
                      <p>
                        <span className="font-bold text-lg">Name: </span>
                        {detail?.storeData?.formDataSignUp?.name ||
                          "Not Added Yet"}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">Email: </span>
                        {detail?.storeData?.formDataSignUp?.email ||
                          "Not Added Yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Categories Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Selected Categories
                    </h2>
                    <ul className="text-gray-600 list-disc pl-4 gap-1 flex flex-col">
                      {detail?.storeData?.selectedCategories?.map(
                        (category, index) => (
                          <>
                            <li key={index}>
                              <span className="font-bold text-lg">
                                {category.name}:
                              </span>{" "}
                              &nbsp; ${category.price}
                            </li>
                            <hr />
                          </>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Selected Countries Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Selected Countries
                    </h2>
                    <ul className="text-gray-600 list-disc pl-4 gap-1 flex flex-col">
                      {detail?.storeData?.selectedCountries?.map(
                        (country, index) => (
                          <>
                            <li key={index}>
                              <span className="font-bold text-lg">
                                {country?.name}:
                              </span>{" "}
                              &nbsp; ${country?.price}
                            </li>
                            <hr />
                          </>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Selected Country Translations Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Selected Country Translations
                    </h2>
                    <ul className="text-gray-600 list-disc list-inside gap-1 flex flex-col">
                      {detail?.storeData?.selectedCountryTranslations?.length >
                      0 ? (
                        <>
                          {detail?.storeData?.selectedCountryTranslations?.map(
                            (translation, index) => (
                              <li key={index}>
                                <span className="font-bold text-lg">
                                  {translation.name}
                                </span>
                                <hr />
                              </li>
                            )
                          )}
                        </>
                      ) : (
                        "Translation Not Add By User"
                      )}
                    </ul>
                  </div>
                </div>

                {/* Other Information Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Main Data
                    </h2>
                    <div className="text-gray-600 gap-1 flex flex-col">
                      <p>
                        <span className="font-bold text-lg">
                          Selected Option:
                        </span>{" "}
                        &nbsp;
                        <span className="uppercase">
                          {detail?.storeData?.selectedOption || "Not Added Yet"}
                        </span>
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">
                          Selected Price:
                        </span>{" "}
                        &nbsp; $
                        {detail?.storeData?.selectedPrice || "Not Added Yet"}
                      </p>
                      <hr />
                      <p>
                        <span className="font-bold text-lg">Status: </span>{" "}
                        &nbsp;
                        <span className="uppercase">
                          {detail?.storeData?.status || "Not Added Yet"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Form Data Contract Section */}
                {detail?.formDataContract?.file === null && !filterData?.pdf ? (
                  <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                        Form Data Contract
                      </h2>
                      <div className="text-gray-600">
                        <p>
                          <span className="font-bold text-lg">
                            Selected Company:
                          </span>
                          {detail?.formDataContract?.selectedCompany ||
                            "Not Added Yet"}
                        </p>
                        <hr className="my-1" />
                        <p className=" mt-2">
                          <span className="font-bold text-lg">
                            Company URL:{" "}
                          </span>
                          {detail?.formDataContract?.url || "Not Added Yet"}
                        </p>
                        <hr className="my-1" />
                        <p>
                          <span className="font-bold text-lg mt-2">
                            Target Keywords:{" "}
                          </span>
                          <ul>
                            {detail?.formDataContract?.tags.map(
                              (tag, index) => (
                                <li key={index}>{tag}</li>
                              )
                            )}
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {filterData?.pdf && (
                      <Link
                        target="_blank"
                        href={`https://files.imcwire.com/${filterData?.pdf}`}
                        // download
                        download="excel-file.pptx"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex gap-5 items-center justify-center w-full text-center"
                      >
                        <FaRegFilePdf /> <span> Download Docs file </span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
            <hr className="py-2" />
            <div className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 flex items-center">
              <p className="text-gray-600 flex-grow">
                <span className="font-bold text-2xl font-serif">
                  Status Update :{" "}
                </span>
              </p>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-auto mt-1 py-2 px-2 mb-2 mr-2 border border-gray-300 rounded-md shadow-2xl focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="pending">Pending</option>
                <option value="approved">Approval</option>
                <option value="inprogress">In Progress</option>
                <option value="rejected">Rejected</option>
                <option value="hold">Hold</option>
                {/* <option value="completed">Completed</option> */}
              </select>
              <button
                onClick={handleStatusChange}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none shadow-2xl focus:shadow-outline"
              >
                {loadingButton ? "Loading..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <p>Failed to fetch data.</p>
      </div>
    );
  }
};

export default Page;
