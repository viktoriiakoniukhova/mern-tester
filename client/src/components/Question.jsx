import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const Question = ({
  index,
  question,
  setSelectedAnswers,
  selectedAnswers,
  isTestFinished,
}) => {
  const { text, options, answer } = question;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (e) => {
    e.persist();
    const { value } = e.target;
    setSelectedOption(value);

    const isCorrect = value === answer;

    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: { value, isCorrect },
    }));
  };

  return (
    <Form.Group controlId={`question_${index}`}>
      <Form.Label>
        <b>{text}</b>
      </Form.Label>
      {options?.map((option) => (
        <Form.Check
          key={uuidv4()}
          type="radio"
          label={option}
          value={option}
          onChange={handleChange}
          checked={selectedOption === option}
          style={
            isTestFinished && option === answer
              ? { color: "#50c878" }
              : isTestFinished &&
                selectedOption === option &&
                !selectedAnswers[index]?.isCorrect
              ? { color: "#EE4B2B" }
              : {}
          }
          disabled={isTestFinished}
        />
      ))}
    </Form.Group>
  );
};

export default Question;
