const state = 0;
const drawBool = 1; //not in use
const StateChangeBool= 2;
const itteration1=3;
const itteration2=4;
const itteration3=5;
const itteration4=6;
const itteration5 = 7;
const neighbors_top= 8;
const neighbors_top_right=9;
const neighbors_right=10;	
const neighbors_bottom_right=11;
const neighbors_bottom=12;
const neighbors_bottom_left=13;
const neighbors_left=14;
const neighbors_top_left=15;
const itterationMask = 248 ; //11111000 in binary - a mask;
const mirroredNeighborBitsFlags = 
	[
	neighbors_bottom,
	neighbors_bottom_left,
	neighbors_left,
	neighbors_top_left,
	neighbors_top,
	neighbors_top_right,
	neighbors_right,
	neighbors_bottom_right
];
const neighborsArray = 
		[
	 {name: "neighbors_top",value: neighbors_top},
	 {name: "neighbors_top_right",value:neighbors_top_right},
	 {name: "neighbors_right",value:neighbors_right},
	 {name: "neighbors_bottom_right",value:neighbors_bottom_right},
	 {name: "neighbors_bottom",value:neighbors_bottom},
	 {name: "neighbors_bottom_left",value:neighbors_bottom_left},
	 {name: "neighbors_left",value:neighbors_left},
	 {name:"neighbors_top_left",value:neighbors_top_left}
	]


const rainBowColoring = [
	{a:255,r:255,g:255,b:255},
	{a:255,r:245,g:245,b:235},
	{a:255,r:235,g:235,b:215},
	{a:255,r:225,g:225,b:205},
	{a:255,r:139,g:40,b:285},
	{a:255,r:119,g:30,b:165},
	{a:255,r:100,g:30,b:150},
	{a:255,r:70,g:40,b:120},
	{a:255,r:46,g:43,b:105},
	{a:255,r:36,g:35,b:95},
	{a:255,r:26,g:30,b:140},
	{a:255,r:16,g:27,b:160},
	{a:255,r:10,g:24,b:195},
	{a:255,r:12,g:45,b:235},
	{a:255,r:15,g:110,b:138},
	{a:255,r:17,g:130,b:118},
	{a:255,r:20,g:195,b:60},
	{a:255,r:40,g:235,b:55},
	{a:255,r:115,g:240,b:50},
	{a:255,r:145,g:245,b:45},
	{a:255,r:165,g:255,b:40},
	{a:255,r:185,g:235,b:35},
	{a:255,r:205,g:197,b:30},
	{a:255,r:215,g:157,b:25},
	{a:255,r:225,g:127,b:20},
	{a:255,r:235,g:107,b:15},
	{a:255,r:245,g:90,b:10},
	{a:255,r:255,g:50,b:5},
	{a:255,r:225,g:20,b:0},
	{a:255,r:195,g:0,b:0},
	{a:255,r:178,g:0,b:0},
	{a:255,r:128,g:0,b:0},















];





const deadColoring=
	[
	{a:255,r:40,g:40,b:255},
	{a:255,r:10,g:34,b:250},
	{a:255,r:0,g:20,b:245},
	{a:255,r:0,g:10,b:240},
	{a:255,r:0,g:0,b:235},
	{a:255,r:0,g:0,b:130},
	{a:255,r:0,g:0,b:125},
	{a:255,r:0,g:0,b:120},
	{a:255,r:10,g:0,b:115},
	{a:255,r:20,g:0,b:110},
	{a:255,r:30,g:0,b:105},
	{a:255,r:40,g:0,b:100},
	{a:255,r:50,g:0,b:95},
	{a:255,r:60,g:0,b:90},
	{a:255,r:80,g:0,b:85},
	{a:255,r:90,g:0,b:80},
	{a:255,r:100,g:40,b:75},
	{a:255,r:110,g:24,b:70},
	{a:255,r:120,g:0,b:65},
	{a:255,r:110,g:0,b:60},
	{a:255,r:100,g:0,b:55},
	{a:255,r:90,g:0,b:50},
	{a:255,r:80,g:0,b:45},
	{a:255,r:70,g:0,b:40},
	{a:255,r:60,g:0,b:35},
	{a:255,r:50,g:0,b:30},
	{a:255,r:40,g:0,b:25},
	{a:255,r:30,g:0,b:20},
	{a:255,r:20,g:0,b:15},
	{a:255,r:10,g:0,b:10},
	{a:255,r:0,g:0,b:5},
	{a:255,r:0,g:0,b:0},
	{a:255,r:0,g:0,b:0},
];
rainBowColoring.forEach(colorObject=>colorObject.value = setColor(colorObject));
deadColoring.forEach(colorObject=>colorObject.value = setColor(colorObject));

