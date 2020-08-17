
setReleaseUrl = function (isRelease) {
    if (isRelease) {
        window.UrlManager = {
            WebsocketUrl: 'ws://114.215.43.99:9501',
            HttpUrl: 'http://mihecheng.teamone.wang',
            GameType: 'OFFICIAL',//TEST:测试服   OFFICIAL：正式服
            // WebsocketUrl: 'ws://114.215.43.99:9506',
            // HttpUrl: 'http://mihecheng.vmall99.com',
            // GameType: 'TEST',//TEST:测试服   OFFICIAL：正式服
        }
    } else {
        window.UrlManager = {
            WebsocketUrl: 'ws://114.215.43.99:9506',
            HttpUrl: 'http://mihecheng.vmall99.com',
            GameType: 'TEST',//TEST:测试服   OFFICIAL：正式服
        }
    }
}

setReleaseUrl(false)


