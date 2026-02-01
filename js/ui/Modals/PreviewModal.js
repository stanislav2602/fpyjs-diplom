/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
    constructor(element) {
        super(element);
        this.registerEvents();
    }

    /**
     * Добавляет следующие обработчики событий:
     * 1. Клик по крестику на всплывающем окне, закрывает его
     * 2. Клик по контроллерам изображения: 
     * Отправляет запрос на удаление изображения, если клик был на кнопке delete
     * Скачивает изображение, если клик был на кнопке download
     */
    registerEvents() {
        const closeIcon = this.element.querySelector('.header .x.icon');
        closeIcon.addEventListener('click', () => this.close());

        const content = this.element.querySelector('.scrolling.content');
        content.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete') || e.target.closest('.delete')) {
                const button = e.target.classList.contains('delete') ? e.target : e.target.closest('.delete');
                const path = button.dataset.path;
                const icon = button.querySelector('i');
                
                icon.className = 'icon spinner loading';
                button.classList.add('disabled');
                
                Yandex.removeFile(path, (err, response) => {
                    if (err) {
                        alert(`Ошибка удаления: ${err.message || err}`);
                        icon.className = 'trash icon';
                        button.classList.remove('disabled');
                        return;
                    }
                    
                    button.closest('.image-preview-container').remove();
                });
            }
            
            if (e.target.classList.contains('download') || e.target.closest('.download')) {
                const button = e.target.classList.contains('download') ? e.target : e.target.closest('.download');
                const fileUrl = button.dataset.file;
                Yandex.downloadFileByUrl(fileUrl);
            }
        });
    }
    /**
     * Отрисовывает изображения в блоке всплывающего окна
     */
    showImages(data) {
        const content = this.element.querySelector('.scrolling.content');
        const html = data.reverse().map(item => this.getImageInfo(item)).join('');
        content.innerHTML = html;
    }

    /**
     * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
     * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
     * */
    formatDate(date) {
        const d = new Date(date);
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
    }

    /**
     * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
     */
    getImageInfo(item) {
        const sizeInKb = (item.size / 1024).toFixed(1);
        const formattedDate = this.formatDate(item.created);
        
        const imageUrl = item.preview || item.file || 'https://yugcleaning.ru/wp-content/themes/consultix/images/no-image-found-360x250.png';
        
        return `
            <div class="image-preview-container">
                <img src="${imageUrl}" style="width: 170px; height: auto;" />
                <table class="ui celled table">
                    <thead>
                        <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>${item.name}</td><td>${formattedDate}</td><td>${sizeInKb}Кб</td></tr>
                    </tbody>
                </table>
                <div class="buttons-wrapper">
                    <button class="ui labeled icon red basic button delete" data-path="${item.path}">
                        Удалить
                        <i class="trash icon"></i>
                    </button>
                    <button class="ui labeled icon violet basic button download" data-file="${item.file}">
                        Скачать
                        <i class="download icon"></i>
                    </button>
                </div>
            </div>
        `;
    }
}