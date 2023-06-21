import api from './api';

class InstancesService {
    async getInstances() {
        const response = await api.get('/instances');
        return response.data;
    }

    async connectInstance(instance) {
        const response = await api.post(`/instances/connect/${instance}`);
        return response.data;
    }

    async createInstance(instance) {
        const response = await api.post('/instances', instance);
        return response.data;
    }
}

export default new InstancesService();
