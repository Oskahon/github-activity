// Javascript file called from index.html

const input = document.getElementById('username-form');
input.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username-input');
    const username = usernameInput.value;

    console.log(username);
    document.getElementById('user-text').innerText = `Usage for ${username}`;

    usernameInput.value = "";
});

window.myAPI.hello();

const activityList = window.myAPI.fetchHardCodedActivity('Oskahon');

console.log(activityList);

const activity_list = document.getElementById('activity-list');

const list = document.createElement('ul');

const month = document.createElement('h2');
month.innerText = activityList[0];
activity_list.append(month);

for (let i = 1; i < activityList.length; i++) {
    const list_item = document.createElement('li');
    list_item.innerText = activityList[i];

    list.append(list_item);
}

activity_list.append(list);