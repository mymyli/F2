import { deepMix, isFunction } from '@antv/util';
import { jsx } from '../../../jsx';
import { deepClone } from '../../../util/storytelling/util';
import { getAnimationCfg } from '../../../util/storytelling/animationCfg';

export default (props) => {
  const { records, animation } = props;
  return (
    <group>
      {records.map((record) => {
        const { key, children } = record;
        return (
          <group key={key}>
            {children.map((item) => {
              const { key, xMin, xMax, yMin, yMax, color, shape } = item;

              //#region 处理接收的animation
              let thisAnimation = {};
              if (animation) {
                thisAnimation = deepClone(animation);
                Object.keys(animation).map((cycle) => {
                  let cycleCfg = thisAnimation[cycle];
                  thisAnimation[cycle] = getAnimationCfg(cycleCfg, item);
                });
              }
              //#endregion

              return (
                <rect
                  key={key}
                  attrs={{
                    x: xMin,
                    y: yMin,
                    width: xMax - xMin,
                    height: yMax - yMin,
                    fill: color,
                    ...shape,
                  }}
                  animation={deepMix(
                    {
                      appear: {
                        easing: 'linear',
                        duration: 450,
                        property: ['y', 'height'],
                        start: {
                          y: yMax,
                          height: 0,
                        },
                      },
                      update: {
                        easing: 'linear',
                        duration: 450,
                        property: ['x', 'y', 'width', 'height'],
                      },
                    },
                    thisAnimation
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
