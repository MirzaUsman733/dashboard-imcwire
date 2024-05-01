'use client'
import React, { useState, useEffect } from "react";
import { CircularProgress, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { InfinitySpin } from "react-loader-spinner";

export default function Page() {
  const [newCoupon, setNewCoupon] = useState({
    couponCode: "",
    discountPercentage: 0,
  });

  const [editingCouponId, setEditingCouponId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const handleInputChange = (field, value) => {
    setNewCoupon({ ...newCoupon, [field]: value });
  };

  const [coupons, setCoupons] = useState([]);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(
    new Array(coupons.length).fill(null)
  );
  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons");
      if (response.ok) {
        const couponsData = await response.json();
        setCoupons(couponsData);
        setLoading(false);
      } else {
        console.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const handleAddCoupon = async () => {
    try {
      setLoadingPost(true);
        // Add new coupon
        const response = await fetch("/api/coupons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newCoupon,
          }),
        });

        if (response.ok) {
          fetchCoupons();
          setNewCoupon({
            couponCode: "",
            discountPercentage: 0,
          });
          setLoadingPost(false);
        } else {
          console.error("Failed to add coupon");
        }
    } catch (error) {
      console.error("Error adding/updating coupon:", error);
    }
  };

  const handleEditCoupon = (couponId) => {
    const couponToEdit = coupons.find((coupon) => coupon.id === couponId);
    if (couponToEdit) {
      setNewCoupon({
        couponCode: couponToEdit.couponCode,
        discountPercentage: couponToEdit.discountPercentage,
      });
      setEditingCouponId(couponId);
    }
  };

  const handleDeleteCoupon = (couponId) => {
    fetch("/api/coupons?_id=" + couponId, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchCoupons();
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
  const handleCopyCoupon = (couponCode) => {
    navigator.clipboard.writeText(couponCode);
    handleMenuClose()
    // Optionally, provide some feedback to the user that the coupon code has been copied
  };

  const handleMenuClose = () => {
    setAnchorEl(new Array(coupons.length).fill(null));
  };

  if (loading) {
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
  if (session && sessionStatus === "authenticated" && coupons && loading === false) {
  return (
    <div className="container mx-auto">
      <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">Manage Coupons</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-4">
        <TextField
          label="Coupon Code"
          value={newCoupon.couponCode}
          onChange={(e) => handleInputChange("couponCode", e.target.value)}
          fullWidth
          id="couponCode"
        />
        <TextField
          label="Discount Percentage"
          value={newCoupon.discountPercentage}
          onChange={(e) =>
            handleInputChange("discountPercentage", parseFloat(e.target.value))
          }
          type="number"
          fullWidth
          id="discountPercentage"
        />
      </div>
      <div className="flex justify-center mb-8">
        {/* <button
          className="btn-grad px-5 py-3"
          onClick={handleAddCoupon}
          disabled={
            !newCoupon.couponCode ||
            !newCoupon.discountPercentage
          }
        >
          <Add /> {editingCouponId ? "Update" : "Add"} Coupon
        </button> */}
         {loadingPost ? (
            <button className="px-10 uppercase py-3 mt-4" disabled={loadingPost}>
              {loadingPost ? <CircularProgress size={24} /> : ""}
            </button>
          ) : (
            <button
              className="btn-grad px-7 uppercase py-3 mt-4"
              onClick={handleAddCoupon}
            >
              <Add /> Add Coupons
            </button>
          )}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {coupons.map((coupon,index) => (
          <div key={coupon.id} className="h-full">
            <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white border border-slate-200 shadow shadow-slate-950/5">
              <div className="flex justify-between mb-5">
                <div>
                  <div className="text-lg font-semibold mb-1">
                    Coupon Code: {coupon.couponCode}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Discount Percentage: {coupon.discountPercentage}%
                  </div>
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
                     <MenuItem onClick={() => handleCopyCoupon(coupon.couponCode)}>
                      Copy Coupon
                    </MenuItem>
                    {/* <MenuItem
                      onClick={() =>
                        handleEditCoupon(coupon.id, index)
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
                    <MenuItem onClick={() => handleDeleteCoupon(coupon.id, index)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
else{
  <>
  <h1>Failed To fetch Data</h1>
  </>
}
}
