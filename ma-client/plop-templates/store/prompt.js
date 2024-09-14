
const { notEmpty } = require('../utils.js');

module.exports = {
    description: 'generate vue store module',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'component name please',
        validate: notEmpty('name')
    }, {
        type: 'input',
        name: 'path',
        message: 'path please',
        default: 'common/store/modules'
    }],
    actions: () => {
        const name = '{{name}}';
        const path = '{{path}}';
        const actions = [{
            type: 'add',
            path: `${path}/${name}.js`,
            templateFile: 'plop-templates/store/index.hbs'
        }];
        return actions;
    }
};

