import { jsx } from '../../../jsx';
import { deepMix, isFunction } from '@antv/util';

export default (props) => {
  const { coord, records, animation } = props;
  const { center, startAngle, endAngle, radius } = coord;
  return (
    <group>
      {records.map((record) => {
        const { key, children } = record;
        return (
          <group key={key}>
            {children.map((item) => {
              const { key, xMin, xMax, yMin, yMax, color, shape } = item;

              //#region 处理接收的animation
              let _thisAnimation = {};
              if (animation) {
                Object.keys(animation).map((animationType) => {
                  let _animationCfg = animation[animationType];
                  // 如果动画配置为函数，则执行该函数获取配置对象
                  if (isFunction(_animationCfg)) {
                    _animationCfg = _animationCfg(item);
                  }
                  _thisAnimation[animationType] = _animationCfg;
                });
              }
              //#endregion

              return (
                <sector
                  key={key}
                  attrs={{
                    x: center.x,
                    y: center.y,
                    fill: color,
                    startAngle: xMin,
                    endAngle: xMax,
                    r0: yMin,
                    r: yMax,
                    ...shape,
                  }}
                  animation={deepMix(
                    {
                      update: {
                        easing: 'linear',
                        duration: 450,
                        property: ['x', 'y', 'startAngle', 'endAngle', 'r0', 'r'],
                      },
                    },
                    _thisAnimation
                  )}
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
};
