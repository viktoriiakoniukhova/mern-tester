import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import authService from "../utils/service/authService";

const Navigation = () => {
  const [isAuth, setIsAuth] = useState(
    document.cookie
      .split("; ")
      .filter((row) => row.startsWith("refreshToken="))
      .map((c) => c.split("=")[1])[0]
      ? true
      : false
  );

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const user = await authService.getUser(userId);
        setUser(user);
      };
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Tester</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuth && (
              <LinkContainer to={`/${user._id}`}>
                <Nav.Link>My Tests</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end gap-2">
          {isAuth ? (
            <>
              <Navbar.Text>Signed in as:</Navbar.Text>
              <LinkContainer to={`/${user._id}`}>
                <Nav.Link>
                  {user.firstname} {user.lastname}
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/">
                <Button onClick={handleLogout}>Log Out</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <LinkContainer to="/login">
                <Button>Log In</Button>
              </LinkContainer>
              <LinkContainer to="/signup">
                <Nav.Link>Sign Up</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
