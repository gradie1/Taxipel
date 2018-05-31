//FIREBASE

var progress = new Progress();
var alertDialog = new AlertDialog();


$(document).on('deviceready',onStart);


function onCreate(){

//..
progress.message('Chargement..');


firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		
	} else {
    	redirect('pages/login.html');
	}
});


}onCreate();


function onStart(){

	

	//prevent the size from remaining small when the input is focused
	//preventSizeError();



}

















function logout(){

	firebase.auth().signOut().then(function() {
		
		redirect("pages/login.html");

	}, function(error) {
		
		Snack({text:'Réesayez',action:'Voir erreur?'},function(){alert(error.message);});

	});

}