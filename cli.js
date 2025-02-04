// CLI tool for getting public github activity data of a given user
// @ts-check

const { getActivity, handleEvents } = require("./events");

async function main() {
    if (process.argv.length < 3) {
        console.error('Too few arguments.');
        return;
    }

    // Get username from command line argument
    const username = process.argv[2];

    // Get the activity as an object
    let activity;
    try {
        activity = await getActivity(username);
    } catch (error) {
        console.error(error.message);
        return;
    }

    console.log(`Activity for ${username}:`);

    // Log the first event
    // console.log(activity[19]);

    handleEvents(activity);
}

main();