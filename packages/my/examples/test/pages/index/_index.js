// 直接通过 jsx 声明式使用
import Chart from './chart';
import { jsx as _jsx } from "@antv/f2/jsx-runtime";
const data = [{
  genre: 'Sports',
  sold: 275
}, {
  genre: 'Strategy',
  sold: 115
}, {
  genre: 'Action',
  sold: 120
}, {
  genre: 'Shooter',
  sold: 350
}, {
  genre: 'Other',
  sold: 150
}];
Page({
  data: {},

  onRenderChart() {
    return _jsx(Chart, {
      data: data
    });
  }

});