'use client'
import React, { useCallback, useEffect, useState } from "react";
import PublicationDetail from "../../components/PublicationDetail";
import { useData } from "../../contexts/DataContext";
// import CompanyInfoPersonal from "../../components/CompanyInfoPersonal";
// import TimelineCreate from "../../components/TimelineDetail";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InfinitySpin } from "react-loader-spinner";
import TawkTo from "../../components/TawkTo";

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
  // const [showFirstComponent, setShowFirstComponent] = useState(false);
  // const [showSecondComponent, setShowSecondComponent] = useState(false);
  // const [showComponent, setShowComponent] = useState(false);
  const [plans, setPlans] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailAvailable, setDetailAvailable] = useState(false);
  const [loading, setLoading] = useState(true); 
  const { data: session, status: sessionStatus } = useSession();
  // const [agencyName, setAgencyName] = useState("")

  const router = useRouter();
  // const handleNextButtonClick = () => {
  //   setShowFirstComponent(false);
  //   setShowSecondComponent(true);
  // };
  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch("/api/compaignData?_id=" + id);
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
        // setAgencyName(plansData?.agencyName)
        // setShowFirstComponent(true);
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
        const clientidData = detailData?.filter(
          (data) => data?.storeData?.clientId === plans?.clientId
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
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const numberOfPRInComponents = plans?.matchedPlanData?.numberOfPR;
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
      <TawkTo/>
      <div className="container-lg lg:max-w-7xl mx-auto mt-32">
      <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">
        Press Release Order
      </h1>
        <div className="grid grid-cols-12 gap-4">
          {/* <div className="col-span-3 sm:col-span-4 md:col-span-3">
            <TimelineCreate
              firstComponentShow={showFirstComponent}
              secondComponentShow={showSecondComponent}
            />
          </div> */}
          <div className="col-span-12">
            <div className="mt-18">
              {/* {showFirstComponent && (
                <div>
                  <CompanyInfoPersonal
                    onNextButtonClick={handleNextButtonClick}
                    formData={formData}
                    setFormData={setFormData}
                    agencyName={agencyName}
                  />
                </div>
              )} */}
                <div>
                  <PublicationDetail
                    publicationData={publicationData}
                    setPublicationData={setPublicationData}
                    formData={formData}
                    storeData={matchedData}
                    setFormData={setFormData}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
