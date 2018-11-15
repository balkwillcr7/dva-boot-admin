/* eslint-disable */ 
import React from 'react';
import dva from 'dva';
import dynamic from 'dva/dynamic';
import createLoading from 'dva-loading';
import { BrowserRouter, HashRouter } from 'dva/router';
import createHistory from 'history/createBrowserHistory';
import request from 'cmn-utils/lib/request';
import createRoutes from '@/routes';
import 'assets/styles/index.less';
import config from './config';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { baseURL } from '../package.json';

// -> 初始化 HashHistory
const app = dva();
// -> 初始化 BrowserHistory
// const app = dva({ history: createHistory() });

// -> 插件
app.use(createLoading());
app.use({ onError: config.exception.global });

// -> 请求
request.config(config.request);

// 使用mock数据
require('./__mocks__');
// -> Developer mock data
// if (process.env.NODE_ENV === 'development') {
//   require('./__mocks__');
// }

// -> loading
dynamic.setDefaultLoadingComponent(() => config.router.loading);

// -> 注册全局模型
app.model(require('./models/global').default);

// -> 初始化路由
app.router(({ history, app }) => (
  <LocaleProvider locale={zh_CN}>
    <HashRouter basename={baseURL}>
      {createRoutes(app)}
    </HashRouter>
  </LocaleProvider>
));

// -> Start
app.start('#root');

// export global
export default {
  app,
  store: app._store,
  dispatch: app._store.dispatch
};
