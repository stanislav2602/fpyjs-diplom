/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    const url = new URL(options.url);
    
    if (options.data) {
        Object.keys(options.data).forEach(key => {
            url.searchParams.append(key, options.data[key]);
        });
    }

    xhr.open(options.method || 'GET', url);

    if (options.headers) {
        Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key]);
        });
    }

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            options.callback(null, xhr.response);
        } else {
            options.callback({
                status: xhr.status,
                message: xhr.statusText || 'Ошибка запроса',
                response: xhr.response
            }, null);
        }
    };

    xhr.onerror = () => {
        options.callback('Ошибка сети', null);
    };

    xhr.send(options.body || null);
};