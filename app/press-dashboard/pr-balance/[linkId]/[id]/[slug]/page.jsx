"use client";
import React, { useCallback, useEffect, useState } from "react";
import PublicationdetailUpdate from "../../../../../components/PublicationsDetailUpdate";
import { useUpdateData } from "../../../../../contexts/updateDataContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TawkTo from "../../../../../components/TawkTo";

const Page = ({ params }) => {
  const id = params.slug;
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { publicationData, setPublicationData } = useUpdateData();
  const [detail, setDetail] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(true);
  const [pdf, setPdf] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail?_id=" + id);
      if (response.ok) {
        const detailData = await response.json();
        setDetail(detailData);
        setPublicationData(detailData.formDataContract);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setFetchingDetail(false);
    }
  }, [id, setPublicationData]);

  useEffect(() => {
    if (fetchingDetail) {
      fetchDetail();
    }
  }, [fetchingDetail, fetchDetail]);

  const fetchFiles = async () => {
    try {
      const uniId = detail?.formDataContract?.file;
      const response = await fetch("/api/uploadPdf?_id=" + uniId);
      if (response.ok) {
        const uniqueData = await response.json();
        setPdf(uniqueData?.pdf);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    if (detail?.formDataContract?.file != null) {
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
        setPublicationData(updatedData.formDataContract);
        
        router.push("/press-dashboard/pr-balance");
      } else {
        console.error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      const response = await fetch(
        "/api/uploadPdf?_id=" + detail?.formDataContract?.file,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPdf(result?.pdf);
        router.push("/press-dashboard/pr-balance");
      } else {
        console.error("Failed to update PDF");
      }
    } catch (error) {
      console.error("Error updating PDF:", error);
    }
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  return (
    <div className="container-lg lg:max-w-7xl mx-auto mt-32">
      <TawkTo />
      <div className="container mx-auto px-4 py-8">
        <div>
          <div className="mt-18">
            <PublicationdetailUpdate
              pdf={pdf}
              detail={detail}
              handleEditSubmit={handleEditSubmit}
              handleFileUpload={handleFileUpload}
              publicationData={publicationData}
              setPublicationData={setPublicationData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
