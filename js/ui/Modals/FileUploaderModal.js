/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
    constructor(element) {
        super(element);
        this.registerEvents();
        this.imageContainers = this.element.querySelectorAll('.image-preview-container');
    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по крестику на всплывающем окне, закрывает его
     * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
     * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
     * 4. Клик по кнопке загрузке по контроллерам изображения: 
     * убирает ошибку, если клик был по полю вода
     * отправляет одно изображение, если клик был по кнопке отправки
     */
    registerEvents() {
        const closeIcon = this.element.querySelector('.header .x.icon');
        const closeButton = this.element.querySelector('.actions .close.button');
        const sendAllButton = this.element.querySelector('.actions .send-all.button');
        const content = this.element.querySelector('.scrolling.content');

        closeIcon.addEventListener('click', () => this.close());
        closeButton.addEventListener('click', () => this.close());
        
        sendAllButton.addEventListener('click', () => this.sendAllImages());

        content.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.closest('input')) {
                const inputContainer = e.target.closest('.ui.action.input');
                if (inputContainer) {
                    inputContainer.classList.remove('error');
                }
            }
            
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                if (button.querySelector('.upload.icon')) {
                    const container = button.closest('.image-preview-container');
                    this.sendImage(container);
                }
            }
        });
    }

    /**
     * Отображает все полученные изображения в теле всплывающего окна
     */
    showImages(images) {
        const content = this.element.querySelector('.scrolling.content');
        const html = images.reverse().map(image => this.getImageHTML(image)).join('');
        content.innerHTML = html;
        this.imageContainers = content.querySelectorAll('.image-preview-container');
    }

    /**
     * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
     */
    getImageHTML(item) {
        return `
            <div class="image-preview-container">
                <img src="${item}" />
                <div class="ui action input">
                    <input type="text" placeholder="Путь к файлу">
                    <button class="ui button"><i class="upload icon"></i></button>
                </div>
            </div>
        `;
    }

    /**
     * Отправляет все изображения в облако
     */
    sendAllImages() {
        this.imageContainers.forEach(container => {
            this.sendImage(container);
        });
    }

    /**
     * Валидирует изображение и отправляет его на сервер
     */
    sendImage(imageContainer) {
        const input = imageContainer.querySelector('input');
        const path = input.value.trim();
        
        if (!path) {
            input.closest('.ui.action.input').classList.add('error');
            return;
        }
        
        input.closest('.ui.action.input').classList.add('disabled');
        const imageUrl = imageContainer.querySelector('img').src;
        
        Yandex.uploadFile(path, imageUrl, (err, response) => {
            if (err) {
                alert(`Ошибка загрузки: ${err}`);
                input.closest('.ui.action.input').classList.remove('disabled');
                return;
            }
            
            imageContainer.remove();
            this.imageContainers = this.element.querySelectorAll('.image-preview-container');
            
            if (this.imageContainers.length === 0) {
                this.close();
            }
        });
    }
}