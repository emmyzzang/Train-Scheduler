alert('Gotta Go Fast!'); 

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyByvaeFk7g4DveE5NMZgqEOthAxACp1UR4",
    authDomain: "train-scheduler-794cb.firebaseapp.com",
    databaseURL: "https://train-scheduler-794cb.firebaseio.com",
    projectId: "train-scheduler-794cb",
    storageBucket: "",
    messagingSenderId: "992040419184"
  };
  firebase.initializeApp(config);


var database = firebase.database();

// Button for adding new trains
$("#add-train-btn").click(function(event){

// Prevent defaults from submitting even when event not handled
  event.preventDefault();

// Grab user input and stores it into declarative variables
  var newTrain = $("#train-name-input").val().trim();
  var newDestination = $("#destination-input").val().trim();
  var newFirstTrain = $("#first-train-input").val().trim();
  var newFrequency = $("#frequency-input").val().trim();

// Create local "temporary" object for holding train data
  newObject = {
    train: newTrain,
    destination: newDestination,
    firstTrain: newFirstTrain,
    frequency: newFrequency
  };

// Uploads newObject train data to the database 
// This will "trigger" the "child_added" event
    database.ref().push(newObject);

// Logs everything to console
      console.log(newObject.train);
      console.log(newObject.destination);
      console.log(newObject.firstTrain);
      console.log(newObject.frequency);

      alert("Choo Choo! Train Successfully Added!");

// Flush out the input wells 
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");

});

// Create Firebase event for adding train to the database 
// And a row in the html when a user adds an entry
// "child_added" is a firebase event, such as "child-removed", "child_changed", and "child_moved"

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

   console.log(childSnapshot.val());

      // Store everything into a variable.
      var newTrain = childSnapshot.val().train;
      var newDestination = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFrequency = childSnapshot.val().frequency;

        // Train Info
        console.log(newTrain);
        console.log(newDestination);
        console.log("FIRST TRAIN DEPARTED AT: " + newFirstTrain);
        console.log("THE TRAIN ARRIVES EVERY " + newFrequency + " MINUTES");
  
        // Convert the first train time 
        var firstTrainConverted = moment(newFirstTrain, "hh:mm").subtract(1, "days");
        console.log(firstTrainConverted);;
      

        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var timeApart = diffTime % newFrequency;
        console.log("MINUTES TO SUBTRACT FROM FREQUENCY: " + timeApart);

        var minutesAway = newFrequency - timeApart;
        console.log("MINUTES UNTIL TRAIN: " + minutesAway);

        var nextArrival = moment().add(minutesAway, "minutes");
        var nextArrival2 = moment(nextArrival).format("hh:mm");

        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + newTrain + "</td> <td>" + newDestination + "</td> <td>" +
        newFrequency + "</td><td>" + nextArrival2 + "</td><td>" + minutesAway + "</td></tr>");


});

