import { getDestructArgs } from './getDestructArgs.js';
import { intersection } from './intersection.js';
const initialized = new WeakMap();
const queueMap = new WeakMap();
const deconstructedUpdateArgs = new WeakMap();
export async function addToRenderQueue(config, prop) {
    let queue = undefined;
    if (!queueMap.has(config)) {
        queue = new Set();
        queueMap.set(config, queue);
    }
    else {
        queue = queueMap.get(config);
    }
    queue.add(prop.name);
    await transRender(config);
}
async function transRender(config) {
    if (config.notReadyForInitView)
        return;
    if (!queueMap.has(config)) {
        return;
    }
    const queue = queueMap.get(config);
    queueMap.set(config, new Set());
    if (!initialized.has(config)) {
        if (!config.root) {
            if (config.noShadow) {
                config.root = config.self;
            }
            else {
                config.root = config.self.attachShadow({ mode: 'open' });
            }
        }
        const mode = {};
        if (typeof config.initTransform === 'function') {
            mode.initArgs = new Set(getDestructArgs(config.initTransform));
        }
        if (config.updateTransforms !== undefined) {
            for (const selectiveUpdate of config.updateTransforms) {
                deconstructedUpdateArgs.set(selectiveUpdate, new Set(getDestructArgs(selectiveUpdate)));
            }
        }
        initialized.set(config, {});
    }
    const mode = initialized.get(config);
    let evaluateAllUpdateTransforms = false;
    if (config.updateTransforms === undefined) {
        //Since there's no delicate update transform,
        //assumption is that if data changes, just redraw based on init
        config.root.innerHTML = '';
    }
    else {
        if (mode.initArgs !== undefined && intersection(queue, mode.initArgs).size > 0) {
            //we need to restart the ui initialization, since the initialization depended on some properties that have since changed.
            //reset the UI
            config.root.innerHTML = '';
            delete config.renderContext;
            evaluateAllUpdateTransforms = true;
        }
    }
    let rc = config.renderContext;
    let target;
    let isFirst = true;
    if (rc === undefined) {
        //this.dataset.upgraded = 'true';
        mode.initRCIP = true;
        rc = this._renderContext = await this.initRenderContext();
        rc.options = {
            initializedCallback: this.afterInitRenderCallback.bind(this),
        };
        target = this[this._mainTemplateProp].content.cloneNode(true);
        await transform(target, rc);
        delete rc.options.initializedCallback;
        this.__initRCIP = false;
    }
    else {
        target = this.root;
        isFirst = false;
    }
}
