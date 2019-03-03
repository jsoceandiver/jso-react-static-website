# React Static Website Generator
Really simple static site generator based on [React without ES6](https://reactjs.org/docs/react-without-es6.html). It uses  server side rendering to build the pages. 

## Features
           
- No markdown, only react :) You are free to use any markup you need.
- Uses SASS preprocessor and autoprefixer for CSS, automatically minifies the CSS output.
- Minifies client side javascript using UglifyJS
- MIT licensed

## How to install?

```
npx jso-react-static-website
```

## How to use?

- Build the site using 
    ```
    npm run build
    ```
- Run and go to [http://localhost:3000](http://localhost:3000) to see it
    ```
    npm run site
    ```    
- The site output is located at */dist* folder  
- Go to */src/js/website-generator* and edit or add your own react components.

## How to pass general website data to react components?

Use */data/data.json* file, every component has access to its content via *props*. For example *websiteName* property defined in */data/data.json* can be accesses as *this.props.websiteName* in react components. 

## Where to add CSS?

- It's located at */src/css*
- The output file is */dist/css/styles.min.css* and it's already minified using [UglifyCSS](https://github.com/fmarcia/uglifycss)
- SASS preprocessor is used to handle CSS
- All CSS go through Autoprefixer to add vendor prefixes if needed

## Where to add client side JavaScript?

- It's located at */src/js/client*
- The output file is */dist/js/website.min.js* and it's already minified using UglifyJS.

## Where should I add my images and other assets?

- Any assets should be placed at */assets* folder
- They automatically copied to the destination folder */dist*

## License

The project is free for use under the [MIT license](https://opensource.org/licenses/MIT)