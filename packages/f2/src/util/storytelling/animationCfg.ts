import { isArray, isFunction, isNumber, isString } from '@antv/util';
import timeFunctions from './timeFunctions';
import { deepClone } from './util';

//#region types
type FieldOpt = {
  field: string;
  start?: any;
  base?: number;
  unit?: number;
  f?: Function;
};
type FieldsOpt = FieldOpt[];

type TimeCfg = {
  field: string;
  times: { [k: string]: number };
};
type TimeCfgArray = TimeCfg[];
//#endregion

function registerTimeFunction(key: string, f: Function) {
  if (timeFunctions[key]) {
    throw new Error(`${key} already exists, try another name`);
  }
  timeFunctions[key] = f;
}

// 计算时间
function _getTimesOfField(data: any[], xField, fieldOpt: FieldOpt) {
  const { field, start, base, unit, f } = fieldOpt;

  let isX = false;
  isX = field === xField;

  let timeFunc: Function = timeFunctions['order'];
  if (typeof f === 'string') {
    timeFunc = timeFunctions[f];
  } else if (isFunction(f)) {
    timeFunc = f;
  }

  return timeFunc(data, field, isX, start, base, unit);
}

// 得到某个需要排序字段的差异化动画配置
function _assembleCfgOfField(data, xField, fieldOpt) {
  const { field } = fieldOpt;
  const times = _getTimesOfField(data, xField, fieldOpt);
  return {
    field,
    times,
  };
}

// 得到所有需要排序的字段得到差异化动画配置
function _assembleCfgOfAllFields(data, xField, fieldsOpt: FieldsOpt): TimeCfgArray {
  let cfgs = [];
  fieldsOpt.forEach((fieldOpt) => {
    cfgs.push(_assembleCfgOfField(data, xField, fieldOpt));
  });
  return cfgs;
}

// 根据用户设置得到动画配置
function assembleAnimationCfg(data, xField, animationOpt) {
  if (!data || !data.length) throw new Error('"data" required when process user option');
  if (!xField) throw new Error('"xField" required by time configuration but get null');

  const animationCfg = deepClone(animationOpt);
  Object.keys(animationOpt).map((step) => {
    const stepOpt = animationOpt[step];
    if (isArray(stepOpt)) {
      if (step === 'delay' || step === 'duration') {
        animationCfg[step] = _assembleCfgOfAllFields(data, xField, stepOpt);
      }
    } else if (!isString(stepOpt) && !isNumber(stepOpt)) {
      throw new Error('Only String/Number/Array supported by time options');
    }
  });

  return animationCfg;
}

// 作为入口api接收用户设置并进行处理
function processUserOpt(userOpt) {
  return () => {
    return (originData, xField) => {
      return assembleAnimationCfg(originData, xField, userOpt);
    };
  };
}

// 解析得到时间配置
function _getTimeOfItem(cfgs, item) {
  let time = 0;

  if (typeof cfgs === 'number') {
    time = cfgs;
    return time;
  }

  cfgs.forEach((cfg) => {
    const { field, times } = cfg;
    let key;
    if (typeof item === 'string') {
      key = item;
    } else {
      const { origin } = item;
      if (origin) {
        key = origin[field];
      } else {
        key = field;
      }
    }
    time += times[key];
  });
  return time;
}

// 解析得到某一类型的动画配置
function _parseCfg(animationCfg, item) {
  const cfgOfItem = deepClone(animationCfg);

  //@ts-ignore
  const { delay: uDelayCfg, duration: uDurationCfg } = cfgOfItem;
  if (uDelayCfg) {
    cfgOfItem['delay'] = _getTimeOfItem(uDelayCfg, item);
  }
  if (uDurationCfg) {
    cfgOfItem['duration'] = _getTimeOfItem(uDurationCfg, item);
  }

  return cfgOfItem;
}

// 解析得到图形元素自身的完整动画配置
function parseAnimationCfg(animation, item) {
  let thisAnimation = {};
  if (animation) {
    thisAnimation = deepClone(animation);
    Object.keys(animation).map((cycle) => {
      let cycleCfg = animation[cycle];
      thisAnimation[cycle] = _parseCfg(cycleCfg, item);
    });
  }
  return thisAnimation;
}

export { registerTimeFunction, processUserOpt, assembleAnimationCfg, parseAnimationCfg };
