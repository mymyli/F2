import { valuesOfKey, isArray, pick } from '@antv/util';

function deepClone(obj) {
  var objClone = Array.isArray(obj) ? [] : {};

  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }

  return objClone;
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

function getFieldValues(data: any[], field: string) {
  return valuesOfKey(data, field);
}

function init(unit, base) {
  return {
    times: {},
    _unit: unit ? unit : 0,
    _base: base ? base : 0,
    fieldValues: [],
    startIndex: 0,
  };
}

export { deepClone, getFieldValues, init, pickAttrs };
