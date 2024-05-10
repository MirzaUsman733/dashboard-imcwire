"use client";
import { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const fileUploadButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#7E22CE",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  marginTop: "10px",
};

const fileUploadLabelStyles = {
  cursor: "pointer",
};
// usmna
export default function Page() {
  const [plans, setPlans] = useState([]);
  // const [compaignEmails, setCompaignEmail] = useState([])
  const [newPlan, setNewPlan] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedExcel, setUploadedExcel] = useState(null);
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const [detail, setDetail] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.role === "user") {
      router.replace("/press-dashboard/pr-balance");
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const handleAddPlan = () => {
    setPlans([...plans, newPlan]);
    setNewPlan({});
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  const handleEmailChange = (event) => {
    setSelectedEmail(event.target.value); // Update the selected email state
  };

  // const handleFileChange = (e, field) => {
  //   const file = e.target.files[0];
  //   switch (field) {
  //     case "image":
  //       setUploadedImage(file);
  //       break;
  //     case "excelLink":
  //       setUploadedExcel(file);
  //       break;
  //     case "pdfLink":
  //       setUploadedPDF(file);
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // const timestamp = Date.now();
  // const randomID = Math.floor(Math.random() * 10000);
  // const reportID = `report_${timestamp}_${randomID}`;
  // const handleFeatureChange = (index, value) => {
  //   const updatedFeatures = [...newPlan.features];
  //   updatedFeatures[index] = value;
  //   setNewPlan({ ...newPlan, features: updatedFeatures });
  // };
  // const fetchPlans = async () => {
  //   try {
  //     const response = await fetch("/api/compaignData");
  //     if (response?.ok) {
  //       const plansData = await response?.json();
  //       console.log("Full Data",plansData)
  //       const paidPlans = plansData?.filter(
  //         (plan) =>
  //           plan?.status === "paid"
  //       );
  //       console.log("paidPlans", paidPlans)
  //       setCompaignEmail(paidPlans);
  //       setLoading(false);
  //     } else {
  //       console.error("Failed to fetch plans");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching plans:", error);
  //   } finally {
  //   }
  // };
  // useEffect(() => {
  //   if (session) {
  //     fetchPlans();
  //   }
  // }, [session]);
  useEffect(() => {
    const generatedId = generateUniqueId(24);
    setUniqueId(generatedId);
  }, []);

  const generateUniqueId = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  };
  const handleSubmitFiles = async () => {
    // e.preventDefault();

    const formData = new FormData();
    // formData.append("image", uploadedImage);
    formData.append("pdf", uploadedPDF);
    formData.append("excel", uploadedExcel);
    formData.append("id", uniqueId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload Data");
      }
      router.push("/press-dashboard-admin/reports");
      // return true;
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Failed to upload files. Please try again.");
      setSnackbarOpen(true);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const selectedDetail = detail?.find(
      (data) =>
      data.formData.email ===
      // selectedEmail
      newPlan.clientEmail
    );
    if (!selectedDetail) {
      console.error("No detail found for the selected email");
      return;
    }
    // const fileUploadation = handleSubmitFiles();
    // if(fileUploadation){
      try {
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedDetail,
            ...newPlan,
            uniqueId: uniqueId,
          }),
        });
  
        if (response.ok) {
          handleAddPlan();
          handleSubmitFiles()
          setUploadedImage(null);
          setUploadedExcel(null);
          setUploadedPDF(null);
          setLoading(false);
        } else {
          console.error("Failed to add data to the database");
        }
      } catch (error) {
        console.error("Error adding data to the database:", error);
      }
    // }else{
    //   setSnackbarMessage("Failed to upload files. Please try again.");
    //   setSnackbarOpen(true);
    // }
    
  };

  // All Sub data
  const fetchDetail = useCallback(async () => {
    try {
      const response = await fetch("/api/submit-detail");
      if (response.ok) {
        const detailData = await response.json();
        const clientidData = detailData?.filter(
          (data) => data.storeData.action === "inprogress"
        );
        setDetail(clientidData);
      } else {
        console.error("Failed to fetch detail");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  }, [plans]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);
  const removeFile = (fileType) => {
    switch (fileType) {
      case "pdf":
        setUploadedPDF(null);
        break;
      case "excel":
        setUploadedExcel(null);
        break;
      default:
        break;
    }
  };
  if (
    session &&
    sessionStatus === "authenticated" &&
    session?.user?.role === "admin"
  ) {
    return (
      <div className="container mx-auto">
        <h1 className="text-6xl font-serif text-purple-700 font-bold text-center mb-20 mt-10">Add Reports For Customers</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          <FormControl fullWidth>
            <InputLabel id="client-email-label">Client Email</InputLabel>
            <Select
              labelId="client-email-label"
              id="client-email"
              onFocus={() => handleFocus("client-email")}
              onBlur={handleBlur}
              className={focusedField === "client-email" ? "focused" : ""}
              // value={newPlan.clientEmail || ""}
              value={selectedEmail}
              // onChange={(e) =>
              //   setNewPlan({ ...newPlan, clientEmail: e.target.value })
              // }
              onChange={handleEmailChange}
              label="Client Email"
            >
              <MenuItem value="" disabled>
                Select Customer Email
              </MenuItem>
              {Object.entries(
                (detail ?? []).reduce((emailCount, data) => {
                  if (!emailCount[data.storeData.formDataSignUp.email]) {
                    emailCount[data.storeData.formDataSignUp.email] = 1;
                  } else {
                    emailCount[data.storeData.formDataSignUp.email]++;
                  }
                  return emailCount;
                }, {})
              ).map(([email, count]) => (
                <MenuItem key={email} value={email}>
                  {`${email} (${count})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedEmail && (
            <FormControl fullWidth>
              <InputLabel id="customer-email-label">Client Email</InputLabel>
              <Select
                labelId="customer-email-label"
                id="customer-email"
                onFocus={() => handleFocus("customer-email")}
                onBlur={handleBlur}
                className={focusedField === "customer-email" ? "focused" : ""}
                value={newPlan.clientEmail || ""}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, clientEmail: e.target.value })
                }
                label="Client Email"
              >
                <MenuItem value="" disabled>
                  Select Client Email
                </MenuItem>
                {detail
                  ?.filter(
                    (data) =>
                      data.storeData.formDataSignUp.email === selectedEmail
                  )
                  .map((data) => (
                    <MenuItem key={data?.id} value={data?.formData?.email}>
                      {data?.formData?.email}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Press Release Title"
            value={newPlan.pressReleaseTitle || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, pressReleaseTitle: e.target.value })
            }
            fullWidth
            id="description"
            onFocus={() => handleFocus("pressReleaseTitle")}
            onBlur={handleBlur}
            className={focusedField === "pressReleaseTitle" ? "focused" : ""}
          />

          <TextField
            label="Plan Description"
            value={newPlan.packageName || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, packageName: e.target.value })
            }
            fullWidth
            id="packageName"
            onFocus={() => handleFocus("packageName")}
            onBlur={handleBlur}
            className={focusedField === "packageName" ? "focused" : ""}
          />
          {/* <select
            value={newPlan.clientEmail || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, clientEmail: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 gap-10"
          >
            <option value="" disabled>
              Select Client Email
            </option>
            <hr />
            {detail?.map((data) => (
              <>
                <option key={data.id} value={data?.formData?.email}  style={{ margin: "100px", padding: "100px", lineHeight: "200px"}}>
               <span className="block mb-92" style={{ margin: "100px", padding: "100px", lineHeight: "200px"}}>   {data?.formData?.email} </span>
                </option>
                <hr style={{ paddingTop: "10px"}}/>
                </>
            ))}
          </select> */}
          {/* <FormControl fullWidth>
            <InputLabel id="client-email-label">Client Email</InputLabel>
            <Select
              labelId="client-email-label"
              id="client-email"
              onFocus={() => handleFocus("client-email")}
              onBlur={handleBlur}
              className={focusedField === "client-email" ? "focused" : ""}
              value={newPlan.clientEmail || ""}
              onChange={(e) =>
                setNewPlan({ ...newPlan, clientEmail: e.target.value })
              }
              label="Client Email"
            >
              <MenuItem value="" disabled>
                Select Client Email
              </MenuItem>
              {detail?.map((data) => (
                <MenuItem key={data?.id} value={data?.formData?.email} >
                  {data?.storeData.formDataSignUp?.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* <TextField
          label="Client Email"
          value={newPlan.clientEmail || ""}
          onChange={(e) =>
            setNewPlan({ ...newPlan, clientEmail: e.target.value })
          }
          fullWidth
          id="clientEmail"
          onFocus={() => handleFocus("clientEmail")}
          onBlur={handleBlur}
          className={focusedField === "clientEmail" ? "focused" : ""}
        /> */}
          {/* <TextField
          label="Link"
          value={newPlan.link || ""}
          onChange={(e) => setNewPlan({ ...newPlan, link: e.target.value })}
          fullWidth
          id="link"
          onFocus={() => handleFocus("link")}
          onBlur={handleBlur}
          className={focusedField === "link" ? "focused" : ""}
        /> */}
          {/* <TextField
          label="Type"
          value={newPlan.type || ""}
          onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
          fullWidth
          id="type"
          onFocus={() => handleFocus("type")}
          onBlur={handleBlur}
          className={focusedField === "type" ? "focused" : ""}
        />
        <TextField
          label="Industry"
          value={newPlan.industry || ""}
          onChange={(e) => setNewPlan({ ...newPlan, industry: e.target.value })}
          fullWidth
          id="industry"
          onFocus={() => handleFocus("industry")}
          onBlur={handleBlur}
          className={focusedField === "industry" ? "focused" : ""}
        />
        <TextField
          label="Top Visiting Countries"
          value={newPlan.topCountries || ""}
          onChange={(e) =>
            setNewPlan({ ...newPlan, topCountries: e.target.value })
          }
          fullWidth
          id="topCountries"
          onFocus={() => handleFocus("topCountries")}
          onBlur={handleBlur}
          className={focusedField === "topCountries" ? "focused" : ""}
        />
        <TextField
          label="Potential Audience"
          value={newPlan.potentialAudience || ""}
          onChange={(e) =>
            setNewPlan({ ...newPlan, potentialAudience: e.target.value })
          }
          fullWidth
          id="potentialAudience"
          onFocus={() => handleFocus("potentialAudience")}
          onBlur={handleBlur}
          className={focusedField === "potentialAudience" ? "focused" : ""}
        />
        <input
          type="file"
          onChange={(e) => setUploadedImage(e.target.files[0])}
          className="hidden"
          id="image-upload"
          accept="image/*"
        />
        <label htmlFor="image-upload" style={fileUploadLabelStyles}>
          <Button
            variant="contained"
            style={fileUploadButtonStyles}
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload Image
          </Button>
          <span>{uploadedImage && uploadedImage.name}</span>
        </label> */}

          <input
            type="file"
            onChange={(e) => {
              console.log(e)
              setUploadedPDF(e.target.files[0])}}
            className="hidden"
            id="pdf-upload"
            accept=".pdf,.doc,.docs"
          />
          <label htmlFor="pdf-upload" style={fileUploadLabelStyles}>
            <Button
              variant="contained"
              style={fileUploadButtonStyles}
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload PDF
            </Button>
            {uploadedPDF && (
              <span className="flex items-center">
                {uploadedPDF.name}{" "}
                <button
                  className="ml-2 text-xl text-red-600 hover:text-red-800 focus:outline-none"
                  onClick={() => removeFile("pdf")}
                >
                  &times;
                </button>
              </span>
            )}
          </label>
          <input
            type="file"
            onChange={(e) => {
              console.log(e)
              setUploadedExcel(e.target.files[0])}}
            className="hidden"
            id="excel-upload"
            accept=".xlsx, .xls, .pptx"
          />
          <label htmlFor="excel-upload" style={fileUploadLabelStyles}>
            <Button
              variant="contained"
              style={fileUploadButtonStyles}
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Excel
            </Button>
            {uploadedExcel && (
              <span className="flex items-center">
                {uploadedExcel.name}{" "}
                <button
                  className="ml-2 text-xl text-red-600 hover:text-red-800 focus:outline-none"
                  onClick={() => removeFile("excel")}
                >
                  &times;
                </button>
              </span>
            )}
          </label>
        </div>

        <div className="flex justify-center mb-8 mt-10">
          {/* <button
            className="btn-grad px-5 pt-3 pb-2 "
            onClick={handleSubmit}
            // disabled={!newPlan.planName || !newPlan.totalPlanPrice}
          >
            <Add className="mb-1" /> Add Reports
          </button> */}
          {loading ? (
            <button className="px-10 uppercase py-3 mt-4" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : ""}
            </button>
          ) : (
            <button
              className="btn-grad px-7 uppercase py-3 mt-4"
              onClick={handleSubmit}
            >
              <Add /> Add Reports
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3"></div>
      </div>
    );
  } else {
    return (
      <div className="h-[80vh] flex justify-center items-center w-full">
        <p>Failed to fetch data.</p>
      </div>
    );
  }
}
