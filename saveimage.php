<?php
$path = $_POST['filePath'];
$count = $_POST['count'];
$name = "image_".$count.".png";
$fileSaved = false;
if (isset($_POST["imageBitmap"]) )
	{
	$imageData = $_POST['imageBitmap'];
	$unencodedData = base64_decode($imageData);
	$img = str_replace('data:image/png;base64,', '', $imageData);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
 	$fp = fopen('C:/xampp/htdocs/gameOfLife'.$path.'/'.$name, 'wb');
	fwrite($fp, $data);
	fclose($fp);
	$fileSaved = true;
}

print($fileSaved);

?>