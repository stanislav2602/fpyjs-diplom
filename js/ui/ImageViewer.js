/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
    constructor(element) {
        this.element = element;
        this.previewImage = element.querySelector('.ui.fluid.image');
        this.imagesList = element.querySelector('.images-list .grid .row:first-of-type');
        this.registerEvents();
    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по изображению меняет класс активности у изображения
     * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
     * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
     * Добавляет или удаляет класс активности у всех изображений
     * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
     * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
     */
    registerEvents() {
        this.imagesList.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                e.target.classList.toggle('selected');
                this.checkButtonText();
            }
        });

        this.imagesList.addEventListener('dblclick', (e) => {
            if (e.target.tagName === 'IMG') {
                this.previewImage.src = e.target.src;
            }
        });

        const selectAllBtn = this.element.querySelector('.select-all');
        selectAllBtn.addEventListener('click', () => {
            const images = this.imagesList.querySelectorAll('img');
            const allSelected = Array.from(images).every(img => img.classList.contains('selected'));
            
            images.forEach(img => {
                if (allSelected) {
                    img.classList.remove('selected');
                } else {
                    img.classList.add('selected');
                }
            });
            
            this.checkButtonText();
        });

        const showUploadedBtn = this.element.querySelector('.show-uploaded-files');
        showUploadedBtn.addEventListener('click', () => {
            const modal = App.getModal('filePreviewer');
            modal.open();
            
            const content = modal.element.querySelector('.scrolling.content');
            content.innerHTML = '<i class="asterisk loading icon massive"></i>';
            
            Yandex.getUploadedFiles((err, data) => {
                if (err) {
                    alert(`Ошибка: ${err}`);
                    return;
                }
                modal.showImages(data.items || []);
            });
        });

        const sendBtn = this.element.querySelector('.send');
        sendBtn.addEventListener('click', () => {
            const selectedImages = this.imagesList.querySelectorAll('img.selected');
            if (selectedImages.length === 0) return;

            const modal = App.getModal('fileUploader');
            const images = Array.from(selectedImages).map(img => img.src);
            modal.open();
            modal.showImages(images);
        });
    }

    /**
     * Очищает отрисованные изображения
     */
    clear() {
        this.imagesList.innerHTML = '';
        this.previewImage.src = 'https://yugcleaning.ru/wp-content/themes/consultix/images/no-image-found-360x250.png';
        this.checkButtonText();
    }

    /**
     * Отрисовывает изображения.
     */
    drawImages(images) {
        const selectAllBtn = this.element.querySelector('.select-all');
        
        if (images.length > 0) {
            selectAllBtn.classList.remove('disabled');
        } else {
            selectAllBtn.classList.add('disabled');
        }

        images.forEach(imageUrl => {
            const col = document.createElement('div');
            col.className = 'four wide column ui medium image-wrapper';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cursor = 'pointer';
            img.style.width = '100%';
            img.style.height = 'auto';
            
            col.appendChild(img);
            this.imagesList.appendChild(col);
        });

        this.checkButtonText();
    }

    /**
     * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
     */
    checkButtonText() {
        const images = this.imagesList.querySelectorAll('img');
        const selectAllBtn = this.element.querySelector('.select-all');
        const sendBtn = this.element.querySelector('.send');
        
        if (images.length === 0) {
            selectAllBtn.textContent = 'Выбрать всё';
            selectAllBtn.classList.add('disabled');
            sendBtn.classList.add('disabled');
            return;
        }
        
        const allSelected = images.length > 0 && 
            Array.from(images).every(img => img.classList.contains('selected'));
        
        selectAllBtn.textContent = allSelected ? 'Снять выделение' : 'Выбрать всё';
        selectAllBtn.classList.remove('disabled');
        
        const hasSelected = Array.from(images).some(img => img.classList.contains('selected'));
        if (hasSelected) {
            sendBtn.classList.remove('disabled');
        } else {
            sendBtn.classList.add('disabled');
        }
    }
}