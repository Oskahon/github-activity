// Javascript file called from index.html

const input = document.getElementById('username-form');
input.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value;

    console.log(username);
    document.getElementById('user-text').innerText = `Usage for ${username}`;

    usernameInput.value = "";

    clearActivity();
    setActivity('Oskahon');

});

function setActivity(username) {
    const activityData = window.myAPI.fetchHardCodedActivity(username);

    const activityList = document.getElementById('activity-list');

    for (const [month, events] of activityData.entries()) {
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
}

function clearActivity() {
    document.getElementById('activity-list').innerHTML = "";
}