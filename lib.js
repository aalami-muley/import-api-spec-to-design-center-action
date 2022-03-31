"use strict";

const fs = require("fs");
const path = require("path");
const client = require("./client");

const DEFAULT_COMMIT_MESSAGE = process.env.DEFAULT_COMMIT_MESSAGE || "CommitedByPipeline";

module.exports = {
    async getProject(credentials, name) {
        const projects = (await client.get(credentials).get("/projects")).data;
        return projects.filter(function (project) {
            return project.name === name;
        })[0];
    },
    async createProject(credentials, definition) {
        return (await client.get(credentials).post(`/projects`, definition)).data;
    },
    async getBranch(credentials, projectId, name) {
        const branches = (await client.get(credentials).get(`/projects/${projectId}/branches`)).data;
        return branches.filter(function (branch) {
            return branch.name === name;
        })[0];
    },
    async createBranch(credentials, projectId, name) {
        return (await client.get(credentials).post(`/projects/${projectId}/branches`, { name })).data;
    },
    async releaseLock(credentials, projectId, branch) {
        (await client.get(credentials).post(`/projects/${projectId}/branches/${branch}/releaseLock`, {})).data;
    },
    async aquireLock(credentials, projectId, branch) {
        (await client.get(credentials).post(`/projects/${projectId}/branches/${branch}/acquireLock`, {})).data;
    },
    async addSpec(credentials, { projectId, branch, specPath, spec, message }) {
        (await client.get(credentials).post(`/projects/${projectId}/branches/${branch}/save?commit=true&message=${message || DEFAULT_COMMIT_MESSAGE}`, [
            { "path": "exchange.json", "type": "FILE", "content": JSON.stringify({ "dependencies": [], "main": spec }) },
            { "path": `/${spec}`, "type": "FILE", "content": JSON.stringify(fs.readFileSync(specPath, "utf-8")) }
        ]));
    },
    async addFile(credentials, { projectId, branch, filePath, file, message }) {
        (await client.get(credentials).post(`/projects/${projectId}/branches/${branch}/save?commit=true&message=${message || DEFAULT_COMMIT_MESSAGE}`, [
            { "path": `/${file}`, "type": "FILE", "content": fs.readFileSync(filePath, "utf-8") }
        ]));
    },
    async getFiles(credentials, projectId, branch) {
        return (await client.get(credentials).get(`/projects/${projectId}/branches/${branch}/files`)).data;
    }
}