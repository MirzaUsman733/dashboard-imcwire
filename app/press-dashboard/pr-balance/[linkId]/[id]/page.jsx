"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import TawkTo from "../../../../components/TawkTo";
import { FaRegFilePdf } from "react-icons/fa";

const Page = ({ params }) => {
  const id = params.id;
  const linkId = params.linkId;
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail?_id=" + id);
      if (response.ok) {
        const detailData = await response.json();
        setDetail(detailData);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);
  const fetchFiles = async () => {
    if (detail?.formDataContract.file != null) {
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
    if (detail?.formDataContract?.file) {
      fetchFiles();
    }
  }, [detail]);
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
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
        <TawkTo />
        <div className="container-lg lg:max-w-7xl mx-auto mt-32">
          <h1
            className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10 "
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517504734587-2890819debab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHVycGxlJTIwYWVzdGhldGljfGVufDB8fDB8fHww')`,
              backgroundSize: "cover",
              backgroundClip: "text",
              color: "transparent",
              textShadow:
                "2px 7px 5px rgba(0,0,0,0.3), 0px -4px 10px rgba(255,255,255,0.3)",
            }}
          >
            Press Release Order
          </h1>
          <div>
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Form Data Section */}
                <div className="bg-white shadow-xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Form Data
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg"> Name: </span>
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
                        <span className="font-bold text-lg">Address: </span>
                        {detail?.formData?.address1
                          ? detail?.formData?.address1
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Address: </span>
                        {detail?.formData?.address2
                          ? detail?.formData?.address2
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg"> Website: </span>
                        <Link
                          href={
                            detail?.formData?.websiteUrl
                              ? detail?.formData?.websiteUrl
                              : "Not Added Yet"
                          }
                          target="_blank"
                        >
                          {detail?.formData?.websiteUrl
                            ? detail?.formData?.websiteUrl
                            : "Not Added Yet"}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Store Data Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Store Data
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg">Action: </span>
                        {detail?.storeData?.action
                          ? detail?.storeData?.action
                          : "Not Added Yet"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Category Subtotal:
                        </span>
                        ${detail?.storeData?.categorySubtotal}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Cost: </span> $
                        {detail?.storeData?.cost}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Country Subtotal:
                        </span>
                        ${detail?.storeData?.countrySubTotal}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
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
                      Matched Plan Data
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg">Plan Name: </span>
                        {detail?.storeData?.matchedPlanData?.planName}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Plan Description:
                        </span>
                        {detail?.storeData?.matchedPlanData?.planDescription || " Not Added by Admin"}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Price Single: $
                        </span>
                        {detail?.storeData?.matchedPlanData?.priceSingle}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Total Plan Price: $
                        </span>
                        {detail?.storeData?.matchedPlanData?.totalPlanPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Data Signup Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Form Data Signup
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg">Name: </span>
                        {detail?.storeData?.formDataSignUp?.name}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Email: </span>
                        {detail?.storeData?.formDataSignUp?.email}
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
                    <ul className="text-gray-600 list-disc pl-4">
                      {detail?.storeData?.selectedCategories?.map(
                        (category, index) => (
                          <li key={index}>
                            <span className="font-bold text-lg">
                              {category.name}:
                            </span>
                            ${category.price}
                          </li>
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
                    <ul className="text-gray-600 list-disc pl-4">
                      {detail?.storeData?.selectedCountries?.map(
                        (country, index) => (
                          <li key={index}>
                            <span className="font-bold text-lg">
                              {country?.name}:
                            </span>
                            ${country?.price}
                          </li>
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
                    <ul className="text-gray-600 list-disc list-inside">
                      {detail?.storeData?.selectedCountryTranslations?.map(
                        (translation, index) => (
                          <li key={index}>
                            <span className="font-bold text-lg">
                              {translation.name}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Other Information Section */}
                <div className="bg-white shadow-2xl border border-1 border-purple-300 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center font-serif">
                      Other Information
                    </h2>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-bold text-lg">
                          Selected Option:
                        </span>
                        {detail?.storeData?.selectedOption}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Selected Price:
                        </span>
                        ${detail?.storeData?.selectedPrice}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Status: </span>
                        {detail?.storeData?.status}
                      </p>
                    </div>
                  </div>
                </div>
                {detail?.formDataContract?.file != null && !filterData?.pdf ? (
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
                          {detail?.formDataContract?.selectedCompany
                            ? detail?.formDataContract?.selectedCompany
                            : "Not Added Yet"}
                        </p>
                        <p>
                          <span className="font-bold text-lg">
                            Company URL:{" "}
                          </span>
                          {detail?.formDataContract?.url
                            ? detail?.formDataContract?.url
                            : "Not Added Yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {filterData?.pdf && (
                      <Link
                        href={`https://files.imcwire.com${filterData?.pdf}`}
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
            {detail?.storeData?.action === "pending" ? (
              <div className="flex justify-center">
                <Link
                  className="btn-grad px-5 py-3"
                  href={`/press-dashboard/pr-balance/${linkId}/${id}/${detail?.id}`}
                >
                  Edit Detail
                </Link>
              </div>
            ) : (
              ""
            )}
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
