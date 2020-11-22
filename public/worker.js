//worker.js

//hypothetical shared array buffer stratagy
/*
shared array buffer = [bit:state,arrayindex,cellIndex,newborn,iterationx4, bitNeighbors]
such that even including zero represents the cell - and color count,
and the odd are the neighbors in bits



//flags
//1= state
//2= index
//4= cellRow
//8= newbornBool
//16= itteration1
//32= itteration2
//64= itteration3
//128= itteration4
//256= neighbors_top
//512= neighbors_top_right
//1024= neighbors_right
//2048= neighbors_bottom_right
//4096= neighbors_bottom
//8192= neighbors_bottom_left
//16384= neighbors_left
//32768= neighbors_top_left




0010100


function getBitState(what, bit)
	{
	if ((what & (1 << (bit - 1))) == 1) 
		{
		return true;
	}	
	else 
		{
		return false;
	}
}

function extractBits(what, start, length)
	{
	return ((1 << start ) -1) & (what >> (length - 1));
}
function countSetBits(what)
	{
	let bitCount = 0;
	while(what>0)
		{
		count+= what & 1;
		what >>1;
	}	
	return count;
}
function gameOfLifeBinary(state, neighborCount)
	{
	if((neighborCount >3||neighborCount<2)&&state==1)
		{
		rState = 0;
	}	
	else if(state ==0 && neighborCount ==3)
		{
		rState = 1;
	}
}
function iterate(what, start, length)
	{
	let maxIter=true;	
	for(let i=0;i<length;i++)
		{	
		if(!getBitState(what,(start+length))
			{
			maxIter=false;
		}
	}
	if(!maxIter)
		{	
		what+=256;
	}
	return what;
}
function easeIterator(what)
	{
	what&itteration1^1;
	what&itteration2^1;
	what&itteration3^1;
	what&itteration4^1;	
	return what;
}
function updateNeighbors(arrayOfCells, span)
	{
	let itter = 0;	
	let defined neighbors = [itter-1,itter+1,itter+span+1,itter+span-1,itter-span+1,itter-span-1];

	arrayOfCells.forEach(cell=>
		{
		if(itter == span)
		{}
		else
			{
			let state = getBitState(cell,1);
			for(let i=0;i<neighbors.length;i++)
				{
				if(neightbors[i]>=0)
					{
					let neighorBit = 8+i;	
					setBitState(arraOfCells[neighbor], neighorBit, state);

				}
			}
		}
	});
}

function setBitState(cellBinary, targetBit ,updateData)
	{
	const clearMask = ~(1 << targetBit);
  	return (cellBinary & clearMask) | (updateData << targetBit);
}	
}
let sab = e.data;
const array = newUint16Array(sab);
array.forEach(cellBinary=>
	{
	//we capture the last state	
	let lastState = 1 & cellBinary; // records the state
	let newState = GameOfLifeBinary(lastState, countSetBit(extractBits(cellBinary, 8, 8)));
	if(newState == lastSate)
		{
		cellBinary = iterate(cellBinary, 16, 4);
	}
	else
		{
		cellBinary^1=1;
		cellbinary = easeIterator(cellbinary);

	}

});


*/
this.onmessage = function(e) 
	{

   e.data.array.forEach((cell) => 
		{
		let lastState = cell.state;
		cell.state = gameOfLife(cell);
		if(lastState ==0 && cell.state==1)
			{
			cell.newBorn = true;
		}

	});
   this.finished = true;

   this.postMessage({array:e.data.array, index:e.data.index});

};

function gameOfLife(cell)
	{
	let sum = Sum(cell.neighbors);
	rState = cell.state;
	if((sum>3 || sum<2) && cell.state==1)
		{
		rState = 0;
	}
	else if(cell.state == 0 && sum == 3)
		{
		rState= 1;

	}
	return rState;
}
		
function Sum (array)
	{
	let result = 0;
	array.forEach(x=>result+=x);
	return result;	
}			

