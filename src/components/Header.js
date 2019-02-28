const Header = {
    Create(data) {
        return {...data, ...this.methods};
    },
    methods: {
        filtersCollection: null,
        render(container) {
            container.innerHTML = this.template();
    
            const filter = document.getElementsByName('filter');
            const sort = document.getElementsByName('sort');
            const date = document.getElementsByName('date');
            this.filtersCollection = [...filter, ...date, ...sort];
        },
        template() {
            return `
                <div class="container">
                    <div class="row">
                        <div class="col s12 m5 l4 xl3">
                            <div class="filter">
                                <h6 class="filter__text">filter</h6>
                                <div class="filter__buttons">
                                    <input checked type="radio" name="filter" id="filter_1" value="all">
                                    <label for="filter_1" class="filter__button">all</label>
                                    <input type="radio" name="filter" id="filter_2" value="image">
                                    <label for="filter_2" class="filter__button">image</label>
                                    <input type="radio" name="filter" id="filter_3" value="video">
                                    <label for="filter_3" class="filter__button">video</label>
                                </div>
                            </div>
                        </div>
                        <div class="col s12 m3 l4 xl3">
                            <div class="filter">
                                <h6 class="filter__text">date</h6>
                                <select class="filter__select" id="date" name="date">
                                    ${this.renderSelectBox()}
                                </select>
                            </div>
                        </div>
                        <div class="col s12 m4 l4">
                            <div class="filter">
                                <h6 class="filter__text">sort</h6>
                                <div class="filter__buttons">
                                    <input checked type="radio" name="sort" id="sort_2" value="asc">
                                    <label for="sort_2" class="sort__button">asc</label>
                                    <input type="radio" name="sort" id="sort_1" value="desc">
                                    <label for="sort_1" class="sort__button">desc</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        renderSelectBox() {
            const items = this.items
                .map(item => item.date.slice(0, 4))
                .sort()
                .reduce((arr, item) => {
                    if (!arr.includes(item)) {
                        return [...arr, item];
                    }
                    return [...arr];
                }, ['all']);

            return items.map(item => `<option value="${item}">${item}</option>`).join('\n');
        },
        onChange(cb) {
            this.filtersCollection.forEach(item => {
                item.addEventListener('change', ({target : {name, value}}) => {
                    cb && cb(name, value);
                });
            });
        },
        
        updateState(params) {
            this.filtersCollection.forEach(item => {
                if (item.value === params[item.name]) {
                    item.checked = true;
                }
                if (item.name === 'date') {
                    item.value = params[item.name];
                }
            });
        }
    },
};

export default Header;
