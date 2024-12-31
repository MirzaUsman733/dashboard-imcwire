import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import { Button, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const PublicationDetailUpdate = ({ detail, storeData, formData, handleEditSubmit }) => {
  const [file, setFile] = useState(null);
  const [previousFileName, setPreviousFileName] = useState(null);
  const [focusedField, setFocusedField] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [targetWebsite, setTargetWebsite] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (detail) {
      setKeywords(detail.formDataContract.tags || []);
      setTargetWebsite(detail.formDataContract.url || "");
      setSelectedCompany(detail.formDataContract.selectedCompany || "");
      setFile(null);
      setPreviousFileName(detail.formDataContract.fileName || "No file uploaded");
    }
  }, [detail]);

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

  const handleTargetWebsiteChange = (event) => {
    setTargetWebsite(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setPreviousFileName(uploadedFile.name); // Update the displayed file name
  };

  const handleSubmit = () => {
    const formDataContract = {
      url: targetWebsite,
      tags: keywords,
      file: file,
      fileName: file ? file.name : previousFileName, // Send the updated or previous file name
      selectedCompany: selectedCompany,
    };

    setLoading(true);

    handleEditSubmit({
      formData: formData,
      formDataContract: formDataContract,
    });

    setLoading(false);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const renderForm = () => {
    if (detail?.storeData?.selectedOption === "ownPr") {
      return (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold my-4">Distribute Only</h2>
          <p>
            Ready to distribute your PR globally? Upload Your High-Quality
            Journalist's writing PR in Document.
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
            accept=".pdf,.doc,.docs"
          />
          <label htmlFor="pdf-upload" className="flex items-center mt-3 cursor-pointer">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload PDF
            </Button>
            {file ? (
              <span className="ml-3">{file.name}</span>
            ) : (
              <span className="ml-3">{previousFileName}</span>
            )}
          </label>
          <div className="flex w-100 mt-5">
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
              {companies.map((company, index) => (
                <option key={index} value={company.companyName}>
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
          <div className="flex justify-center mb-8 mt-10">
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <button
                className="btn-grad px-7 uppercase py-3 mt-4"
                onClick={handleSubmit}
              >
                Update Written File
              </button>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md border border-1">
          <h2 className="text-2xl font-bold my-4 text-center">Edit Your Keyword and URL</h2>
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
                  {companies.map((company, index) => (
                    <option key={index} value={company.companyName}>
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
              <div className="flex justify-center mx-auto text-center w-1/2 px-3 md:py-2 lg:py-4 rounded btn btn-grad mt-5">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <button onClick={handleSubmit} className="">
                    Update Data
                  </button>
                )}
              </div>
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

  return <div>{renderForm()}</div>;
};

export default PublicationDetailUpdate;
