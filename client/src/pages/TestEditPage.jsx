import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import testService from "../utils/service/testService";
import { useParams } from "react-router-dom";

const TestEditPage = () => {
  const [test, setTest] = useState({});

  let { testId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      const test = await testService.getTest(testId);
      setTest(test);
    };
    fetchTest();
  }, []);

  const { Formik, Field, FieldArray } = formik;

  const schema = yup.object().shape({
    title: yup
      .string()
      .min(2, "*Title must have at least 2 characters")
      .max(100, "*Title can't be longer than 100 characters")
      .required("*Title is required"),
    description: yup
      .string()
      .min(25, "*Description must have at least 25 characters")
      .max(2000, "*Description can't be longer than 2000 characters")
      .required("*Description is required"),
    questions: yup.array().of(
      yup.object().shape({
        text: yup
          .string()
          .min(2, "*Question text must have at least 2 characters")
          .max(1000, "*Question text can't be longer than 1000 characters")
          .required("*Question text is required"),
        options: yup
          .array()
          .of(
            yup
              .string()
              .min(2, "*Option must have at least 2 characters")
              .max(200, "*Option can't be longer than 200 characters")
              .required("*Option is required")
          )
          .min(2, "*At least 2 options are required"),
        answer: yup.string().required("*Answer is required"),
        score: yup
          .number()
          .default(1)
          .min(1, "*Score must be at least 1")
          .required("*Score is required"),
      })
    ),
  });

  const handleSubmit = (values) => {
    testService.updateTest(test.owner._id, testId, values);
  };

  return (
    <Container className="my-4">
      <h1>Update Test</h1>
      {test._id && (
        <Formik
          initialValues={test}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter test title"
                  value={values.title}
                  onChange={handleChange}
                  isInvalid={touched.title && errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter test description"
                  value={values.description}
                  onChange={handleChange}
                  isInvalid={touched.description && errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Questions FieldArray */}
              <FieldArray name="questions">
                {({ push, remove }) => (
                  <Col className="my-2">
                    {values.questions.map((question, index) => (
                      <div key={index} style={{ marginTop: "10px" }}>
                        {/* Question Text */}
                        <Form.Group controlId={`questions[${index}].text`}>
                          <Form.Label>
                            <b>Question #{index + 1} </b>
                          </Form.Label>
                          <Field
                            type="text"
                            name={`questions[${index}].text`}
                            placeholder="Enter question text"
                            as={Form.Control}
                            isInvalid={
                              touched.questions &&
                              touched.questions[index] &&
                              errors.questions &&
                              errors.questions[index] &&
                              touched.questions[index].text &&
                              errors.questions[index].text
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.questions &&
                              errors.questions[index] &&
                              errors.questions[index].text}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {/* Options FieldArray */}
                        <FieldArray name={`questions[${index}].options`}>
                          {({ push, remove }) => (
                            <Row className=" mb-3">
                              {question.options.map((_, optionIndex) => (
                                <Col key={optionIndex} md="3">
                                  {/* Option */}
                                  <Form.Group
                                    controlId={`questions[${index}].options[${optionIndex}]`}
                                  >
                                    <Form.Label>
                                      Option {optionIndex + 1}
                                    </Form.Label>
                                    <Field
                                      type="text"
                                      name={`questions[${index}].options[${optionIndex}]`}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      as={Form.Control}
                                      isInvalid={
                                        touched.questions &&
                                        touched.questions[index] &&
                                        errors.questions &&
                                        errors.questions[index] &&
                                        touched.questions[index].options &&
                                        errors.questions[index].options &&
                                        touched.questions[index].options[
                                          optionIndex
                                        ] &&
                                        errors.questions[index].options[
                                          optionIndex
                                        ]
                                      }
                                    />
                                    {optionIndex > 1 && (
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => remove(optionIndex)}
                                        style={{ marginLeft: "10px" }}
                                      >
                                        Remove
                                      </Button>
                                    )}
                                    <Form.Control.Feedback type="invalid">
                                      {errors.questions &&
                                        errors.questions[index] &&
                                        errors.questions[index].options &&
                                        errors.questions[index].options[
                                          optionIndex
                                        ]}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </Col>
                              ))}
                              <Row>
                                <Col>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => push("")}
                                    style={{ marginTop: "10px" }}
                                  >
                                    Add Option
                                  </Button>
                                </Col>
                              </Row>
                            </Row>
                          )}
                        </FieldArray>

                        {/* Correct Answer */}
                        <Form.Group controlId={`questions[${index}].answer`}>
                          <Form.Label>Correct Answer</Form.Label>
                          <Field
                            as="select"
                            name={`questions[${index}].answer`}
                            className={`mx-2 ${
                              touched.questions &&
                              touched.questions[index] &&
                              errors.questions &&
                              errors.questions[index] &&
                              touched.questions[index].answer &&
                              errors.questions[index].answer
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            {test.questions[index] &&
                            test.questions[index].answer ? (
                              <option value={test.questions[index].answer}>
                                {"Option " +
                                  (test.questions[index].options.findIndex(
                                    (option) =>
                                      option === test.questions[index].answer
                                  ) +
                                    1)}
                              </option>
                            ) : (
                              <option value="">Select Correct Answer</option>
                            )}

                            {question.options.map((_, optionIndex) => {
                              if (
                                (test.questions[index] &&
                                  _ !== test.questions[index].answer) ||
                                !test.questions[index]
                              )
                                return (
                                  <option key={optionIndex} value={_}>
                                    Option {optionIndex + 1}
                                  </option>
                                );
                            })}
                          </Field>
                          <Form.Control.Feedback type="invalid">
                            {errors.questions &&
                              errors.questions[index] &&
                              errors.questions[index].answer}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {/* Score */}
                        <Form.Group controlId={`questions[${index}].score`}>
                          <Form.Label>Score</Form.Label>
                          <Field
                            type="number"
                            name={`questions[${index}].score`}
                            placeholder="Enter score"
                            as={Form.Control}
                            isInvalid={
                              touched.questions &&
                              touched.questions[index] &&
                              errors.questions &&
                              errors.questions[index] &&
                              touched.questions[index].score &&
                              errors.questions[index].score
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.questions &&
                              errors.questions[index] &&
                              errors.questions[index].score}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => remove(index)}
                          style={{ marginTop: "10px" }}
                        >
                          Remove Question #{index + 1}
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        push({
                          text: "",
                          options: ["", ""],
                          answer: "",
                          score: "1",
                        })
                      }
                      style={{ marginTop: "10px" }}
                    >
                      Add Question
                    </Button>
                  </Col>
                )}
              </FieldArray>

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Update Test
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default TestEditPage;
