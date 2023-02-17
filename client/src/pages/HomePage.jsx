import React from "react";
import { Container, Row, Col, Image, Jumbotron } from "react-bootstrap";
import Register from "./authentication/forms/Register";
import GoogleAuthButton from "./authentication/googleOAUTH/GoogleAuthButton";

const HomePage = () => {
  return (
    <Container>
      <Row className="mt-5">
        <Col xs={12} md={8}>
          <Jumbotron>
            <h1>Welcome to My App!</h1>
            <Image src="https://picsum.photos/550/300" rounded />
          </Jumbotron>
        </Col>
        <Col xs={6} md={4}>
          <Register />
          <GoogleAuthButton />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
