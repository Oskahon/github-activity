// @ts-check


async function main() {
    console.log('github-activity');

    getActivity('Oskahon');

}

async function getActivity(username) {
    // Fetch from https://api.github.com/users/<username>/events
    console.log(`Fetching activity data for ${username}`);

    // Turn into object
}

main();