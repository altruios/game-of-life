class Board{
    constructor(height,width){
        this.heigh=height;
        this.width=width;
        this.food= new EditableList("food",50, 10,30,this);
        this.poison= new EditableList("Poison",50,10,30,this);
        this.agentList= new AgentList(40,"agents",canvas.width,canvas.height,this);
    }
    update()
        {
        this.agentList.update();
    }
}

class AgentList{
    constructor(size,type,x,y,ref){
        this.parent=ref;
        this.type=type
        this.list= new Array(size).fill(Agent({x:randomInt(0,x),y:randomInt(0,y)},this.parent))
    }
    update(){
        this.list.forEach(agent=>agent.update());
    }
}

class Agent{
    constructor(pos,dnaValues,ref){
        this.board=ref;
        this.dna= new DNA(dnaValues)
        this.pos=pos;
        this.heading=[0,0]; //x and y when added to pos, numbered between 0 and 1
        this.speed=0; //multiplied to pos x and y can be between negative and pos max speed;
        this.mutationRate=0;//4th param in DNA, just to experiment
        this.maxSpeed=5;
        this.health=100;
        this.poisonXCorrection=0;
        this.poisonYCorrection=0;
    }
    mutate(){
        this.dna.mutate();
    }
    isDead(){
        return this.health<=0;
    }
    die(){
        this.board.agentList.remove(this);
        this.board.food.add(this.pos)
    }
    update(){
        this.health=this.health-1;
        this.pos=this.getNewPos();
        this.consume();
        this.isDead()?this.die():this.draw();
    }
    getNewPos(){
        return {
            x: this.pos.x+this.heading[0]*this.speed,
            y: this.pos.y+this.heading[1]*this.speed,
        }
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.pos.x+this.heading[0],this.pos.y+this.heading[1]);
        ctx.lineTo(this.pos.x-1,this.pos.y);
        ctx.lineTo(this.pos.x+1,this.pos.y);
        ctx.lineTo(this.pos.x+this.heading[0],this.pos.y+this.heading[1]);
        ctx.stoke();
    }
    consume(){
        const nearFood = this.board.food.list.find(x=>x.x>this.pos.x-2&&x.x<this.pos.x+2&&x.y>this.pos.y-2&&x.y<this.pos.y+2);
        const nearPoison = this.board.poison.list.find(x=>x.x>this.pos.x-2&&x.x<this.pos.x+2&&x.y>this.pos.y-2&&x.y<this.pos.y+2);
        nearFood?this.board.food.list = this.board.food.list.filter(x=>x.x==nearFood.x&&x.y==nearFood.y):null;
        nearPoison?this.board.poison.list = this.board.poison.list.filter(x=>x.x==nearPoison.x&&x.y==nearPoison.y):null;
        nearFood?this.eat(nearFood):null;
        nearPoison?this.eat(nearPoison):null;
    }
    eat(food){
        this.health=this.health+food.consume();
        this.dna.mutate();
    }
    

}
class Editable{
    constructor(type, value){
        this.type=type;
        this.value=value;
    }
    consume(){
        return this.type=="food"?this.value:-this.value;
    }
}
class EditableList{
    constructor(type,size,min,max){
        this.type="type";
        this.list = new Array(size).fill(new Editable(type, randomInt(min,max)))
    }
    add(pos)
        {
        this.list.push(new Editable(this.type,pos.x,pos.y));
    }
}
function randomInt(min,max){
    return Math.random() * (max - min) + min;
}
class DNA{
    constructor(array){
        this.strain=array;
        this.mutation=[];
    }
    mutate(){
        this.strain=this.strain.map((x,i)=>x+this.mutation[i]);
    }
    mutateStrainIndex(index,value){
     this.mutation[index]=value;
    }
}