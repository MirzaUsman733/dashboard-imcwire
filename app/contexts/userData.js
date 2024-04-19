"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSession } from "next-auth/react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [userWithEmail, setUserWithEmail] = useState(null);

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const checkSessionEmail = useCallback(async () => {
    const session = await getSession();
    if (session) {
      const userWithEmail = userData.find(
        (user) => user.email === session.user.email
      );

      if (userWithEmail) {
        setUserWithEmail(userWithEmail);
      }
    }
  }, [userData]);

  useEffect(() => {
    checkSessionEmail();
  }, [checkSessionEmail]);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await checkSessionEmail();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUserWithEmail(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userWithEmail, userData, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
