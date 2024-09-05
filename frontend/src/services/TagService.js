import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/blog/api/tags';

const getArticleTag = async (articleId) => {
    const response = await axios.get(`http://localhost:8080/blog/api/articles/${articleId}/tag`);
    return response.data;
}

const getAllTags = async () => {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
}

const tagService ={
    getArticleTag,
    getAllTags
}
export default tagService;