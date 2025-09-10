import axios from 'axios';

// Fetch all textures from the API
export const fetchAllTextures = async () => {
  try {
    const token = localStorage.getItem('sovaToken'); // Retrieve token from localStorage
    const response = await axios.get('https://sova-admin.cyberxinfosolution.com/api/texture/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 