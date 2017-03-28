  $(document).ready(function() {
    	// Inserting Firebase URL into dataRef variable
    	var dataRef = new Firebase("https://choochootrain.firebaseio.com/");


    	//Initializing empty variables
    	var name = "";
    	var destination = "";
    	var firstTrain = "";
    	var frequency = 0;

    	var trainIDs = []; 


    	//Displays current time!
    	var currentTime = moment().format('h:mm A'); 
    	$('#currentTime').html("Current Time: " + currentTime); 

    	//Add a train
    	$('#trainForm').on('submit', function(){

    		//Taking input values and storing them in variables
    		name = $('#nameInput').val().trim(); 
    		destination = $('#destinationInput').val().trim(); 
    		firstTrain = $('#firstTrainInput').val().trim(); 
    		frequency = $('#frequencyInput').val().trim(); 

			//Pushing input entries to Firebase
			dataRef.push({
					name: name,
					destination: destination,
					firstTrain: firstTrain,
					frequency: frequency,
			
			});

			 
			return false;

   })



	dataRef.on("child_added", function(snapshot) {

			var firstTrainMoment = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
			var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
			var remainder = diffTime % snapshot.val().frequency;
			var minUntilNextTrain = snapshot.val().frequency - remainder;
			var nextTrain = moment().add(minUntilNextTrain, "minutes");

			console.log("Train Name: " + snapshot.val().name);
			console.log("Destination: " + snapshot.val().destination);
			console.log("First Train: " + snapshot.val().firstTrain);
			console.log("Frequency: " + snapshot.val().frequency);
			console.log("Next Train Time: " + moment(nextTrain).format("hh:mm A"));
			console.log("Minutes Until: " + minUntilNextTrain);
			console.log("====================");


			$('#display').append("<tr><td id='nameDisplay'> "+snapshot.val().name +
					"</td><td id='destinationDisplay'> "+ snapshot.val().destination +
					"</td><td id='frequencyDisplay'> " + "Every " + snapshot.val().frequency + "mins" + 
					"</td><td id='nextArrivalDisplay'> " + moment(nextTrain).format("hh:mm A") + 
					"</td><td id='minsAwayDisplay'>" + minUntilNextTrain + " minutes until arrival"); 

	// Handle the errors
	}, function(errorObject){
			console.log("Errors handled: " + errorObject.code)
	});

	dataRef.once('value', function(dataSnapshot){ 
	var indexofTrains = 0;

	    dataSnapshot.forEach(
	        function(childSnapshot) {
	        	trainIDs[indexofTrains++] = childSnapshot.key();
	        }
	    );
	});

});


