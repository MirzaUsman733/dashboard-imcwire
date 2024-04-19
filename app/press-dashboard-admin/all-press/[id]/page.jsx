"use client";
import React, { useCallback, useEffect, useState } from "react";
import TimelineCreate from "../../../components/TimelineDetail";
import Rightbar from "../../../components/Rightbar";
import SignupForm from "../../../components/SignupForm";
import PaymentGateWay from "../../../components/PaymentGateway";
import PublicationDetail from '../../../components/PublicationDetail'
import { useData } from '../../../contexts/DataContext';
import CompanyInfoPersonal from "../../../components/CompanyInfoPersonal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Page = ({ params }) => {
  const id = params.id;
  console.log(id)
  const {
    storeMatchedData,
    matchedData,
    formData,
    setFormData,
    publicationData, 
    setPublicationData
  } = useData();
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showThirdComponent, setShowThirdComponent] = useState(false);
  const [showFourthComponent, setShowFourthComponent] = useState(false);
  const [plans, setPlans] = useState({});
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter()
  useEffect(() => {
    if( session?.user?.role === 'user'){
      router.replace("/press-dashboard/pr-balance");
    }
    else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  
  const handleNextButtonClick = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(true);
    setShowThirdComponent(false);
    setShowFourthComponent(false);
  };

  const handleNextButtonClick1 = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(false);
    setShowThirdComponent(true);
    setShowFourthComponent(false);
  };
  const handleNextButtonClick2 = () => {
    setShowFirstComponent(false);
    setShowSecondComponent(false);
    setShowThirdComponent(false);
    setShowFourthComponent(true);
  };
  const fetchPlans = useCallback(async () => {
        try {
          const response = await fetch("/api/compaignData?_id=" + id);
          if (response.ok) {
            const plansData = await response.json();
            setPlans(plansData);
          } else {
            console.error("Failed to fetch plans");
          }
        } catch (error) {
          console.error("Error fetching plans:", error);
        }
      }, [id]);
    
      useEffect(() => {
        fetchPlans();
      }, [fetchPlans]);
      useEffect(() => {
        if (plans) {
          storeMatchedData(plans);
        }
      }, [plans, storeMatchedData]);
    return (
          
      <div className="container-lg lg:max-w-7xl mx-auto mt-40">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 sm:col-span-4 md:col-span-2 lg:col-span-3">
            <TimelineCreate
              firstComponentShow={showFirstComponent}
              secondComponentShow={showSecondComponent}
              thirdComponentShow={showThirdComponent}
              fourthComponentShow={showFourthComponent}
            />
          </div>
          <div className="col-span-9 sm:col-span-8 md:col-span-5 lg:col-span-5">
            <div className="mt-18">
              {showFirstComponent && (
                <div>
                  <CompanyInfoPersonal onNextButtonClick={handleNextButtonClick} formData={formData} setFormData={setFormData} />
                </div>
              )}
              {showSecondComponent && (
                <div>
                  <PublicationDetail publicationData={publicationData} setPublicationData={setPublicationData} formData={formData} storeData={matchedData} onNextButtonClick1={handleNextButtonClick1} />
                </div>
              )}
              {showThirdComponent && (
                <>
                  <SignupForm onNextButtonClick2={handleNextButtonClick2} />
                </>
              )}
              {showFourthComponent && (
                <>
                  <PaymentGateWay />
                </>
              )}
            </div>
          </div>
          <div className="col-span-10 mx-auto sm:col-span-10 sm:mx-auto md:col-span-5 lg:col-span-4">
            <Rightbar />
          </div>
        </div>
      </div>
    );
  }
export default Page;
