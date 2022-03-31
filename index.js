"use strict";

const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
    try {
        const organizationId = core.getInput('ORGANIZATION_ID');
        const userId = core.getInput('USER_ID');
        const branch = core.getInput('BRANCH');
        const classifier = core.getInput('CLASSIFIER');
        const subType = core.getInput('SUB_TYPE');
        const name = core.getInput('PROJECT_NAME');
        const directory = core.getInput('PROJECT_DIRECTORY');
        const spec = core.getInput('SPEC_PATH');
        const files = core.getInput('FILES_PATHS');

        await require("./import")(directory, branch, { token, organizationId, userId }, { directory, name, spec, files, classifier, subType });

    } catch (error) {
        core.setFailed(error.message);
    }
};

main();
