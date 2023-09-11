import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { v4 as uuidv4 } from "uuid";
import { LinkContainer } from "react-router-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import authService from "../utils/service/authService";
import { useParams } from "react-router-dom";
import testService from "../utils/service/testService";

const UserPage = () => {
  const [user, setUser] = useState({});

  let { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getUser(userId);
      setUser(user);
    };
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleTestOpen = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleTestEdit = (testId) => {
    navigate(`/test/${testId}/edit`);
  };

  const handleTestDelete = (testId) => {
    testService.deleteTest(testId);
    navigate(0);
  };

  const handleUserEdit = () => {
    navigate(`/${userId}/edit`);
  };

  const listItems = user.tests?.map(({ _id, title }) => {
    return (
      <ListGroup.Item key={uuidv4()}>
        <Row>
          <Col xs={12} sm={9}>
            <h3>{title}</h3>
          </Col>
          <Col xs={12} sm={3} className="d-flex justify-content-end">
            <Button
              variant="success"
              className="mx-1"
              onClick={() => {
                handleTestOpen(_id);
              }}
            >
              Open
            </Button>
            <Button
              variant="secondary"
              className="mx-1"
              onClick={() => {
                handleTestEdit(_id);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="mx-1"
              onClick={() => {
                handleTestDelete(_id);
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  });

  return (
    <Container className="py-4">
      {user._id && (
        <Stack direction="vertical" gap={3}>
          <Stack direction="horizontal">
            <div className="p-2">
              <h2>
                {user.firstname} {user.lastname}
              </h2>
            </div>
            <div className="p-2 ms-auto">
              <Button variant="secondary" onClick={handleUserEdit}>
                Edit
              </Button>
            </div>
          </Stack>

          <div className="p-2">{user.email}</div>
          <div className="p-2 d-flex justify-content-center">
            <LinkContainer to="/create">
              <Button className="mx-2">Create test</Button>
            </LinkContainer>
          </div>
          <div className="p-2">My tests:</div>
          {user.tests?.length ? (
            <ListGroup>{listItems}</ListGroup>
          ) : (
            <div className="p-2 d-flex justify-content-center">
              <div className="p-2 "> You haven't created tests yet.</div>
            </div>
          )}
        </Stack>
      )}
    </Container>
  );
};

export default UserPage;
