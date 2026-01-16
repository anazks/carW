import Axios from '../Axios/Axios'
const userLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Axios.post("/auth/user/login/", data);
    return response.data;
  } catch (error) {
    throw error;
  } 
};
const getProfile = async () => {
  try {
    const response = await Axios.get("/auth/user/getProfile/");
    console
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { userLogin, getProfile };