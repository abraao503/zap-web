import api from './api';

class FilesService {
    async postFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        console.log('file', file);
        console.log('formData', formData);

        const response = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }
}

export default new FilesService();
