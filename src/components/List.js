const List = {
    Create(onClick) {
        return {...this.methods, onClick};
    },
    methods: {
        className: 'list',
    
        template(item) {
            const btn = (item.type === 2) ? `<div class="list__item-play-btn"></div>` : '';
            return `
                <a href="#" class="list__item-container">
                    <div class="list__item-img-wrapper">
                        <div class="list__item-img" style="background-image: url('public/${item.thumb}')"></div>
                        ${btn}
                    </div>
                    
                    <div class="list__item-bottom">
                        <div class="list__item-title-wrapper">
                            <h5 class="list__item-title">${item.title}</h5>
                        </div>
                        <div class="list__item-date">
                            <span class="list__item-date-key">Creation date</span>
                            <span class="list__item-date-value">${item.date}</span>
                        </div>
                    </div>
                </a>
            `;
        },
        
        renderItem(item) {
            const li = document.createElement('li');
            li.className = `col s12 m6 l4 xl3 ${this.className}__item`;
            li.innerHTML = this.template(item);
            li.onclick = (e) => {
                if (item.type !==2) return false;
                e.preventDefault();
                this.onClick(item);
            };
            return li;
        },
        
        render(container, items) {
            container.innerHTML = '';

            if (items.length) {
                const ul = document.createElement('ul');
                ul.className = `row ${this.className}`;
                items.forEach(item => {
                    ul.appendChild(this.renderItem(item));
                });
                container.appendChild(ul);
            } else {
                const view = document.createElement('div');
                view.className = 'no-data';
                view.innerText = 'Not found data to show!!!';
                container.appendChild(view);
            }
        },
    },
};

export default List;
