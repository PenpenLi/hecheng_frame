export class loader_mgr {
    private static instance: loader_mgr;

    static ins() {
        if (!this.instance) {
            this.instance = new loader_mgr();
        }
        return this.instance;
    }

    /**从远程url下载资源 */
    public loadExternalAsset(url: string, type?: string) {
        const res = cc.loader.getRes(url);
        if (res) {
            console.log("loadExternalAsset from cache");
            return res;
        }
        return new Promise((resolve, reject) => {
            cc.loader.load(type ? { url, type } : url, (err, res: cc.Texture2D) => {
                if (err) {
                    cc.warn("loadExternalAsset error", url);
                    resolve(null);
                    return;
                }
                resolve(res);
            })
        })
    }

    /**从resources目录加载asset，asset是指cc.SpriteFrame, cc.AnimationClip, cc.Prefab*/
    public async  loadAsset(url: string, type: typeof cc.Asset) {
        if (!url || !type) {
            console.error("参数错误", url, type);
            return;
        }
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(url, type, (err, asset) => {
                if (err) {
                    cc.log(`[资源加载] 错误 ${err}`);
                    resolve(null);
                    return;
                }
                resolve(asset);
            })
        })
    }

    /**加载鸟的名字 */
    public async loadName(url: string) {
        if (!url) {
            console.error("参数错误", url);
            return;
        }
        return await new Promise((resolve, reject) => {
            cc.loader.loadRes(url, function (err, jsonAsset) {
                if (err) {
                    cc.log(`[资源加载] 错误 ${err}`);
                    resolve(null);
                    return;
                }
                resolve(jsonAsset.json);
            });
        })

    }
}