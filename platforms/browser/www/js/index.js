//FIREBASE
var database = firebase.database();

var progress = new Progress();
var alertDialog = new AlertDialog();


$(document).on('deviceready',onStart);


function onCreate(){

//..
// progress.message('Chargement..');
// progress.show();


firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			document.location.assign('../index.html');
		} else {
    	// User is signed out.
    	// ...
	}
});


}onCreate();


function onStart(){

	progress.hide();

	//prevent the size from remaining small when the input is focused
	//preventSizeError();



}

function login(){

	progress.message('Patientez..');

	var user = {
		email: $('#email').val(),
		password: $('#password').val()
	}

	if(isFormValid(user)){

		progress.show();

		firebase.auth().signInWithEmailAndPassword(user.email, user.password)
		.then(function(user){

			document.location.assign('../index.html');

		})
		.catch(function(error) {
			Toast(error.message);
			progress.hide();
		});

	}

}


function signup(){

	progress.message('Patientez..');

	var user = {
		name:$('#name').val(),
		email: $('#email').val(),
		phone: $('#phone').val(),
		password: $('#password').val(),
		password2: $('#password2').val()
	}
	
	if(isFormValid(user)){

		progress.show();


		//FIREBASE CREATE USER
		firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
		.then(function(response){

			//regester in db

			database.ref('users/'+firebase.auth().currentUser.uid)
			.set(user).then(function(snapshot){

				document.location.assign('../index.html');

			}).catch(function(err){
				Toast(err.message);
				progress().hide();
			});




		})
		.catch(function(error) {
			Toast(error.message);
			progress().hide();
		});


	}

	

}


function preventSizeError(){alert();

	$(document).on('backbutton',function(){
		$('#phone').blur(); alert();
	});

}



