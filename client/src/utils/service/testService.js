import { config } from "../axiosconfig";
import { base_url, nav_url } from "../baseUrl";
import axios from "axios";

const getTests = async () => {
  const response = await axios.get(`${base_url}test/all`);
  if (response.data) return response.data;
};

const getTest = async (testId) => {
  const response = await axios.get(`${base_url}test/${testId}`);
  if (response.data) return response.data;
};

const createTest = async (testData) => {
  const response = await axios.post(`${base_url}test/add`, testData, config);
  window.location.replace(nav_url);

  if (response.data) {
    return response.data;
  }
};

const updateTest = async (userId, testId, updatedData) => {
  const response = await axios.put(
    `${base_url}test/${testId}`,
    updatedData,
    config
  );
  window.location.replace(`${nav_url}${userId}`);
  if (response.data) return response.data;
};

const deleteTest = async (testId) => {
  const response = await axios.delete(`${base_url}test/${testId}`, config);
  if (response.data) return response.data;
};

const addCandidateToTest = async (testId, candidateData) => {
  const response = await axios.put(
    `${base_url}test/${testId}/candidate`,
    candidateData,
    config
  );
  if (response.data) return response.data;
};

const testService = {
  getTests,
  getTest,
  updateTest,
  deleteTest,
  createTest,
  addCandidateToTest,
};

export default testService;
