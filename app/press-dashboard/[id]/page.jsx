'use client'
import React, { useCallback, useEffect, useState } from "react";
import PublicationDetail from "../../components/PublicationDetail";
import { useData } from "../../contexts/DataContext";
import CompanyInfoPersonal from "../../components/CompanyInfoPersonal";
import TimelineCreate from "../../components/TimelineDetail";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";

const Page = ({ params }) => {
  const id = params.id;
  const {
    storeMatchedData,
    matchedData,
    formData,
    setFormData,
    publicationData,
    setPublicationData,
  } = useData();
  const [showFirstComponent, setShowFirstComponent] = useState(false);
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [plans, setPlans] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailAvailable, setDetailAvailable] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const { data: session, status: sessionStatus } = useSession();

  const router = useRouter();
  const handleNextButtonClick = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(true);
  };
  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch("/api/compaignData?_id=" + id);
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
        setShowFirstComponent(true);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false); 
    }
  }, [id]);
  useEffect(() => {
    fetchPlans();
  }, []);
  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail");
      if (response.ok) {
        const detailData = await response.json();
        const clientidData = detailData.filter(
          (data) => data.storeData.clientId == plans.clientId
        );
        setDetail(clientidData);
        setDetailAvailable(true);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  }, [plans]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (plans) {
      storeMatchedData(plans);
    }
  }, [plans, storeMatchedData]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  console.log("Number of PR", plans?.matchedPlanData?.numberOfPR);
  const numberOfPRInComponents = plans?.matchedPlanData?.numberOfPR;
  console.log("Detail Length", detail?.length);
  const lengthOfDetail = detail?.length;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <InfinitySpin visible={true} width={50} color="#7E22CE" />
      </div>
    );
  }
  if (lengthOfDetail >= numberOfPRInComponents) {
    return router.replace("/press-dashboard/pr-balance");
  }
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
                <div>
                  <CompanyInfoPersonal
                    onNextButtonClick={handleNextButtonClick}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              )}
              {showSecondComponent && (
                <div>
                  <PublicationDetail
                    publicationData={publicationData}
                    setPublicationData={setPublicationData}
                    formData={formData}
                    storeData={matchedData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
