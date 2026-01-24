/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
    constructor(element) {
        this.element = element;
        this.registerEvents();
    }

    /**
     * Выполняет подписку на кнопки "Заменить" и "Добавить"
     * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
     * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
     */
    registerEvents() {
        const replaceBtn = this.element.querySelector('.replace');
        const addBtn = this.element.querySelector('.add');
        const input = this.element.querySelector('input');

        replaceBtn.addEventListener('click', () => {
            const userId = input.value.trim();
            if (!userId) return;

            VK.get(userId, (images) => {
                App.imageViewer.clear();
                App.imageViewer.drawImages(images);
            });
        });

        addBtn.addEventListener('click', () => {
            const userId = input.value.trim();
            if (!userId) return;

            VK.get(userId, (images) => {
                App.imageViewer.drawImages(images);
            });
        });
    }
}