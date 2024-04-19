'use client'
import React, { useCallback, useEffect, useState } from "react";
import PublicationdetailUpdate from "../../../components/PublicationsDetailUpdate";
import CompanyInfoPersonalUpdate from "../../../components/CompanyInfoPersonalUpdate";
import TimelineCreate from "../../../components/TimelineDetail";
import { useUpdateData } from "../../../contexts/updateDataContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";

const Page = ({ params }) => {
  const id = params.slug;
  const router = useRouter();
  const { formData, setFormData, publicationData, setPublicationData } =
    useUpdateData();
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [detail, setDetail] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(true);
  const [loading, setLoading] = useState(true); 
  const { data: session, status: sessionStatus } = useSession();
  const handleNextButtonClick = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(true);
  };

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
      setLoading(false); // Set loading to false when done fetching
    }
  }, [id, setFormData, setPublicationData]);

  useEffect(() => {
    if (fetchingDetail) {
      fetchDetail();
    }
  }, [fetchingDetail, fetchDetail]);

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
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <InfinitySpin visible={true} width={50} color="#7E22CE" />
      </div>
    );
  }
  return (
    <div className="container-lg lg:max-w-7xl mx-auto mt-32">
      <h1>Press Release Order</h1>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 sm:col-span-4 md:col-span-3">
            <TimelineCreate
              firstComponentShow={showFirstComponent}
              secondComponentShow={showSecondComponent}
            />
          </div>
          <div className="col-span-9 sm:col-span-8 md:col-span-9">
            <div className="mt-18">
              {showFirstComponent && (
                <CompanyInfoPersonalUpdate
                  onNextButtonClick={handleNextButtonClick}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              {showSecondComponent && (
                <PublicationdetailUpdate
                  publicationData={publicationData}
                  setPublicationData={setPublicationData}
                  formData={formData}
                  detail={detail}
                  handleEditSubmit={handleEditSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
