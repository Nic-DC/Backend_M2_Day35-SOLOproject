import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("formData: ", formData);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    const endpoint = "http://localhost:3008/auth/login";
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error("Network response was not ok. Failed to log in the user");
      }
      const data = await response.json();
      console.log(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

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
      </Form.Group>
      <Button variant="outline-dark" type="submit">
        Login
      </Button>
    </Form>
  );
};
export default Login;
