/** @jsx jsx */
import { jsx, Canvas, Chart, Interval, Axis, Tooltip, Legend } from '@antv/f2';
import { processUserOpt, processAnimationTypeCfg } from '@antv/f2';

const context = document.getElementById('container').getContext('2d');

// F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

const delay = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'genre', start: 'Strategy', unit: 200 }],
});
const cfg = {
  delay,
  duration: 1000,
  easing: 'elasticOut',
};

const { props } = (
  <Canvas context={context} pixelRatio={window.devicePixelRatio}>
    <Chart data={data}>
      <Legend />
      <Axis field="genre" />
      <Axis field="sold" />
      <Tooltip showTooltipMarker={true} />
      <Interval
        x="genre"
        y="sold"
        color="genre"
        animation={{
          appear: (item) => {
            return processAnimationTypeCfg({ ...cfg }, item);
          },
        }}
      />
    </Chart>
  </Canvas>
);

const canvas = new Canvas(props);
canvas.render();
