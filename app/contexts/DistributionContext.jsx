"use client";
import React, { createContext, useContext, useState } from "react";

const DistributionContext = createContext();

export const useDistributionContext = () => useContext(DistributionContext);

export const DistributionProvider = ({ children }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCountryTranslations, setSelectedCountryTranslations] =
    useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [matchedPlanData, setMatchedPlanData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("imcwirePr");
  const [cost, setCost] = useState(120);
  const [coupon, setCoupon] = useState(null);
  const categories = [
    { name: "General", price: 0 },
    { name: "Technology", price: 40 },
    { name: "Health", price: 40 },
    { name: "Finance", price: 40 },
    { name: "Artificial Intelligence", price: 40 },
    { name: "Business & Entrepreneurship", price: 40 },
    { name: "Science & Innovation", price: 40 },
    { name: "Arts & Entertainment", price: 40 },
    { name: "Education & Learning", price: 40 },
    { name: "Environment & Sustainability", price: 40 },
    { name: "Travel & Adventure", price: 40 },
    { name: "Food & Nutrition", price: 40 },
    { name: "Lifestyle & Fashion", price: 40 },
    { name: "Sports & Fitness", price: 40 },
    { name: "Politics & Current Affairs", price: 40 },
    { name: "Literature & Writing", price: 40 },
    { name: "History & Culture", price: 40 },
    { name: "Gaming & Esports", price: 40 },
    { name: "Home & Garden", price: 40 },
    { name: "Parenting & Family", price: 40 },
    { name: "Relationships & Dating", price: 40 },
    { name: "Spirituality & Religion", price: 40 },
  ];
// jkdsfk
  const countries = [
    { name: "global", price: 0 },
    { name: "Brazil ", price: 40 },
    { name: "Italy", price: 40 },
    { name: "Spain", price: 40 },
    { name: "United States", price: 40 },
    { name: "France", price: 40 },
    { name: "Germany", price: 40 },
    { name: "Netherlands", price: 40 },
    { name: "Saudi Arabia", price: 40 },
    { name: "Poland", price: 40 },
    { name: "Vietnam ", price: 40 },
    { name: "India ", price: 40 },
    { name: "Pakistan", price: 40 },
    { name: "South Africa", price: 40 },
    { name: "Singapore", price: 40 },
    { name: "Japan", price: 40 },
    { name: "Philippines ", price: 40 },
    { name: "Indonesia", price: 40 },
    { name: "Hong Kong", price: 40 },
    { name: "South Korea", price: 40 },
    { name: "Morocco ", price: 40 },
    { name: "Romania", price: 40 },
    { name: "Thailand ", price: 40 },
    { name: "Taiwan", price: 40 },
    { name: "Ukraine", price: 40 },
    { name: "Peru", price: 40 },
    { name: "Ireland", price: 40 },
    { name: "Russia", price: 40 },
    { name: "Sweden", price: 40 },
    { name: "Azerbaijan", price: 40 },
    { name: "Bangladesh", price: 40 },
    { name: "Greece", price: 40 },
    { name: "Sri Lanka", price: 40 },
    { name: "Kenya", price: 40 },
  ];

  const storeMatchedPlanData = (data) => {
    setMatchedPlanData(data);
  };
  const storePrice = (price) => {
    setSelectedPrice(price);
  };
  const applyCoupon = (couponData) => {
    setCoupon(couponData);
  };
  // const calculateSubtotal = (items) => {
  //   return items.reduce((total, item) => total + item.price, 0);
  // };

  const calculateSubtotal = (items) => {
    return items.reduce((total, item, index) => total + (index ? item.price : 0), 0); // Charging only for items beyond the first
  };

  const calculateTotalPrice = () => {
    let total = selectedPrice || 0;
  total += calculateSubtotal(selectedCategories);
  total += calculateSubtotal(selectedCountries);
  
  selectedCountryTranslations.forEach((country) => {
    total += country.translationPrice || 0;
  });
  total += cost * matchedPlanData?.numberOfPR;
  
    // Apply coupon discount if a coupon is applied
    if (coupon) {
      const discountAmount = (total * coupon.discountPercentage) / 100;
      total -= discountAmount;
    }
    return total;
  };
  

   const toggleCountryTranslation = (country) => {
    const found = selectedCountryTranslations.some((trans) => trans.name === country.name);
    if (!found) {
      setSelectedCountryTranslations([...selectedCountryTranslations, { ...country, translationPrice: selectedCountryTranslations.length === 0 ? 0 : 20 }]);
    } else {
      const newTranslations = selectedCountryTranslations.filter((item) => item.name !== country.name);
      setSelectedCountryTranslations(newTranslations);
      // Recalculate translation prices when a country is removed
      newTranslations.forEach((trans, idx) => trans.translationPrice = idx ? 20 : 0);
    }
  };
  const contextValue = {
    selectedCategories,
    selectedCountries,
    selectedCountryTranslations,
    categories,
    countries,
    selectedPrice,
    storePrice,
    cost,
    setCost,
    matchedPlanData,
    storeMatchedPlanData,
    selectedOption,
    setSelectedOption,
    applyCoupon, 
    coupon, 
    categorySubtotal: calculateSubtotal(selectedCategories),
    countrySubtotal: calculateSubtotal(selectedCountries),
    countryTranslationsPrice: selectedCountryTranslations.length * 20,
    totalPrice: calculateTotalPrice(),
    // addCategory: (category) =>
    //   setSelectedCategories([...selectedCategories, category]),
    addCategory: (category) => {
      setSelectedCategories([...selectedCategories, { ...category, price: selectedCategories.length === 0 ? 0 : category.price }]);
    },
    removeCategory: (index) => {
      const newCategories = [...selectedCategories];
      newCategories.splice(index, 1);
      setSelectedCategories(newCategories);
      // Recalculate prices when a category is removed
      newCategories.forEach((cat, idx) => cat.price = idx ? cat.price : 0);
    },
    addCountry: (country) => {
      setSelectedCountries([...selectedCountries, { ...country, price: selectedCountries.length === 0 ? 0 : country.price }]);
    },
    removeCountry: (index) => {
      const newCountries = [...selectedCountries];
      newCountries.splice(index, 1);
      setSelectedCountries(newCountries);
      // Recalculate prices when a country is removed
      newCountries.forEach((country, idx) => country.price = idx ? country.price : 0);
    },
    toggleCountryTranslation,
  };

  return (
    <DistributionContext.Provider value={contextValue}>
      {children}
    </DistributionContext.Provider>
  );
};
