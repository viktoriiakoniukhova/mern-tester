import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import { v4 as uuidv4 } from "uuid";
import testService from "../utils/service/testService";

const HomePage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const tests = await testService.getTests();
      setTests(tests);
    };
    fetchTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  const listItems = tests.map(({ _id, title }) => {
    return (
      <ListGroup.Item
        action
        onClick={() => {
          handleTestClick(_id);
        }}
        key={uuidv4()}
      >
        {title}
      </ListGroup.Item>
    );
  });

  return (
    <Container className="my-4">
      <ListGroup>{listItems}</ListGroup>
    </Container>
  );
};

export default HomePage;
