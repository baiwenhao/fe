
const { notEmpty } = require('../utils.js');

module.exports = {
    description: 'generate an api ',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'api name please',
        validate: notEmpty('name')
    },
    {
        type: 'checkbox',
        name: 'blocks',
        message: 'Blocks:',
        choices: [{
            name: 'list',
            value: 'list',
            checked: true
        },
        {
            name: 'item',
            value: 'item',
            checked: true
        },
        {
            name: 'create',
            value: 'create',
            checked: true
        },
        {
            name: 'update',
            value: 'update',
            checked: true
        },
        {
            name: 'delete',
            value: 'delete',
            checked: true
        }
        ]
    }
    ],
    actions: data => {
        const name = '{{name}}';
        const actions = [{
            type: 'add',
            path: `src/api/${name}.js`,
            templateFile: 'plop-templates/api/index.hbs',
            data: {
                name: name,
                list: data.blocks.includes('list'),
                item: data.blocks.includes('item'),
                create: data.blocks.includes('create'),
                update: data.blocks.includes('update'),
                delete: data.blocks.includes('delete')
            }
        }];

        return actions;
    }
};

