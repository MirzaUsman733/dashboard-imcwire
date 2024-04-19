"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const UpdateDataContext = createContext();

export const useUpdateData = () => useContext(UpdateDataContext);

export const UpdateDataProvider = ({ children }) => {
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
  const contextValue = {
    formData,
    setFormData,
    publicationData,
    setPublicationData,
  };
  return (
    <UpdateDataContext.Provider value={contextValue}>
      {children}
    </UpdateDataContext.Provider>
  );
};
