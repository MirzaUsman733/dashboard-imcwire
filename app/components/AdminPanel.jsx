import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

function AdminPanel() {
  const { data: session, status: sessionStatus } = useSession();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [compaignData, setCompaignData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiCallsCompleted, setApiCallsCompleted] = useState(0);
  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/compaignData");
      if (response.ok) {
        const plansData = await response?.json();
        const paidPlans = plansData?.filter((plan) => plan?.status === "paid");
        setCompaignData(paidPlans);
        setApiCallsCompleted((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  // useEffect(() => {
  //   if (session) {
  //     fetchPlans();
  //   }
  // }, [session]);
  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail");
      if (response.ok) {
        const detailData = await response.json();
        const clientidData = detailData?.filter(
          (data) => data.storeData.action != "completed"
        );
        setDetail(clientidData);
        setApiCallsCompleted((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchPlans();
      fetchDetail();
    }
  }, [session]);
  useEffect(() => {
    if (compaignData) {
      const total = compaignData.reduce(
        (acc, campaign) => acc + campaign.totalPrice,
        0
      );
      setTotalRevenue(total);
      setApiCallsCompleted((prevCount) => prevCount + 1);
    }
  }, [compaignData]);
  useEffect(() => {
    if (apiCallsCompleted === 2) {
      setLoading(false);
    }
  }, [apiCallsCompleted]);
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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">
            Total Revenue
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <line x1="12" x2="12" y1="2" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div className="p-6">
          <div className="text-2xl font-bold">${totalRevenue}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +20.1% from last month
          </p>
        </div>
      </div>

      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">
            Subscriptions
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="p-6">
          <div className="text-2xl font-bold">{compaignData?.length}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +180.1% from last month
          </p>
        </div>
      </div>

      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">
            Sales
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
            <line x1="2" x2="22" y1="10" y2="10"></line>
          </svg>
        </div>
        <div className="p-6">
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +19% from last month
          </p>
        </div>
      </div>

      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        data-v0-t="card"
      >
        <div className="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="whitespace-nowrap tracking-tight text-sm font-medium">
            Active Now
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div className="p-6">
          <div className="text-2xl font-bold">+{detail?.length}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +201 since last hour
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
