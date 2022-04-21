import { isArray, isFunction } from '@antv/util';
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
type CycleOpt = {
  [k: string]: any;
};

type TimeCfg = {
  field: string;
  times: { [k: string]: number };
};
type TimeCfgArray = TimeCfg[];
//#endregion

//#region util
export function registerTimeFunc(key: string, f: Function) {
  if (timeFunctions[key]) {
    throw new Error(`${key} already exists, try another name`);
  }
  timeFunctions[key] = f;
}
//#endregion

//#region 解析用户配置
function getTimes(data: any[], xField, fieldOpt: FieldOpt) {
  const { field, start, base, unit, f } = fieldOpt;

  let isX = false;
  isX = field === xField;

  let F: Function = timeFunctions['order'];
  if (typeof f === 'string') {
    F = timeFunctions[f];
  } else if (isFunction(f)) {
    F = f;
  }

  return F(data, field, isX, start, base, unit);
}

// userOpt = {xField:"", fields:[{field:"",start:,unit:,base:,f:},{}]}
function getCfgArray(data, xField, fields: FieldsOpt): TimeCfgArray {
  let cfgArray = [];
  for (let i = 0, len = fields.length; i < len; i++) {
    const fieldOpt = fields[i];
    const { field } = fieldOpt;
    const times = getTimes(data, xField, fieldOpt);
    cfgArray.push({
      field,
      times,
    });
  }
  return cfgArray;
}

/**
 * 根据原始数据集和用户time设置计算得到times配置
 * @param data 原始数据集
 * @param xField 作为x轴的字段
 * @param userOpt 用户设置
 */
export function processOpt(data: any[], xField, cycleOpt: CycleOpt) {
  if (!data || !data.length) {
    throw new Error('"data" required when process user option');
  }

  if (!xField) throw new Error('"xField" required by time configuration but get null');

  const _cycleOpt = deepClone(cycleOpt);
  Object.keys(_cycleOpt).map((step) => {
    const stepOpt = _cycleOpt[step]; // StepOpt
    if (isArray(stepOpt)) {
      _cycleOpt[step] = getCfgArray(data, xField, stepOpt);
    } else if (typeof stepOpt === 'string' || 'number') {
    } else {
      throw new Error('Only String/Number/Array supported by time options');
    }
  });

  return _cycleOpt;
}
//#endregion

//#region 读取配置
function parseCfg(cfgs, item) {
  if (typeof cfgs === 'number') {
    return cfgs;
  } else {
    let time = 0;
    // cfg=[{field:'',delays:{}},...]
    for (let i = 0, len = cfgs.length; i < len; i++) {
      const cfg = cfgs[i];
      const { field, times } = cfg;
      if (typeof item === 'string') {
        time += times[item];
      } else {
        const { origin } = item;
        if (origin) {
          time += times[origin[field]];
        } else {
          time += times[item[field]];
        }
      }
    }
    return time;
  }
}

/**
 * 根据times配置，在动画执行前获取图形元素各自的动画配置
 * @param animationCfg times配置
 * @param item 图形元素对应的数据
 * @returns
 */
export function getAnimationCfg(animationCfg, item) {
  let typeCfg = {};
  typeCfg = animationCfg;

  const { delay: uDelayCfg, duration: uDurationCfg, easing } = animationCfg;

  // delay处理
  if (uDelayCfg) {
    typeCfg['delay'] = parseCfg(uDelayCfg, item);
  }

  // duration处理
  if (uDurationCfg) {
    typeCfg['duration'] = parseCfg(uDurationCfg, item);
  }

  // easing处理
  if (easing) {
    typeCfg['easing'] = easing;
  }
  return typeCfg;
}
//#endregion
