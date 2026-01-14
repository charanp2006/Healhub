import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn } from "../services/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign up");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (state === "Sign up") {
        if (!name.trim()) {
          toast.error("Please enter your full name");
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        await signIn(email, password);
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      let errorMessage = "An error occurred";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        default:
          errorMessage = error.message || "An error occurred";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center ">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-300 dark:border-gray-700 rounded-xl text-[#5E5E5E] dark:text-gray-300 text-sm shadow-lg bg-white dark:bg-background-cardDark transition-colors duration-300">
        <p className="text-2xl font-semibold text-gray-800 dark:text-white transition-colors">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">
          Please {state === "Sign up" ? "sign-up" : "log-in"} to book your
          appointment
        </p>
        {
          state === "Sign up" && (
            <div className="w-full">
              <p className="text-gray-700 dark:text-gray-300">Full Name</p>
              <input
                className="border border-[#DADADA] dark:border-gray-600 rounded w-full p-2 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>)
          }
        <div className="w-full">
          <p className="text-gray-700 dark:text-gray-300">Email</p>
          <input
            className="border border-[#DADADA] dark:border-gray-600 rounded w-full p-2 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p className="text-gray-700 dark:text-gray-300">Password</p>
          <input
            className="border border-[#DADADA] dark:border-gray-600 rounded w-full p-2 mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          className="bg-primary hover:bg-primary-hover text-white w-full py-2 my-2 rounded-md text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : state === "Sign up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign up" ? (
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account? <span onClick={()=>setState("Login")} className="text-primary underline cursor-pointer hover:text-primary-hover transition-colors">login here</span>
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account? <span onClick={()=>setState("Sign up")} className="text-primary underline cursor-pointer hover:text-primary-hover transition-colors">create account here</span>
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default Login;
