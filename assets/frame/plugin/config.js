/**
 * @author SungKT
 * @data 2020/8/12
 * @param {*} isRelease 是否启用正式域名
 * 
 * 本脚本为插件脚本，用于切换使用的网络地址
 * 使用方法:点击该脚本，在属性检查器里勾选导入插件，允许平台全选（或者根据需求勾选）
 * 打包后该文件不会混淆，可以只修改setUrl方法的参数，既可以切换
 * window声明方式在creator.d.ts中声明
 */

//  /****声明window */
// interface Window {
// 	dd_httpUrl: string,
// 	dd_webSocketUrl: string,
// 	dd_token: string,
// 	dd_isDebug: boolean,
// }

/**
 * 切换正式服与测试服域名
 * @param {*} isRelease true正式服 false测试服 
 */
function setUrl(isRelease = true) {
    if (isRelease) { //正式服
        window.dd_httpUrl = "http://www.bjhyldkj.cn";
        window.dd_webSocketUrl = "ws://123.56.163.35:9502";
        window.dd_token = "3b9e6547d8fede05f32a56eb10bd1c15";
        window.dd_isDebug = false;
    } else {
        window.dd_httpUrl = "http://duoduoshijie.vmall99.com";
        window.dd_webSocketUrl = "ws://114.215.43.99:9503";
        window.dd_token = "123456";
        window.dd_isDebug = false; //true 用于屏蔽类似新手引导等
    }
}

setUrl(false);

