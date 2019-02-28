"use strict";

import Header from './components/Header';
import List from './components/List';
import Utils from './services/Utils';
import Video from './components/Video';
import getList from './services/api';

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
        },
        async init() {
            const headerContainer = document.getElementById('headerContainer');
            const videoContainer = document.getElementById('videoContainer');
            const params = Utils.parseQueryStringParameter();
            const data = await getList();
            
            this.state.items = Object.keys(data).map(item => data[item]);
            this.state.video = Video.Create(videoContainer);
            
            const headerView = Header.Create(this.state);
            headerView.render(headerContainer);

            if (Object.keys(params).length) {
                this.state.params = {...this.state.params, ...params};
                this.filterSortItems(this.state);
                headerView.updateState(this.state.params);
            } else {
                this.showItems(this.state.items);
            }

            headerView.onChange(this.onFilterChange.bind(this));
            window.addEventListener('popstate', this.onPopState.bind(this), false);
    
        },
        
        showItems(data) {
            const listContainer = document.getElementById('listContainer');
            const listView = List.Create((item) => {
                this.showVideo(item);
            });
            listView.render(listContainer, data);
        },

        showVideo (item) {
            this.state.video.play(item);
        },
        
        onPopState(e) {
            e.preventDefault();
            this.state.params = {...this.state.params, ...e.state};
            this.filterSortItems(this.state);
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
    },
};

export default App;
