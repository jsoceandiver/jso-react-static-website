const React = require('react');
const ReactCreateClass = require('create-react-class');

const Header = require('../components/header');
const Footer = require('../components/footer');

module.exports = ReactCreateClass({

    /**
     * render the layout
     * @returns {JSX}
     */
    render: function() {
        return (
            <html>
                <head>
                    <title>{this.props.websiteName}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />

                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous" />
                    <link rel="stylesheet" href="/css/styles.min.css" />
                </head>
                <body>
                    <div className="container">

                        <Header {...this.props} />
                        {this.props.children}
                        <Footer {...this.props} />

                    </div>

                    <script src="/js/website.min.js?v=1"></script>
                </body>
            </html>
        );
    }
});