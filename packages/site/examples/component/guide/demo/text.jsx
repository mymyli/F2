/** @jsx jsx */
import { jsx, Canvas, Chart, Interval, TextGuide } from '@antv/f2';

const context = document.getElementById('container').getContext('2d');

const data = [
  { genre: 'Sports', sold: 275, type: 'a' },
  { genre: 'Strategy', sold: 115, type: 'a' },
  { genre: 'Action', sold: 120, type: 'a' },
  { genre: 'Shooter', sold: 350, type: 'a' },
  { genre: 'Other', sold: 150, type: 'a' },
];

const delay = processUserOpt(data, {
  xField: 'genre',
  fields: [{ field: 'genre', unit: 500 }],
});

const { props } = (
  <Canvas context={context} pixelRatio={window.devicePixelRatio}>
    <Chart data={data}>
      <Interval
        x="genre"
        y="sold"
        animation={{
          appear: (item) => {
            return processAnimationTypeCfg({ delay }, item);
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
            offsetY={-20}
            offsetX={-15}
            animation={{
              update: (item) => {
                return processAnimationTypeCfg(
                  {
                    delay,
                    property: ['fillOpacity'],
                    start: {
                      fillOpacity: 0,
                    },
                    end: {
                      fillOpacity: 1,
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
  </Canvas>
);

const chart = new Canvas(props);
chart.render();
