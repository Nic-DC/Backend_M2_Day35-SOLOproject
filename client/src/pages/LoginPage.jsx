import React from "react";
import { Container, Row, Col, Image, Jumbotron } from "react-bootstrap";
import Login from "./authentication/forms/Login";

const LoginPage = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col xs={12} md={8}>
          <Jumbotron>
            <h1>Login</h1>
            <Image src="https://picsum.photos/550/300" rounded />
          </Jumbotron>
        </Col>
        <Col xs={6} md={4}>
          <Login />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
