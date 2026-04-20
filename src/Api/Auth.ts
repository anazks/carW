import Axios from "../Axios/Axios";

/* ================= USER ================= */

// User Login
const userLogin = async (data: { email: string; password: string }) => {
  try {
    console.log("Login Data:", data);
    const response = await Axios.post("/login", { ...data, role: "user" });
    return response.data;
  } catch (error) {
    console.error("User Login Error:", error);
    throw error;
  }
};

// User Register
const userRegister = async (data: any) => {
  try {
    const response = await Axios.post("/auth/user/register/", data);
    return response.data;
  } catch (error) {
    console.error("User Register Error:", error);
    throw error;
  }
};

// Get User Profile
const getProfile = async () => {
  const response = await Axios.get("/auth/user/getProfile");
  return response.data;
};


/* ================= SHOP ================= */

// Shop Login
const shopLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await Axios.post("/login", { ...data, role: "owner" });
    return response.data;
  } catch (error) {
    console.error("Shop Login Error:", error);
    throw error;
  }
};

// Shop Register
const shopRegister = async (data: any) => {
  try {
    const response = await Axios.post("/auth/shop/register", data);
    return response.data;
  } catch (error) {
    console.error("Shop Register Error:", error);
    throw error;
  }
};

// Get Shop Profile
const getShopProfile = async () => {
  try {
    const response = await Axios.get("/shop/getMyProfile");
    console.log("Shop Profile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Shop Profile Error:", error);
    throw error;
  }
};



export {
  userLogin,
  userRegister,
  getProfile,
  shopLogin,
  shopRegister,
  getShopProfile
};