import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    plugins: [
        nodeResolve({ jsnext: true, main: true }),
        babel()
    ],
    moduleName: "inStalk",
    targets: [
        { dest: 'dist/bundle.cjs.js', format: 'cjs' },
        { dest: 'dist/bundle.es.js', format: 'es' },
    ]
};
