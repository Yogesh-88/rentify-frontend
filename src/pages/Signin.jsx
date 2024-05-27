import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSignin = async () => {
    try {
      const user = await login(email, password);

      if (user && user.role) {
        if (user.role === "seller") {
          navigate("/seller/properties");
        } else if (user.role === "buyer") {
          navigate("/");
        } else {
          setError("Unexpected user role");
        }
      } else {
        setError("User role is missing");
      }
    } catch (err) {
      console.error("Signin error:", err.response || err.message);
      setError(err.response?.data?.error || "An error occurred during signin.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center p-4 max-w-md w-full">
        <div className="rounded-lg bg-white text-center p-6 shadow-lg">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          {error && <p className="text-red-500">{error}</p>}
          <InputBox
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
            type="password"
          />
          <div className="pt-4">
            <Button onClick={handleSignin} label={"Sign in"} />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
