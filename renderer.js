// Javascript file called from index.html

console.log('hello electron');

window.myAPI.hello();

const activityList = window.myAPI.fetchActivity('Oskahon');

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