let sab; //shared array buffer refference
let startIndex; //starting row position
let endIndex; //ending row position
let span; //length of row
let hSpan; //heigh of grid

let wi;//worker working index
let mainGrid;
let pixels;
let imageGrid;
let colorIndex;
function setworkerState(e)
	{
	sab = e.data.sab;
	pixels = e.data.pixels;
	startIndex=e.data.start;
	endIndex=e.data.end;
	span=e.data.span;
	hSpan=e.data.hSpan;
	wi=e.data.index;
	if(mainGrid==undefined)
		{
		mainGrid = new Uint16Array(sab);
	}
	if(imageGrid==undefined)
		{
		imageGrid = new Uint32Array(pixels);
	}
}
function checkWorkerState(e)
	{
	let obg={
		sab:sab,
		pixels:pixels,
		startIndex:startIndex,
		endIndex:endIndex,
		span:span,
		wi:wi,
		e:e
		}
		return obg;
}
function countNeighbors(cellBinary)
	{
	let count=extract8Bits(cellBinary, neighbors_top);
	if(cellBinary>255){
		let mes;
	}
		return bitCount(count);	
/*	neighborsArray.forEach(n=>count+=checkBit(cellBinary,n.value));
	return count;
*/}
function bitCount(item) {
    item = item - ((item >> 1) & 0x55555555);
    item = (item & 0x33333333) + ((item >> 2) & 0x33333333);
    item = (item + (item >> 4)) & 0x0f0f0f0f;
    item = item + (item >> 8);
    item = item + (item >> 16);
    return item & 0x3f;
}
function extract8Bits(what, start)
	{
	return (what >> start) & 255;
}
function extractXBits(what,start,x)
	{
	return (what >> start) & x;

}
function checkBit(what, bitPos) 
	{
  	return (what & (1 << bitPos)) === 0 ? 0 : 1;
}
function setBitToOne(what, bitPos) 
	{
  	return what | (1 << bitPos);
}
function setBitToZero(what, bitPos)
	{
 	const mask = ~(1 << bitPos);
  	return what & mask;
}

function getNeighborIfromXY(cellIndex,x,y)
	{
	//	first we handle the x axis
	if(span%cellIndex ==0) //if x is negative or parent cell divides evenly into span
		{
		x+=span; // add a row,
	}
	else if((span-1)%cellIndex == 0) // if you are at the left edge.
		{
		x-=span; //subtract a row
	}	


	//then the y axis
	if(y==-1) //too far up
		{
		y+=hSpan; //set to max y
	}
		
	else if(y>hSpan-1) // if you are too low
		{
		y-=hSpan; //set to first level = 0
	}
	let index = y*span + x; 
	return index;
}

function getNeighbors(cellIndex)
	{
	let currentPos = getXY(cellIndex); 

	//round like a clock starting at top (center top neighbor)
	let neighbors = [
		getNeighborIfromXY(cellIndex,currentPos.x,  currentPos.y-1), //top
		getNeighborIfromXY(cellIndex,currentPos.x+1,currentPos.y-1),//top_right
		getNeighborIfromXY(cellIndex,currentPos.x+1,currentPos.y), //right
		getNeighborIfromXY(cellIndex,currentPos.x+1,currentPos.y+1),//bottom_right
		getNeighborIfromXY(cellIndex,currentPos.x,  currentPos.y+1),//bottom
		getNeighborIfromXY(cellIndex,currentPos.x-1,currentPos.y+1),//bottom_left
		getNeighborIfromXY(cellIndex,currentPos.x-1,currentPos.y),//left
		getNeighborIfromXY(cellIndex,currentPos.x-1,currentPos.y-1),///top_left
	];
	return neighbors;

}
function getXY(cellIndex)
	{
	let XYobject = 	
		{
		x:(cellIndex%span),
		y:(Math.floor(cellIndex/span))
	}
	return XYobject;
}
function setBitState(cellBinary, targetBit , updateData)
	{
	if(updateData == 1)	
		{
		cellBinary=setBitToOne(cellBinary, targetBit);
	}
	else
		{
		cellBinary=setBitToZero(cellBinary, targetBit);
	}
	return cellBinary;
}	
function GameOfLifeBinary(state, neighborCount)
	{
	let rState = 1;	
	if((neighborCount >3 || neighborCount < 2) && state == 1 )
		{
		rState = 0;
	}	
	else if(state == 0 && neighborCount == 3)
		{
		rState = 1;
	}
	else if(state == 0)
		{
		rState = 0;
	}
	//	console.log("properties are,",state, neighborCount,"game return state is", rState);
	return rState;
}
function extract5Bits(what, start)
	{
	return (what >> start) & 31;
}


