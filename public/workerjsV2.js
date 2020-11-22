
//hypothetical shared array buffer stratagy



//flags
//1= state
//2= index
//4= cellRow
//8= StateChangeBool
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
		bitCount+= what & 1;
		what >>1;
	}	
	return bitCount;
}
function GameOfLifeBinary(state, neighborCount)
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
		if(!getBitState(what,(start+length)))
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
	setBitState(what, 4, 0)
	setBitState(what, 5, 0)
	setBitState(what, 6, 0)
	setBitState(what, 7, 0)



	return what;
}
function updateNeighbors(arrayOfCells, span, start, end)
	{
	for(let index=0; index<arrayOfCells.length;indexi++)
		{
		let state = getBitState(cell,1);	
		let neighbors_top_index = (index-span);
		let neighbors_bottom_index = (index+span);
		let neighbors_right_index =  (index+1)
		let neighbors_left_index = (index-1);
		let neighbors_top_right_index = (index-span-1);
		let neighbors_top_left_index = (index-span+1);
		let neighbors_bottom_left_index = (index-span-1);
		let neighbors_bottom_right_index = (index-span+1);

		//wrap around paird by orth sym
		if(Math.sign(neighbors_right_index)==-1)
			{
			neighbors_right_index = (index-span+1);
		}
		if(Math.sign(neighbors_left_index)==-1)
			{
			neighbors_left_index = (index+span-1);
		}


		if(Math.sign(neighbors_top_index)==-1)
			{
			neighbors_top_index = (arrayOfCells.length-span)+index;
		}
		if(Math.sign(neighbors_bottom_index)==-1)
			{
			neighbors_bottom_index = (index%span);
		}


		if(Math.sign(neighbors_top_left_index)==-1)
			{
			neighbors_top_left_index = arrayOfCells.length-span;
		}
		if(Math.sign(neighbors_top_right_index)==-1)
			{
			neighbors_top_right_index = arrayOfCells.length;
		}


		if(Math.sign(neighbors_bottom_right_index==-1))
			{
			neighbors_bottom_right_index = 0;
		}
		if(Math.sign(neighbors_bottom_left_index==-1))
			{
			neighbors_bottom_left_index = arrayOfCells.length%span;
		}
		//round like a clock
		let neighbors = [
			neighbors_top_index,
			neighbors_top_right_index,
			neighbors_right_index,
			neighbors_bottom_right_index,
			neighbors_bottom_index,
			neighbors_bottom_left_index,
			neighbors_left_index,
			neighbors_top_left_index,
		];

		for(let nIndex=0; nIndex<neighbors.length;nIndex++)
			{
			let neighorBit = 8+nIndex;	
			setBitState(arraOfCells[neighbor], neighorBit, state);	
		}
	}
	return true;
}

function setBitState(cellBinary, targetBit ,updateData)
	{
	const clearMask = ~(1 << targetBit);
  	return (cellBinary & clearMask) | (updateData << targetBit);
}	



let sab; //shared array buffer refference
let startIndex; //starting row position
let endIndex; //ending row position
let span; //length of row
let wi;//worker working index
this.onmessage = function(e) 
	{
	let workOrupdate = 1;	
	console.log("message recieved");	
	console.log(e.data);
	sab = e.data.sab;
	startIndex=e.data.start;
	endIndex=e.data.end;
	span=e.data.span;
	wi=e.data.index;
	const array = new Uint16Array(sab);
	if(e.data.gameOfLife)
		{
		console.log("game of life true");	
		for(let i = startIndex; i<endIndex;i++)
			{
			 ;
			//we capture the last state	
			let lastState = 1 & array[i]; // records the state
			let newState = GameOfLifeBinary(lastState, countSetBits(extractBits(array[i], 8, 8)));
			if(newState == lastState)
				{
				array[i] = iterate(array[i], 16, 4);
				console.log(array[i])
			}
			else
				{
				array[i]^=11; //toggle change

				array[i] = easeIterator(array[i]);
				array[i]|=8; // set change happened to true

			}

		}
	}
	else if(e.data.updateNeighbors)
		{
		workOrupdate = 2;
		updateNeighbors(WorkerArray, span, startIndex, endIndex)
	}

   this.postMessage({message:"all clear captain", status:workOrupdate, index:wi});

};



