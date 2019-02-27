const getList = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(`public/nba.json`, options);
        return await response.json()
    } catch (err) {
        console.log('Error getting documents', err)
    }
};

export default getList;