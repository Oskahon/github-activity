// @ts-check


async function main() {
    const username = 'Oskahon';
    // Get username from command line argument
    console.log('github-activity');

    // Get the activity as an object
    const activity = await getActivity(username);

    // Log the first event
    // console.log(activity[19]);

    const events = [];
    const eventObject = {};

    // Create eventObject from event
    for (const event of activity) {
        eventObject.name = event.repo.name;
        eventObject.type = event.type;

        if (event.type === 'PushEvent') {
            eventObject.commits = event.payload.size;
        }
        if (event.type === 'CreateEvent') {
            eventObject.createType = event.payload.ref_type;
            eventObject.branch = event.payload.ref;
        }

        events.push({ ...eventObject });
    }

    // Print event details
    // TODO Check if there is a list of event types for the github api
    for (const event of events) {
        if (event.type === 'PushEvent') {
            console.log(`Pushed ${event.commits} ${event.commits > 1 ? 'commits' : 'commit'} to ${event.name}`);
        } else if (event.type === 'PublicEvent') {
            console.log(`Made ${event.name} public`);
        } else if (event.type === 'CreateEvent') {
            if (event.createType === 'repository') {
                console.log(`Created ${event.name}`);
            } else if (event.createType === 'branch') {
                console.log(`Created a new branch '${event.branch}' at ${event.name}`);
            } else {
                console.log(`CreateEvent, payload.ref_type: ${event.createType}`);
            }
        } else if (event.type === 'ForkEvent') {
            console.log(`Forked ${event.name}`);
        } else {
            console.log(event);
        }
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