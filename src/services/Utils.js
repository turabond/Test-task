import 'url-search-params-polyfill';

const Utils = {
    
    parseQueryStringParameter() {
        const searchParams = new URLSearchParams(location.search);
        const state = {};
    
        for(let pair of searchParams.entries()) {
            state[pair[0]] = pair[1];
        }
        
        return state;
    },
    
    setQueryStringParameter(name, value) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(name, value);
       
        history.pushState(this.parseQueryStringParameter(), '', decodeURIComponent(`?${searchParams}`));
    },

    async serialAsyncMap(collection, fn) {
        let result = [];
        for (let item of collection) {
            result.push(await fn(item));
        }
        return result;
    },

    
    async sleep(ms) {
        await new Promise(resolve => setTimeout(resolve, ms));
    },
};

export default Utils;
