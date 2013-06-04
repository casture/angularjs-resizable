<!--
	Class	IT210
	Project	HTML5 TicTacToe
	File	tictactoe.php
	Type	PHP: Hypertext Preprocessor
	Version	1.0
	Date	16 November 2012
	Author	Trevor Durán
-->
<?include 'getDName.php';?>
<!DOCTYPE html>
<html>
	<head>
		<meta content="text/html" charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="tictactoe.css" />
		<title>HTML5 Tic Tac Toe</title>
	</head>
	<body>
		<div id="content">
			<div id="playground"></div>
			<input id="text" type="text" placeholder="Send Message to your opponent with ENTER or button"/><button id="send">Send</button><button id="disconnect">Disconnect</button>
			<div id="chatLog"></div>
		</div>

		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<script src="http://kineticjs.com/download/v4.0.5/kinetic-v4.0.5.min.js"></script>
		<script src="tictactoe.js"></script>
		<script>var dName = "<?echo $dName?>"</script>
	</body>
</html>​
