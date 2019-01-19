abstract class XtalElement<Model>{
    abstract async init(element: this) : Promise<Model>;

    _value!: Model;
    get value(){
        return this._value;
    }

}