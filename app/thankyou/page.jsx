// pages/thankyou.js

"use client";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const [queryParams, setQueryParams] = useState({});
  const [paymentStatus, setPaymentStatus] = useState("Checking...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {
        status: urlParams.get("status"),
        ordId: urlParams.get("ordId"),
        msg: urlParams.get("msg"),
      };
      setQueryParams(params);
    }
  }, []); 
  useEffect(() => {
    if (queryParams.ordId) {
      // Fetch order status
      fetch(`/api/checkOrderStatus?ordId=${queryParams.ordId}`)
        .then((res) => res.json())
          // console.log(res)
          
        .then((data) => {
          console.log("Data",data)
          if (data.orderStatusResult[1].OrderStatus === "PAID") {
            setPaymentStatus("Paid");
          } else {
            setPaymentStatus("Unpaid");
          }
        })
        .catch((err) => {
          console.error("Error checking payment status:", err);
          setPaymentStatus("Error checking status");
        });
    }
  }, [queryParams.ordId]);

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //     <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-all duration-500 ease-in-out">
    //         <Image
    //             src="data:image/jpeg;base64,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"
    //             alt="Thank You"
    //             width={200}
    //             height={200}
    //             className="mx-auto mb-4 animate-fadeIn"
    //         />
    //         <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif">Thank You for Your Order</h1>
    //         <p className="text-lg text-gray-600 mb-6">Your order status:</p>
    //         {paymentStatus === 'Checking...' ? (
    //             <div className="flex justify-center items-center">
    //                 <ClipLoader color="#4A90E2" loading={true} size={50} />
    //             </div>
    //         ) : (
    //             <p className={`text-2xl font-semibold ${paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>
    //                 {paymentStatus}
    //             </p>
    //         )}
    //     </div>
    // </div>
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
