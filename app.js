var letters = [
'aaafrs','aaeeee','aafirs','adennn','aeeeem',
'aeegmu','aegmnn','afirsy','bjkqxz','ccenst',
'ceiilt','ceilpt','ceipst','ddhnot','dhhlor',
'dhlnor','dhlnor','eiiitt','emottt','ensssu',
'fiprsy','gorrvw','iprrry','nootuw','ooottu'
];

var board_generator = [];
var curr_word = []; 
var can_click = [];
var submitted_words = new Set();

function startTimer() {
    // 1 less than actual time
    var timeleft = 119;
    var downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        $('#endModal').modal('show');
      }
      document.getElementById("timer").value = 120 - timeleft;
      document.getElementById("timer").innerHTML = timeleft + "s remaining";
      timeleft -= 1;
    }, 1000);

}


function board(){
	var board = [];
	var board_temp = [];
	var dice_arr = [];
	var upside;
	var row;
	var character='';

	var idx;
	var temp;
	for(let i = board_generator.length; i > 0; i--){
		idx = Math.floor(Math.random() * i);
		temp = board_generator[i - 1];
		board_generator[i - 1] = board_generator[idx];
		board_generator[idx] = temp;
	}
	for(let i = 0; i < board_generator.length;i++){
		dice_arr = board_generator[i];
		upside = random_face(dice_arr);
		if(upside === 'Q'){
			upside = 'Qu';
		}
		board_temp.push(upside);
	}
	
	for(let i = 0; i < board_temp.length; i += 5){
		line = [];
		line.push(board_temp[i]);
		line.push(board_temp[i + 1]);
		line.push(board_temp[i + 2]);
		line.push(board_temp[i + 3]);
		line.push(board_temp[i + 4]);
		board.push(line);
	}

	for(var row = 0; row < 5; row++){
		for(var col = 0; col < 5; col++){
			character = board[row][col];
			var button = "<button type='button' class='btn dice'"+"row="+row+" col=" + col + ">" + character + "</button>";
			var row_str = "row" + row;
			var row_selector = document.getElementById(row_str);
			row_selector.innerHTML += button;
		}
	}
}


function board_generate(){
	var dice;
	for(let i=0;i<letters.length;i++){
		dice = letters[i].split('');
		board_generator.push(dice);
	}
}

function random_face(arr){
	var index = Math.floor(Math.random()*6);
	var upside_face = arr[index];
	return upside_face;
}

function button_event(){
	var row,col,text;
	var events = document.getElementsByClassName('dice');
	for(let event of events){
		event.onclick = function(){
			row = Number(event.getAttribute('row'));
			col = Number(event.getAttribute('col'));
			text = event.innerHTML;	
			if(!event.classList.contains('active')){
				curr_word.push([row, col]);
				current_word += text;
			}else{
				curr_word.pop();
				current_word = current_word.substring(0, current_word.length - 1);
			}
			if(curr_word.length !== 0){
				var current_dice = curr_word[curr_word.length-1];
				ajacent(current_dice[0],current_dice[1]);
				can_click = modify_can_click(can_click,curr_word);
				can_click.push([current_dice[0],current_dice[1]]);
			}
			update_can_click_dice();
			document.getElementById('current_word').innerHTML = current_word;
			event.classList.toggle('active');
		}
	}
	document.getElementById('submit').onclick = function(){
		submit_word();
		after_submit();
	};
}

function modify_can_click(can_click,curr_word){
	var dice1 = [];
	var dice2 = [];
	var difference = can_click.slice();
	for(let i=can_click.length-1;i>=0;i--){
		for(let j=0;j<curr_word.length;j++){
			var dice1 = can_click[i];
			var dice2 = curr_word[j];
			if( dice1[0] === dice2[0] && dice1[1] === dice2[1] ){
					difference.splice(i,1);
			}
		}
	}
	return difference;
}

function update_can_click_dice(){
	var events = document.getElementsByClassName('dice');
	var found = false;
	if(curr_word.length === 0 ){
		for(let event of events){
			event.disabled = false;
			event.classList.remove('highlight_btn');
		}
	}else{
		for(let event of events){
			event.disabled = true;
			event.classList.remove('highlight_btn');
			found = false;
			row = Number(event.getAttribute('row'));
			col = Number(event.getAttribute('col'));
			for(let dice of can_click){
				if(dice[0] === row && dice[1] === col){
					found = true;
				}
			}
			if(found){
				event.disabled = false;
				event.classList.add('highlight_btn');
			}
		}
	}

}

var current_word = "";
var err_msg = "";
function submit_word(){
	if(current_word===""){
		$("#error").css("color", "#424242");
		$("#error").text("Please select a word before submitting.");
	}else{

		curr_word = [];
		console.log("word is", current_word)
		

		var result = words[current_word];
		if (result === undefined) {
			$("#error").css("color", "#424242");
			$("#error").text("Word does not exist.");
			console.log("undefined")
			current_word = "";
			$('#current_word').html(current_word);
		}
		else {
			console.log("word exissts")
			submitted_words.add(current_word);
			current_word = "";
			$('#current_word').html(current_word);
			update_words();
			$('#error').css("color", "#e6f5ff")
		}
	}
}

function after_submit(){
	var events = document.getElementsByClassName('dice');
	for(let event of events){
		event.classList.remove('active');
	}
	curr_word = [];
	update_can_click_dice();
}

function update_words(){
	var score;
	var sum = 0;
	$('#table_words').text("");
	for(let word of submitted_words){
		score = calculate_score(word);
		sum += score;
		document.getElementById('table_words').innerHTML += "<div><span>"+word+"</span>"+"<span>"+score+"</span></div>";
	}
	document.getElementById('total-score').innerHTML = sum;
}

function calculate_score(word){
	switch(word.length){
		case 1:
		case 2:
			return 0;
		case 3:
		case 4:
			return 1;
		case 5:
			return 2;
		case 6:
			return 3;
		case 7:
			return 5;
		default:
			return 11;
	}
}

function within_range(row,col){
	return(row >= 0 && row < 5 && col >= 0 && col < 5);
}

var ajacent_dice = [
[-1,-1],[-1,0],[-1,1],
[0,-1],			[0,1],
[1,-1],	[1,0],	[1,1]
];
function ajacent(row,col){
	can_click = [];
	var newrow,newcol;
	for(let neighbor of ajacent_dice){
		newrow = Number(row)+neighbor[0];
		newcol = Number(col)+neighbor[1];
		if(within_range(newrow,newcol)){
			can_click.push([newrow,newcol]);
		}
	}
}