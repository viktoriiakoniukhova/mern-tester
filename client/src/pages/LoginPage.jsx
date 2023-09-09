import React from "react";
import * as formik from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import authService from "../utils/service/authService";

const LoginPage = () => {
  const { Formik } = formik;

  const schema = yup.object().shape({
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
    authService.login(values);
  };
  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleSubmit}
      initialValues={{
        email: "",
        password: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="row justify-content-md-center mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik01">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isInvalid={touched.email && errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="row justify-content-md-center mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik02">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Col className="text-center">
              <Button type="submit" className="text-center">
                Log In
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPage;
