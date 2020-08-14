import { loader_mgr } from "../load/loader_mgr";
import SingletonClass from "../base/SingletonClass";

export default class musicManager extends SingletonClass {

    public static ins() {
        return super.ins() as musicManager;
    }
    /** 播放音效,不用担心会重复loadRes会消耗网络, 有缓存 */
    public async playEffectMusic(url: string, volume?: number) {
        if (!url || url.length === 0) return;
        let sound = await loader_mgr.ins().loadAsset(url, cc.AudioClip) as cc.AudioClip;
        if (volume != undefined) {
            cc.audioEngine.setEffectsVolume(volume);
        }
        cc.audioEngine.playEffect(sound, false);
    }

    /** 是否关闭声音 */
    public setmusicVolume(isclose: boolean) {
        if (isclose) {
            cc.audioEngine.setEffectsVolume(0);
        } else {
            cc.audioEngine.setEffectsVolume(1);
        }
    }
}