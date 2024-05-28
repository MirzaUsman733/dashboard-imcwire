"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CloseIcon from "@mui/icons-material/Close";
import { InfinitySpin } from "react-loader-spinner";
export default function Page() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newPlan, setNewPlan] = useState({
    planName: "",
    totalPlanPrice: 0,
    priceSingle: 0,
    planDescription: "",
    pdfLink: "",
    numberOfPR: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [plans, setPlans] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(
    new Array(plans.length).fill(null)
  );
  const handleInputChange = (field, value) => {
    setNewPlan({ ...newPlan, [field]: value });
  };

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);
  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
        setLoadingPage(false);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddPlan = async () => {
    try {
      setLoading(true);
      const totalPrice = newPlan.priceSingle * newPlan.numberOfPR;

      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newPlan, totalPlanPrice: totalPrice }),
      });

      if (response.ok) {
        fetchPlans();
        setNewPlan({
          planName: "",
          totalPlanPrice: 0,
          priceSingle: 0,
          planDescription: "",
          pdfLink: "",
          numberOfPR: 0,
        });
        setLoading(false);
      } else {
        console.error("Failed to add plan");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };
  const handleCopyLink = (planId) => {
    navigator.clipboard
      .writeText(`dashboard.imcwire.com/plan/${planId}`)
      .then(() => {
        setSnackbarMessage("Plan ID copied to clipboard");
        setSnackbarOpen(true);
        handleMenuClose();
      })
      .catch((error) => {
        console.error("Error copying plan ID to clipboard:", error);
      });
  };

  const handleDeleteCoupon = (planId) => {
    fetch("/api/plans?_id=" + planId, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("delete");
          fetchPlans();
        } else {
          console.error("Failed to delete");
        }
      })
      .catch((error) => console.error("Error deleting:", error));
  };
  const handleMenuOpen = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      return newAnchorEl;
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(new Array(plans?.length).fill(null));
  };
  if (loadingPage) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          visible={true}
          width="200"
          color="#7E22CE"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  if (
    session &&
    sessionStatus === "authenticated" &&
    plans &&
    loadingPage === false
  ) {
    return (
      <div className="container mx-auto">
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">
          Manage Pricing Plans
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <TextField
            label="Plan Name"
            value={newPlan?.planName}
            onChange={(e) => handleInputChange("planName", e.target.value)}
            fullWidth
            id="planName"
          />
          <TextField
            label="Single PR Price"
            value={newPlan?.priceSingle}
            onChange={(e) =>
              handleInputChange("priceSingle", parseFloat(e.target.value))
            }
            type="number"
            fullWidth
            id="priceSingle"
          />
          <TextField
            label="Number of PR"
            value={newPlan?.numberOfPR}
            onChange={(e) =>
              handleInputChange("numberOfPR", parseInt(e.target.value))
            }
            type="number"
            fullWidth
            id="numberOfPR"
          />
          <TextField
            label="Plan Description"
            value={newPlan?.planDescription}
            onChange={(e) =>
              handleInputChange("planDescription", e.target.value)
            }
            fullWidth
            id="planDescription"
          />
          <TextField
            label="PDF Link"
            value={newPlan?.pdfLink}
            onChange={(e) => handleInputChange("pdfLink", e.target.value)}
            fullWidth
            id="pdfLink"
          />
        </div>
        <div className="flex justify-center mb-8">
          {/* <button
          className="btn-grad px-5 py-3 "
          onClick={handleAddPlan}
          disabled={
            !newPlan?.planName || !newPlan?.priceSingle || !newPlan?.numberOfPR
          }
        >
          <Add /> Add Plan
        </button> */}
          {loading ? (
            <button className="px-10 uppercase py-3 mt-4" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : ""}
            </button>
          ) : (
            <button
              className="btn-grad px-7 uppercase py-3 mt-4"
              onClick={handleAddPlan}
            >
              <Add /> Add Plan
            </button>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {plans?.map((plan, index) => (
            <div
              key={plan.id}
              className={`h-full ${plan.popular ? "dark" : ""}`}
            >
              <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 shadow shadow-slate-950/5">
                <div className="mb-5">
                  <div className="flex justify-between">
                    <div className="text-lg text-gray-800 dark:text-gray-200 font-semibold mb-1">
                      {plan.planName}
                    </div>
                    <div className="flex gap-3">
                      <div className="font-bold text-sm text-gray-600 dark:text-gray-300">
                        Total Price: ${plan.totalPlanPrice}
                      </div>
                      {/* <div>
                      <button className="bg-red-600 text-white rounded-md hover:bg-red-800" onClick={()=>handleDeleteCoupon(plan.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M7.615 20q-.67 0-1.143-.472Q6 19.056 6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.152q-.463.463-1.153.463zM17 6H7v12.385q0 .269.173.442t.442.173h8.77q.23 0 .423-.192q.192-.193.192-.423zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
                          />
                        </svg>
                      </button>
                    </div> */}
                      <div>
                        <IconButton
                          aria-label="more"
                          aria-controls={`actions-menu-${index}`}
                          aria-haspopup="true"
                          onClick={(event) => handleMenuOpen(event, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`actions-menu-${index}`}
                          anchorEl={anchorEl[index]}
                          open={Boolean(anchorEl[index])}
                          onClose={handleMenuClose}
                        >
                          {/* <MenuItem
                      onClick={() =>
                        handleEditCoupon()
                      }
                    >
                      Edit
                    </MenuItem> */}
                          {/* <MenuItem
                      onClick={() =>
                        handleDeleteCoupon(coupon.id, "")
                      }
                    > */}
                          {/* Permanent Block
                    </MenuItem> */}
                          <MenuItem
                            onClick={() => handleDeleteCoupon(plan?.id)}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem onClick={() => handleCopyLink(plan?.id)}>
                            Copy Link
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-baseline mb-2">
                    <span className="text-lg text-gray-800 dark:text-gray-200 font-bold">
                      $
                    </span>
                    <span className="text-3xl text-gray-800 dark:text-gray-200 font-bold">
                      {plan.priceSingle}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      /pr
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                    {plan.planDescription}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="text-lg font-semibold">Plan Id:</span>
                    {plan.id}
                  </div>
                  {plan.pdfLink && (
                    <Link
                      className="block mt-2 text-sm text-indigo-500 hover:underline"
                      href={plan.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PR Report PDF
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    <>
      <h1>Failed To fetch data</h1>
    </>;
  }
}
