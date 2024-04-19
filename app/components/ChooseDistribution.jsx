import { Snackbar } from "@mui/material";
import React, { useState } from "react";
import MuiAlert from "@mui/material/Alert";
const ChooseDistribution = ({
  selectedCategories,
  selectedCountries,
  categories,
  countries,
  addCategory,
  removeCategory,
  addCountry,
  removeCountry,
  toggleCountryTranslation,
  selectedCountryTranslations,
  onNextButtonClick,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleNextButtonClick = () => {
    if (selectedCategories.length === 0 || selectedCountries.length === 0) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please Select at least one Country or Category.");
      setSnackbarOpen(true);
    } else {
      onNextButtonClick();
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
      <h1 className="text-2xl font-bold mb-4">
        Set Your Press Release Up for Success
      </h1>

      {/* Categories */}
      <div className="mb-4">
        <p className="text-base mb-2">Target industry categories</p>
        <p className="text-sm text-gray-600 mb-3">
          We’ll hand-build a custom list of target journalists in these
          categories for your press release - the first one is free, additional
          categories are $40 each.
        </p>
        <h2 className="text-lg font-semibold mb-2">
          Categories <span className="text-red-600">*</span>
        </h2>
        <select
          className="border border-gray-300 rounded-xl w-full h-10 px-3 py-2 mb-2"
          onChange={(e) => addCategory(JSON.parse(e.target.value))}
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={JSON.stringify(category)}>
              {category.name} - ${category.price}
            </option>
          ))}
        </select>
        <ul className="flex flex-wrap gap-3">
          {selectedCategories.map((category, index) => (
            <li
              key={index}
              className="flex items-center bg-gray-200 px-2 py-1 rounded-2xl"
              style={{ fontSize: "12px" }}
            >
              <span>
                {category.name} - ${category.price}
              </span>
              <button
                className="text-red-600 ml-2"
                onClick={() => removeCategory(index)}
              >
                &#10005;
              </button>
            </li>
          ))}
        </ul>
      </div>
      <hr />
      {/* Countries */}
      <div className="my-4">
        <p className="text-base mb-2">Target industry countries</p>
        <p className="text-sm text-gray-600 mb-3">
          We’ll hand-build a custom list of target journalists in these
          countries for your press release - the first one is free, additional
          countries are $100 each.
        </p>

        <h2 className="text-lg font-semibold mb-2">
          Countries <span className="text-red-600">*</span>
        </h2>
        <select
          className="border border-gray-300 rounded-xl w-full h-10 px-3 py-2 mb-2"
          onChange={(e) => addCountry(JSON.parse(e.target.value))}
        >
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={JSON.stringify(country)}>
              {country.name} - ${country.price}
            </option>
          ))}
        </select>
        <ul className="flex flex-wrap gap-3">
          {selectedCountries.map((country, index) => (
            <li
              key={index}
              className="flex items-center bg-gray-200 px-2 py-1 rounded-2xl"
              style={{ fontSize: "12px" }}
            >
              <span>
                {country.name} - ${country.price}
              </span>
              <button
                className="text-red-600 ml-2"
                onClick={() => removeCountry(index)}
              >
                &#10005;
              </button>
              <label className="ml-2 flex gap-1">
                <div>Translation (+$20)</div>
                <input
                  type="checkbox"
                  checked={selectedCountryTranslations.some(
                    (trans) => trans.name === country.name
                  )}
                  onChange={() => toggleCountryTranslation(country)}
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          className="btn-grad py-2 px-4 uppercase text-center"
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseDistribution;
