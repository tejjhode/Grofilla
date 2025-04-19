// src/services/recommendationService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/recommendations/'; // No need for another /recommendations

export const fetchRecommendations = async (productId: number, topN: number = 5) => {
  try {
    const response = await axios.post(`${API_URL}`, { 
      product_id: productId,
      top_n: topN,
    });
    

    return response.data.recommendations;
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};