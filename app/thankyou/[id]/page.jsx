"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Page = ({ params }) => {
  const [paymentStatus, setPaymentStatus] = useState("Checking status...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (params.id) {
          setLoading(true);
          
          // Delay API call by 2 seconds
          setTimeout(async () => {
            // Fetch order status
            const response = await fetch(`/api/checkOrderStatus?ordId=${params.id}`);
            if (!response.ok) {
              throw new Error("Failed to fetch");
            }

            const data = await response.json();
            console.log("Data:", data);
            if (data && data?.orderStatusResult[1]?.OrderStatus === "PAID") {
              setPaymentStatus("Paid");
            } else {
              setPaymentStatus("Unpaid");
            }
            setLoading(false); // Stop loading after data processing
          }, 2000); // 2 seconds delay

        } else {
          setLoading(false); // Stop loading if there is no id
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        setPaymentStatus("Error checking status");
        setLoading(false); // Stop loading if there was an error
      }
    };

    fetchData();
  }, [params.id]);
  

//   if (loading) {
//     return <div>Loading...</div>; // Display a loading indicator when data is being fetched
//   }

  return (
    <div>
      <section>
        <div className="flex flex-wrap divide-x divide-gray-200">
          <div className="w-full lg:flex-1 p-8">
            <div className="flex flex-col justify-center px-4 text-center h-full">
              <div className="max-w-xl mx-auto">
                <div className="mb-12 text-7xl">🎉</div>
                <span className="mb-5 inline-block text-gray-400">
                  You have successfully ordered all items
                </span>
                <h2 className="mb-5 font-heading text-5xl text-">
                  Thank you for the order
                </h2>
                <p className="mb-20 text-gray-400">
                  Really nicely designed theme and quite fast loading. The
                  quickness of page loads you can really appreciate once for you
                  turn off page of the transition preloader in theme options.
                  Custom of a support was really quick.
                </p>
                <div className="mb-5  ">
                  <p className="text-lg text-gray-600 mb-6">
                    Checking Your order status:
                  </p>
                  {paymentStatus === "Checking..." ? (
                    <div className="flex justify-center items-center">
                      <ClipLoader color="#4A90E2" loading={true} size={50} />
                    </div>
                  ) : (
                    <p
                      className={`text-2xl font-semibold ${
                        paymentStatus === "Paid"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {paymentStatus}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap justify-center -m-2.5 mb-14">
                  <div className="w-auto p-2.5">
                    <a
                      href="#"
                      className="text-gray-900 hover:text-gray-800 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M36 18.1102C36 8.10799 27.9415 0 18.0022 0C8.05849 0.00224972 0 8.10799 0 18.1125C0 27.1496 6.58268 34.6412 15.1856 36V23.3453H10.6187V18.1125H15.1901V14.1192C15.1901 9.58155 17.8785 7.07537 21.9888 7.07537C23.9595 7.07537 26.018 7.42857 26.018 7.42857V11.883H23.748C21.5141 11.883 20.8166 13.2801 20.8166 14.7132V18.1102H25.8065L25.0101 23.3431H20.8144V35.9977C29.4173 34.6389 36 27.1474 36 18.1102Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="w-auto p-2.5">
                    <a
                      href="#"
                      className="text-gray-900 hover:text-gray-800 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M18 0C8.05875 0 0 8.05875 0 18C0 27.9412 8.05875 36 18 36C27.9412 36 36 27.9412 36 18C36 8.05875 27.9412 0 18 0ZM13.5937 25.4606H9.94875V13.7306H13.5937V25.4606ZM11.7487 12.2906C10.5975 12.2906 9.85312 11.475 9.85312 10.4662C9.85312 9.43687 10.62 8.64562 11.7956 8.64562C12.9712 8.64562 13.6912 9.43687 13.7137 10.4662C13.7137 11.475 12.9712 12.2906 11.7487 12.2906ZM26.9062 25.4606H23.2612V18.96C23.2612 17.4469 22.7325 16.4194 21.4144 16.4194C20.4075 16.4194 19.8094 17.115 19.545 17.7844C19.4475 18.0225 19.4231 18.36 19.4231 18.6956V25.4587H15.7762V17.4713C15.7762 16.0069 15.7294 14.7825 15.6806 13.7287H18.8475L19.0144 15.3581H19.0875C19.5675 14.5931 20.7431 13.4644 22.71 13.4644C25.1081 13.4644 26.9062 15.0712 26.9062 18.525V25.4606Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="w-auto p-2.5">
                    <a
                      href="#"
                      className="text-gray-900 hover:text-gray-800 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M18 0C8.05875 0 0 8.05875 0 18C0 27.9412 8.05875 36 18 36C27.9412 36 36 27.9412 36 18C36 8.05875 27.9412 0 18 0ZM25.3219 14.745C25.3294 14.8987 25.3312 15.0525 25.3312 15.2025C25.3312 19.89 21.7669 25.2919 15.2456 25.2919C13.3187 25.2951 11.4318 24.7416 9.81187 23.6981C10.0875 23.7319 10.3706 23.745 10.6575 23.745C12.3187 23.745 13.8469 23.1806 15.06 22.2281C14.3207 22.2136 13.6044 21.9688 13.0108 21.5278C12.4173 21.0869 11.9761 20.4717 11.7487 19.7681C12.2797 19.8691 12.8266 19.8479 13.3481 19.7062C12.5457 19.544 11.8241 19.1092 11.3057 18.4756C10.7873 17.842 10.504 17.0486 10.5037 16.23V16.1869C10.9819 16.4513 11.5294 16.6125 12.1106 16.6313C11.3584 16.1305 10.8258 15.3613 10.622 14.4809C10.4181 13.6005 10.5582 12.6755 11.0137 11.895C11.9043 12.99 13.0149 13.8858 14.2736 14.5243C15.5323 15.1629 16.911 15.53 18.3206 15.6019C18.1414 14.8412 18.2185 14.0426 18.54 13.3303C18.8615 12.618 19.4093 12.0319 20.0983 11.663C20.7872 11.2941 21.5788 11.1632 22.3498 11.2906C23.1208 11.418 23.8282 11.7966 24.3619 12.3675C25.1553 12.2105 25.9162 11.9195 26.6119 11.5069C26.3474 12.3284 25.7938 13.026 25.0537 13.47C25.7566 13.3853 26.4429 13.1964 27.09 12.9094C26.6147 13.6217 26.0159 14.2433 25.3219 14.745Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <Link
                  href="/press-dashboard/pr-balance"
                  className="bg-gray-900 rounded-full hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 text-white text-xs font-semibold px-4 h-9 inline-flex items-center transition duration-200"
                >
                  Visit Our PR Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
