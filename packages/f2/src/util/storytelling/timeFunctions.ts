import { deepMix, sortBy } from '@antv/util';
import { init, getFieldValues } from './util';

// 根据数据在排序字段的值的顺序计算时间
function getTimesByOrderOfValues_Linear(
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

// 根据数据在排序字段的值计算时间
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

const functions = {
  order: getTimesByOrderOfValues_Linear,
  value: getTimesByValues,
};

export default functions;
