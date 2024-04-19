'use client'
import React, { useEffect, useState } from "react";
import { useDistributionContext } from "../../contexts/DistributionContext";
import ContactForm from "../../components/ContactForm";
import TimelineCreate from "../../components/Timeline";
import Rightbar from "../../components/Rightbar";
import SignupForm from "../../components/SignupForm";
import PaymentGateWay from "../../components/PaymentGateway";
import ChooseDistribution from "../../components/ChooseDistribution";
import { InfinitySpin } from "react-loader-spinner";

const Page = ({ params }) => {
  const id = params.slug;
  const [loading, setLoading] = useState(true);
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showThirdComponent, setShowThirdComponent] = useState(false);
  const [showFourthComponent, setShowFourthComponent] = useState(false);
  const {
    storePrice,
    storeMatchedPlanData,
    matchedPlanData,
    selectedCategories,
    selectedCountries,
    categories,
    countries,
    addCategory,
    removeCategory,
    addCountry,
    removeCountry,
    toggleCountryTranslation,
    selectedCountryTranslations,
  } = useDistributionContext();

  
  const [plans, setPlans] = useState([]);

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
  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      if (response.ok) {
        const plansData = await response.json();
        console.log("Fetched plans data:", plansData); // Log fetched data
        setPlans(plansData);
        setLoading(false); // Set loading to false after fetching plans
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  
  const matchedPlan = plans?.find((plan) => plan?.id == id);
  useEffect(() => {
    fetchPlans();
  }, []);
  useEffect(() => {
    if (matchedPlan) {
      storeMatchedPlanData(matchedPlan);
      storePrice(matchedPlan.totalPlanPrice);
    }
  }, [matchedPlan, storeMatchedPlanData, storePrice]);

  if (loading) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width={200}
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  } else if (matchedPlan) {
    return (
      <div className="container-lg lg:max-w-7xl mx-auto mt-52">
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
                  <ChooseDistribution
                    selectedCategories={selectedCategories}
                    selectedCountries={selectedCountries}
                    categories={categories}
                    countries={countries}
                    addCategory={addCategory}
                    removeCategory={removeCategory}
                    addCountry={addCountry}
                    removeCountry={removeCountry}
                    toggleCountryTranslation={toggleCountryTranslation}
                    selectedCountryTranslations={selectedCountryTranslations}
                    onNextButtonClick={handleNextButtonClick}
                  />
                </div>
              )}
              {showSecondComponent && (
                <div>
                  <ContactForm onNextButtonClick1={handleNextButtonClick1} />
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
  } else {
    return (
      <div>
        Failed to fetch plans.
      </div>
    );
  }
};

export default Page;
