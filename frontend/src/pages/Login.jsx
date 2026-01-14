import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Sign up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <form className="min-h-[80vh] flex items-center ">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign up" ? "sign-up" : "log-in"} to book your
          appointment
        </p>
        {
          state === "Sign up" && (
            <div className="w-full">
              <p>Full Name</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>)
          }
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base"
          type="submit"
        >
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign up" ? (
          <p>
            Already have an account? <span onClick={()=>setState("Login")} className="text-primary underline cursor-pointer">login here</span>
          </p>
        ) : (
          <p>
            Don't have an account? <span onClick={()=>setState("Sign up")} className="text-primary underline cursor-pointer">create account here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
