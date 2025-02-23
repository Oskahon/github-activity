const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    hello: () => {
        console.log('Hello from the back!');
    },
    fetchHardCodedActivity: (username) => {
        // TODO replace this with functionality from events.js
        console.log(`TODO: Actually use the username: ${username} when fetching`);

        const tempListOfActivity = [
            "In March:",
            "Pushed 2 commits to Oskahon/github-activity",
            "Pushed 3 commits to Oskahon/github-activity",
            "Pushed 1 commit to Oskahon/github-activity",
            "Created Oskahon/github-activity"
        ];

        return tempListOfActivity;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('username-input').focus();
});