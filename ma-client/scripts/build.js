const { sh } = require('tasksfile')
// run(`vue-cli-service build --mode ${process.env.TEST_ENV}`);
const rawArgv = process.argv.slice(2);
let mode = 'production';
if (rawArgv.length > 0) {
    mode = rawArgv[0];
}
sh(`vue-cli-service build --mode ${mode}`);
