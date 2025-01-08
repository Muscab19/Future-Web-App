import axios from "./axios_setting";
export const APIClient = ({ Uri, data }) => {
  console.log("Uri",Uri)
  console.log("data",data)

  return axios.post(Uri, data);
};