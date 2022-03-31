# Import a specification to Design Center

This action helps to import and update a sepcification project in Design center.

## Inputs

|Name|Desription|Required|
|---|---|---|
|ORGANIZATION_ID|The organization id|true|
|USER_ID|The user id used to create the design center project|true|
|BRANCH|The branch used to commit the specification project|true|
|CLASSIFIER|The classifier of the specification project|true|
|SUB_TYPE|The subtype of the classfier of the specification project|false|
|PROJECT_NAME|The specification project name|true|
|PROJECT_DIRECTORY|The directory of the project|true|
|SPEC_PATH|The relative path of the root specification file|true|
|FILES_PATHS|The relative path of the files to import|true|

## Secrets

The action uses a TOKEN secret used to authorize the actions to Anypoint Platform.

## Example usage

```yaml
uses: aalami-muley/import-api-spec-to-design-center-action@main
with:
  ORGANIZATION_ID: ''
  USER_ID: ''
  BRANCH: 'master'
  CLASSIFIER: 'raml'
  SUB_TYPE: ''
  PROJECT_NAME: ''
  PROJECT_DIRECTORY: '${{ github.workspace }}'
  SPEC_PATH: ''
  FILES_PATHS: ''
  TOKEN: ''
```
