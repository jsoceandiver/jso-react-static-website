const React = require('react');
const ReactCreateClass = require('create-react-class');

module.exports = ReactCreateClass({

    render: function() {

        const year = (new Date()).getFullYear();

        return (
            <div className="text-center py-3"> <div>© {year} JavaScript Ocean</div></div>
        );
    }
});