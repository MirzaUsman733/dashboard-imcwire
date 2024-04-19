"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";

const Page = ({ params }) => {
  const id = params.id;
  const linkId = params.linkId;
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true); 

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
    } finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);
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
        <div className="container-lg lg:max-w-7xl mx-auto mt-32">
          <h1
            className="text-6xl font-serif font-bold text-center mb-20 "
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
                        {detail?.formData?.name}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Email: </span>
                        {detail?.formData?.email}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Phone: </span>
                        {detail?.formData?.phone}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Company Name:{" "}
                        </span>
                        {detail?.formData?.companyName}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Address: </span>
                        {detail?.formData?.address}
                      </p>
                      <p>
                        <span className="font-bold text-lg"> Website: </span>
                        <a href={detail?.formData?.websiteUrl} target="_blank">
                          {detail?.formData?.websiteUrl}
                        </a>
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
                        {detail?.storeData?.action}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Agency Name: </span>
                        {detail?.storeData?.agencyName}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Category Subtotal:
                        </span>
                        {detail?.storeData?.categorySubtotal}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Cost: </span> $
                        {detail?.storeData?.cost}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Country Subtotal:
                        </span>
                        {detail?.storeData?.countrySubTotal}
                      </p>
                      <p>
                        <span className="font-bold text-lg">
                          Country Translations Price:
                        </span>
                        {detail?.storeData?.countryTranslationsPrice}
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
                        {detail?.storeData?.matchedPlanData?.planDescription}
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

                {/* Form Data Contract Section */}
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
                        {detail?.formDataContract?.selectedCompany}
                      </p>
                      <p>
                        <span className="font-bold text-lg">Company URL: </span>
                        {detail?.formDataContract?.url}
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
