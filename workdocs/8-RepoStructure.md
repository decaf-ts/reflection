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
