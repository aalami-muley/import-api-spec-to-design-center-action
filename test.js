"use strict";

const token = process.argv[2];
const organizationId = "f60b1434-1059-4f0f-a28c-ccf4a9be05b2";
const userId = "612cf2dd-9f92-4a08-97ed-f6be4faf06ca";

const branch = "master";
let classifier = "raml";
let subType;

let name = "raml-pipeline-demo";
let directory = "/Users/ahmed.alami/Work/Mulesoft/Playgrounds/" + name;
const files = ["test.raml"];
const spec = name + ".raml";

(async function () {
    await require("./import")(directory, branch, { token, organizationId, userId }, { directory, name, spec, files, classifier, subType });
})();