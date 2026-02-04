/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    let url = options.url;
    let requestData = null;
    
    // Для GET запросов данные добавляем в URL
    if (options.data && (options.method === 'GET' || !options.method)) {
        const urlObj = new URL(options.url);
        Object.keys(options.data).forEach(key => {
            urlObj.searchParams.append(key, options.data[key]);
        });
        url = urlObj.toString();
    } 
    // Для POST/PUT запросов данные передаем в теле
    else if (options.data && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')) {
        requestData = JSON.stringify(options.data);
    }

    try {
        xhr.open(options.method || 'GET', url);
    } catch (err) {
        options.callback({
            error: true,
            message: 'Network error: ' + err.message
        }, null);
        return;
    }

    if (options.headers) {
        Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key]);
        });
    }
    
    // Для POST/PUT запросов добавляем Content-Type
    if (requestData && !options.headers?.['Content-Type']) {
        xhr.setRequestHeader('Content-Type', 'application/json');
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
        options.callback({
            error: true,
            message: 'Ошибка сети'
        }, null);
    };

    xhr.ontimeout = () => {
        options.callback({
            error: true,
            message: 'Таймаут запроса'
        }, null);
    };

    try {
        xhr.send(requestData);
    } catch (err) {
        options.callback({
            error: true,
            message: 'Ошибка отправки: ' + err.message
        }, null);
    }
};