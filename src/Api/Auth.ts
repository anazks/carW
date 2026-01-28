import Axios from '../Axios/Axios'
const userLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Axios.post("/auth/user/login/", data);
    return response.data;
  } catch (error) {
    throw error;
  } 
};
const userRegister = async ( data:any)=>{
  try {
    const response = await Axios.post("/auth/user/register/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
const getProfile = async () => {
  try {
    const response = await Axios.get("/auth/user/getProfile/");
    console.log(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};
const getShopProfile = async () => {
  try {
    const response = await Axios.get("/shop/getMyProfile/");
    console.log(response.data);
    return response;
  } catch (error) {
    throw error;
  }
}
const shopLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Axios.post("/auth/shop/login/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
const shopRegister = async ( data:any)=>{
  try {
    const response = await Axios.post("/auth/shop/register/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export { userLogin, getProfile,userRegister,shopLogin,shopRegister,getShopProfile };