// Module containing the functionality to fetch, parse and print github event activity
//@ts-check

/**
 * Fetch github activity based on the given username for the last 3 months
 * @param {String} username The username of the profile to be fetched
 * @returns {Promise<Array>} Promise that resolves into an array containing objects with event data
 */
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
/**
 * Create EventObjects from the fetched data
 * @param {Object} event The event object containing all the data fetched from GitHub
 * @returns {Object} Object containing only the relevant data
 */
function createEventObject(event) {
    const eventObject = {};

    eventObject.name = event.repo.name;
    eventObject.type = event.type;
    eventObject.createdAt = new Date(event.created_at);


    if (event.type === 'PushEvent') {
        eventObject.commits = Number(event.payload.size);
    }
    if (event.type === 'CreateEvent') {
        eventObject.createType = event.payload.ref_type;
        eventObject.branch = event.payload.ref;
    }
    if (event.type === 'DeleteEvent') {
        eventObject.deleteType = event.payload.ref_type;
        eventObject.branch = event.payload.ref;
    }
    if (event.type === 'IssuesEvent') {
        eventObject.issueAction = event.payload.action;
        // eventObject.issueTitle = event.payload.issue.title;
    }
    if (event.type === 'PullRequestEvent') {
        eventObject.pullRequestAction = event.payload.action;
        eventObject.merged = event.payload.pull_request.merged;
    }

    return eventObject;
}

// ? Check if there is a list of event types for the github api
/**
 * Log event information into console
 * @param {Object} event Contains all the relevant event data
 */
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

/**
 * Get the month the from the event timestamp
 * @param {Object} event Contains all the data for an event fetched from GitHub
 * @returns {String} The month when the event happened as a string
 */
function parseMonth(event) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(event.createdAt);

    return monthName;
}

/**
 * Creates objects and prints their content from activity data
 * Activity data is fetched with the getActivity function
 * @param {Array.<Object>} activity Array containing the event objects fetched from GitHub
 */
function handleEvents(activity) {
    let month = "";
    const events = aggregatePushEvents(createEventObjects(activity));

    for (const event of events) {
        // Get the month an print it if it's a new one
        const eventMonth = parseMonth(event);
        if (month !== eventMonth) {
            month = eventMonth;

            console.log();
            console.log(`In ${month}: `);
        }

        // Print the event
        console.log('\t' + parseEventToString(event));
    }

    console.log();
}

/**
 * Parse event data into string
 * ? Check if there is a list of event types for the github api
 * @param {Object} event Contains all the relevant event data
 * @returns {String} Event data in a string format
 */
function parseEventToString(event) {
    let eventString = '';

    switch (event.type) {
        case 'PushEvent':
            eventString += `Pushed ${event.commits} ${event.commits > 1 ? 'commits' : 'commit'} to ${event.name}`;
            break;
        case 'PublicEvent':
            eventString += `Made ${event.name} public`;
            break;
        case 'CreateEvent':
            if (event.createType === 'repository') {
                eventString += `Created ${event.name}`;
            } else if (event.createType === 'branch') {
                eventString += `Created a new branch '${event.branch}' at ${event.name}`;
            } else {
                eventString += `CreateEvent, payload.ref_type: ${event.createType}`;
            }
            break;
        case 'ForkEvent':
            eventString += `Forked ${event.name}`;
            break;
        case 'DeleteEvent':
            if (event.deleteType === 'branch') {
                eventString += `Deleted branch '${event.branch}' at ${event.name}`;
            } else {
                eventString += `DeleteEvent, payload.ref_type: ${event.createType}`;
            }
            break;
        case 'IssuesEvent':
            const action = event.issueAction[0].toUpperCase() + event.issueAction.slice(1);
            eventString += `${action} an issue at ${event.name}`;
            break;
        case 'PullRequestEvent':
            if (event.pullRequestAction === 'closed' && event.merged) {
                eventString += `Merged a pull request at ${event.name}`;
            } else if (event.pullRequestAction === 'opened') {
                eventString += `Opened a pull request at ${event.name}`;
            } else {
                eventString += `PullRequestEvent, action: ${event.pullRequestAction}`;
            }
            break;

        default:
            eventString += `${event.name} - ${event.type}`;
            break;
    }

    return eventString;
}

/**
 * Parse activity into a map that contains months as keys with an array of the event strings
 * @param {Array.<Object>} activity Array containing the event objects fetched from GitHub
 * @returns {Map.<string, string[]>} Returns the event strings mapped per month
 */
function mapActivity(activity) {
    const activityMap = new Map();
    let events = createEventObjects(activity);
    events = aggregatePushEvents(events);

    for (const event of events) {
        const month = parseMonth(event);

        if (!activityMap.has(month)) {
            activityMap.set(month, []);
        }

        const eventString = parseEventToString(event);

        activityMap.get(month).push(eventString);
    }

    return activityMap;
}

/**
 * Parses the activity data from github api to eventObjects
 * @param {Array.<Object>} activity Activity data from github
 * @returns {Array.<Object>} Activity data parsed into eventObjects
 */
function createEventObjects(activity) {
    const events = activity.map(event => createEventObject(event));
    return events;
}

/**
 * Aggregates consecutive push events that target the same repository
 * @param {Array.<Object>} events Array containing eventObjects
 * @returns {Array.<Object>} Array containing eventObjects after aggregating pushEvents
 */
function aggregatePushEvents(events) {
    const aggregatedEvents = [];

    for (let i = 0; i < events.length; i++) {
        if (events[i].type !== 'PushEvent') {
            aggregatedEvents.push(events[i]);
            continue;
        }

        let sumOfCommits = events[i].commits;
        const eventMonth = parseMonth(events[i]);

        for (let j = i + 1; j < events.length; j++) {
            const nextEventMonth = parseMonth(events[j]);
            if (events[i].name !== events[j].name || events[j].type !== 'PushEvent' || eventMonth !== nextEventMonth) {
                break;
            }

            i = j;
            sumOfCommits += events[j].commits;
        }

        events[i].commits = sumOfCommits;
        aggregatedEvents.push(events[i]);

    }
    return aggregatedEvents;
}

module.exports = {
    getActivity,
    createEventObject,
    printEvent,
    parseMonth,
    handleEvents,
    parseEventToString,
    mapActivity
};