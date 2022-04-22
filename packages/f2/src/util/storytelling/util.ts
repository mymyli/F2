import { valuesOfKey, isArray, pick } from '@antv/util';

//使用递归的方式实现数组、对象的深拷贝
export function deepClone(obj) {
  //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
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

export function pickAttrs(element, attrNames: string[]) {
  if (!isArray(element)) {
    return pick(element, attrNames);
  }

  let origin = [];
  element.forEach((e, i) => {
    origin.push(pick(e, attrNames));
  });
  return origin;
}

export function getFieldValues(data: any[], field: string) {
  return valuesOfKey(data, field);
}

export function init(unit, base) {
  return {
    times: {},
    _unit: unit ? unit : 0,
    _base: base ? base : 0,
    fieldValues: [],
    startIndex: 0,
  };
}
