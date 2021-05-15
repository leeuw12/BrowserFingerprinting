let submit_message = function () {
    parametrs.useragent = navigator.userAgent
    parametrs.browserType = browserType()
    parametrs.plugins = pluginsGet()
    parametrs.mimeTypes = mimeTypesGet()
    parametrs.platform = navigator.platform
    parametrs.hardwareConcurrency = navigator.hardwareConcurrency
    parametrs.language = navigator.language
    parametrs.deviceMemory = checkMe(navigator.deviceMemory, 'deviceMemory')
    parametrs.languagesSet = languagesSet()
    parametrs.timezone = getTimezoneOffset()
    parametrs.connectedDevices = getConnectedDevices()
    parametrs.cookie = checkMe(navigator.cookieEnabled, 'cookieEnabled')
    parametrs.donottrack = checkMe(Navigator.doNotTrack, 'doNotTrack')
    parametrs.javaEnable = navigator.javaEnabled()
    parametrs.countproperties = countProperties()
    parametrs.propertiesValues = propertiesValues()
    parametrs.screenWidth = window.screen.width
    parametrs.screenHeight = window.screen.height
    parametrs.screenColorDepth = window.screen.colorDepth
    parametrs.fonts = getFonts()
    parametrs.canvas_test = canvasGet()
    parametrs.unmaskedInfoWebGL = getUnmaskedInfoWebGL()
    parametrs.webGLgetInfo = webGLgetInfo()


    fetch(`${window.origin}/foo`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(parametrs),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    }).then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
            // console.log(data);
        });
    }).catch(function (error) {
        console.log("Fetch error: " + error);
    });


    document.getElementById('fingerprint').innerHTML = fingerprint_browser(parametrs);
}

let fingerprint_browser = function (myMap) {
    let array = []
    for (const [key, value] of Object.entries(myMap)) {
        array.push(value.toString())
    }
    return murmurhash3_32_gc(array.join('###'), 31);
}


let murmurhash3_32_gc = function (key, seed) {
    var remainder, bytes, h1, h1b, c1, c2, k1, i;
    remainder = key.length & 3;
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;
    while (i < bytes) {
        k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;
        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }
    k1 = 0;
    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }
    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;
    return h1 >>> 0;
}