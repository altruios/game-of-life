class BinaryCounter{
    constructor(value,speed,direction){
        

        if(!value){
            this.BINARY=[0,0,0,0,0,0,0,0]//we initialize to that size. 8-bit?
        }
        this.padSize=8;
        this.value = value;
        this.value = Math.floor(this.value);
        this.BINARY=this.getBinary();
        this.counter= null;
        this.setCounterSpeedAndDir(speed,direction)
    }
    /**
     * gets the binary array from value;
     */
    getBinary(){
        return this.PAD(Array.from(this.value.toString(2)).reverse().map(x=>Number(x)),this.padSize);
    }
    /**
     * @param  {number} array
     * @param  {number} padSize
     */
    PAD(array, padSize){
        while(array.length<padSize){
            array.push(0);
        }
        return array;
    }
    countUP(){
        this.add(1);
    }
    countDOWN(){
        this.subtract(1);
    }
    /**
     * @param  {number} value
     */
    add(value){
        this.Calculator(this._add, value);
    }
    _add(a,b){
        return a+b;
    }
    Calculator(fun, value){
        let safe=false;
        if(value==NaN||value==undefined||value==null){
            value = Number(value);
            if(value ==NaN||value==undefined||value==null){
                console.error("could not add");
            }else{
                safe=true;
            }
        }else{
            safe=true;
        }
        if(safe){
            this.value = fun(this.value, value);
            this.value = Math.floor(this.value);
            this.BINARY=this.getBinary();
        }else{
            return false
        }
    }
    subtract(value){
        this.Calculator(this._substract,value)
    }
    _substract(a,b){
        a-b<0?console.error("can not subtract less than zero"):null;
        return a-b<0? 0:a-b;
    }
    multiply(value){
        this.Calculator(this._multiply,value);
    }
    _multiply(a,b){
        return a*b;
    }
    divid(value){
        this.Calculator(this._divide,value);
    }
    _divide(a,b){return a/b;}

    read(number){
        return number?this.BINARY[number]:this.BINARY;
    }
    set(value){
        if(value==NaN|| value==undefined){
            return; 
        }
        this.value=Math.floor(this.value);
        this.BINARY=this.getBinary();
    }
    setCounterSpeedAndDir(time,dir){
        if(time==null||dir==null){
            return null;
        }
        const that = this;
        this.counter = window.setInterval(function(){
            dir?dir=="up"?that.countUP():that.countDOWN():that.countUP();
            console.log(that.BINARY, that.value,"yay", "dir=>",dir);
            if(that.value==0&& dir=="down"){
                that.clear()
            }
    },time)
    }
    start(speed,dir){
        this.setCounterSpeedAndDir(speed,dir);
    }
    clear(){
        this.BINARY= this.BINARY.map(x=>0);
        this.value=0;
        window.clearInterval(this.counter);
    }
}


