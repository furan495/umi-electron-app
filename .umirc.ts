import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  headScripts: [
    'https://cdn.jsdelivr.net/gh/nicolaspanel/numjs@0.15.1/dist/numjs.min.js',
  ],
  history: { type: 'hash' },
  routes: [
    { path: '/', redirect: 'oss' },
    { path: 'oss', component: '@/pages/oss' },
    { path: 'login', component: '@/pages/login' },
    { path: 'jira', component: '@/pages/jira' },
  ],
  dynamicImport: {},
  fastRefresh: {},
  publicPath: './'
});
