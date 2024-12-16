'use client'
import { useState, useEffect } from 'react';
import Link from "next/link";

const ResponseOfApi = ({ dataResponse }) => {
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);

  // useEffect to handle the loading state based on dataResponse availability
  useEffect(() => {
    if (dataResponse) {
      setOrderStatus(dataResponse.orderResultData[1].OrderStatus);
      setLoading(false);  // Set loading to false when data is available
    }
  }, [dataResponse]);  // Dependency array includes dataResponse to re-run when it changes

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;  // Show loading message while data is not available
  }

  return (
    <div>
      <section>
        <div className="flex flex-wrap divide-x divide-gray-200">
          <div className="w-full lg:flex-1 px-8">
            <div className="flex flex-col items-center justify-center px-4 text-center h-screen overflow-y-hidden">
              <div className="max-w-xl mx-auto">
                {/* Update Icon and Message Based on Payment Status */}
                {orderStatus === "PAID" ? (
                  <>
                    <div className="mb-12 text-7xl">🎉</div>
                    <span className="mb-5 inline-block text-gray-400">
                      You have successfully ordered all items.
                    </span>
                  </>
                ) : (
                  <>
                    <div className="mb-12 text-7xl">🚫</div>
                    <span className="mb-5 inline-block text-gray-400">
                      Your payment was unsuccessful.
                    </span>
                  </>
                )}
                <h2 className="mb-5 font-black text-4xl">
                  {orderStatus === "PAID"
                    ? "Thank you for your order!"
                    : "Payment Declined"}
                </h2>
                <p className="mb-5 text-gray-400">
                  {orderStatus === "PAID"
                    ? "Payment successful! We appreciate your business and are processing your order now."
                    : "Please check your payment details and try again. Contact support if the issue persists."}
                </p>
                <div className="mb-5">
                  <p className="text-lg text-gray-600 mb-6">
                    Checking your order status:
                  </p>
                  <p
                    className={`text-2xl font-semibold ${
                      orderStatus === "PAID"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {orderStatus}
                  </p>
                </div>
                {orderStatus === "PAID" ? (
                  <Link
                    className="bg-gray-900 rounded-full hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 text-white text-xs font-semibold px-4 h-9 inline-flex items-center transition duration-200"
                    href="/press-dashboard/pr-balance"
                  >
                    Visit Our PR Dashboard
                  </Link>
                ) : (
                  <Link
                    className="bg-gray-900 rounded-full hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 text-white text-xs font-semibold px-4 h-9 inline-flex items-center transition duration-200"
                    href="https://imcwire.com/contact/"
                  >
                    Contact With Support Team
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponseOfApi;
