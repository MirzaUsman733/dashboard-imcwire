import Link from "next/link";

const ResponceOfApi = ({ dataResponce }) => {
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
                <h2 className="mb-5 font-heading text-5xl">
                  Thank you for the order
                </h2>
                <p className="mb-20 text-gray-400">
                  Really nicely designed theme and quite fast loading. The
                  quickness of page loads you can really appreciate once for you
                  turn off page of the transition preloader in theme options.
                  Custom of a support was really quick.
                </p>
                <div className="mb-5">
                  <p className="text-lg text-gray-600 mb-6">
                    Checking Your order status:
                  </p>
                  {dataResponce.orderResultData[1].OrderStatus === "Checking status..." ? (
                    "loading"
                  ) : (
                    <p
                      className={`text-2xl font-semibold ${
                        dataResponce?.orderResultData[1].OrderStatus == 'PAID'
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {dataResponce?.orderResultData[1].OrderStatus}
                    </p>
                  )}
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

export default ResponceOfApi;
