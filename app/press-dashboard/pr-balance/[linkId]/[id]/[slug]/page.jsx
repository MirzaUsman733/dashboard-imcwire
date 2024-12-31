"use client";
import React, { useCallback, useEffect, useState } from "react";
import PublicationdetailUpdate from "../../../../../components/PublicationsDetailUpdate";
import CompanyInfoPersonalUpdate from "../../../../../components/CompanyInfoPersonalUpdate";
import TimelineCreate from "../../../../../components/TimelineDetail";
import { useUpdateData } from "../../../../../contexts/updateDataContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TawkTo from "../../../../../components/TawkTo";

const Page = ({ params }) => {
  const id = params.slug;
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { formData, setFormData, publicationData, setPublicationData } =
    useUpdateData();
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(true);

  const handleNextButtonClick = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(true);
  };
  console.log("formData",formData)
  console.log("formData",publicationData)
  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail?_id=" + id);
      if (response.ok) {
        const detailData = await response.json();
        setDetail(detailData);
        setFormData(detailData.formData);
        setPublicationData(detailData.formDataContract);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setFetchingDetail(false);
    }
  }, [id, setFormData, setPublicationData]);

  useEffect(() => {
    if (fetchingDetail) {
      fetchDetail();
    }
  }, [fetchingDetail, fetchDetail]);
 const fetchFiles = async () => {
    if (detail?.formDataContract.file != null) {
      try {
        const uniId = detail?.formDataContract?.file;
        const response = await fetch("/api/uploadPdf?_id=" + uniId);
        if (response.ok) {
          const uniqueData = await response.json();
          console.log("Unique Data", uniqueData);
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
  const handleEditSubmit = async (updatedData) => {
    try {
      const response = await fetch("/api/submit-detail?_id=" + id, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setFormData(updatedData.formData);
        setPublicationData(updatedData.formDataContract);
        router.push("/press-dashboard/pr-balance");
      } else {
        console.error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
console.log("fetchingDetail",fetchingDetail)
  return (
    <div className="container-lg lg:max-w-7xl mx-auto mt-32">
      <TawkTo/>
      {/* <h1>Press Release Order</h1> */}
      <div className="container mx-auto px-4 py-8">
        {/* <div className="grid grid-cols-12 gap-4"> */}
          {/* <div className="col-span-3 sm:col-span-4 md:col-span-3">
            <TimelineCreate
              firstComponentShow={showFirstComponent}
              secondComponentShow={showSecondComponent}
            />
          </div> */}
          <div>
            <div className="mt-18">
              {/* {showFirstComponent && (
                <CompanyInfoPersonalUpdate
                  onNextButtonClick={handleNextButtonClick}
                  formData={formData}
                  setFormData={setFormData}
                />
              )} */}
              {/* {showSecondComponent && ( */}
                <PublicationdetailUpdate
                  publicationData={publicationData}
                  setPublicationData={setPublicationData}
                  formData={formData}
                  detail={detail}
                  handleEditSubmit={handleEditSubmit}
                  fetchFiles={fetchFiles} 
                />
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default Page;
