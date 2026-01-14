import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn } from "../services/authService";
import { userAPI } from "../services/apiService";
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
        const userCredential = await signUp(email, password, name);
        toast.success("Account created successfully!");
        
        // Sync user with backend API (optional, will fail gracefully if backend is not available)
        try {
          await userAPI.syncUser({ name });
        } catch (syncError) {
          console.log('Backend sync not available, using direct Firestore');
        }
        
        navigate("/");
      } else {
        await signIn(email, password);
        toast.success("Logged in successfully!");
        
        // Sync user with backend API (optional)
        try {
          await userAPI.syncUser();
        } catch (syncError) {
          console.log('Backend sync not available');
        }
        
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
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-300 rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-gray-800">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-600">
          Please {state === "Sign up" ? "sign-up" : "log-in"} to book your
          appointment
        </p>
        {
          state === "Sign up" && (
            <div className="w-full">
              <p className="text-gray-700">Full Name</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white text-gray-900"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>)
          }
        <div className="w-full">
          <p className="text-gray-700">Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white text-gray-900"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p className="text-gray-700">Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white text-gray-900"
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
          <p className="text-gray-600">
            Already have an account? <span onClick={()=>setState("Login")} className="text-primary underline cursor-pointer hover:text-primary-hover">login here</span>
          </p>
        ) : (
          <p className="text-gray-600">
            Don't have an account? <span onClick={()=>setState("Sign up")} className="text-primary underline cursor-pointer hover:text-primary-hover">create account here</span>
          </p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default Login;
