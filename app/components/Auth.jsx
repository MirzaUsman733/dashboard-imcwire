"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { signIn, useSession } from "next-auth/react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaLock } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [viewPasswordSignIn, setViewPasswordSignIn] = useState(true);
  const [viewPasswordLogin, setViewPasswordLogin] = useState(true);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const recaptchaRef = useRef(null);

  const router = useRouter();
  const handleClickShowPassword = () => {
    setViewPasswordSignIn(!viewPasswordSignIn);
  };
  const handleClickShowPasswordlogin = () => {
    setViewPasswordLogin(!viewPasswordLogin);
  };
  const handleRemoveBtnSignIn = () => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setEmailSignIn("");
    setPasswordSignIn("");
    container.classList.remove("right-panel-active");
  };

  const handleRemoveBtnSignUp = () => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setEmailSignIn("");
    setPasswordSignIn("");
    container.classList.add("right-panel-active");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "emailSignIn":
        setEmailSignIn(value);
        break;
      case "passwordSignIn":
        setPasswordSignIn(value);
        break;
      default:
        break;
    }
  };

  const handleFocus = (fieldName) => setFocusedField(fieldName);

  const handleBlur = () => setFocusedField("");

  const isValidEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const token = await recaptchaRef.current.getValue();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setLoadingSignUp(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user",
          token: token,
        }),
      });

      if (res?.status === 400) {
        setError("This email is already registered");
        setLoadingSignUp(false);
        return;
      }

      if (res?.status === 200) {
        setLoadingSignUp(false);
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setEmailSignIn("");
        setPasswordSignIn("");
        handleRemoveBtnSignIn();

        return;
      }
      setError("Error, try again");
    } catch (error) {
      setError("Error, try again");
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const token = await recaptchaRef?.current?.getValue();
    console.log(token);
    // const isVerified = await verifyCaptcha(token);
    // if (!isVerified) {
    //   setError("Please complete the reCAPTCHA verification");
    //   return;
    // }
    if (!isValidEmail(emailSignIn)) {
      setError("Email is invalid");
      return;
    }

    if (!passwordSignIn || passwordSignIn?.length < 8) {
      setError("Password is invalid");
      return;
    }
    setLoadingSignIn(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: emailSignIn,
      password: passwordSignIn,
      token: token,
    });

    if (res?.error) {
      setError(res?.error);
      if (!res?.error) router?.replace("/press-dashboard/pr-balance");
    } else {
      setError("");
    }
    setLoadingSignIn(false);
    recaptchaRef.current.execute();
  };

  return (
    <div>
      <div>
        <div className="containerAuth" id="container">
          <div>
            <div className="form-container sign-up-container">
              <form className="formAuth" onSubmit={handleSignUpSubmit}>
                <h1 className="text-3xl font-bold font-serif mb-5">
                  Create Account
                </h1>
                <div className="w-full my-2">
                  <TextField
                    label="Name"
                    variant="outlined"
                    type="text"
                    name="name"
                    autoComplete="off"
                    placeholder="Your Name"
                    onChange={handleChange}
                    value={name}
                    fullWidth
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <AiOutlineUser className="text-gray-400 me-2" />
                      ),
                      placeholder: focusedField !== "name" ? "Name" : "",
                    }}
                    className={focusedField === "name" ? "focused" : ""}
                  />
                </div>
                <div className="w-full my-2">
                  <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    name="email"
                    autoComplete="off"
                    placeholder="Enter the Email"
                    value={email}
                    onChange={handleChange}
                    fullWidth
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <AiOutlineMail className="text-gray-400 me-2" />
                      ),
                      placeholder: focusedField !== "email" ? "Email" : "",
                    }}
                    className={focusedField === "email" ? "focused" : ""}
                  />
                </div>
                <div className="w-full my-2">
                  <TextField
                    label="Password"
                    variant="outlined"
                    type={viewPasswordSignIn ? "password" : "text"}
                    name="password"
                    autoComplete="off"
                    placeholder="Enter the Password"
                    value={password}
                    onChange={handleChange}
                    fullWidth
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    InputProps={{
                      placeholder:
                        focusedField !== "password" ? "Password" : "",
                      startAdornment: <FaLock className="text-gray-400 me-2" />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {viewPasswordSignIn ? (
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
                </div>
                <div className="w-full my-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  />
                </div>
                {loadingSignUp ? (
                  <button
                    className="px-10 uppercase py-3 mt-4"
                    disabled={loadingSignUp}
                  >
                    {loadingSignUp ? <CircularProgress size={24} /> : "Sign Up"}
                  </button>
                ) : (
                  <button className="btn-grad px-10 uppercase py-3 mt-4">
                    {loadingSignUp ? <CircularProgress size={24} /> : "Sign Up"}
                  </button>
                )}
              </form>
            </div>
            <div className="form-container sign-in-container">
              <form
                className="formAuth"
                onSubmit={handleSignInSubmit}
                action="#"
              >
                <h1 className="text-3xl font-bold font-serif mb-5">Sign In</h1>
                <div className="w-full my-2">
                  <TextField
                    label="Email"
                    variant="outlined"
                    required
                    type="email"
                    name="emailSignIn"
                    autoComplete="off"
                    placeholder="Enter the Email"
                    value={emailSignIn}
                    onChange={handleChange}
                    fullWidth
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <AiOutlineMail className="text-gray-400 me-2" />
                      ),
                      placeholder: focusedField !== "email" ? "Email" : "",
                    }}
                    className={focusedField === "email" ? "focused" : ""}
                  />
                </div>
                <div className="w-full my-2">
                  <TextField
                    label="Password"
                    variant="outlined"
                    // type="password"
                    type={viewPasswordLogin ? "password" : "text"}
                    name="passwordSignIn"
                    required
                    autoComplete="off"
                    placeholder="Enter the Password"
                    value={passwordSignIn}
                    onChange={handleChange}
                    fullWidth
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    // InputProps={{
                    //   startAdornment: <FaLock className="text-gray-400 me-2" />,
                    //   placeholder:
                    //     focusedField !== "password" ? "Password" : "",
                    // }}
                    InputProps={{
                      placeholder:
                        focusedField !== "password" ? "Password" : "",
                      startAdornment: <FaLock className="text-gray-400 me-2" />,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordlogin}
                            edge="end"
                          >
                            {viewPasswordLogin ? (
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
                </div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
                <div className="flex justify-start">
                  <a
                    href="/forgot-password"
                    style={{ textDecoration: "underline", textAlign: "start" }}
                    className="text-red-700 text-underline text-start"
                  >
                    Forgot your password?
                  </a>
                </div>
                {error && (
                  <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {error}
                  </div>
                )}
                {loadingSignIn ? (
                  <button
                    className="px-10 uppercase py-3 mt-4"
                    disabled={loadingSignIn}
                  >
                    {loadingSignIn ? <CircularProgress size={24} /> : "Sign In"}
                  </button>
                ) : (
                  <button
                    className="btn-grad px-10 uppercase py-3 mt-4"
                    disabled={loadingSignIn}
                  >
                    {loadingSignIn ? <CircularProgress size={24} /> : "Sign In"}
                  </button>
                )}
              </form>
            </div>
          </div>

          <div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-xl mb-2">Start from where you left</p>
                  <p className="text-opacity-75 mb-3">
                    Already Have the Account
                  </p>
                  <div
                    onClick={handleRemoveBtnSignIn}
                    className="btn-grad px-10 uppercase py-3 mt-4"
                    id="signIn"
                  >
                    Sign In
                  </div>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="text-3xl font-bold mb-2">Hello, Buddy!</h1>
                  <p className="text-xl mb-2">Join Us on a new adventure</p>
                  <p className="text-opacity-75 mb-3">
                    Do not Have the Account
                  </p>
                  <div
                    onClick={handleRemoveBtnSignUp}
                    className="btn-grad  px-10 uppercase py-3 mt-4"
                    id="signUp"
                  >
                    Sign Up
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
