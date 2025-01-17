const viewGenerator = require('./plop-templates/view/prompt');
const componentGenerator = require('./plop-templates/component/prompt');
const apiGenerator = require('./plop-templates/api/prompt');

module.exports = function(plop) {
    plop.setGenerator('view', viewGenerator);
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('api', apiGenerator);
};
