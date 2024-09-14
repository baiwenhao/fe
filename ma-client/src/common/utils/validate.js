/**
 * 验证方法
 */

/**
 * @param {string} path path to test
 * @returns {Boolean} result
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}
