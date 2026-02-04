/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 */
class Yandex {
    static HOST = 'https://cloud-api.yandex.net/v1/disk';

    /**
     * Метод формирования и сохранения токена для Yandex API
     */
    static getToken() {
        let token = localStorage.getItem('yandexToken');
        
        if (!token) {
            token = prompt('Введите токен Яндекс.Диска:');
            if (token) {
                localStorage.setItem('yandexToken', token);
            }
        }
        
        return token;
    }

    static checkToken(callback) {
        const token = this.getToken();
        if (!token) {
            if (callback) callback('Токен не найден', null);
            return null;
        }
        return token;
    }

    /**
     * Метод загрузки файла в облако
     */
    static uploadFile(path, url, callback) {
        const token = this.checkToken(callback);
        if (!token) {
            if (callback) callback('Токен не найден', null);
            return;
        }

        createRequest({
            method: 'GET',
            url: `${this.HOST}/resources/upload`,
            headers: {
                'Authorization': `OAuth ${token}`
            },
            data: {
                path: path,
                overwrite: 'true'
            },
            callback: callback
        });
    }

    /**
     * Метод удаления файла из облака
     */
    static removeFile(path, callback) {
        const token = this.checkToken(callback);
        if (!token) return;

        const url = `${this.HOST}/resources?path=${encodeURIComponent(path)}&permanently=true`;
        
        createRequest({
            method: 'DELETE',
            url: url,
            headers: {
                'Authorization': `OAuth ${token}`
            },
            callback: callback
        });
    }

    /**
     * Метод получения всех загруженных файлов в облаке
     */
    static getUploadedFiles(callback) {
        const token = this.checkToken(callback);
        if (!token) return;

        createRequest({
            method: 'GET',
            url: `${this.HOST}/resources/files`,
            headers: {
                'Authorization': `OAuth ${token}`
            },
            callback: (err, data) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                
                if (!data || !data.items) {
                    callback(null, { items: [] });
                    return;
                }

                callback(null, data);
            }
        });
    }

    /**
     * Метод скачивания файлов
     */
    static downloadFileByUrl(url) {
        if (!url) return;
        
        const link = document.createElement('a');
        
        link.href = url;
        link.download = '';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}