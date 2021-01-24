export interface IDynamicJSLoadStep {
    src: string;
} 
export function downloadJSFilesInParallelButLoadInSequence(refs: IDynamicJSLoadStep[]) {
    //see https://www.html5rocks.com/en/tutorials/speed/script-loading/
    return new Promise((resolve, reject) => {
        const notLoadedYet: { [key: string]: boolean } = {};
        const nonNullRefs = refs.filter(ref => ref !== null);
        nonNullRefs.forEach(ref => {
            notLoadedYet[ref.src] = true;
        });
        nonNullRefs.forEach(ref => {
            const script = document.createElement('script');
            script.src = ref.src;
            script.async = false;
            script.onload = () => {
                //delete notLoadedYet[script.src];
                Object.keys(notLoadedYet).forEach(key => {
                    if (script.src.endsWith(key)) {
                        delete notLoadedYet[key];
                        return;
                    }
                })
                if (Object.keys(notLoadedYet).length === 0) {
                    resolve();
                }
            }
            document.head!.appendChild(script);
        });
    })

}