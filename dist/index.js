/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 372:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const axios = __nccwpck_require__(84);
const BASE_URL = process.env.BASE_URL || "https://eu1.anypoint.mulesoft.com/designcenter/api-designer";

module.exports = {
    get(credentials) {
        return axios.create({
            baseURL: BASE_URL,
            timeout: 5000,
            headers: {
                'Authorization': `Bearer ${credentials.token}`,
                "x-organization-id": credentials.organizationId,
                "x-owner-id": credentials.userId,
                "Accept": "application/json",
                "x-origin": "API Designer",
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip, deflate, br"
            }
        });;
    }
};

/***/ }),

/***/ 612:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(147);
const lib = __nccwpck_require__(771);
const {info, warn, error} = __nccwpck_require__(49);

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

/***/ }),

/***/ 771:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(147);
const path = __nccwpck_require__(17);
const client = __nccwpck_require__(372);

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
            { "path": `/${spec}`, "type": "FILE", "content": fs.readFileSync(specPath, "utf-8") }
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

/***/ }),

/***/ 49:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


let core;
try {
    core = __nccwpck_require__(518);
} catch (error) {
}

module.exports = {
    "info": (core) ? core.info : console.log,
    "warn": (core) ? core.warn : console.log,
    "error": (core) ? core.error : console.log,
}

/***/ }),

/***/ 518:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 832:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 84:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";


const core = __nccwpck_require__(518);
const github = __nccwpck_require__(832);

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
        const token = core.getInput('TOKEN');

        await __nccwpck_require__(612)(directory, branch, { token, organizationId, userId }, { directory, name, spec, files, classifier, subType });

    } catch (error) {
        core.setFailed(error.message);
    }
};

main();

})();

module.exports = __webpack_exports__;
/******/ })()
;