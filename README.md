![Banner](./workdocs/assets/Banner.png)
## Decaf-ts' Reflection

Provides the Reflection apis for decaf-ts

![Licence](https://img.shields.io/github/license/decaf-ts/reflection.svg?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/decaf-ts/reflection?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/decaf-ts/reflection?style=plastic)
[![Tests](https://github.com/decaf-ts/reflection/actions/workflows/jest-test.yaml/badge.svg)](http://www.pdmfc.com)
[![CodeQL](https://github.com/starnowski/posmulten/workflows/CodeQL/badge.svg)](https://github.com/decaf-ts/reflection/actions?query=workflow%3ACodeQL)

![Open Issues](https://img.shields.io/github/issues/decaf-ts/reflection.svg)
![Closed Issues](https://img.shields.io/github/issues-closed/decaf-ts/reflection.svg)
![Pull Requests](https://img.shields.io/github/issues-pr-closed/decaf-ts/reflection.svg)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

![Line Coverage](workdocs/badges/badge-lines.svg)
![Function Coverage](workdocs/badges/badge-functions.svg)
![Statement Coverage](workdocs/badges/badge-statements.svg)
![Branch Coverage](workdocs/badges/badge-branches.svg)


![Forks](https://img.shields.io/github/forks/decaf-ts/reflection.svg)
![Stars](https://img.shields.io/github/stars/decaf-ts/reflection.svg)
![Watchers](https://img.shields.io/github/watchers/decaf-ts/reflection.svg)

![Node Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=Node&query=$.engines.node&colorB=blue)
![NPM Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=NPM&query=$.engines.npm&colorB=purple)

Utilitarian library providing the Reflection implementation, currently based on `reflect-metadata`

Please follow the Contributing guide or the developer's guide to contribute to this library. 

All help is appreciated.

Technical documentation can be found [here](decaf-ts-reflection.github.io)
## Considerations
 - Setup for a linux based environment (Sorry windows users. use WSL... or just change already);
 - Setup for node 20, but will work at least with 16;
 - Requires docker to build documentation (drawings and PlantUML)
### Related

[![Decorator Validation Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=decaf-ts&repo=decorator-validation)](https://github.com/decaf-ts/decorator-validation)

[![Decaf-ts Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=decaf-ts&repo=decaf-ts)](https://github.com/decaf-ts/decaf-ts)
### Social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/TiagoVenceslau/)
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

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ShellScript](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

## Getting help

If you have bug reports, questions or suggestions please [create a new issue](https://github.com/decaf-ts/ts-workspace/issues/new/choose).

## Contributing

I am grateful for any contributions made to this project. Please read [this](./workdocs/98-Contributing.md) to get started.

## Supporting

The first and easiest way you can support it is by [Contributing](./workdocs/98-Contributing.md). Even just finding a typo in the documentation is important.

Financial support is always welcome and helps keep the both me and the project alive and healthy.

So if you can, if this project in any way. either by learning something or simply by helping you save precious time, please consider donating.

## License

This project is released under the [MIT License](LICENSE.md).

#### Disclaimer:

badges found [here](https://dev.to/envoy_/150-badges-for-github-pnk), [here](https://github.com/alexandresanlim/Badges4-README.md-Profile#-social-) and [here](https://github.com/Ileriayo/markdown-badges)
