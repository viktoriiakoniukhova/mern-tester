import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import authService from "../utils/service/authService";
import { useParams } from "react-router-dom";

const UserEditPage = () => {
  const [user, setUser] = useState({});

  let { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getUser(userId);
      setUser(user);
    };
    fetchUser();
  }, []);

  const { Formik } = formik;

  const schema = yup.object().shape({
    firstname: yup
      .string()
      .min(2, "*Names must have at least 2 characters")
      .max(100, "*Names can't be longer than 100 characters")
      .required("*Name is required"),
    lastname: yup
      .string()
      .min(2, "*Names must have at least 2 characters")
      .max(100, "*Names can't be longer than 100 characters")
      .required("*Name is required"),
  });

  const handleSubmit = (values) => {
    authService.updateUser(userId, values);
  };

  return (
    <>
      {user._id && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            firstname: user.firstname,
            lastname: user.lastname,
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

              <Row className="row">
                <Col className="col text-center">
                  <Button type="submit" className="text-center">
                    Update
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default UserEditPage;
