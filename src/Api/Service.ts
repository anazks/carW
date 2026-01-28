import Axios from '../Axios/Axios';

const BASE_URL = '/shop';

export const AddService  = async (data:any)=>{
    try {
        const response = await Axios.post(`${BASE_URL}/addService`,data);
        return response.data; // { success, message, data }
    } catch (error) {
        console.error('Error adding service:', error);
        throw error;
    }
}

export const addnewShop = async (data:any)=>{
    try {
        const response = await Axios.post(`${BASE_URL}/addShop`,data);
        return response.data; // { success, message, data }
    } catch (error) {
        console.error('Error adding shop:', error);
        throw error;
    }
}

export const getProfileShop = async ()=>{
    try {
        const response = await Axios.get(`${BASE_URL}/getMyProfile`); 
        return response.data; // { success, message, data }
    } catch (error) {
        console.error('Error fetching profile shop:', error);
        throw error;
    }
}

export const getmyshops = async ()=>{
    try {
        const response = await Axios.get(`${BASE_URL}/viewMyshop`); 
        return response.data; // { success, message, data }
    } catch (error) {
        console.error('Error fetching profile shop:', error);
        throw error;
    }
}