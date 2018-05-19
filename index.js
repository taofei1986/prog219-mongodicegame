window.onload = function () {
    $(document).on('click', '#ButtonBet', function(event){
        buttonClicked();
    });
    $(document).on('click', '#QuitGame', function(event){
        updateDB();
       });
    $(document).on('click', '#create', function(event){
        addNewUser();
    }); 
    $(document).on('click', '#bet1', function(event){
        state.betAmount = 1;
        document.location.href = "#game";
    });
    $(document).on('click', '#bet2', function(event){
        state.betAmount = 2;
        document.location.href = "#game";
    });
    $(document).on('click', '#bet5', function(event){
        state.betAmount = 5;
        document.location.href = "#game";
    });

 userArray.length = 0;
//  userArray[userArray.length] = new PlayerObject(userArray.length, "Fast", "Eddy", 10 );
//  userArray[userArray.length] = new PlayerObject(userArray.length, "Fly", "Bynight", 10 );
//  userArray[userArray.length] = new PlayerObject(userArray.length, "Susie", "Queue", 10 );

 $(document).on("pagebeforeshow", "#pickplayer",function(event){
     createList();
 });
 $(document).on("pagebeforeshow", "#LosePage",function(event){
    deletUser();
    //reset state value
    state = {
        balance: 5,
        betAmount: 2,
        currentFirstName: "Not",
        currentLastName: "Set",
        IsSelectPlayer:false,
        player_id:""
    }
});
 
 $(document).on("pagebeforeshow", "#PickBet",function(event){
     var which = findIndex($('#IDparmHere').text());//get the index of the selected user
     //$('#IDparmHere').text() will get the _id value
     state.currentFirstName = userArray[which].PlayerFirstName;
     state.currentLastName = userArray[which].PlayerLastName;
     state.balance = userArray[which].PlayerBalance;
     state.IsSelectPlayer=true;
     state.player_id=userArray[which]._id;
     var x = "Welcome " + state.currentFirstName + " " + state.currentLastName + " You have $" + state.balance;
     $('#welcome').text(x);
 });


 $(document).on("pagebeforeshow", "#game",function(event){
     if(!state.IsSelectPlayer){// not select player can not get in pickbet page, will return to pickplayer page
        document.location.href = "#pickplayer";
        return
     }
     document.getElementById("turnCount").innerText = 0;
     document.getElementById("balance").innerText = state.balance;
     document.getElementById("status").innerText = "Good luck!";
     document.getElementById("ButtonBet").style.display = 'inline';
 });


 // set up an event, if user clicks any, it writes that items data-parm into the hidden html 
 $(document).on('click', '.onePlayer', function(event){
     //$('.onePlayer').on("click", function (event) {    // this worked first time through, but not second!!
         var parm = $(this).attr("data-parm");  // passing in the record.Id
         //do something here with parameter on  pickbet page
         $('#IDparmHere').text(parm);
         //document.location.href = "index.html#pickbet";
     });

} // end of onLoaddata-role="button"currentLastName






//=====================================================================
// functions not required to be in window.onload
var state = {
    balance: 5,
    betAmount: 2,
    currentFirstName: "Not",
    currentLastName: "Set",
    IsSelectPlayer:false,
    player_id:""
}


// store PlayerObject objects here
var userArray = [];

// define a constructor to create player objectsPlayerFirstName
var PlayerObject = function( pPlayerID, pFirstName, pLastName, pBalance) {
 this.PlayerID = pPlayerID;
 this.PlayerFirstName = pFirstName;
 this.PlayerLastName = pLastName;
 this.PlayerBalance = pBalance;
}

function createList() {
// first load array from Mongo
// jQuery AJAX call for JSON
$.getJSON( '/users/userlist', function( data ) {
    userArray = data;
    // For each item in our JSON, add a table row and cells to the content string
  
// done with mongo
 $('#playerul').empty(); // don't want to keep adding old li s to old li s
 userArray.forEach(function(element) {
     $('#playerul').append('<li><a data-transition="pop" class="onePlayer" data-parm=' + 
     element._id + ' href="#PickBet" > Pick your bet size.  ' + //change playerID to _id because of it is the unique key
     element.PlayerFirstName + ' ' + element.PlayerLastName + ' </a></li>' );
   });
   $('#playerul').listview('refresh');
});
};


function addNewUser(){
 userArray[userArray.length] = new PlayerObject(userArray.length, $('#firstName').val(), $('#lastName').val(), 10 )
 // ajax call to mongo
  // Use AJAX to post the object to our adduser service
  var newUser = userArray[userArray.length-1]
  $.ajax({
    type: 'POST',
    data: newUser,
    url: '/users/adduser',
    dataType: 'JSON'
  }).done(function( response ) {

    if (response.msg === '') {

      // Clear the form inputs
      $('#firstName').val('');
      $('#lastName').val('');
    }
    else {

      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);

    }
  });
 // end of calling mongo
 document.location.href = "#pickplayer";
};

function buttonClicked() {
 state.balance = GetNewBalance(state.balance);
(document.getElementById("balance")).innerText = state.balance;
if(state.balance <= 0) {
    (document.getElementById("ButtonBet")).style.display = 'none';

    var which = findIndex($('#IDparmHere').text());
    state.currentFirstName = ""; 
    state.currentLastName = ""; 
    state.balance = userArray[which].PlayerBalance = 0;
    document.location.href = "#LosePage";
}
if(state.balance >= 20) {
    document.location.href = "#WinPage";
}
};

function GetNewBalance(balance) {
 var dice = [];
 RollDice(dice);
 var dice1txt = "images/dice-" + dice[0] + ".jpg";
 var dice2txt = "images/dice-" + dice[1] + ".jpg";
 document.getElementById("image1").src = dice1txt;
 document.getElementById("image2").src = dice2txt;
 balance=parseInt(balance);
 state.betAmount=parseInt(state.betAmount);
 if (dice[0] == dice[1] || dice[0] + dice[1] == 7 || dice[0] + dice[1] == 11) {
     balance = balance + state.betAmount;
     (document.getElementById("status")).innerText = "You Win!";
 }
 else {
     balance = balance - state.betAmount;
     (document.getElementById("status")).innerText = "You Lost!";
 }

 
 var turnCount = (document.getElementById("turnCount")).innerText;
 var turnCountInt = parseInt(turnCount);
 turnCountInt++;
 (document.getElementById("turnCount")).innerText = turnCountInt;

 return balance;
}

function RollDice(dice) {
 dice[0] = Math.floor((Math.random() * 6) + 1);
 dice[1] = Math.floor((Math.random() * 6) + 1);
}

function deletUser(){
    let which = $('#IDparmHere').text();
    $.ajax({
        type: 'DELETE',
        url: '/users/deleteuser/' + which
      }).done(function( response ) {  
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
    });
}

function findIndex(pString){
    for(i=0;i<userArray.length;i++){
        if(userArray[i]._id==pString){
            return i;
        }
    }
}

function updateDB(){
    var updateUser={
        balance:state.balance,
        playerID:state.player_id
    };
    console.log(updateUser);
    $.ajax({
        type: 'POST',
        data: updateUser,
        url: '/users/update',
        dataType: 'JSON'
      }).done(function( response ) {
    
        if (response.msg === '') {
        }
        else {
              // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);    
        };
    });
    document.location.href = "#Home";// end of calling mongo
}