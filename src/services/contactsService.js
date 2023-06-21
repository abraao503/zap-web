import api from './api';

class ContactsService {
    async getContacts(query) {
        const response = await api.get('/contacts', { params: query });
        return response.data;
    }

    async postContact(contact) {
        const response = await api.post('/contacts', contact);
        return response.data;
    }

    async patchContact(id, contact) {
        const response = await api.patch(`/contacts/${id}`, contact);
        return response.data;
    }

    async postContacts(contacts) {
        const response = await api.post('/contacts/import', contacts);
        return response.data;
    }

    async deleteContact(id) {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    }

    async deleteContacts(ids) {
        const response = await api.post('/contacts/delete', { contactIds: ids });
        return response.data;
    }
}

export default new ContactsService();
