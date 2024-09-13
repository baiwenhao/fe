import { EggPlugin } from 'egg';

interface EggPlugin2 extends EggPlugin {
    typescript?: boolean;
}

const plugin: EggPlugin2 = {
    static: true,
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },
};

export default plugin;
