/** @jsx jsx */
import { jsx, Canvas, Timeline, Chart, Interval, TextGuide } from '@antv/f2';
import { processUserOpt, processAnimationTypeCfg } from '@antv/f2';

const context = document.getElementById('container').getContext('2d');

const data = [
  { genre: 'Sports', sold: 275, type: 'a' },
  { genre: 'Strategy', sold: 115, type: 'a' },
  { genre: 'Action', sold: 120, type: 'a' },
  { genre: 'Shooter', sold: 350, type: 'a' },
  { genre: 'Other', sold: 150, type: 'a' },
];

const delay_interval = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'sold', unit: 500 }],
});
const cfg_interval = {
  delay: delay_interval,
  easing: 'bounceOut',
};

const delay_guide = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'sold', unit: 500, base: 450 }],
});
const cfg_guide = {
  delay: delay_guide,
  duration: 200,
  property: ['fillOpacity'],
  start: {
    fillOpacity: 0,
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
            appear: (item) => {
              return processAnimationTypeCfg({ ...cfg_interval }, item);
            },
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
                update: (item) => {
                  return processAnimationTypeCfg({ ...cfg_guide }, item);
                },
              }}
            />
          );
        })}
      </Chart>
    </Timeline>
  </Canvas>
);

const chart = new Canvas(props);
chart.render();
