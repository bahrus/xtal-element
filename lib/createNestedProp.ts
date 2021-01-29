export function createNestedProp(target: any, pathTokens: string[], val: any, clone: boolean){
    const firstToken = pathTokens.shift() as string;
    const tft = target[firstToken];
    const returnObj =  {[firstToken]: tft ? tft : {}};
    let tc = returnObj[firstToken]; //targetContext
    const lastToken = pathTokens.pop() as string;
    pathTokens.forEach(token =>{
            let newContext = tc[token];
            if(!newContext){
                newContext = tc[token] = {};
            }
            tc = newContext;
    });
    if(tc[lastToken] && typeof(val) === 'object'){
        Object.assign(tc[lastToken], val);
    } else{
        if(lastToken===undefined){
            returnObj[firstToken] = val;
        }else{
            tc[lastToken] = val;
        }
    }
    //this controversial line is to force the target to see new properties, even though we are updating nested properties.
    //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 
    if(clone) try{Object.assign(target, returnObj)}catch(e){};
}