import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async () => {
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        payload
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify({ email, role }));
      await login(email, password);
      navigate(role === "seller" ? "/seller/properties" : "/");
    } catch (err) {
      console.error("Signup error:", err.response || err.message);
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center p-4 max-w-md w-full">
        <div className="rounded-lg bg-white text-center p-6 shadow-lg">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          {error && <p className="text-red-500">{error}</p>}
          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Phone Number"
            label={"Phone Number"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
            type="password"
          />
          <select
            id="role"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            className="mt-3 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <div className="pt-4">
            <Button onClick={handleSignup} label={"Sign up"} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
