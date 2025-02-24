const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    fetchHardCodedActivity: (username) => {
        console.log('Using hardcoded data');
        const tempListOfActivity = createHardCodedData();

        return tempListOfActivity;
    },
    getActivity: async (username) => {
        return await ipcRenderer.invoke('get-activity', username);
    },
    mapActivity: async (activity) => {
        return await ipcRenderer.invoke('map-activity', activity);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('username-input').focus();
});


function createHardCodedData() {
    const map = new Map();

    map.set('March', []);
    map.get('March').push('Pushed 2 commits to Oskahon/github-activity');
    map.get('March').push('Pushed 3 commits to Oskahon/github-activity');
    map.get('March').push('Pushed 1 commit to Oskahon/github-activity');
    map.get('March').push('Created Oskahon/github-activity');

    map.set('February', []);
    map.get('February').push('Pushed 10 commits to Oskahon/reverser');
    map.get('February').push('Created Oskahon/reverser');
    map.get('February').push('Pushed 1 commit to Oskahon/linux_settings');

    return map;
}