function iterate(what)
	{
	let colorIter= getIter(what,itteration1);	
	if(colorIter<31)
		{
		colorIter++;	
	}
	else
		{
		//cycle color effect;

			
	}	
	what = setIter(what, colorIter);

	return what;
}

function setIter(what, itter)
	{
	return (what&~itterationMask)|(itter<<itteration1);
}
function getIter(what)
	{
	return extract5Bits(what,itteration1);
	}
function updateNeighbors(cellIndex, stateOfCell)
	{	
	let neighbors = getNeighbors(cellIndex);
	let mirroredFlags = mirroredNeighborBitsFlags[Symbol.iterator](); // offset by 4.
	//so when we modify the bit on the neighbor - we toggle the switch of the neighbor this cell is to neighbor...
	// we adjust the bottom neighbor bit of the top neighbor
	// we adjust the right neighbor bit of the left neighbor... etc

	neighbors.forEach(neighbor=> mainGrid[neighbor]=setBitState(mainGrid[neighbor], mirroredFlags.next().value, stateOfCell)); 
}

function drawCell(cellIndex)
	{	
/*	if(!checkBit(mainGrid[cellIndex], drawBool)){return}
*/	if(checkBit(mainGrid[cellIndex], StateChangeBool))
		{
		mainGrid[cellIndex] = setBitToZero(mainGrid[cellIndex],StateChangeBool);
		mainGrid[cellIndex] = setIter(mainGrid[cellIndex],0);

	}

	let pixelObject = getNextColor(mainGrid[cellIndex],cellIndex);

	imageGrid[cellIndex]  = pixelObject.value;
	mainGrid[cellIndex] = setBitToZero(mainGrid[cellIndex],drawBool);
	mainGrid[cellIndex] = iterate(mainGrid[cellIndex]);
}
function getNextColor(binary, cellIndex)
	{
	let iteration = getIter(binary);
	let coloring = rainBowColoring[iteration];		
	if(!checkBit(binary,state))
		{
		coloring = deadColoring[iteration];
		if(coloring ==undefined)
			{
		coloring = deadColoring[31];

		} 
	}

	return coloring;

}
function setColor(colorObject)
	{
	return (colorObject.a<<24)|(colorObject.b<<16)|(colorObject.g<<8)|colorObject.r;
}

this.onmessage = function(e) 
	{

	let workerState = e.data.workerState;
	//	console.log("message recieved state=",workerState);	
	let message = "test";
	setworkerState(e);
	switch(workerState)
		{
			case 0: //worker state 1 = setup
				message = "data has been set"
					break;
			case 1: // run through the game of life
				colorIndex=startIndex; //
				for(let i=startIndex;i<endIndex;i++)
					{
				//	console.log(mainGrid[i]);	
					let lastState = checkBit(mainGrid[i],state);
					let newState = GameOfLifeBinary(lastState, countNeighbors(mainGrid[i]));

					mainGrid[i] = setBitState(mainGrid[i],state,newState);
					if(newState != lastState)
						{
						mainGrid[i] = setBitToOne(mainGrid[i],StateChangeBool);

					}
					//this is where I add get next color
				/*	if(checkBit(mainGrid[i],StateChangeBool)||checkBit(mainGrid[i], state))
						{
						mainGrid[i] = setBitToOne(mainGrid[i],drawBool);

					}*/
					drawCell(i);
				}
				message = "game of life has been played";

					break;
				
			case 2: // update neighbors
				for(let i=startIndex;i<endIndex;i++)			
					{
					updateNeighbors(i, checkBit(mainGrid[i], state));
				}
				message = "updated neighbors";
					break;
			default:
				message = "error";
				console.error("no worker state / invalid worker state");
					break;				
		}
		workerState++;
		if(checkWorkerState().wi ==undefined){
			console.error(checkWorkerState(e.data));
		}

		let returnObject = {message:message, state:workerState, index:wi, traceIndex:e.data.index};
		if(e.data.index ==0)
			{
			returnObject.firstStep = true;
		}

		this.postMessage(returnObject);

};



