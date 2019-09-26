/**
 * Created by WYX
 * Time 2019/8/14
 */

function padLeftZero(str) {
    return (`00${str}`).substr(str.length)
}

/**
   * 日期过滤
   * @param {日期} date
   * @param {*日期格式} fmt
   */
export function formatdate(date, fmt) {
    if (!date) {
        return ''
    }
    date = new Date(date)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const str = `${o[ k ]}`
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

/**
   * 内容长度过滤器
   * @param {字符串} str
   * @param {*参数} param
   */
export function ContentLimit(str, param) {
    if (str === null) {
        return ' '
    }
    return str.length > param ? `${str.substring(0, param)}...` : str
}

/**
   * [FileSize description]获得文件大小
   * @param  {[num]} size [description]文件原始大小（单位是字）
   * @return {[num]}      [description]文件返回大小（单位是兆）
   */
export function formaFileSize(size) {
    if (!size) {
        return 0
    }
    return `${Math.ceil(parseInt(size) / 1024 / 1024)}M`
}

/**
   * @description: 过滤满足条件的数组
   * @param {array} array 数组
   * @param {string} key 键
   * @param {type} value 值：类型不定
   * @return: array
   */
export function filterBy(array, key, value) {
    const result = []
    array.forEach((item) => {
        if (item[ key ] === value || (key === '' && item === value)) {
            result.push(item)
        }
    })
    return result
}

/**
 * @description: 过滤图片类型
 * @param index
 * @returns {void | string|string}
 */
export function picTypeFilter(index) {
    const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    index = index.replace(/\//g, '')
    if (reg.test(index)) {
        return `用户${index}`
    }
    switch (index) {
        case 'typeList':
            return '类型图片'
        case 'new':
            return '测试图片'
        default:
            return index
    }
}
