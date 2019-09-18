import md5 from 'js-md5'
import sha1 from 'sha1'

function _getRandomString(len) {
    len = len || 32
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    const maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

export default function getSign() {
    const timestamp = parseInt(Date.parse(new Date()) / 1000)
    const rand_str = _getRandomString(10)
    const arr = `${timestamp + rand_str}LOVESHEN`
    const sha = sha1(arr)
    const token = md5(sha)
    const signature = token.toUpperCase()
    return [timestamp, rand_str, signature]
}

