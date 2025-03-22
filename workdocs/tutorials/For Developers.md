### ***Initial Setup***

clone it `git clone <project>` and navigate to the root folder `cd <project>`

### Installation

Run `npm install` (or `npm run do-install` if you have private dependencies and a `.token` file) to install the dependencies

### Scripts

The following npm scripts are available for development:

- `do-install` - sets a `TOKEN` environment variable to the contents of `.token` and runs npm install (useful when you
  have private dependencies);
- `flash-forward` - updates all dependencies. Take care, This may not be desirable is some cases;
- `reset` - updates all dependencies. Take care, This may not be desirable is some cases;
- `build` - builds the code (via gulp `gulpfile.js`) in development mode (generates `lib` and `dist` folder);
- `build:prod` - builds the code (via gulp `gulpfile.js`) in production mode (generates `lib` and `dist` folder);
- `test` - runs unit tests;
- `test:integration` - runs it tests;
- `test:all` - runs all tests;
- `lint` - runs es lint on the code folder;
- `lint-fix` - tries to auto-fix the code folder;
- `test-circular` - tests the code for circular dependencies;
- `prepare-release` - defines the commands to run prior to a new tag (defaults to linting, building production code,
  running tests and documentation generation);
- `release` - triggers a new tag being pushed to master (via `./bin/tag_release.sh`);
- `clean-publish` - cleans the package.json for publishing;
- `coverage` - runs all test, calculates coverage and generates badges for readme;
- `docs` - compiles all the coverage, drawings, uml, jsdocs and md docs into a readable web page under `./docs`;

## Testing

Preconfigured Jest based testing:

- unit tests under the `tests/unit` folder;
- include a default bundle test (helps with circular dependencies and such);
- integration tests under the `tests/integration` folder;
- stores converage results under `workdocs/coverage`;
- publishes coverage result to docs;
- ignores `cli.ts` from coverage since that is an executable file;
- defines the coverage threshold in `jest.config.ts`;

### Repository Structure

```
reflection
│
│   .gitignore              <-- Defines files ignored to git
│   .npmignore              <-- Defines files ignored by npm
│   .nmprc                  <-- Defines the Npm registry for this package
│   .nmptoken               <-- Defines access token for the Npm registry for this package
│   .prettierrc             <-- style definitions for the project
│   .snyk                   <-- vulnerability scan (via snyk) config
│   .eslint.config.js       <-- linting for the project
│   gulpfile.js             <-- Gulp build scripts. used for building na other features (eg docs)
│   jest.config.ts          <-- Tests Configuration file
│   jsdocs.json             <-- jsdoc Documentation generation configuration file
│   LICENCE.md              <-- Licence disclamer
│   mdCompile.json          <-- md Documentation generation configuration file
│   package.json
│   package-lock.json
│   README.md               <-- Readme File dynamically compiled from 'workdocs' via the 'docs' npm script
│   tsconfig.json           <-- Typescript config file. Is overriden in 'gulpfile.js' 
│
└───.github
│   │   ...                 <-- github workflows and templates
│   
└───bin
│   │   tag_release.sh      <-- Script to help with releases
│   
└───docs
│   │   ...                 <-- Dinamically generated folder, containing the compiled documentation for this repository. generated via the 'docs' npm script
│   
└───src
│   │   ...                 <-- Source code for this repository
│   
└───tests
│   │───unit                <-- Unit tests
│   └───integration         <-- Integration tests
│   
└───workdocs                <-- Folder with all pre-compiled documentation
│   │───assets              <-- Documentation asset folder
│   │───coverage            <-- Auto generated coverage results
│   │───tutorials           <-- Tutorial folder (will show up on tutorial section in generated documentation)
│   │   ...                 <-- Categorized *.md files that are merged to generate the final readme (via md compile)
│   │   Readme.md           <-- Entry point to the README.md (will import other referenced md files)  
│  
└───dist
│   │   ...                 <-- Dinamically generated folder containing the bundles for distribution
│
└───lib
    |   ...                 <-- Dinamically generated folder containing the compiled code
```

## Considerations
- Setup for a linux based environment (Sorry windows users. use WSL... or just change already);
- Setup for node 20, but will work at least with 16;
- Requires docker to build documentation (drawings and PlantUML)