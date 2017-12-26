import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const umdConfig = {
  output: {
    format: 'umd',
    name: 'localstoragelock',
  },
  plugins: [
    babel()
  ]
};

if (process.env.NODE_ENV === 'production') {
  umdConfig.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

export default umdConfig;