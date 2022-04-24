/** @jsx jsx */
import { jsx, Canvas, Timeline, Chart, Interval, TextGuide, LineGuide } from '@antv/f2';
import { generateAnimation } from '@antv/f2';

const context = document.getElementById('container').getContext('2d');

const data = [
  { genre: 'Sports', sold: 275, type: 'a' },
  { genre: 'Strategy', sold: 115, type: 'a' },
  { genre: 'Action', sold: 120, type: 'a' },
  { genre: 'Shooter', sold: 350, type: 'a' },
  { genre: 'Other', sold: 150, type: 'a' },
];

const delay = [{ field: 'genre', unit: 500, base: 1000 }];
const duration = [{ field: 'sold', unit: 10, f: 'value' }];

const { clientHeight } = context.canvas;
const offset = 20;
const height = clientHeight - offset; // 文字标注起始高度

const opt_interval = {
  delay,
  duration,
};
const opt_guide = {
  delay,
  duration,
  property: [['text', 0], 'y', 'fillOpacity'],
  start: {
    text: 0,
    y: height,
    fillOpacity: 0.1,
  },
  end: {
    fillOpacity: 1,
  },
};

const { props } = (
  <Canvas context={context} pixelRatio={window.devicePixelRatio}>
    <Timeline>
      <Chart data={data}>
        <Interval
          x="genre"
          y="sold"
          color="genre"
          animation={{
            appear: () => generateAnimation(opt_interval),
          }}
        />
        {data.map((item) => {
          const { sold } = item;
          return (
            <TextGuide
              records={[item]}
              onClick={(ev) => {
                console.log('ev: ', ev.points);
              }}
              content={`${sold}`}
              attrs={{
                fill: '#000',
                fontSize: '24px',
              }}
              offsetY={-10}
              offsetX={-10}
              animation={{
                update: () => generateAnimation(opt_guide),
              }}
            />
          );
        })}
        <LineGuide
          records={[
            { genre: 'min', sold: '150' },
            { genre: 'max', sold: '150' },
          ]}
          style={{ stroke: 'green' }}
          animation={{
            update: {
              duration: 1000,
            },
          }}
        />
      </Chart>
    </Timeline>
  </Canvas>
);

const chart = new Canvas(props);
chart.render();
