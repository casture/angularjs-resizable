/*
	Class	IT210
	Project	HTML5 TicTacToe
	File	tictactoe.js
	Type	JavaScript
	Version	1.0
	Date	16 November 2012
	Author	Trevor Durán
*/
$(document).ready(function() {
	//these are all of the global variables
	var socket, slots, stage, layer, interval, loc, myTurn, myPieces, theirPieces, banner, turn, pieces, activePiece, openSlots, player1, player2, matchNum, waitText;
	//a quick and dirty check to see if the user's browser has websocket technology
	if(!("WebSocket" in window)){
		$('#chatLog, input, button, #examples').fadeOut("fast");  
		$('<p>Your browser doesn\'t support the functionality of this site. Try Google Chrome</p>').appendTo('#container');  
		return;
	} else
		setup();
	//sets the basic variables for the game: canvas stage, layer, websocket connections, etc...
	function setup() {
		//creates the canvas using the KineticJS library which uses one stage and mulitple layers
		stage = new Kinetic.Stage({
			//specifies which div to attach the stage to, and the dimensions of the stage
			container: "playground",
			width: 650,
			height: 600
		});
		//for this lab, we use only a single layer
		layer = new Kinetic.Layer();
		stage.add(layer);
		//these next few lines set up a nifty little feature that might be handy for your writeup...
		//try pressing '+' with the canvas highlighted (or focused)
		var playCanvas = document.getElementById("playground");
		playCanvas.onkeypress=function(e){if(e.which===43)stage.toDataURL({callback:function(dataUrl){window.open(dataUrl);}});};
		playCanvas.tabIndex=1;
		//bounds which represent the lanes, slots, or positions where an X or O can lie
		bounds = {y:[135,245,355,465],x:[160,270,380,490]};
		//retrieving variables via GET
		player1 = gup('player1');
		player2 = gup('player2');
		matchNum = (parseInt(gup('match')));
		//once canvas is ready, let's try to connect to the websocket server!
		connect();
	}
	//initializes game variables
	function reset() {
		//clears the layer of the board, banner, and pieces
		layer.removeChildren();
		//all slots are open and available for an X or O
		openSlots = [[true,true,true],[true,true,true],[true,true,true]];
		//set mouse location
		loc = {x:0,y:0};
		//decides whose turn it is...dName is a javascript variable which was populated by PHP
		//it tells the browser what display name you are logged in as
		myTurn = player1==dName;
		//no turns have been played
		turn = 0;
		//create all the Xs and Os
		createPieces();
		//create a new tic tac toe board (the 2 vertical and 2 horizontal lines) and add it to the layer
		layer.add(createNewBoard());
		//create & adds the banner ie. "Professor Hansen vs. Trevor"
		layer.add(createNewBanner(player1,player2));
		//creates & adds the text telling the player their oppenent hasn't arrived
		layer.add(createWaitText());
		//make the layer fully visible (not transparent),
		//useful if you are waiting for the other player (your board is transparent), but they have left...
		//your board becomes non-transparent and you know something is up
		layer.setOpacity(1);
		//redraws the layer to the canvas
		layer.draw();
	}
	//uses kineticjs text object to create a textbox to notify users oppenent isn't read
	//this object will serve another feature later on at the end of the game
	function createWaitText() {
		waitText = new Kinetic.Text({
			x: 125,
			y: 200,
			stroke: '#555',
			strokeWidth: 5,
			fill: '#ddd',
			text: 'Please wait while your opponent arrives',
			height:200,
			fontSize: 20,
			fontFamily: 'Calibri',
			textFill: '#555',
			width: 380,
			padding: 75,
			align: 'center',
			fontStyle: 'italic',
			shadow: {
				color: 'black',
				blur: 1,
				offset: [10, 10],
				alpha: 0.4
			},
			cornerRadius: 10
        });
		return waitText;
	}
	//initializes the pieces object, which contains all the Xs and Os
	//initializes myPieces and theirPieces to Xs or Os, depending on circumstances
	function createPieces() {
		pieces = {Xs:[],Os:[]};
		if (myTurn) {
			myPieces = pieces.Xs;
			theirPieces = pieces.Os;
			theirPieces.nodeType='Shape';
		} else {
			myPieces = pieces.Os;
			theirPieces = pieces.Xs;
			theirPieces.nodeType='Group';
		}
		for (var i = 0; i < 5; i++)
			pieces.Xs.push(createNewX(i));
		for (var i = 0; i < 4; i++)
			pieces.Os.push(createNewO(i));
		updateLastPiecesPos();
	}
	//used so the browser knows which piece to pick up next and put into play with each turn
	function updateLastPiecesPos() {
		if (pieces.Xs.length>0)
			pieces.Xs.lastSlot = {x:pieces.Xs[pieces.Xs.length-1].getX(),y:pieces.Xs[pieces.Xs.length-1].getY()};
		if (pieces.Os.length>0)
			pieces.Os.lastSlot = {x:pieces.Os[pieces.Os.length-1].getX(),y:pieces.Os[pieces.Os.length-1].getY()};
	}
	//creates a kineticjs circle object, makes it an O, adds to layer, etc
	function createNewO(index) {
		var O = new Kinetic.Circle({
			x:stage.getWidth()-60,
			y: 80+index*80,
			radius:30,
			stroke: '#800000',
			strokeWidth:15,
		});
		setListeners(O);
		O.setListening(false);
		layer.add(O);
		return O;
	}
	//creates a kineticjs group object, makes it an X by making 2 rectangles at a right angle and adding them to the group
	//adds the X to the layer, etc
	function createNewX(index) {
		var X = new Kinetic.Group();
		for (var i = 0; i < 2; i++) {
			var line = new Kinetic.Rect({
				width: 86,
				height: 15,
				rotation:(Math.PI/2*i)+Math.PI/4,
				offset:[43,7.5],
				cornerRadius:7.5,
				fill: '#0000A0',
			});
			X.add(line);
		}
		X.setPosition(60,80+index*80);
		setListeners(X);
		X.setListening(false);
		layer.add(X);
		return X;
	}
	//uses a kineticjs text obect to create the top banner notify the user who is playing whom
	function createNewBanner(p1,p2) {
		banner = new Kinetic.Text({
			x:stage.getWidth()/2,
			y: 75,
			width:450,
			height:40,
			offset:[225,20],
			align:'center',
			text: p1+' vs '+p2,
			fontSize: 30,
			fontFamily: 'trebuchet ms',
			textFill: 'black'
		});
		return banner;
	}
	//creates a blank tic tac toe board to place the pieces in/on & adds to the layer
	function createNewBoard() {
		var board = new Kinetic.Group();
		for (var i = 0; i < 4; i++) {
			var line = new Kinetic.Rect({
				x: stage.getWidth()/2,
				y: stage.getHeight()/2,
				width: 300,
				height: 15,
				rotation:Math.PI/2*i,
				offset:[150,60],
				cornerRadius:7.5,
				fill: 'black'
			});
			board.add(line);
		}
		return board;
	}
	//sets event listeners to the active piece (the one you are allowed to move on your turn)
	//mostly setting the cursor style to the hand pointer when the active piece is hovered over
	function setListeners(piece) {
		piece.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		piece.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});
		piece.on('dragmove', function() {
			document.body.style.cursor='pointer';
		});
		//this event listener is used when you let go of your active piece
		//the piece is dropped into it's closest slot (to keep pieces organized)
		//the websocket server is updated with the pieces latest position...
		//then told that the user's turn is over (each websocket server message gets relayed to the opponent)
		//the user then takes their next turn (waiting for the oppenent)
		piece.on('mouseup', function() {
			plugIntoSlot();
			updateMousePosition();
			if (!myTurn) {
				socket.send(JSON.stringify({msg:'\u0004'}));
				takeTurn(turn++);
			}
		});
	}
	//connects to the websocket server and sets event listeners dealing with the connection
	function connect() {
		var host = "ws://"+"192.168.213.128"+":8081";
		try {
			socket = new WebSocket(host);
		} catch (error) {
			message('<p class="event">Cannot connect to WebSocketServer.');
		}
		//once a successful connection has been made, introduce yourself to the WebSocket Server
		//and log the socket status in the chat log
		socket.onopen = function() {
			socket.send(JSON.stringify({username:dName,matchNum:matchNum}));
			message('<p class="event">Socket Status: '+socket.readyState+' (open)');
		}
		//any time a message has been received...
		socket.onmessage = function(msg){
			//first, parse the data received into a JSON
			var data = JSON.parse(msg.data);
			//if the data contains an X position (the opponent has moved their piece), slide the active piece into that position
			if (data.x) {
				activePiece.transitionTo({
					x:data.x,
					y:data.y,
					duration:0.1
				});
				layer.draw();
				//if the data contains a message either take your turn (if the message contains the special character)
				//or log the message from the opponent in the chat log (they are trying to say something)
			} else if (data.msg) {
				if (data.msg=='\u0004') {
					myTurn=true;
					takeTurn(turn++);
				} else
					message('<p class="message">'+data.user+': '+data.msg);
				//if the data contains move data (the opponent has ended their turn)
			} else if (data.move) {
				var slot = data.move;
				if (openSlots[slot.x][slot.y])
					openSlots[slot.x][slot.y] = theirPieces.nodeType;
				//if the data contains the number of connections (someone has entered the game)
				//reset the game, hide any wait text, and take your turn
			} else if (data.connNum) {
				reset();
				if (data.connNum==2) {
					if (waitText != undefined)
						waitText.hide();
					takeTurn(turn++);
				}
				//if the data tells you that the opponent has left, let the user know this
			} else if (data.opponentLeft) {
				waitText.show();
				waitText.setText('Your opponent has left, once they return, the game will be reset...');
				waitText.setPadding(40);
				layer.setOpacity(1);
				waitText.setFontSize(10);
				layer.draw();
				//if the WebSocket server tells you that there is no room, the the user and close the socket
			} else if (data.noRoom) {
				message('<p class="event">There is no room for this match');
				socket.close()
			}
		}
		//whenever the connection is closed (from either end), log it in the chat log
		socket.onclose = function() {console.log('Socket CLOSED');
			message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');
		}
		//whenever an error occurs (from either end, most likely yours), log it in the chat log
		socket.onerror = function(msg) {
			console.log(msg);
			message('<p class="warning">Socket Error: '+msg);
		}
		//clicking the send button sends the message to the websocket server
		$('#send').click(function(){
			send();
		});
		//if you press the enter key when typing in the text box, send the message to the websocket server
		$('#text').keypress(function(event) {
			if (event.keyCode == '13')
				send();
		});
		//if you click the disconnect button, close the websocket connection
		$('#disconnect').click(function(){
			socket.close();
		});
	}
	//package the user's message nicely into a json and send it to the websocket server
	//any error's are logged as well as your message is logged in the chat log
	function send() {
		var text = $('#text').val();
		if(text==""){
			message('<p class="warning">Please enter a message');
			return ;
		}
		try {
			socket.send(JSON.stringify({user:dName,msg:text}));
			message('<p class="event">You: '+text)
		} catch(exception) {
			message('<p class="warning">'+exception);
		}
		$('#text').val("");
	}
	//adding logs to the chat log
	function message(msg) {
		$('#chatLog').append(msg+'</p>');
	}
	//taking your turn consists of checking if the game is over...if not popping/prepping active piece,
	//if game is over editing the banner text with game results and recording the winner
	function takeTurn(turnNum) {
		if (!gameIsOver()) {
			if (myTurn) {
				activePiece = myPieces.pop();
				activePiece.setListening(true);
				activePiece.transitionTo({
					scale: {x: 1.2,y: 1.2},
					duration:0.3
				});
				activePiece.moveToTop();
				activePiece.setDraggable(true);
				layer.setOpacity(1);
			} else {
				activePiece = theirPieces.pop();
				layer.setOpacity(0.5);
			}
		} else {
			if (turn==11) {
				banner.setText('Game Over \u2014 Cat\'s Game');
				takeTheWalkOfShame();
			} else if (myTurn) {
				banner.setText('Game Over \u2014 You Lost');
				takeTheWalkOfShame();
			} else {
				banner.setText('Game Over \u2014 You Won');
				recordWinner((turn % 2 == 0?"1":"2"), matchNum);
			}
			layer.setOpacity(1);
		}
		layer.draw();
	}
	//remind the user that they didn't win, allow them to return to the bracket page
	function takeTheWalkOfShame() {
		waitText.setText('Sorry, you didn\'t win the game.\nClick here to go back to the bracket');
		waitText.setPadding(40);
		waitText.setFontSize(10);
		waitText.show();
		waitText.moveToTop();
		waitText.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		waitText.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});
		waitText.on('click', function(e) {
			window.location = 'index.php?startUp=1&game=ttt';
		});
		layer.draw();
	}
	//use the wait text from the beginning to congratulate the user on winning
	//also make an AJAX call to update/save the JSON with the game results
	function recordWinner(winner, n) {
		waitText.setText('Congratulations\n\nPlease wait while the game is saved');
		waitText.setPadding(40);
		waitText.setFontSize(10);
		waitText.show();
		waitText.moveToTop();
		waitText.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		waitText.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});
		$.ajax({
			url: 'saveWinner.php?game=ttt&match='+n+'&winner='+winner,
			success: function(data) {
				if(n == 6) 
					$.ajax('/cgi-bin/CreateGameLog.py');

				waitText.setText('Congratulations\n\nThe game has been saved. Click here to go back to the bracket');
				waitText.on('click', function(e) {
					window.location = 'index.php?startUp=1&game=ttt';
				});
				layer.draw();
			}
		});
	}
	//determines which location on the game board the active piece has been dropped into
	//moves the piece back where it came from if it's no where near one of the nine possible positions
	//...or if that slot is occupied already
	function plugIntoSlot() {
		//if out of the box...move home
		if (activePiece.getX()<bounds.x[0]||activePiece.getX()>bounds.x[3]||activePiece.getY()<bounds.y[0]||activePiece.getY()>bounds.y[3])
			moveHome();
		else {
			var locX,locY;
			//find the X position of the closest slot
			for (var i = 0,j=1; j < bounds.x.length; i++,j++)
				if (activePiece.getX() > bounds.x[i] && activePiece.getX() < bounds.x[j]){
					locX = (bounds.x[i]+bounds.x[j])/2;
					break;
				}
			//find the Y position of the closest slot
			for (var i=0,j=1;j<bounds.y.length;i++,j++)
				if (activePiece.getY()>bounds.y[i] && activePiece.getY()<bounds.y[j]){
					locY = (bounds.y[i]+bounds.y[j])/2;
					break;
				}
			var slot = {x:Math.floor(locX/110)-1,y:Math.floor(locY/110)-1};
			//if the slot is available, put 'er there, update the websocket server of the piece's position
			//else, move home
			if (openSlots[slot.x][slot.y]===true) {
				updateLastPiecesPos();
				openSlots[slot.x][slot.y] = activePiece.nodeType;
				socket.send(JSON.stringify({move:{x:slot.x,y:slot.y}}));
				activePiece.setPosition(locX,locY);
				activePiece.transitionTo({
					scale: {x: 1,y: 1},
					duration:0.3
				});
				activePiece.setListening(false);
				myTurn=false;
			} else
				moveHome();
		}
		layer.draw();
	}
	//determine if the game is over/someone has won yet (3 Xs or 3 Os in a row horizontally, vertically, or diagonally)
	function gameIsOver() {
		if (openSlots[0][0]==openSlots[0][1]&&openSlots[0][1]==openSlots[0][2]&&openSlots[0][0]!==true)
			return drawWinningLine({start:{x:0,y:0},end:{x:0,y:2}});
		else if (openSlots[1][0]==openSlots[1][1]&&openSlots[1][1]==openSlots[1][2]&&openSlots[1][0]!==true)
			return drawWinningLine({start:{x:1,y:0},end:{x:1,y:2}});
		else if (openSlots[2][0]==openSlots[2][1]&&openSlots[2][1]==openSlots[2][2]&&openSlots[2][0]!==true)
			return drawWinningLine({start:{x:2,y:0},end:{x:2,y:2}});
		else if (openSlots[0][0]==openSlots[1][0]&&openSlots[1][0]==openSlots[2][0]&&openSlots[0][0]!==true)
			return drawWinningLine({start:{x:0,y:0},end:{x:2,y:0}});
		else if (openSlots[0][1]==openSlots[1][1]&&openSlots[1][1]==openSlots[2][1]&&openSlots[0][1]!==true)
			return drawWinningLine({start:{x:0,y:1},end:{x:2,y:1}});
		else if (openSlots[0][2]==openSlots[1][2]&&openSlots[1][2]==openSlots[2][2]&&openSlots[0][2]!==true)
			return drawWinningLine({start:{x:0,y:2},end:{x:2,y:2}});
		else if (openSlots[0][0]==openSlots[1][1]&&openSlots[1][1]==openSlots[2][2]&&openSlots[0][0]!==true)
			return drawWinningLine({start:{x:0,y:0},end:{x:2,y:2}});
		else if (openSlots[2][0]==openSlots[1][1]&&openSlots[1][1]==openSlots[0][2]&&openSlots[2][0]!==true)
			return drawWinningLine({start:{x:2,y:0},end:{x:0,y:2}});
		else if (turn == 10)
			return turn++&&true;
		return false;
	}
	//outline the winning three pieces in a row and color it accordingly
	function drawWinningLine(solution) {
		var start = {x:(bounds.x[solution.start.x]+bounds.x[solution.start.x+1])/2,y:(bounds.y[solution.start.y]+bounds.y[solution.start.y+1])/2};
		var end = {x:(bounds.x[solution.end.x]+bounds.x[solution.end.x+1])/2,y:(bounds.y[solution.end.y]+bounds.y[solution.end.y+1])/2};
		var line = new Kinetic.Line({
			points:[start.x,start.y,end.x,end.y],
			stroke:openSlots[solution.start.x][solution.start.y]=='Group'?'#0000A0':'#800000',
			strokeWidth:10,
			lineCap:'round'
		});
		layer.add(line);
		layer.draw();
		return true;
	}
	//move the active piece back to where it came from originally
	function moveHome() {
		activePiece.transitionTo({
			x:myPieces.lastSlot.x,
			y:myPieces.lastSlot.y,
			duration:0.3
		});
		activePiece.setPosition(myPieces.lastSlot.x,myPieces.lastSlot.y);
	}
	//updates the position of the active piece, or the piece being dragged (drug?)
	function updateMousePosition(evt) {
		var updatedLoc = {x:activePiece.getX(),y:activePiece.getY()};
		if (loc.x != updatedLoc.x || loc.y != updatedLoc.y) {
			loc.x = updatedLoc.x;
			loc.y = updatedLoc.y;
			socket.send(JSON.stringify(loc));
		}
	}
	//your typical gup (get url parameters) function...if you don't know what this is by now...God bless you.
	function gup(name) {
		var results = new RegExp("[\\?&]"+name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")+"=([^&#]*)").exec(window.location.href);
		return results == null?"":results[1];
	}
});
