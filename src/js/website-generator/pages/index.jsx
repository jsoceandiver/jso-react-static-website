const React = require('react');

// https://reactjs.org/docs/react-without-es6.html
const ReactCreateClass = require('create-react-class');

const DefaultLayout = require('../layouts/layout.jsx');

const HomePage = ReactCreateClass({

    render: function() {

        return (
            <DefaultLayout {...this.props}>

                <div className="jumbotron mt-3">
                    <h1 className="display-4">Hello, world!</h1>
                    <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                    <hr className="my-4" />
                    <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                    <a className="btn btn-primary btn-lg" href="/" role="button">Learn more</a>
                </div>

            </DefaultLayout>
        );
    }
});

module.exports = HomePage;
