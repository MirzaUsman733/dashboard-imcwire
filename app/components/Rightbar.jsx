import React, { useEffect, useState } from "react";
import { useDistributionContext } from "../contexts/DistributionContext";
import { FiTag } from "react-icons/fi";
import { TbWorldCheck } from "react-icons/tb";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Rightbar = () => {
  const {
    selectedCategories,
    selectedCountries,
    categorySubtotal,
    countrySubtotal,
    totalPrice,
    selectedPrice,
    applyCoupon,
    cost,
    matchedPlanData,
    selectedOption
    
  } = useDistributionContext();
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons");
      if (response.ok) {
        const couponsData = await response.json();
        setCoupons(couponsData);
      } else {
        console.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);
  const handleApplyCoupon = () => {
    // Find the coupon with the matching code
    const appliedCoupon = coupons.find(
      (coupon) => coupon.couponCode === couponCode
    );
    if (appliedCoupon) {
      applyCoupon(appliedCoupon);
      setSnackbarSeverity("success");
      setSnackbarMessage(
        `Coupon "${appliedCoupon.couponCode}" applied. You get a ${appliedCoupon.discountPercentage}% discount.`
      );
      setSnackbarOpen(true);
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Invalid coupon code");
      setSnackbarOpen(true);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const planPrice = cost * matchedPlanData?.numberOfPR;
  console.log(coupons);
  return (
    <div className="rightbar-container bg-white border border-1 shadow-lg rounded-lg p-6">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <h1 className="text-2xl font-bold text-center mb-4">
        Your Campaign Summary
      </h1>
      <div className="mb-4">
        <div className="flex justify-between">
          <div>Base Price:</div>
          <div>${selectedPrice}</div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="mb-4">
        {selectedCategories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              <FiTag className="inline mr-2" /> Selected Categories
            </h2>
            <ul>
              {selectedCategories.map((category, index) => (
                <>
                  <li key={index} className="flex justify-between">
                    <div>{category.name}</div>
                    <div>${category.price}</div>
                  </li>
                  <hr className="my-1" />
                </>
              ))}
              <li className="flex justify-between font-semibold">
                <div>Subtotal:</div>
                <div>${categorySubtotal}</div>
              </li>
            </ul>
            <hr className="mt-1" />
          </div>
        )}
        {selectedCountries.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              <TbWorldCheck size={25} className="inline mr-2 mb-1" /> Selected
              Countries
            </h2>
            <ul>
              {selectedCountries.map((country, index) => (
                <>
                  <li key={index} className="flex justify-between">
                    <div>{country.name}</div>
                    <div>${country.price}</div>
                  </li>
                  <hr className="my-1" />
                </>
              ))}
              <li className="flex justify-between font-semibold">
                <div>Subtotal:</div>
                <div>${countrySubtotal}</div>
              </li>
            </ul>
          </div>
        )}
        {planPrice > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              <TbWorldCheck size={25} className="inline mr-2 mb-1" /> Selected
              PR Plan
            </h2>
            <ul>
              {selectedOption && planPrice &&
                <>
                  <li className="flex justify-between">
                    <div>Plan By {selectedOption} </div>
                    <div>${cost} * {matchedPlanData?.numberOfPR} =  ${planPrice}</div>
                  </li>
                  <hr className="my-1" />
                </>
              }
            </ul>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between mt-4">
          <div className="font-bold text-lg text-purple-700">Total</div>
          <div className="font-bold text-lg text-purple-700">${totalPrice}</div>
        </div>
        {/* <div className="mt-4 flex justify-center items-center">
          <input
            type="email"
            placeholder="Enter Promo Code"
            className="p-2 border border-gray-300 focus:border-purple-700 rounded focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
          <button className="ml-2 px-4 py-2 btn-grad uppercase text-center">
            Apply
          </button>
        </div> */}
        <div className="mt-4 flex justify-center items-center">
          <input
            type="text"
            placeholder="Enter Promo Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="p-2 border border-gray-300 focus:border-purple-700 rounded focus:outline-none focus:ring-1 focus:ring-purple-700"
          />
          <button
            onClick={handleApplyCoupon}
            className="ml-2 px-4 py-2 btn-grad uppercase text-center"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
