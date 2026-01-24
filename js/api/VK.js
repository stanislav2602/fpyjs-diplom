/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

    static ACCESS_TOKEN = 'Введите токен VK (Service token)';
    static lastCallback;

    /**
     * Получает изображения
     * */
    static get(id = '', callback) {
        if (!id.trim()) {
            callback([]);
            return;
        }

        this.lastCallback = callback;

        const script = document.createElement('script');
        script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&extended=1&photo_sizes=1&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
        document.body.appendChild(script);
    }

    /**
     * Передаётся в запрос VK API для обработки ответа.
     * Является обработчиком ответа от сервера.
     */
    static processData(result) {
        const script = document.querySelector('script[src*="api.vk."]');
        if (script) {
            script.remove();
        }

        if (result.error) {
            alert(`Ошибка VK: ${result.error.error_msg}`);
            this.lastCallback([]);
            this.lastCallback = () => {};
            return;
        }

        const images = [];
        if (result.response && result.response.items) {
            result.response.items.forEach(item => {
                const sizes = item.sizes;
                if (sizes && sizes.length > 0) {
                    const largest = sizes.reduce((prev, current) => 
                        (current.width * current.height) > (prev.width * prev.height) ? current : prev
                    );
                    images.push(largest.url);
                }
            });
        }

        this.lastCallback(images);
        this.lastCallback = () => {};
    }
}