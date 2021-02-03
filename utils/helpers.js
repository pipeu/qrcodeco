/* eslint-disable indent */
export function loadScript (url) {
    return new Promise((resolve, reject) => {
        var head = document.head || document.getElementsByTagName('head')[0]
        const script = document.createElement('script')
        script.async = true
        script.src = url
        script.charset = 'utf8'

        head.appendChild(script)

        script.onload = resolve
        script.onerror = reject
    })
}
