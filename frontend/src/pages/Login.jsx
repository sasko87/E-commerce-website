import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import Input from "../components/UI/Input";
import SubmitButton from "../components/UI/SubmitButton";
import MotionDiv from "../components/UI/MotionDiv";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUserStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <MotionDiv y={-20} delay={0}>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Login to your account
        </h2>
      </MotionDiv>

      <MotionDiv>
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-mail"
              id="email"
              type="email"
              placeholder={"you@example.com"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={Mail}
            />

            <Input
              label="Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              Icon={Lock}
            />

            <SubmitButton Icon={LogIn}>Login</SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Sign up now <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default Login;
