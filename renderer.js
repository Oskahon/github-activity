// Javascript file called from index.html

// Change to false when fetching from github API
const HARDCODED_DATA = true;

const input = document.getElementById('username-form');
input.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value;

    document.getElementById('user-text').innerText = `Usage for ${username}`;

    usernameInput.value = "";

    clearActivity();
    setActivity(username);

});

async function setActivity(username) {
    try {
        let activityMap;
        if (HARDCODED_DATA) {
            activityMap = window.myAPI.fetchHardCodedActivity(username);
        } else {
            const activity = await window.myAPI.getActivity(username);
            activityMap = await window.myAPI.mapActivity(activity);
        }
        console.log(activityMap);

        const activityList = document.getElementById('activity-list');

        for (const [month, events] of activityMap.entries()) {
            const monthHeader = document.createElement('h2');
            monthHeader.innerText = month;

            const eventList = document.createElement('ul');

            for (const event of events) {
                const eventItem = document.createElement('li');
                eventItem.innerText = event;
                eventList.append(eventItem);
            }

            activityList.append(monthHeader);
            activityList.append(eventList);
        }
    } catch (error) {
        console.error(error);
    }
}

function clearActivity() {
    document.getElementById('activity-list').innerHTML = "";
}