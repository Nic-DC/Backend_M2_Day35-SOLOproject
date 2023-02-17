import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";

//import passport from "passport";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isRegistered, setIsRegistered] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordStrengthArray = ["Weak", "Fair", "Good", "Strong", "Very strong"];

  const calculatePasswordStrength = (password) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  console.log("formData", formData);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (event.target.name === "password") {
      calculatePasswordStrength(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordStrength < 3) {
      toast.error("Password is too weak. Please choose a stronger password.");
      return;
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    const endpoint = "http://localhost:3008/auth/register";
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error("Network response was not ok. Failed to register user");
      }
      const data = await response.json();
      console.log(data);
      setIsRegistered(true);

      toast.success("Registration successful!");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      const errorMessage = "Registration failed. Please try again later.";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      navigate("/login");
    }
  }, [isRegistered]);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <Form.Control type="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Control
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Form.Text className={`text-${passwordStrength >= 3 ? "success" : "danger"}`}>
          Password strength: {passwordStrengthArray[passwordStrength]}
        </Form.Text>
      </Form.Group>
      <Button variant="outline-dark" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default Register;
