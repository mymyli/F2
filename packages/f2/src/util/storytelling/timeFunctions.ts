import { valuesOfKey, deepMix, sortBy, pick } from '@antv/util';
import { deepClone } from './util';

//#region util
const defaultUnit = 0;
const defaultBase = 0;

function getFieldValues(data: any[], field: string) {
  return valuesOfKey(data, field);
}

function pickAttrs(element, attrNames: string[]) {
  if (!Array.isArray(element)) {
    return pick(element, attrNames);
  }

  let origin = [];
  element.forEach((e, i) => {
    origin.push(pick(e, attrNames));
  });
  return origin;
}

function init(unit, base) {
  return {
    times: {},
    _unit: unit ? unit : defaultUnit,
    _base: base ? base : defaultBase,
    fieldValues: [],
    startIndex: 0,
  };
}
//#endregion

//#region time functions
/**
 * 对数据在指定字段的值排序，据此顺序决定数据的时间配置，时间配置成等差数列
 * @param data 原数据集
 * @param field 作为排序依据的字段
 * @param isX 排序字段是否为x轴字段
 * @param start 排序起始值
 * @param base 时间起始值
 * @param unit 时间差
 * @returns
 */
function getTimesByOrderOfValues(
  data: any[],
  field: string,
  isX: boolean,
  start?: any,
  base?: number,
  unit?: number
) {
  let { times, _unit, _base, fieldValues, startIndex } = init(unit, base);

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
    times[value] = Math.abs((i - startIndex) * _unit) + _base;
  }
  return times;
}

/**
 * 根据数据在指定字段的值获取时间配置
 * @param data
 * @param field
 * @param isX
 * @param start
 * @param base
 * @param unit
 * @returns
 */
function getTimesByValues(
  data: any[],
  field: string,
  isX: boolean,
  start?: any,
  base?: number,
  unit?: number
) {
  let { times, _unit, _base, fieldValues } = init(unit, base);

  fieldValues = getFieldValues(data, field);
  for (let i = 0, len = fieldValues.length; i < len; i++) {
    const value = fieldValues[i];
    times[value] = value * _unit + _base;
  }
  return times;
}
//#endregion

const functions = {
  order: getTimesByOrderOfValues,
  value: getTimesByValues,
};

export default functions;
