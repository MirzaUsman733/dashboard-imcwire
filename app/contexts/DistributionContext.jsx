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

  const countries = [
    { name: "global", price: 0 },
    { name: "Brazil ", price: 100 },
    { name: "Italy", price: 100 },
    { name: "Spain", price: 90 },
    { name: "United States", price: 100 },
    { name: "France", price: 100 },
    { name: "Germany", price: 100 },
    { name: "Netherlands", price: 90 },
    { name: "Saudi Arabia", price: 100 },
    { name: "Poland", price: 100 },
    { name: "Vietnam ", price: 80 },
    { name: "India ", price: 80 },
    { name: "Pakistan", price: 80 },
    { name: "South Africa", price: 100 },
    { name: "Singapore", price: 80 },
    { name: "Japan", price: 100 },
    { name: "Philippines ", price: 90 },
    { name: "Indonesia", price: 90 },
    { name: "Hong Kong", price: 90 },
    { name: "South Korea", price: 80 },
    { name: "Morocco ", price: 80 },
    { name: "Romania", price: 90 },
    { name: "Thailand ", price: 80 },
    { name: "Taiwan", price: 80 },
    { name: "Ukraine", price: 80 },
    { name: "Peru", price: 80 },
    { name: "Ireland", price: 80 },
    { name: "Russia", price: 80 },
    { name: "Sweden", price: 80 },
    { name: "Azerbaijan", price: 80 },
    { name: "Bangladesh", price: 80 },
    { name: "Greece", price: 80 },
    { name: "Sri Lanka", price: 80 },
    { name: "Kenya", price: 80 },
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
  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
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
    if (
      !selectedCountryTranslations.some((trans) => trans.name === country.name)
    ) {
      setSelectedCountryTranslations([
        ...selectedCountryTranslations,
        { ...country, translationPrice: 20 },
      ]);
    } else {
      const newTranslations = selectedCountryTranslations.filter(
        (item) => item.name !== country.name
      );
      setSelectedCountryTranslations(newTranslations);
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
    addCategory: (category) =>
      setSelectedCategories([...selectedCategories, category]),
    removeCategory: (index) => {
      const newCategories = [...selectedCategories];
      newCategories.splice(index, 1);
      setSelectedCategories(newCategories);
    },
    addCountry: (country) =>
      setSelectedCountries([...selectedCountries, country]),
    removeCountry: (index) => {
      const newCountries = [...selectedCountries];
      newCountries.splice(index, 1);
      setSelectedCountries(newCountries);
    },
    toggleCountryTranslation,
  };

  return (
    <DistributionContext.Provider value={contextValue}>
      {children}
    </DistributionContext.Provider>
  );
};
