console.log("starting script!");
const canvas = document.getElementById('canvas');

const ctx=canvas.getContext('2d');
function initRow(length){
    let r=[];
    for(let i=0;i<length;i++){
        let val= i==Math.floor(length/2)?1:0
        r.push(
            [
                val,
                val?255:0,
                val?255:0,
                val?255:0
        ]);
    }
    console.log("init row is:");
    console.log(r);
    return r;
}
function step(grid){
    const lastRow = grid[grid.length-1];
    const nextRow = lastRow.map((arrayCell,i,ar)=>{
        const leftNIndex = i==0? ar.length-1:i-1;
        const rightNIndex= i==ar.length-1?0:i+1;
        let lN=ar[leftNIndex][0];
        let Ns=arrayCell[0];
        let rN=ar[rightNIndex][0];
        



      //state engine
      //returning an array [state, red,green,blue], that represents a cell
    


        if(lN==0){
            if(Ns==0){
                if(rN==0){//0 0 0
                    return [0,arrayCell[1],arrayCell[2],arrayCell[1]];
                }
                else{ // 0 0 1
                    return [1,arrayCell[1],arrayCell[2],arrayCell[3]+ar[rightNIndex][3]];
                }
            }else{
                if(rN==0){//0 1 0
                    return  [0,arrayCell[1],arrayCell[2]-ar[i][2],arrayCell[3]];
                }
                else{// 0 1 1
                    return   [1,arrayCell[1],arrayCell[2]+ar[i][1],arrayCell[3]+ar[rightNIndex][3]];
                }
            }
        }else{
            if(Ns==0){
                if(rN==0){//1 0 0
                    return   [1,arrayCell[1]+ar[leftNIndex][1],arrayCell[2],arrayCell[3]];
                }else{// 1 0 1
                    return   [1,arrayCell[1]+ar[leftNIndex][1],arrayCell[2],arrayCell[3]+ar[rightNIndex][3]];
                }
            }else{
                if(rN==0){// 1 1 0
                    return    [1,arrayCell[1]+ar[leftNIndex][1],arrayCell[2]+ar[i][1],arrayCell[1]];

                }else{// 1 1 1
                    return    [0,arrayCell[1]-ar[leftNIndex][1],arrayCell[2]-ar[i][1],arrayCell[1]-ar[rightNIndex][3]];

                }
            }
        }
    })
    grid.push(nextRow);
    return grid;
}
let grid=[];
grid.push(initRow(1840));



grow(grid,3160);

//grows the grid -one row at a time
function grow(grid,len){
    let stepCount=0;
    const growInterval=window.setInterval(function(){
        console.count("stepping");
        if(stepCount>len){
            window.clearInterval(growInterval);
            return;
        }
        grid=step(grid);
        drawGridRow(grid,grid.length-1);
        stepCount++;
    },150);
    for(let rloop=0;rloop<len;rloop++){
    grid =step(grid);
    drawGridRow(grid, grid.length-1);

    }

}
//draw the next line on the canvas
function drawGridRow(grid, y){
    const row = grid[grid.length-1];
    row.forEach((pixel,i)=>{
        const red=pixel[1];
        const green=pixel[2];
        const blue =pixel[3];
        ctx.fillStyle=`rgb(${red},${green},${blue})`;
        ctx.fillRect(i,y,1,1);
    });
}



