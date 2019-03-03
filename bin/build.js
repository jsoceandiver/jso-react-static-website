#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');

const paths = ['assets',  'data', 'dist', 'src', 'LICENSE', 'browserslist', 'package.json', 'README.md', '.gitignore'];

for(let i=0; i<paths.length; i++){
    const pathItem = '../' + paths[i];
    fse.copySync(path.join(__dirname, pathItem), path.join('./', paths[i]));
}
