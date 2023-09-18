import React, { useEffect, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import testService from "../utils/service/testService";
import { useNavigate, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Question from "../components/Question";
import ListGroup from "react-bootstrap/ListGroup";
import { v4 as uuidv4 } from "uuid";

const TestPage = () => {
  const [test, setTest] = useState({});
  const [questions, setQuestions] = React.useState([]);

  const navigate = useNavigate();

  let { testId } = useParams();

  useEffect(() => {
    const fetchTest = async () => {
      const test = await testService.getTest(testId);
      setTest(test);
      if (!test) navigate("/notfound", { replace: true });

      else {
        setQuestions(
          test.shuffle ? shuffleQuestions(test.questions) : test.questions
        );
      }

    };

    fetchTest();
  }, []);

  const [isAuth, setIsAuth] = useState(
    document.cookie
      .split("; ")
      .filter((row) => row.startsWith("refreshToken="))
      .map((c) => c.split("=")[1])[0]
      ? true
      : false
  );

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showTest, setShowTest] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const { Formik, Field, FieldArray } = formik;

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
  });

  const handleSubmit = (values) => {
    const { firstname, lastname, email } = values;
    const candidateData = {
      firstname,
      lastname,
      email,
      score: getTotalScore(),
    };
    setIsTestFinished(true);
    testService.addCandidateToTest(testId, candidateData);
  };

  const handleStartTest = () => {
    setShowTest((prevState) => !prevState);
  };

  const getTotalScore = () => {
    let totalScore = 0;
    for (const index in selectedAnswers) {
      if (selectedAnswers[index].isCorrect) {
        totalScore += test.questions[index].score;
      }
    }
    return totalScore;
  };

  const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  };

  const formItems = questions?.map((question, index) => {
    return (
      <Question
        index={index}
        question={question}
        setSelectedAnswers={setSelectedAnswers}
        selectedAnswers={selectedAnswers}
        isTestFinished={isTestFinished}
      />
    );
  });

  const candidatesItems = test.candidates
    ? test.candidates.map(({ firstname, lastname, email, score }) => {
        return (
          <ListGroup.Item key={uuidv4()}>
            <Row className="d-flex align-items-center">
              <Col xs={9}>
                <h5>
                  {firstname} {lastname}
                </h5>
                <p>{email}</p>
              </Col>
              <Col xs={3} className="d-flex justify-content-end">
                <p>
                  Result: <b>{score}</b>
                </p>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })
    : null;

  return (
    <Container className="py-4">
      {test._id && (
        <>
          <Stack direction="horizontal" gap={3}>
            <div className="p-2">
              <h2>{test.title}</h2>
            </div>
            <div className="p-2 ms-auto">
              author: {test.owner.firstname} {test.owner.lastname}
            </div>
          </Stack>
          <Stack>
            <div className="p-2">{test.description}</div>
            <div className="p-2">Questions amount:{test.questions.length}</div>
            {isAuth && user._id === test.owner._id ? (
              <>
                <div className="p-2">
                  <h3>Candidates:</h3>
                  {test.candidates?.length ? (
                    <ListGroup>{candidatesItems}</ListGroup>
                  ) : (
                    <div className="p-2 d-flex justify-content-center">
                      <div className="p-2 ">There is no candidates yet.</div>
                    </div>
                  )}
                </div>
              </>
            ) : showTest ? (
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  firstname: "",
                  lastname: "",
                  email: "",
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  isValidating,
                  isSubmitting,
                  handleSubmit,
                  handleChange,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <h2>Candidate Data</h2>
                    <Row className="row justify-content-md-center mb-3 mt-3">
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik01"
                      >
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
                      <Form.Group
                        as={Col}
                        md="3"
                        controlId="validationFormik02"
                      >
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
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationFormik03"
                      >
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
                    <h2>Questions</h2>
                    {formItems}
                    {isTestFinished ? (
                      <div className="p-2">
                        <h3>
                          Your results: <b>{getTotalScore()}</b>
                        </h3>
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        variant="success"
                        className="col-md-2 mx-auto"
                        disabled={isSubmitting || isValidating}
                      >
                        Finish test
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            ) : (
              <Button
                onClick={handleStartTest}
                variant="secondary"
                className="col-md-2 mx-auto"
              >
                Start test
              </Button>
            )}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default TestPage;
