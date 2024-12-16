"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Button,
} from "@mui/material";
import {
  Add,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected from 'next/navigation' to 'next/router'
import { InfinitySpin } from "react-loader-spinner";

export default function Page() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
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
  const [anchorEl, setAnchorEl] = useState(new Array(plans.length).fill(null));

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (field, value) => {
    setNewPlan({ ...newPlan, [field]: value });
  };

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

  const handleAddPlan = async () => {
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
      setSnackbarMessage("Plan added successfully");
      setSnackbarOpen(true);
    } else {
      console.error("Failed to add plan");
      setSnackbarMessage("Failed to add plan");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleStartEdit = (plan) => {
    setEditingPlan({ ...plan });
    setAnchorEl(new Array(plans.length).fill(null));
  };

  const handleUpdatePlan = async () => {
    setLoading(true);
    
    // Calculate the total price based on the number of PR and the price per PR
    const totalPrice = editingPlan.priceSingle * editingPlan.numberOfPR;
  
    const response = await fetch(`/api/plans`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...editingPlan, totalPlanPrice: totalPrice }),
    });
  
    if (response.ok) {
      setSnackbarMessage("Plan updated successfully");
      setSnackbarOpen(true);
      fetchPlans();
      setEditingPlan(null);
    } else {
      console.error("Failed to update plan");
      setSnackbarMessage("Failed to update plan");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };
  

  const handleDeletePlan = (planId) => {
    fetch(`/api/plans?_id=${planId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchPlans();
          setSnackbarMessage("Plan deleted successfully");
          setSnackbarOpen(true);
        } else {
          console.error("Failed to delete plan");
          setSnackbarMessage("Failed to delete plan");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error deleting plan:", error);
        setSnackbarMessage("Error deleting plan");
        setSnackbarOpen(true);
      });
  };

  const handleCopyLink = (planId) => {
    navigator.clipboard
      .writeText(`dashboard.imcwire.com/plan/${planId}`)
      .then(() => {
        setSnackbarMessage("Plan ID copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error copying plan ID to clipboard:", error);
        setSnackbarMessage("Error copying plan ID");
        setSnackbarOpen(true);
      });
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      return newAnchorEl;
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(new Array(plans.length).fill(null));
  };

  if (loadingPage) {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <InfinitySpin
          width="200"
          color="#7E22CE"
          ariaLabel="loading-indicator"
        />
      </div>
    );
  }

  if (!session || sessionStatus === "unauthenticated") {
    return null;
  }

  if (editingPlan) {
    return (
      <div className="edit-form p-4">
        <h2 className="text-lg font-semibold">Edit Plan</h2>
        <TextField
          label="Plan Name"
          value={editingPlan.planName}
          onChange={(e) =>
            setEditingPlan({ ...editingPlan, planName: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Single PR Price"
          type="number"
          value={editingPlan.priceSingle}
          onChange={(e) =>
            setEditingPlan({
              ...editingPlan,
              priceSingle: parseFloat(e.target.value),
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of PR"
          type="number"
          value={editingPlan.numberOfPR}
          onChange={(e) =>
            setEditingPlan({
              ...editingPlan,
              numberOfPR: parseInt(e.target.value, 10),
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Plan Description"
          value={editingPlan.planDescription}
          onChange={(e) =>
            setEditingPlan({ ...editingPlan, planDescription: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="PDF Link"
          value={editingPlan.pdfLink}
          onChange={(e) =>
            setEditingPlan({ ...editingPlan, pdfLink: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <div className="flex justify-end space-x-4 mt-4">
          <Button color="error" onClick={() => setEditingPlan(null)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleUpdatePlan}>
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

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
          value={newPlan.planName}
          onChange={(e) => handleInputChange("planName", e.target.value)}
          fullWidth
          id="planName"
        />
        <TextField
          label="Single PR Price"
          value={newPlan.priceSingle}
          onChange={(e) =>
            handleInputChange("priceSingle", parseFloat(e.target.value))
          }
          type="number"
          fullWidth
          id="priceSingle"
        />
        <TextField
          label="Number of PR"
          value={newPlan.numberOfPR}
          onChange={(e) =>
            handleInputChange("numberOfPR", parseInt(e.target.value))
          }
          type="number"
          fullWidth
          id="numberOfPR"
        />
        <TextField
          label="Plan Description"
          value={newPlan.planDescription}
          onChange={(e) => handleInputChange("planDescription", e.target.value)}
          fullWidth
          id="planDescription"
        />
        <TextField
          label="PDF Link"
          value={newPlan.pdfLink}
          onChange={(e) => handleInputChange("pdfLink", e.target.value)}
          fullWidth
          id="pdfLink"
        />
      </div>
      <div className="flex justify-center mb-8">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddPlan}
            disabled={
              !newPlan.planName || !newPlan.priceSingle || !newPlan.numberOfPR
            }
          >
            Add Plan
          </Button>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan, index) => (
          <div key={plan.id} className={`h-full bg-white`}>
            <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white border border-slate-200">
              <div className="mb-5">
                <div className="flex justify-between">
                  <div className="text-lg text-gray-800 font-semibold mb-1">
                    {plan.planName}
                  </div>
                  <div className="flex gap-3">
                    <div className="font-bold text-sm text-gray-600">
                      Total Price: ${plan.totalPlanPrice}
                    </div>
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
                        <MenuItem onClick={() => handleDeletePlan(plan.id)}>
                          Delete
                        </MenuItem>
                        <MenuItem onClick={() => handleStartEdit(plan)}>
                          Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleCopyLink(plan.id)}>
                          Copy Link
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-baseline mb-2">
                  <span className="text-lg text-gray-800 font-bold">$</span>
                  <span className="text-3xl text-gray-800 font-bold">
                    {plan.priceSingle}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">/pr</span>
                </div>
                <div className="text-sm text-gray-600 mb-5">
                  {plan.planDescription}
                </div>
                <div className="text-gray-600">
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
}
