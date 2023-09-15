import { config } from "../axiosconfig";
import { base_url, nav_url } from "../baseUrl";
import axios from "axios";

const getTests = async () => {
  try {
    const response = await axios.get(`${base_url}test/all`);
    if (response.data) return response.data;
  } catch (error) {
    window.alert(error.response.data.message);
  }
};

const getTest = async (testId) => {
  try {
    const response = await axios.get(`${base_url}test/${testId}`);
    if (response.data) return response.data;
  } catch (error) {}
};

const createTest = async (testData) => {
  try {
    const response = await axios.post(`${base_url}test/add`, testData, config);
    window.location.replace(nav_url);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    window.alert(error.response.data.message);
  }
};

const updateTest = async (userId, testId, updatedData) => {
  try {
    const response = await axios.put(
      `${base_url}test/${testId}`,
      updatedData,
      config
    );
    window.location.replace(`${nav_url}${userId}`);

    if (response.data) return response.data;
  } catch (error) {
    window.alert(error.response.data.message);
  }
};

const deleteTest = async (testId) => {
  try {
    const response = await axios.delete(`${base_url}test/${testId}`, config);
    if (response.data) return response.data;
  } catch (error) {
    window.alert(error.response.data.message);
  }
};

const addCandidateToTest = async (testId, candidateData) => {
  try {
    const response = await axios.put(
      `${base_url}test/${testId}/candidate`,
      candidateData,
      config
    );
    if (response.data) return response.data;
  } catch (error) {
    window.alert(error.response.data.message);
  }
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
