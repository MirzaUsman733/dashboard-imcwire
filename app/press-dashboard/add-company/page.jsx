"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineGlobal,
  AiOutlinePhone,
  AiOutlineHome,
} from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TawkTo from "../../components/TawkTo";

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const router = useRouter();
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    address1: "",
    address2: "",
    country: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    websiteUrl: "",
  });
  const [focusedField, setFocusedField] = useState("");
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all inputs have valid data and are not empty
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    const companyDataWithUser = {
      ...formData,
      user: session,
    };
    if (isValid) {
      try {
        const response = await fetch("/api/add-company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyDataWithUser),
        });

        if (response.ok) {
          setFormData({
            contactName: "",
            companyName: "",
            address1: "",
            address2: "",
            country: "",
            city: "",
            state: "",
            email: "",
            phone: "",
            websiteUrl: "",
          });
          setSnackbarSeverity("success");
          setSnackbarMessage("Data added successfully.");
          setSnackbarOpen(true);
          
          router.push("/press-dashboard/view-companies")
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("Failed to add data.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error adding Company:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage("An error occurred while adding data.");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarOpen(true);
    }
  };

 
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md border border-1 mt-12">
      <TawkTo/>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <h2 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">
       Add Your Company Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-8">
        <TextField
          label="Contact Name"
          variant="outlined"
          type="text"
          name="contactName"
          autoComplete="off"
          value={formData?.contactName}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("contactName")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineUser className="text-gray-400 me-2" />,
            placeholder: focusedField !== "contactName" ? "Contact Name" : "",
          }}
          className={focusedField === "contactName" ? "focused" : ""}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          type="text"
          name="companyName"
          autoComplete="off"
          value={formData?.companyName}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("companyName")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineGlobal className="text-gray-400 me-2" />,
            placeholder: focusedField !== "companyName" ? "Company Name" : "",
          }}
          className={focusedField === "companyName" ? "focused" : ""}
        />
        <TextField
          label="Address 1"
          variant="outlined"
          type="text"
          name="address1"
          autoComplete="off"
          value={formData?.address1}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("address1")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineHome className="text-gray-400 me-2" />,
            placeholder: focusedField !== "address1" ? "Address 1" : "",
          }}
          className={focusedField === "address1" ? "focused" : ""}
        />
        <TextField
          label="Address 2"
          variant="outlined"
          type="text"
          name="address2"
          autoComplete="off"
          value={formData?.address2}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("address2")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineHome className="text-gray-400 me-2" />,
            placeholder: focusedField !== "address2" ? "Address 2" : "",
          }}
          className={focusedField === "address2" ? "focused" : ""}
        />
        <TextField
          label="Country"
          variant="outlined"
          type="text"
          name="country"
          autoComplete="off"
          value={formData?.country}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("country")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineGlobal className="text-gray-400 me-2" />,
            placeholder: focusedField !== "country" ? "Country" : "",
          }}
          className={focusedField === "country" ? "focused" : ""}
        />
        <TextField
          label="City"
          variant="outlined"
          type="text"
          name="city"
          autoComplete="off"
          value={formData?.city}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("city")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineHome className="text-gray-400 me-2" />,
            placeholder: focusedField !== "city" ? "City" : "",
          }}
          className={focusedField === "city" ? "focused" : ""}
        />
        <TextField
          label="State"
          variant="outlined"
          type="text"
          name="state"
          autoComplete="off"
          value={formData?.state}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("state")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineHome className="text-gray-400 me-2" />,
            placeholder: focusedField !== "state" ? "State" : "",
          }}
          className={focusedField === "state" ? "focused" : ""}
        />
        <TextField
          label="Company Email"
          variant="outlined"
          type="email"
          name="email"
          autoComplete="off"
          placeholder="Company Email"
          value={formData?.email}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineMail className="text-gray-400 me-2" />,
            placeholder: focusedField !== "email" ? "Company Email" : "",
          }}
          className={focusedField === "email" ? "focused" : ""}
        />
        <TextField
          label="Phone"
          variant="outlined"
          type="tel"
          name="phone"
          autoComplete="off"
          placeholder="Your Phone"
          value={formData?.phone}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("phone")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlinePhone className="text-gray-400 me-2" />,
            placeholder: focusedField !== "phone" ? "Phone" : "",
          }}
          className={focusedField === "phone" ? "focused" : ""}
        />
        <TextField
          label="Website URL"
          variant="outlined"
          type="url"
          name="websiteUrl"
          autoComplete="off"
          placeholder="Your Website URL"
          value={formData?.websiteUrl}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("websiteUrl")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineGlobal className="text-gray-400  me-2" />,
            placeholder: focusedField !== "websiteUrl" ? "Website URL" : "",
          }}
          className={focusedField === "websiteUrl" ? "focused" : ""}
        />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn-grad py-3 px-5 uppercase text-center"
          >
            Add Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
