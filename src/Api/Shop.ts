import Axios from "../Axios/Axios";

/**
 * Fetch nearby shops using latitude & longitude
 */
export const getShopInfo = async (lng: number, lat: number) => {
  try {
    const response = await Axios.get("/shop/findNearByShops", {
      params: {
        lng,
        lat,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby shops:", error);
    throw error;
  }
};

export const getShopDetails = async (shopId: string) => {
  try {
    console.log("Fetching details for shop ID:", shopId);
    const response = await Axios.post("/shop/viewSigleShop", {
      id: shopId,
    });

    console.log("API response for shop details:", response.data);

    return response.data; // { success, message, data }
  } catch (error) {
    console.error("Error fetching shop details:", error);
    throw error;
  }
};

export const getShopServices = async (shopId: string) => {
  try {
    const response = await Axios.get(`/shop/viewSingleShopService/${shopId}`);
    return response.data; // { success, message, data }
  } catch (error) {
    console.error("Error fetching shop services:", error);
    throw error;
  }
};

export const getAvailbleSlots = async (shopId: string, bookingDate: string) => {
  try {
    console.log("Fetching available slots for shop ID:", shopId, "on date:", bookingDate);
    let data = { shopId, bookingDate };
    const response = await Axios.post("/booking/fetchAllAvailableTimeSlots", data);
    console.log("API response for available slots:", response);
    return response; // { success, message, data }
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
}