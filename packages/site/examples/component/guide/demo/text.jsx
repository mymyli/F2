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

const duration = 1000;
const delay_interval = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'sold', unit: 500 }],
});

const delay_guide = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'sold', unit: 500, base: 0 }],
});

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
              return processAnimationTypeCfg(
                {
                  delay: delay_interval,
                  duration,
                  easing: 'linear',
                },
                item
              );
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
                  return processAnimationTypeCfg(
                    {
                      delay: delay_guide,
                      duration,
                      property: ['fillOpacity', ['text', 0], 'y'],
                      start: {
                        fillOpacity: 0,
                        text: 0,
                        y: 255,
                      },
                      end: {
                        fillOpacity: 1,
                        text: sold,
                      },
                    },
                    item
                  );
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
