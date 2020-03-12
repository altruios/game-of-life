
<?php
//is this right?
// must have ffmpeg installed and in the main c or set to a global

$dateString = strtotime("now");
var_dump(shell_exec("which ffmpeg"));
$cmd = "C:/xampp/htdocs/gameOfLife/images/ffmpeg -r 19 -f image2  -i image_%d.png output_t3.mov";
$output = [];
$didItRun=0;
exec($cmd, $output, $didItRun);
print("did it run? ".$didItRun);
print("did it run? <br>");
for($i=0;$i<sizeOf($output);$i++)
	{
	print("just testing");	
	print("output? ".$output[$i]);
}

exec("C:/xampp/htdocs/gameOfLife/images/image_1.png",$output, $didItRun);

print("did this run? ".$didItRun);
for($i=0;$i<sizeOf($output);$i++)
	{
	print("just testing");	
	print("output? ".$output[$i]);
}
print("did it run? <br>");

?>