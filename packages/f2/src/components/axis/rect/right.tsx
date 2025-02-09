import { jsx } from '../../../jsx';
import { RectProps } from '../types';

export default (props: RectProps) => {
  const { ticks, coord, style } = props;
  const { top, right, bottom } = coord;
  const { grid, tickLine, line, labelOffset, label } = style;

  return (
    <group>
      {grid
        ? ticks.map((tick) => {
            const { points, gridStyle } = tick;
            const start = points[0];
            const end = points[points.length - 1];
            return (
              <line
                attrs={{
                  x1: start.x,
                  y1: start.y,
                  x2: end.x,
                  y2: end.y,
                  ...grid,
                  ...gridStyle,
                }}
              />
            );
          })
        : null}
      {tickLine && tickLine.length
        ? ticks.map((tick) => {
            const { points } = tick;
            const end = points[points.length - 1];
            return (
              <line
                attrs={{
                  x1: end.x,
                  y1: end.y,
                  x2: end.x + tickLine.length,
                  y2: end.y,
                  ...tickLine,
                }}
              />
            );
          })
        : null}
      {line ? (
        <line
          attrs={{
            x1: right,
            y1: top,
            x2: right,
            y2: bottom,
            ...line,
          }}
        />
      ) : null}
      {label
        ? ticks.map((tick, _index) => {
            const { points, text, labelStyle } = tick;
            const end = points[points.length - 1];
            return (
              <text
                attrs={{
                  x: end.x + labelOffset,
                  y: end.y,
                  textAlign: 'left',
                  textBaseline: 'middle',
                  text,
                  ...label,
                  ...labelStyle,
                }}
              />
            );
          })
        : null}
    </group>
  );
};
