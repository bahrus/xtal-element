const sym = Symbol('hi');

class Test{
    [sym] = 'hello';
}

const test = new Test();
console.log(test[sym]);

const arrow = ({[sym]}) => {
    console.log([sym]);
}

arrow(test);