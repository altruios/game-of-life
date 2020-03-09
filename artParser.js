//acsii parser
var ajax = new XMLHttpRequest();
ajax.open("GET", "lexicon.htm", false);
ajax.send();
const source = document.getElementById('source')
	source.innerHTML += ajax.responseText;

//input is:
	let scrappedShapes = [];
	let nameList = document.querySelectorAll('a[name]');
	let shapeList = document.querySelectorAll('pre');
	let parsedShapes = [];
	let parsedNames = [];
	nameList.forEach(name=> parsedNames.push(name.text));
	shapeList.forEach(shape=> parsedShapes.push(shape.innerText));
	for(let i=0; i<parsedShapes.length; i++)
		{
		let shapeObject = 
			{
			name:parsedNames[i],
			pattern:parsedShapes[i]
		}
		scrappedShapes.push(shapeObject);
}
const shapes = [];
scrappedShapes.forEach(scrappedShape=>shapes.push(readInput(scrappedShape)));

//so this parses html files of just a shape stored in this format -- eventually
//in the mean time - just doing it manually.



	function readInput(input)
		{
		let stringArray = input.pattern.split("\n");
		let counterCol = 0;
		let counterRow = 0;
		let objectCount = 0;
		let returnContainer = [];

		let colSize = stringArray.length;
		let rowSize = Array.from(stringArray[0]).length;
		let bounds = {
			v:rowSize,
			h:colSize
		};
		stringArray.forEach((stringLine)=>
			{
			stringLine = Array.from(stringLine);	
			stringLine.forEach((stringItem)=>
				{
				if(stringItem == 'O')
					{
					objectCount++;

					let cellObject = {col:counterRow, row: counterCol};
					returnContainer.push(cellObject);
				}
				counterRow++;	
			});
			rowSize = counterRow;
			counterRow = 0;
			counterCol++;
		});
	let convertedObject = createShape(returnContainer, bounds, input.name)
	return convertedObject;	
	}

function createShape(pattern, bounds, name)
	{
	let shape = 
		{
		name: name,	
		imprints: [],
		bounds: {
			vertical: bounds.v,
			horizontal:bounds.h
		},
		pattern:pattern,
		imprintOnGrid:function(col,row)
			{
			shape.pattern.forEach(mod=>shape.imprints.push(gameBoard.gameMatrix[col+mod.col][row+mod.row]));		
		}
	}
	return shape;
}
