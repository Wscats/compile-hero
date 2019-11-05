const GetRequest = () => {
    //获取url中"?"符后的字串
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

const ajax = (type, url) => {
    new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(xhr.responseText)
            }
        }
        xhr.send();
    })
}

module.export = {
    GetRequest
}