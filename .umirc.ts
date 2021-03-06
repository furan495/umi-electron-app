import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  routes: [
    { path: '/', redirect: 'oss' },
    { path: 'oss', component: '@/pages/oss' },
  ],
  dynamicImport: {},
  fastRefresh: {},
  publicPath: './'
});
