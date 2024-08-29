import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';//後端網址

const API_BASE_URL = 'http://localhost:8080/blog/api/articles';

const getAllArticles = async () => {
    console.log("try to get all...");
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
};

const getArticleById = async (articleId) => {
    const response = await axios.get(`${API_BASE_URL}/${articleId}`);
    return response.data;
};

const getArticleByTitle = async (title) => {
    // 修正這裡的 URL，使用查詢參數
    const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { title: title } // 使用 params 來傳遞 title 查詢參數
    });
    return response.data;
};

const createArticle = async (articleData) => {
    const response = await axios.post(API_BASE_URL, articleData);
    return response.data;
};

const updateArticle = async (articleId, articleData) => {
    const response = await axios.put(`${API_BASE_URL}/${articleId}`, articleData);
    console.log("try fetch...");
    return response.data;
};
//可加入其他請求API的方法
const articleService = {
    getAllArticles,
    getArticleById,
    getArticleByTitle,
    updateArticle,
    createArticle,
};

export default articleService;
