import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.js";
import Input from "../components/UI/Input.jsx";
import SubmitButton from "../components/UI/SubmitButton.jsx";
import MotionDiv from "../components/UI/MotionDiv.jsx";

const SignUp = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, user } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };
  return (
    <div className="flex flex-col justify-center py-12 sm-px-6 lg-px-8">
      <MotionDiv y={-20} delay={0}>
      
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Create your account
        </h2>
     
      </MotionDiv>
      <MotionDiv>
         <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full name"
              id="name"
              required
              type={"text"}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              Icon={User}
            />

            <Input
              label="Email address"
              id="email"
              required
              type={"email"}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              Icon={Mail}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              required
              type={"password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="*******"
              Icon={Lock}
            />

            <SubmitButton Icon={UserPlus}>Sign up</SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default SignUp;
