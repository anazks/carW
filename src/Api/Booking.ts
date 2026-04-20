import Axios from '../Axios/Axios';

const API_BASE_URL = '/booking';
export const createBooking = async (data: any) => {
    console.log('Creating booking with data:', data);
    try {
        const response = await Axios.post(`${API_BASE_URL}/BookNow`, data);
        console.log('API response for create booking:', response);
        return response; // { success, message, data }
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const createOrder = async (data: any) => {
    try {
        const response = await Axios.post(`${API_BASE_URL}/create-order`, data);
        console.log('API response for create order:', response.data);
        return response; // { success, message, data }
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const verifyPayment = async (data: any) => {
    try {
        console.log('Verifying payment with data:', data);
        const response = await Axios.post(`${API_BASE_URL}/verifyPayment`, data);
        console.log('API response for verify payment:', response.data);
        return response; // { success, message, data }
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

export const getBookingHistory = async () => {
    try {
        const response = await Axios.post(`${API_BASE_URL}/myBookings/`);
        console.log('API response for booking history:', response.data);
        return response; // { success, message, data }
    } catch (error) {
        console.error('Error fetching booking history:', error);
        throw error;
    }
}

export const getOwnerBookings = async () => {
    try {
        const response = await Axios.get(`${API_BASE_URL}/ownerBookings`);
        console.log('API response for owner bookings:', response.data);
        return response; // { success, message, bookings }
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        throw error;
    }
}

export const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
        const response = await Axios.put(`${API_BASE_URL}/updateStatus/${bookingId}`, {
            bookingStatus: status
        });
        console.log('API response for update status:', response.data);
        return response; // { success, message }
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}