import { jsx } from '../../../jsx';
import { deepMix } from '@antv/util';
import { Style } from '../../../types';

type TextGuideProps = {
  points?: { x: number; y: number }[] | null;
  content: string | number;
  style?: Style;
  offsetX?: number;
  offsetY?: number;
  theme?: any;
  records: any;
};

export default (props: TextGuideProps, context) => {
  const { theme = {} } = props;
  const { points, style, offsetX, offsetY, content, animation } = deepMix({ ...theme.text }, props);
  const { x, y } = points[0] || {};

  const offsetXNum = context.px2hd(offsetX);
  const offsetYNum = context.px2hd(offsetY);
  const posX = x + (offsetXNum || 0);
  const posY = y + (offsetYNum || 0);

  //#region time Cfg
  let _thisAnimation = {};
  const { records } = props;
  const item = records[0];

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
    <text
      attrs={{
        text: content,
        x: posX,
        y: posY,
        ...style,
      }}
      animation={deepMix(
        {
          update: {
            easing: 'linear',
            duration: 450,
            property: ['x', 'y'],
          },
        },
        _thisAnimation
      )}
    />
  );
};
