import { ReslvSvc } from '../trans-render/froop/ReslvSvc.js';
import { mse } from '../trans-render/froop/const.js';
export class NotifySvc extends ReslvSvc {
    args;
    constructor(args) {
        super();
        this.args = args;
        args.main.addEventListener(mse, () => {
            this.#do(args);
        }, { once: true });
    }
    async #do(args) {
    }
}
