const colors = require('colors');

//html rendering
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const pretty = require('pretty'); //https://github.com/jonschlinkert/pretty

//input / output
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); //https://github.com/jprichardson/node-fs-extra

//CSS rendering
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const sass = require('node-sass');
const uglifycss = require('uglifycss');

//JS client side minification
const uglifyjs = require('uglify-js');

/**
 * handle JSX in node.js
 */
require("@babel/register")({
    // This will override `node_modules` ignoring - you can alternatively pass
    // an array of strings to be explicitly matched or a regex / glob
    ignore: [],
    presets: ["@babel/preset-react"]
});

/**
 * main class responsible for website rendering
 */
class Application{

    /**
     * app init
     */
    constructor(){

        //the data contained in /data/data.json file
        this.data = JSON.parse(fs.readFileSync(process.cwd() + '/data/data.json', 'utf8'));
    }

    /**
     * render HTML recursively
     * @param {string} srcFolderPath - the absolute path to the sources folder (.../src/js/website-generator/pages)
     * @param {string} outputFolderPath - the relative path to the output folder (./dist)
     * @param {Object} data
     */
    renderHTML(srcFolderPath, outputFolderPath, data){

        const items = fs.readdirSync(srcFolderPath);
        const scope = this;

        //loop through all the nested files and folders
        items.forEach(function(item){

            //get the absolute file / folder path
            const sourceItemPath = path.join(srcFolderPath, item);
            const stat = fs.statSync(sourceItemPath);

            //in case it's a file
            if(stat.isFile()){

                const parsed = path.parse(item);

                if(parsed.ext === '.jsx') {

                    console.log(('Rendering ' + outputFolderPath + '/' + item).green);

                    const page = require(sourceItemPath);
                    Application.renderSingleHTMLFile(page, scope.data, outputFolderPath, parsed.name);
                }
            }
            //in case it's a folder
            else{

                //get nested folder absolute path
                const nestedFolder = path.join(srcFolderPath, item);

                //generate relative nested folder path
                const target = outputFolderPath + '/' + item;

                scope.renderHTML(nestedFolder, target, data);
            }
        });
    }

    /**
     * helper: render a single HTML file
     * @param {object} page - react page
     * @param {object} data - data to render
     * @param {string} outputFolderPath - the relative path to the output folder (./dist)
     * @param {string} outputFileName - output file name with path and extension
     */
    static renderSingleHTMLFile(page, data, outputFolderPath, outputFileName){

        //render the HTML
        const pageHtml = pretty('<!DOCTYPE html>\n' + ReactDOMServer.renderToStaticMarkup (
            React.createElement(page, data)
        ).trim());

        const targetFilePath = path.join(process.cwd(), outputFolderPath, outputFileName + '.html');

        //create all the needed nested folders at destination path
        fse.ensureFileSync(targetFilePath);

        //write the output HTML to the destination
        fs.writeFileSync(targetFilePath, pageHtml, 'utf8');
    }

    /**
     * render CSS through post css plugins: autoprefixer, nested CSS etc.
     * @param {string} cssFilePath
     * @param {string} outputFolderPath - the relative path to the output folder (./dist)
     */
    renderCSS(cssFilePath, outputFolderPath){

        //get file name and extension
        const parsed = path.parse(cssFilePath);

        console.log('Rendering ' + parsed.name + parsed.ext + ' to ' + parsed.name + '.min.css');

        //load the SCSS source
        const css = fs.readFileSync(cssFilePath, 'utf8');

        //SASS -> CSS
        const compiled = sass.renderSync({
            data: css
        });

        //apply auto prefixer
        postcss([ autoprefixer ]).process(compiled.css, {
            from: cssFilePath
        }).then(function (result) {

            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });

            //minify the CSS
            // https://github.com/fmarcia/uglifycss
            const uglified = uglifycss.processString(result.css);

            const targetFilePath = path.join(process.cwd(), outputFolderPath, 'css', parsed.name + '.min.css');

            //create all the needed nested folders at destination path
            fse.ensureFileSync(targetFilePath);

            //save the output
            fs.writeFileSync(targetFilePath, uglified, 'utf8');
        });
    }

    /**
     * copy assets to the destination folder
     * @param {string} assetsFolderPath - the absolute path to the assets folder (.../assets)
     * @param {string} outputFolderPath - the relative path to the output folder (./dist)
     */
    copyAssets(assetsFolderPath, outputFolderPath){

        const items = fs.readdirSync(assetsFolderPath);

        items.forEach(function(item){

            const sourceItemPath = path.join(assetsFolderPath, item);
            const targetFilePath = path.join(process.cwd(), outputFolderPath, item);

            console.log(targetFilePath);

            //create all the needed nested folders at destination path
            //fse.ensureFileSync(targetFilePath);
            fse.copySync(sourceItemPath, targetFilePath);
        });
    }

    /**
     * minify client js file intended to be on all website pages
     * https://github.com/mishoo/UglifyJS
     * @param {string} jsFilePath
     * @param {string} outputFolderPath - the relative path to the output folder (./dist)
     */
    static minifyClientJS(jsFilePath, outputFolderPath){

        const jsContent = fs.readFileSync(jsFilePath, 'utf8');
        const uglified = uglifyjs.minify(jsContent).code;
        const targetFilePath = path.join(process.cwd(), outputFolderPath, 'js', 'website.min.js');

        //create all the needed nested folders at destination path
        fse.ensureFileSync(targetFilePath);

        //save the output
        fs.writeFileSync(targetFilePath, uglified, 'utf8');
    }
}

/**
 * render the website
 * @type {Application}
 */
const app = new Application();

const destinationFolder = './dist';

//delete the destination folder
fse.removeSync(destinationFolder);

app.renderHTML(process.cwd() + '/src/js/website-generator/pages', destinationFolder, {});
app.renderCSS(process.cwd() + '/src/css/styles.scss', destinationFolder);
Application.minifyClientJS(process.cwd() + '/src/js/client/index.js', destinationFolder);
app.copyAssets(process.cwd() + '/assets', destinationFolder);