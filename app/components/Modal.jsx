"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { MdOutlineArrowUpward } from "react-icons/md";
import Grid from "@mui/material/Grid";
import { useSession } from "next-auth/react";

const Modal = ({ isOpen, onClose, onAddCompany }) => {
  const { data: session, status: sessionStatus } = useSession();

  const [focusedField, setFocusedField] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    address1: "",
    address2: "",
    contactName: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    state: "",
    websiteUrl: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const companyDataWithUser = {
        ...companyDetails,
        user: session,
      };
      const response = await fetch("/api/add-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyDataWithUser),
      });

      if (response.ok) {
        onAddCompany(companyDataWithUser);
        setCompanyDetails({
          companyName: "",
          address1: "",
          address2: "",
          contactName: "",
          phone: "",
          email: "",
          country: "",
          city: "",
          state: "",
          websiteUrl: "",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error adding Company:", error);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="flex justify-between text-2xl font-semibold my-5">
              <h2 className="text-4xl font-serif text-center">
                Add Company
              </h2>
              <hr />
              {/* <span className="close" onClick={onClose}>
                <MdOutlineArrowUpward size={30} className="cursor-pointer" />
              </span> */}
            </div>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {Object.keys(companyDetails).map((key) => (
                  <Grid item xs={12} md={6} key={key}>
                    <TextField
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={companyDetails[key]}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      id={key}
                      onFocus={() => handleFocus(key)}
                      onBlur={handleBlur}
                      className={focusedField === key ? "focused" : ""}
                    />
                  </Grid>
                ))}
              </Grid>
              <button
                type="submit"
                className="btn-grad px-8 py-3 mx-auto mt-5 text-xl"
              >
                Add Company
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
