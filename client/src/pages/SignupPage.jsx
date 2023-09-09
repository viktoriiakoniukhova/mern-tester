import React from "react";
import * as formik from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import authService from "../utils/service/authService";

const SignupPage = () => {
  const { Formik } = formik;

  const schema = yup.object().shape({
    firstname: yup
      .string()
      .min(2, "*Names must have at least 2 characters")
      .max(100, "*Names can't be longer than 100 characters")
      .required("*First name is required"),
    lastname: yup
      .string()
      .min(2, "*Names must have at least 2 characters")
      .max(100, "*Names can't be longer than 100 characters")
      .required("*Last name is required"),
    email: yup
      .string()
      .required()
      .email("*Must be a valid email address")
      .max(100, "*Email must be less than 100 characters")
      .required("*Email is required"),
    password: yup
      .string()
      .min(5, "*Password must have at least 5 characters")
      .required("*Password is required"),
  });

  const handleSubmit = (values) => {
    authService.register(values);
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="row justify-content-md-center mb-3 mt-3">
            <Form.Group as={Col} md="3" controlId="validationFormik01">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={values.firstname}
                onChange={handleChange}
                isInvalid={!!errors.firstname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstname}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik02">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={values.lastname}
                onChange={handleChange}
                isInvalid={!!errors.lastname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastname}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="row justify-content-md-center mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik03">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="row justify-content-md-center mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik04">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="row">
            <Col className="col text-center">
              <Button type="submit" className="text-center">
                Sign Up
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default SignupPage;
