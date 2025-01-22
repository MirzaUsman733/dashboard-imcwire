"use client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaLock } from "react-icons/fa";
import { useUser } from "../../contexts/userData";

function SignupForm() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { userData } = useUser();
  const [focusedField, setFocusedField] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isAgency, setIsAgency] = useState(false);
  const [viewPassword, setViewPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [plans, setPlans] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const recaptchaRef = useRef(null);

  const handleClickShowPassword = () => {
    setViewPassword(!viewPassword);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  useEffect(() => {
    if (session) {
      setName(session?.user?.name);
      setEmail(session?.user?.email);
    }
  }, [session]);

  const handleAgencyCheckboxChange = () => {
    setIsAgency(!isAgency);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleStreetChange = (event) => {
    setStreetAddress(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  useEffect(() => {
    const generatedId = generateUniqueId(24);
    setClientId(generatedId);
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

  const isEmailAvailable = !userData.find((user) => user.email === email);

  const isValidEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleSignUpSubmit = async (name, email, password) => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      console.log("Email is invalid");
      return;
    }

    if (password.length < 8) {
      console.log("Password must be at least 8 characters long");
      return;
    }
    const token = await recaptchaRef.current.getValue();
    if (!token) {
      setError("Captcha register failed");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: "user",
          token: token,
          isAgency: isAgency,
          redirect: false,
        }),
      });

      if (res.status === 400) {
        console.log("This email is already registered");
        return;
      }
    } catch (error) {
      console.log("Error, try again");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formDataSignUp = {
      name: name,
      email: email,
    };

    const combinedData = {
      selectedCategories: selectedCategories,
      selectedCountries: selectedCountries,
      selectedCountryTranslations: selectedCountryTranslations,
      selectedPrice: selectedPrice,
      cost: cost,
      matchedPlanData: matchedPlanData,
      categorySubtotal: categorySubtotal,
      countrySubTotal: countrySubtotal,
      countryTranslationsPrice: countryTranslationsPrice,
      totalPrice: totalPrice,
      formDataSignUp: formDataSignUp,
      selectedOption: selectedOption,
      clientId: clientId,
      transactionId: null,
    };

    try {
      const response = await fetch("/api/compaignData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        if (!session) {
          if (!isEmailAvailable) {
          } else {
            handleSignUpSubmit(name, email, password);
          }
        }
        setIsLoading(false);
      } else {
        console.error("Failed to add plan");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("https://certsgang.com/v1/countries", {
        headers: {
          "x-api-key": "b46279cb-13bb-4445-a6f9-6f252b61ae79",
        },
      });
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, [session]);
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto mb-0">
      <form className="flex flex-col p-6 space-y-5">
        <h3 className="whitespace-nowrap tracking-tight text-2xl font-bold">
          Personal Detail
        </h3>
        <p className="text-sm text-muted-foreground mb-10">
          Enter your information below to create an account
        </p>
        <div className="space-y-5">
          {!session && (
            <>
              <TextField
                label="Name"
                type="text"
                placeholder="Enter the Name"
                fullWidth
                onChange={handleNameChange}
                value={name}
                onFocus={() => handleFocus("name")}
                onBlur={handleBlur}
                className={focusedField === "name" ? "focused" : ""}
              />
              <TextField
                label="Email"
                type="email"
                placeholder="Enter the Email"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                className={focusedField === "email" ? "focused" : ""}
              />
              <TextField
                label="Set Password"
                variant="outlined"
                type={viewPassword ? "password" : "text"}
                name="password"
                autoComplete="off"
                placeholder="Enter the Password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                InputProps={{
                  placeholder: focusedField !== "password" ? "Password" : "",
                  startAdornment: <FaLock className="text-gray-400 me-2" />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {viewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className={focusedField === "password" ? "focused" : ""}
              />
              <input
                type="checkbox"
                id="agencyCheckbox"
                onChange={handleAgencyCheckboxChange}
                checked={isAgency}
              />
              &nbsp;
              <label htmlFor="agencyCheckbox">Are you an agency?</label>
              <div className="w-full my-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
              </div>
            </>
          )}
          <TextField
            label="Street Address"
            type="text"
            placeholder="Enter the Street Address"
            fullWidth
            value={streetAddress}
            onChange={handleStreetChange}
            onFocus={() => handleFocus("streetAddress")}
            onBlur={handleBlur}
            className={focusedField === "streetAddress" ? "focused" : ""}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="City"
              type="text"
              placeholder="Enter the City"
              fullWidth
              value={city}
              onChange={handleCityChange}
              onFocus={() => handleFocus("city")}
              onBlur={handleBlur}
              className={focusedField === "city" ? "focused" : ""}
            />
            <TextField
              label="State"
              type="text"
              placeholder="Enter the State"
              fullWidth
              value={state}
              onChange={handleStateChange}
              onFocus={() => handleFocus("state")}
              onBlur={handleBlur}
              className={focusedField === "state" ? "focused" : ""}
            />
            <TextField
              label="Zip Code"
              type="text"
              placeholder="Enter the Zip Code"
              fullWidth
              value={zip}
              onChange={handleZipChange}
              onFocus={() => handleFocus("zip")}
              onBlur={handleBlur}
              className={focusedField === "zip" ? "focused" : ""}
            />
            <FormControl fullWidth>
              <InputLabel id="client-email-label">Select Country</InputLabel>
              <Select
                labelId="client-email-label"
                id="country"
                onFocus={() => handleFocus("country")}
                onBlur={handleBlur}
                className={focusedField === "country" ? "focused" : ""}
                value={country}
                onChange={handleCountryChange}
                label="Client Email"
              >
                <MenuItem value="" disabled>
                  Select Country
                </MenuItem>
                {plans.map((country) => (
                  <MenuItem
                    key={country.country_code}
                    value={country.country_code}
                  >
                    {`${country.country_name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <input
            type="checkbox"
            id="termsCheckbox"
            onChange={handleCheckboxChange}
            checked={isChecked}
          />
          &nbsp;
          <label htmlFor="termsCheckbox">
            I have read and accept the{" "}
            <Link
              href="/terms-and-condition"
              className="underline text-blue-500"
            >
              Terms and Conditions{" "}
            </Link>
          </label>
          <button
            type="button"
            disabled={!isChecked || isLoading}
            onClick={handleSubmit}
            className="btn-grad inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isLoading ? "Loading..." : "Checkout"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
