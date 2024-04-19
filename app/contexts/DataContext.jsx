"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [matchedData, setMatchedData] = useState({});
  const [publicationData, setPublicationData] = useState({
    selectedOption: "",
    url: "",
    tags: [],
    file: null,
  });
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    websiteUrl: "",
    phone: "",
    address: "",
  });
  const storeMatchedData = (data) => {
    setMatchedData(data);
  };
  const contextValue = {
    matchedData,
    storeMatchedData,
    formData,
    setFormData,
    publicationData,
    setPublicationData,
  };
  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
