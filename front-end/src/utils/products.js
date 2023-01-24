import axios from 'axios';

const URL_BACKEND = 'http://localhost:8000/api/crawlo';

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${URL_BACKEND}/categories`);
        if (response.status == 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};
//get all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${URL_BACKEND}/products`);
        if (response.status == 200) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export const getaProductsByCategoryId = async (categoryId) => {
    try {
        const res = await axios.get(`${URL_BACKEND}/products/${categoryId}`);
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.log(error);
    }
};
