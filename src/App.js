"use strict";

import Header from './components/Header';
import List from './components/List';
import Utils from './services/Utils';
import Video from './components/Video';
import getList from './services/api'

const App = {
    Create() {
        return {...this.methods};
    },
    methods: {
        state: {
            items: [],
            params: {
                filter: 'all',
                date: 'all',
                sort: 'asc',
            },
            videoView: null,
            headerView: null,
            listView: null,
        },
        async init() {
            const app = document.getElementById('app');
            const headerContainer = document.getElementById('headerContainer');
            const videoContainer = document.getElementById('videoContainer');
            const params = Utils.parseQueryStringParameter();

            const data = await getList();

            this.state.items = Object.keys(data).map(item => data[item]);
            this.state.headerView = Header.Create(this.state);
            this.state.headerView.render(headerContainer);

            const images = this.state.items.map(item => `public/${item.thumb}`);
            await Utils.serialAsyncMap(images, this.preloadImage);

            app.classList.add('loaded');

            this.state.videoView = Video.Create(videoContainer);

            if (Object.keys(params).length) {
                this.state.params = {...this.state.params, ...params};
                this.filterSortItems(this.state);
                this.state.headerView.updateState(this.state.params);
            } else {
                this.showItems(this.state.items);
            }

            this.state.headerView.onChange(this.onFilterChange.bind(this));
            window.addEventListener('popstate', this.onPopState.bind(this), false);
        },
        
        showItems(data) {
            const listContainer = document.getElementById('listContainer');
            this.state.listView = List.Create((item) => {
                this.showVideo(item);
            });
            this.state.listView.render(listContainer, data);
        },

        showVideo (item) {
            this.state.videoView.play(item);
        },
        
        onPopState(e) {
            let params = Utils.parseQueryStringParameter();

            if (!Object.keys(params).length) {
                params = {
                    filter: 'all',
                    date: 'all',
                    sort: 'asc',
                };
            }

            this.state.params = {...this.state.params, ...params};
            this.state.headerView.updateState(this.state.params);
            this.filterSortItems(this.state);
            e.preventDefault();
        },
        
        onFilterChange(name, value) {
            Utils.setQueryStringParameter(name, value);
            this.state.params = {
                ...this.state.params,
                ...Utils.parseQueryStringParameter(),
            };

            this.filterSortItems(this.state);
        },
        
        filterSortItems({params, items}) {
            const filteredItems = items.filter(item => {
                if(params.filter === 'video') {
                    if (params.date !== 'all') {
                        return item.type === 2 && item.date.includes(params.date);
                    }
                    return item.type === 2;
                }
                if (params.filter === 'image') {
                    if (params.date !== 'all') {
                        return item.type === 1 && item.date.includes(params.date);
                    }
                    return item.type === 1;
                }
        
                if (params.date !== 'all') {
                    return item.date.includes(params.date);
                }
        
                return item;
            }).sort((a, b) => {
                if (this.state.params.sort === 'asc') return a.id - b.id;
                if (this.state.params.sort === 'desc') return b.id - a.id;

                return a.id - b.id;
            });

            this.showItems(filteredItems);
        },

        preloadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject();
                img.src = src;
            });
        },
    },
};

export default App;
