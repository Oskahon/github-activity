// @ts-check


async function main() {
    const username = 'Oskahon';
    // Get username from command line argument
    console.log('github-activity');

    // Get the activity as an object
    const activity = await getActivity(username);

    // Log the first event
    // console.log(activity[2].payload);

    const events = [];
    const eventObject = {};

    for (const event of activity) {
        eventObject.name = event.repo.name;
        eventObject.type = event.type;

        if (event.type === 'PushEvent') {
            eventObject.commits = event.payload.size;
        }

        events.push({ ...eventObject });
        // console.log(`Date: ${event.created_at}`);
        // console.log(`Repo: ${event.repo.name}`);
        // console.log(`Event type: ${event.type}`);
        // console.log();
    }

    for (const event of events) {
        console.log(event);
    }

}

async function getActivity(username) {
    // Fetch from https://api.github.com/users/<username>/events
    const url = `https://api.github.com/users/${username}/events`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status ${response.status}`);
        }

        // Turn into object
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }

}

main();