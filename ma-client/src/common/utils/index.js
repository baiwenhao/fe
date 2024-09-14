import { and } from '@ma-dev/auth-utils';
import store from '@/common/store';
/**
 * Parse the time to string
 * @param {(Object|string|number)} time time to format
 * @param {string} cFormat format choice
 * @returns {string} time_str
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time);
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ]; }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

/**
 * @param {number} time time to format
 * @param {string} option format options
 * @returns {string} time_str
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
    // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    }
    return (
        d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    );
}

/**
 * @param {string} url url to parse
 * @returns {Object} param obj
 */
export function param2Obj(url) {
    const search = url.split('?')[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
      decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')
          .replace(/\+/g, ' ') +
      '"}'
    );
}

/**
 * wrap await
 * @param {*} promise promise to wrap
 * @returns {Promise} promise
 */
export function awaitWrap(promise) {
    return promise
        .then(data => [null, data])
        .catch(err => [err, null]);
}

/**
 * wrap await
 * @param {*} obj obj to judge
 * @returns { Boolean } result
 */
export function isEmpty(obj) {
    if (Object.keys(obj).length === 0) return true;
    return false;
}

/**
 * judge permission
 * @param {*} permission permission to judge
 * @returns { Boolean } result
 */
export function hasPermission(permission) {
    const permissions = store.getters && store.getters.permissions;
    const accessMap = window.accessMap || {};
    return and(permissions, accessMap[permission] || 0);
}

export const lock = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

export const toolMove = {
    bottom(index, array) {
        if (index === array.length - 1) return array
        array.push(array.splice(index, 1)[0])
        return array
    },
    top(index, array) {
        if (index === 0) return array
        array.unshift(array.splice(index, 1)[0])
        return array
    },
    move(list, newIndex, oldIndex) {
        list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
    }
}
