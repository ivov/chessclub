import axios from "axios";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 100 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log({ level: "error", message: error });
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
