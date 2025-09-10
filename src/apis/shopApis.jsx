import axios from 'axios';

const SHOP_CATEGORIES_URL = 'https://sova-admin.cyberxinfosolution.com/api/shop/all';

export async function getShopCategories() {
  try {
    const token = localStorage.getItem('sovaToken');
    const response = await axios.get(SHOP_CATEGORIES_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    if (response.data && response.data.success && Array.isArray(response.data.categories)) {
      return response.data.categories;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch shop categories:', error);
    return [];
  }
} 