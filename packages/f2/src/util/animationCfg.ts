import { valuesOfKey, sortBy, isArray, pick, deepMix } from '@antv/util';

//#region types
type fieldOpt = {
  field: string;
  start?: any;
  base?: number;
  unit?: number;
};
type fieldsOpt = {
  xField: any;
  fields: fieldOpt[];
};

type TimeCfg = {
  field: string;
  times: { [k: string]: number };
};
type TimeCfgArray = TimeCfg[];
//#endregion

//#region 解析用户配置
function getFieldValues(data: any[], field: string) {
  return valuesOfKey(data, field);
}

function pickAttrs(element, attrNames: string[]) {
  if (!isArray(element)) {
    return pick(element, attrNames);
  }

  let origin = [];
  element.forEach((e, i) => {
    origin.push(pick(e, attrNames));
  });
  return origin;
}

// TODO 后续实现不同的插值计算方法
function interpolateTimes() {}
function getTimesByField(
  data: any[],
  field: string,
  isX: boolean,
  start?: any,
  base?: number,
  unit?: number
) {
  let times = {};

  let _unit = 0; // 默认间隔
  if (unit) _unit = unit;
  let _base = 0; // 默认起始
  if (base) _base = base;

  let fieldValues = [];
  let startIndex = 0;

  if (isX) {
    fieldValues = getFieldValues(data, field);
  } else {
    let _data = deepMix([], data); // 直接sortBy会改变原数据，导致图形位置变化
    const sortedData = sortBy(_data, field);
    fieldValues = getFieldValues(sortedData, field);
  }

  if (start) {
    startIndex = fieldValues.indexOf(start);
    if (startIndex < 0) {
      throw new Error('"start" value not found');
    }
  }

  for (let i = 0, len = fieldValues.length; i < len; i++) {
    const value = fieldValues[i];
    times[value] = Math.abs((i - startIndex) * unit) + _base;
  }
  return times;
}

function getTimes(data: any[], xField, fieldOpt: fieldOpt) {
  let isX = false;
  const { field, start, base, unit } = fieldOpt;
  isX = field === xField;
  return getTimesByField(data, field, isX, start, base, unit);
}

// userOpt = {xField:"", fields:[{},{}]}
function getCfgArray(data, xField, fields: fieldOpt[]): TimeCfgArray {
  let cfgArray = [];
  for (let i = 0, len = fields.length; i < len; i++) {
    const f = fields[i];
    const { field } = f;
    const times = getTimes(data, xField, f);
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
 * @param userOpt 用户设置
 */
export function processUserOpt(data: any[], userOpt: number | fieldsOpt): number | TimeCfgArray {
  if (!data || !data.length) {
    throw new Error('"data" required when process user option');
  }

  if (typeof userOpt === 'number') {
    return userOpt;
  }

  const { xField, fields } = userOpt;
  if (!xField) throw new Error('"xField" required by time configuration but get null');
  if (!fields) throw new Error('"fields" required by time configuration but get null');
  if (fields && !isArray(fields)) throw new Error('"fields" must be Array');

  return getCfgArray(data, xField, fields);
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
 * @param item 固定参数，无需手动传入
 * @returns
 */
export function processAnimationTypeCfg(animationCfg, item) {
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
