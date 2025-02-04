// Module containing the functionality to fetch, parse and print github event activity
//@ts-check

// Fetch github activity
async function getActivity(username) {
    // Fetch from https://api.github.com/users/<username>/events
    const url = `https://api.github.com/users/${username}/events`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Username not found');
            }
            throw new Error(`Response status ${response.status}`);
        }

        // Turn into object
        const json = await response.json();
        return json;
    } catch (error) {
        throw error;
    }
}

// Create EventObjects from the fetched data
function createEventObject(event) {
    const eventObject = {};

    eventObject.name = event.repo.name;
    eventObject.type = event.type;

    if (event.type === 'PushEvent') {
        eventObject.commits = event.payload.size;
    }
    if (event.type === 'CreateEvent') {
        eventObject.createType = event.payload.ref_type;
        eventObject.branch = event.payload.ref;
    }

    return eventObject;
}

// Print event details
// ? Check if there is a list of event types for the github api
function printEvents(events) {
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

function handleEvents(activity) {
    const events = [];

    // Create eventObject from event
    // TODO List events by month and year
    // ? Should I combine this so that I handle the events one by one instead of making a list?
    for (const event of activity) {
        const eventObject = createEventObject(event);

        events.push({ ...eventObject });
    }

    // Log events into terminal
    printEvents(events);
}

module.exports = {
    getActivity,
    createEventObject,
    printEvents,
    handleEvents
};