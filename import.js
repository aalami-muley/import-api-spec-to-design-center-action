"use strict";

const fs = require("fs");
const lib = require("./lib");
const {info, warn, error} = require("./log");

const info = console.log;
const warn = console.log;
const error = console.log;

module.exports = async function (directory, branch, credentials, { name, spec, files, classifier, subType }) {
    let projectId;
    try {
        const projectReference = await lib.getProject(credentials, name);
        if (!projectReference) {
            projectReference = await lib.createProject(credentials, { name, classifier, subType });
            info(`A new project was created with name ${name}`);
        }

        projectId = projectReference.id;
        info(`Using project with id ${projectId}`);

        const branchReference = await lib.getBranch(credentials, projectId, branch);
        if (!branchReference) {
            await lib.createBranch(credentials, projectId, branch);
            info(`A new branch was created with name ${branch}`);
        }

        try {
            await lib.aquireLock(credentials, projectId, branch);
            info(`Successfully aquired a new lock.`);
        } catch (error) {
            await lib.releaseLock(credentials, projectId, branch);
            await lib.aquireLock(credentials, projectId, branch);
            info(`Successfully released and aquired a new lock.`);
        }

        const specPath = directory + "/" + spec;
        if (fs.existsSync(specPath)) {
            await lib.addSpec(credentials, { projectId, specPath, spec, branch });
            info(`Spec with name ${spec} added successfully released.`);
        } else {
            warn(`Spec file was ignored as its relative path ${spec} is not resolved.`);
        }

        for (const file of files || []) {
            const filePath = directory + "/" + file;
            if (fs.existsSync(filePath)) {
                await lib.addFile(credentials, { projectId, filePath, file, branch });
                info(`File with path ${file} added successfully released.`);
            } else {
                warn(`File was ignored as its relative path ${file} is not resolved.`);
            }
        }
    } catch (err) {
        error(`Error thrown while processing.}`);
        error(err);
        throw err;
    } finally {
        if (projectId) {
            await lib.releaseLock(credentials, projectId, branch);
            info(`Lock is successfully released.`);
        }
    }
};