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

// TODO Create event class and use it to parse needed data into an object
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
function printEvent(event) {
    if (event.type === 'PushEvent') {
        console.log(`\tPushed ${event.commits} ${event.commits > 1 ? 'commits' : 'commit'} to ${event.name}`);
    } else if (event.type === 'PublicEvent') {
        console.log(`\tMade ${event.name} public`);
    } else if (event.type === 'CreateEvent') {
        if (event.createType === 'repository') {
            console.log(`\tCreated ${event.name}`);
        } else if (event.createType === 'branch') {
            console.log(`\tCreated a new branch '${event.branch}' at ${event.name}`);
        } else {
            console.log(`\tCreateEvent, payload.ref_type: ${event.createType}`);
        }
    } else if (event.type === 'ForkEvent') {
        console.log(`\tForked ${event.name}`);
    } else {
        console.log(`\t${event}`);
    }
}

// Get the month the from the event timestamp
function parseMonth(event) {
    const date = new Date(event.created_at);
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

    return monthName;
}

// Creates objects and prints their content from activity data
// Activity data is fetched with the getActivity function
function handleEvents(activity) {
    let month = "";

    for (const event of activity) {
        // Get the month an print it if it's a new one
        const eventMonth = parseMonth(event);
        if (month !== eventMonth) {
            month = eventMonth;

            console.log();
            console.log(`In ${month}: `);
        }

        // Create eventObject
        const eventObject = createEventObject(event);

        // Print the event
        printEvent(eventObject);
    }

    console.log();
}

module.exports = {
    getActivity,
    createEventObject,
    printEvent,
    parseMonth,
    handleEvents,
};;