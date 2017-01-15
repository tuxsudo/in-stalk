import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'index.js',
    plugins: [
        nodeResolve({ jsnext: true, main: true }),
        babel(),
        uglify()
    ],
    moduleName: "inStalk",
    targets: [
        { dest: 'dist/in-stalk.min.js', format: 'iife'}
    ]
};
