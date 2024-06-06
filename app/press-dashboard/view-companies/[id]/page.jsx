'use client'
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { TextField, Button, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { InfinitySpin } from "react-loader-spinner";
import TawkTo from "../../../components/TawkTo";

export default function Page() {
  const { id } = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [redirectToItems, setRedirectToItems] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    companyName: "",
    contactName: "",
    country: "",
    email: "",
    phone: "",
    state: "",
    websiteUrl: "",
  });
  const [loading, setLoading] = useState(true); 

  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await fetch("/api/add-company?_id=" + id);
      if (response.ok) {
        const companyData = await response.json();
        setFormData(companyData);
        setLoading(false); 
      } else {
        console.error("Failed to fetch company data");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    try {
      const response = await fetch("/api/add-company?_id=" + id, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setRedirectToItems(true);
      } else {
        console.error("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center w-full">
        <TawkTo/>
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  } else if (redirectToItems) {
    return redirect("/press-dashboard/view-companies");
  } else if (session && sessionStatus === "authenticated" && formData) {
    return (
      <section className="mt-8">
        <div className="max-w-2xl mx-auto mt-2 shadow-2xl p-5 rounded-xl">
          <Link href="/press-dashboard/view-companies" className="button">
            <span className="flex items-center gap-2 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="m16 8l1.43 1.393L11.85 15H24v2H11.85l5.58 5.573L16 24l-8-8z"
                />
                <path
                  fill="currentColor"
                  d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4"
                />
              </svg>
              Show All Companies
            </span>
          </Link>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              {Object.keys(formData).map((key) => {
                if (key !== "user" && key !== "currentTime" && key !== "id" && key !== "updatedAt") {
                  return (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        id={key}
                        onFocus={() => handleFocus(key)}
                        onBlur={handleBlur}
                        className={focusedField === key ? "focused" : ""}
                        InputProps={{
                          readOnly:
                            key === "user" ||
                            key === "currentTime" ||
                            key === "id" ||
                            key === "updatedAt"
                        }}
                      />
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
            <button
              type="submit"
              className="btn-grad px-8 py-3 mx-auto mt-5 text-xl"
            >
              Update Company
            </button>
          </form>
        </div>
      </section>
    );
  } else {
    return null;
  }
}
