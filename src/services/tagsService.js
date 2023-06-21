import api from './api';

class TagsService {
    async getTags() {
        const response = await api.get('/tags');
        return response.data;
    }

    async postTag(tag) {
        const response = await api.post('/tags', tag);
        return response.data;
    }
}

export default new TagsService();
