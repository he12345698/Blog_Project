import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';//後端網址

const API_BASE_URL = 'http://localhost:8080/blog-0.0.1-SNAPSHOT/api/articles';

const getArticleById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

const createArticle = async (articleData) => {
    const response = await axios.post(API_BASE_URL, articleData);
    return response.data;
};

const updateArticle = async (id, articleData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, articleData);
    return response.data;
};

const articleService = {
    getArticleById,
    createArticle,
    updateArticle,
};

export default articleService;
