import api from './api';

class CampaignsService {
    async getCampaign(id) {
        const response = await api.get(`/campaigns/${id}`);
        return response.data;
    }

    async getCampaigns() {
        const response = await api.get('/campaigns');
        return response.data;
    }

    async postCampaign(campaign) {
        const response = await api.post('/campaigns', campaign);
        return response.data;
    }

    async retryCampaign(campaignId) {
        const response = await api.post(`/campaigns/${campaignId}/retry`);
        return response.data;
    }

    async deleteCampaign(campaignId) {
        const response = await api.delete(`/campaigns/${campaignId}`);
        return response.data;
    }
}

export default new CampaignsService();
