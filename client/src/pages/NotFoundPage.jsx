import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NotFoundPage = () => {
  return (
    <div class="nf_section">
      <h1 class="error">404</h1>
      <div class="nf_page">
        Ooops!!! The page you are looking for is not found
      </div>
      <LinkContainer to="/">
        <Button className="nf_back_home" variant="light">
          Back to home
        </Button>
      </LinkContainer>
    </div>
  );
};

export default NotFoundPage;
