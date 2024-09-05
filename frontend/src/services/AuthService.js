import { API_BASE_URL } from './apiConfig';

const getToken = () => {
    return localStorage.getItem('token');
};

const getUserInfo = async () => {
    const token = getToken();
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/protected-endpoint`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const authService = {
    getToken,
    getUserInfo
};

export default authService;
