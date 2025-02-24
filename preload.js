const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    hello: () => {
        console.log('Hello from the back!');
    },
    fetchHardCodedActivity: (username) => {
        // TODO replace this with functionality from events.js
        console.log(`TODO: Actually use the username: ${username} when fetching`);

        const tempListOfActivity = createHardCodedData();

        return tempListOfActivity;
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

    return map;
}