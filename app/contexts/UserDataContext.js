"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserDataContext = createContext();

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};
