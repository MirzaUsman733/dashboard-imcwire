"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Backdrop,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useDistributionContext } from "../contexts/DistributionContext";
import { useUser } from "../contexts/userData";
import { signIn, useSession } from "next-auth/react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { FaLock } from "react-icons/fa";
import Link from "next/link";

function SignupForm() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const { userData } = useUser();
  const {
    selectedCategories,
    selectedCountries,
    selectedCountryTranslations,
    selectedPrice,
    cost,
    matchedPlanData,
    categorySubtotal,
    countrySubtotal,
    countryTranslationsPrice,
    totalPrice,
    selectedOption,
  } = useDistributionContext();
  const [focusedField, setFocusedField] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAgency, setIsAgency] = useState(false);
  const [agencyName, setAgencyName] = useState("");
  const [viewPassword, setViewPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false)
  const recaptchaRef = useRef(null);

  const handleClickShowPassword = () => {
    setViewPassword(!viewPassword);
  };
  const toggleTermsPopup = () => {
    setShowTermsPopup(!showTermsPopup);
  };

  const handleCloseTermsPopup = () => {
    setShowTermsPopup(false);
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    handleCloseTermsPopup();
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

  const handleAgencyNameChange = (event) => {
    setAgencyName(event.target.value);
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
        }),
      });

      if (res.status === 400) {
        console.log("This email is already registered");
        return;
      }

      if (res.status === 200) {
        await handleSignInSubmit(email, password);
        return;
      }
      console.log("Error, try again");
    } catch (error) {
      console.log("Error, try again");
      console.log(error);
    }
  };

  const [sessionId, setSessionId] = useState("");

  // const handleCheckout = async () => {
  //   try {
  //     const response = await fetch("/api/checkout_sessions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         totalPrice: totalPrice,
  //         clientId: clientId,
  //       }),
  //     });
  //     const data = await response.json();
  //     setSessionId(data.sessionId);
  //   } catch (error) {
  //     console.error("Error creating checkout session:", error);
  //   }
  // };
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          totalPrice: totalPrice,
          clientId: clientId,
        }),
      });
      const data = await response.json();
      console.log(data)
      setSessionId(data.finalUrl);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const redirectToCheckout = () => {
    console.log("Session Id",sessionId)
    window.location.href = `${sessionId}`;
  };

  useEffect(() => {
    const redirectToCheckoutAfterDelay = () => {
      setTimeout(() => {
        redirectToCheckout();
      }, 0);
    };

    if (sessionId) {
      redirectToCheckoutAfterDelay();
    }
  }, [sessionId]);

  const handleSignInSubmit = async (email, password) => {
    if (!isValidEmail(email)) {
      console.log("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      console.log("Password is invalid");
      return;
    }
    const token = await recaptchaRef.current.getValue();
    if (!token) {
      setError("Captcha register failed");
      return;
    }
    const res = await signIn("credentials", {
      email: email,
      password: password,
      token: token,
    });
    if (res?.error) {
      console.log(res.error);
      if (!res?.error) {
        console.log("login successfully");
      }
    } else {
      console.log("");
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
      // formData: formData,
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
      // isAgency: isAgency,
      // agencyName: agencyName,
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
            await handleCheckout();
            // await handleSignInSubmit(email, password);
            redirectToCheckout();
          } else {
            handleSignUpSubmit(name, email, password);
            await handleCheckout();
            redirectToCheckout();
          }
        } else {
          await handleCheckout();
          redirectToCheckout();
        }
        setIsLoading(false);
        // await handleCheckout();
        // redirectToCheckout();
      } else {
        console.error("Failed to add plan");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
    } finally {
      redirectToCheckout();
    }
  };

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
              {/* <TextField
                label="Password"
                type="password"
                placeholder="Enter the Password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                className={focusedField === "password" ? "focused" : ""}
              /> */}
              <TextField
                label="Password"
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
          {/* <Dialog
            open={showTermsPopup}
            onClose={handleCloseTermsPopup}
            BackdropComponent={Backdrop}
          >
            <DialogTitle fontSize={30} className="text-center font-bold">
              Terms and Conditions
            </DialogTitle>
            <DialogContent>
              <div>
                <p>
                  <span className="font-bold">
                    Non-Refundable Payment Policy:
                  </span>{" "}
                  &nbsp; Please note that once a payment is made for our press
                  release distribution services, it is not refundable. This
                  policy is in place due to the immediate action we take to
                  distribute your content across our extensive network,
                  including premier sites like Yahoo Finance, Bloomberg,
                  MarketWatch, and many others. We encourage you to review your
                  selections carefully and reach out to our support team for any
                  clarifications before making a payment.
                </p>
                <p>
                  For more information about our services and policies, please
                  visit our FAQ section or contact our support team.
                </p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAcceptTerms}>Accept</Button>
            </DialogActions>
          </Dialog> */}
          <input
            type="checkbox"
            id="termsCheckbox"
            onChange={handleCheckboxChange}
            checked={isChecked}
          />
          &nbsp;
          <label htmlFor="termsCheckbox">
            I have read and accept the <Link href="/terms-and-condition" className="underline text-blue-500">Terms and Conditions </Link>
          </label>
          {/* {isAgency && (
            <TextField
              label="Agency Name"
              type="text"
              placeholder="Enter the Agency Name"
              fullWidth
              value={agencyName}
              onChange={handleAgencyNameChange}
              onFocus={() => handleFocus("agencyName")}
              onBlur={handleBlur}
              className={focusedField === "agencyName" ? "focused" : ""}
            />
          )} */}
          {/* <button
            type="button"
            disabled={!acceptedTerms || !isChecked}
            onClick={handleSubmit}
            className="btn-grad inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Submit
          </button> */}
          <button
            type="button"
            disabled={ !isChecked || isLoading} // Disable button when loading
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
