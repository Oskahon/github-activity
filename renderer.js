console.log('hello electron');

const tempListOfActivity = [
    "In March:",
    "Pushed 2 commits to Oskahon/github-activity",
    "Pushed 3 commits to Oskahon/github-activity",
    "Pushed 1 commit to Oskahon/github-activity",
    "Created Oskahon/github-activity"
];

console.log(tempListOfActivity);

const activity_list = document.getElementById('activity-list');

const list = document.createElement('ul');

const month = document.createElement('h2');
month.innerText = tempListOfActivity[0];
activity_list.append(month);

for (let i = 1; i < tempListOfActivity.length; i++) {
    const list_item = document.createElement('li');
    list_item.innerText = tempListOfActivity[i];

    list.append(list_item);
}

activity_list.append(list);