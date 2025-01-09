// @ts-check


async function main() {
    // Get username from command line argument
    console.log('github-activity');

    // Get the activity as an object
    const activity = await getActivity('Oskahon');

    console.log(activity);

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