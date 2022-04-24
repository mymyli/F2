import { jsx } from '../../../jsx';
import { deepMix } from '@antv/util';
import { Style } from '../../../types';
import { getAnimationCycleOfJSXElement } from '../../../util/storytelling/animationCfg';

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
  const { records } = props;
  const item = records[0];

  const parsedAnimation = getAnimationCycleOfJSXElement(animation, item);
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
        parsedAnimation
      )}
    />
  );
};
