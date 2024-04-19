import { useState } from "react";
import { Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineGlobal,
  AiOutlinePhone,
  AiOutlineHome,
} from "react-icons/ai";

const CompanyInfoPersonal = ({ onNextButtonClick, formData, setFormData }) => {
  const [focusedField, setFocusedField] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value.trim() !== "")) {
      onNextButtonClick();
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please Enter All Data in the Text Fields.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md border border-1">
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
      <h2 className="text-2xl font-bold mb-4 text-center">
        Your Company Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Company Name"
          variant="outlined"
          type="variant"
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
          label="Name"
          variant="outlined"
          type="text"
          name="name"
          autoComplete="off"
          placeholder="Your Name"
          value={formData?.name}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineUser className="text-gray-400 me-2" />,
            placeholder: focusedField !== "name" ? "Name" : "",
          }}
          className={focusedField === "name" ? "focused" : ""}
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
          label="Address"
          variant="outlined"
          type="text"
          name="address"
          autoComplete="off"
          placeholder="Your Address"
          value={formData?.address}
          onChange={handleChange}
          fullWidth
          onFocus={() => handleFocus("address")}
          onBlur={handleBlur}
          InputProps={{
            startAdornment: <AiOutlineHome className="text-gray-400 me-2" />,
            placeholder: focusedField !== "address" ? "Address" : "",
          }}
          className={focusedField === "address" ? "focused" : ""}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-grad py-2 px-4  uppercase text-center"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoPersonal;
