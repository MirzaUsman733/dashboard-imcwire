import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Modal from "../components/Modal";
import { FaUpload } from "react-icons/fa";
import { useUser } from "../contexts/userData";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

const PublicationDetail = ({ storeData, formData }) => {
  const [file, setFile] = useState(null);
  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [targetWebsite, setTargetWebsite] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/add-company");
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();
        console.log(data);
        if (session) {
          const filteredCompanies = data.filter(
            (company) => company?.user?.user?.id === session?.user?.id
          );
          setCompanies(filteredCompanies);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    if (session) {
      fetchCompanies();
    }
  }, [session]);

  const handleAddCompany = (newCompany) => {
    setCompanies([...companies, newCompany]);
  };
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleOpenModal = () => {
    setIsNewCompanyModalOpen(true);
  };

  const handleCloseModal = (newCompany) => {
    setIsNewCompanyModalOpen(false);
    if (newCompany) {
      setCompanies([...companies, newCompany]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const value = event.target.value.trim();
      if (value !== "") {
        setKeywords([...keywords, value]);
        event.target.value = "";
      }
    }
  };
  const handleRemoveKeyword = (indexToRemove) => {
    setKeywords((prevKeywords) =>
      prevKeywords.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleTargetWebsiteChange = (event) => {
    setTargetWebsite(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formDataContract = {
  //     url: targetWebsite,
  //     tags: keywords,
  //     file: file,
  //     selectedCompany: selectedCompany,
  //   };
  //   const combinedData = {
  //     storeData: storeData,
  //     formData: formData,
  //     formDataContract: formDataContract,
  //   };
  //   try {
  //     const response = await fetch("/api/submit-detail", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(combinedData),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to submit publication");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting publication:", error);
  //   } finally {
  //     setKeywords([]);
  //     setSelectedCompany("")
  //     setTargetWebsite("")
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (storeData.selectedOption === "imcwirePr") {
      const formDataContract = {
        url: targetWebsite,
        tags: keywords,
        file: file,
        selectedCompany: selectedCompany,
      };
      const combinedData = {
        storeData: storeData,
        formData: formData,
        formDataContract: formDataContract,
      };
      try {
        const response = await fetch("/api/submit-detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit publication");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error submitting publication:", error);
      } finally {
        setKeywords([]);
        setSelectedCompany("");
        setTargetWebsite("");
        router.push("/press-dashboard/pr-balance");
      }
    } else {
      // If the option is for file upload, upload the file to the database
      const formDataFileUpload = new FormData();
      formDataFileUpload.append("file", file);

      try {
        const response = await fetch("/api/upload-file", {
          method: "POST",
          body: formDataFileUpload,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setFile(null);
      }
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };
  const handleFileSubmit = async (event) => {
    event.preventDefault();
    const formDataFileUpload = new FormData();
    formDataFileUpload.append("file", file);

    try {
      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formDataFileUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setFile(null);
    }
  };

  const renderForm = () => {
    if (storeData.selectedOption === "ownPr") {
      return (
        <div>
          <h2 className="text-2xl font-bold my-4">Distribute Only</h2>
          <p>
            Ready to distribute your PR globally? Upload Your High-Quality
            Journalist's writing PR in Document.
          </p>
          <label
            htmlFor="file-upload"
            className="custom-file-upload flex items-center justify-center bg-green-700 text-white rounded-md py-3 px-4 mt-4 cursor-pointer"
          >
            <FaUpload size={30} className="mr-2" />
            <span>Upload Your PR in doc file</span>
          </label>
          <input type="file" id="file-upload" className="hidden" />
        </div>
      );
    } else {
      return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md border border-1">
          <h2 className="text-2xl font-bold my-4 text-center">
            Submit Your Keyword and URL
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div>
                <TextField
                  label="Target Keywords"
                  type="text"
                  id="keywords"
                  placeholder="Enter the Target Keywords"
                  fullWidth
                  onFocus={() => handleFocus("keywords")}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className={focusedField === "keywords" ? "focused" : ""}
                />
                <div className="flex items-center mt-2 flex-wrap gap-3">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="border border-gray-400 p-1 px-2 bg-gray-300 rounded-2xl"
                    >
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-2 text-xl text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        &times; {/* Close icon */}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <TextField
                label="Target URL"
                type="text"
                id="url"
                name="url"
                placeholder="Enter the Target URL"
                fullWidth
                value={targetWebsite}
                onChange={handleTargetWebsiteChange}
                onFocus={() => handleFocus("targetWebsite")}
                onBlur={handleBlur}
                className={focusedField === "targetWebsite" ? "focused" : ""}
              />
            </div>
            <div className="col-span-2">
              <div className="flex w-100">
                <select
                  style={{ width: "61%" }}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  className="px-2 border border-1 rounded w-100 py-4 mr-2"
                >
                  <option value="" disabled>
                    Select Company
                  </option>
                  <option value="None">None</option>
                  {companies?.map((company, index) => (
                    <option key={index} value={company?.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
                <div className="flex justify-center">
                  <button
                    onClick={handleOpenModal}
                    className="bg-purple-700 text-white px-3 md:py-2 lg:py-4 rounded"
                  >
                    Add Company
                  </button>
                </div>
              </div>
              <div className="flex justify-center mx-auto text-center w-1/2 px-3 md:py-2 lg:py-4 rounded mt-5">
                {loading ? (
                  <button
                    className="px-10 uppercase py-3 mt-4"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : ""}
                  </button>
                ) : (
                  <button
                    className="btn-grad px-7 uppercase py-3 mt-4"
                    onClick={handleSubmit}
                  >
                    Submit data
                  </button>
                )}
              </div>
              {selectedCompany && (
                <div>
                  <h3 className="text-xl font-bold mt-4">{selectedCompany}</h3>
                </div>
              )}
            </div>
          </div>
          <Modal
            isOpen={isNewCompanyModalOpen}
            onClose={handleCloseModal}
            onAddCompany={handleAddCompany}
          />
        </div>
      );
    }
  };

  return <div>{storeData?.selectedOption && renderForm()}</div>;
};

export default PublicationDetail;
