//This file holds the classes and function that can be reused
//Need jquery to be called

//Enable persistent mode
if(firebase!=undefined){
	
	firebase.firestore().enablePersistence()
  	.then(function() {
      // Initialize Cloud Firestore through firebase
      var database = firebase.firestore();
  	});

}

var Utility = {
	formatTime: function(milliseconds) {
		if (milliseconds <= 0)
			return '00:00';

		var seconds = Math.round(milliseconds);
		var minutes = Math.floor(seconds / 60);
		if (minutes < 10)
			minutes = '0' + minutes;

		seconds = seconds % 60;
		if (seconds < 10)
			seconds = '0' + seconds;

		return minutes + ':' + seconds;
	}
};
var Manipulate = {
	//Slice string length if is over the defined value
	str_slice_exceed : function(str,val){
		if(str.length > val)
			return str.slice(0,val) + ' ..';
		else
			return str;
	},
	switchClasses : function(target, firstClass, secondClass){
		//elem.click(function(){
			if(target.hasClass(firstClass)){
				target.removeClass(firstClass);
				target.addClass(secondClass);
			}
			else if(target.hasClass(secondClass)){
				target.removeClass(secondClass);
				target.addClass(firstClass);
			}
		//});
}
}
var Effect = {
	//scroll to section smoothly
	smooth_scroll : function(delay){
		$('a[href^="#"]').click(function(e) {
			$('html,body').animate({ scrollTop: $(this.hash).offset().top}, delay);
			return false;
			e.preventDefault();
		});
	},
	//Hide and show side menu
	side_menu_toggle : function(menu,content,slide){
		$(menu).click(function(){
			if(slide)
				$(content).toggle();
			else
				$(content).slideToggle();
		});
		$('section').click(function(){
			if(slide)
				$(content).hide();
			else
				$(content).slideUp();
		});
	},
	//Stop loading page if the page is loaded
	page_loaded : function(app){
		$(window).on('load',function(){
			$('.loading').fadeOut();
			$(app).fadeIn();
		});
	},
	//Count input characters
	input_count : function(input, target, txt){
		var a = 0;
		$(input).keyup(function(){
			a = $(input).val().length;
			$(target).html(a+' '+txt);
		});

	},
	//SWIPE PAGES
	swipe_tabs : function(container, n){//container is an id of the main wrapper to slide
		var a = 0;
		var x = window.innerWidth;
		container.on('touchstart ', function(e){	
			
			container.on('touchend', function(e){
				for(var i = 0; i<n-1 ; i++){
					if(container.scrollLeft() >= x*i && container.scrollLeft() <= (x*i)+(x/2)){
						container.animate({scrollLeft:x*i},200);
					}else if(container.scrollLeft() >= (x*i)+(x/2) && container.scrollLeft() <= x*(i+1) ){
						container.animate({scrollLeft:(x*(i+1))},200);
					}
				}
			});
		});
	},
	//SLIDE RIGHT
	slide_right : function(elm,val){
		$(elm).on('touchstart', function(e){
			var a = e.originalEvent.touches[0].pageX;
			$(elm).on('touchmove', function(v){
				var b = v.originalEvent.touches[0].pageX;
				if(b < a - val){
					return true;
				}else{
					return false;
				}
			});
		});
	}


}

function Progress(){	

	this.hide = function(){
		$('.progress-default').hide();
	}

	this.show = function(){
		$('.progress-default').css('display','-webkit-flex');
	}

	this.message = function(msg){
		$('.progress-default .message').html(msg);
	}

}

//TOAST
$('body').append('<div class="toast "><div class="message"></div></div>');	
function Toast(message){
	$('.toast .message').html(message);
	$('.toast').fadeIn(600);
	setTimeout(function(){$('.toast').fadeOut(700)},3000);
}

//SNACK BAR
$('body').append('<div class="snack-bar flex justify-center align-center"><div class="text-white">'+data.text+'</div><div class="action text-simple">'+data.action+'</div></div>');
function Snack(data,onActionClicked){
	
	if(data.action == undefined){

		setTimeout(function(){$('.snack-bar').css('bottom','-100px');},3000);

	}

		if(data.action == undefined){
			data.action = '';
		}


		$('.snack-bar').animate({bottom:'0px'},100);

		$('.snack-bar').find('.action').click(function(){
			onActionClicked();
			$('.snack-bar').css('bottom','-100px');
		});

}


function AlertDialog(title){

	this.title = title;

	//CONSTRUCTOR
	$('.alertDialog .title').html(title);

	var message = function(msg){
		$('.alertDialog .message').html(msg);
	}

	var inputLabel = function(msg){
		$('.alertDialog label').html(msg);
	}

	var input = function(){
		return $('.alertDialog #input');
	}

	var show = function(){
		$('.alertDialog').show();
	}

	var hide = function(){
		$('.alertDialog').hide();
	}

	var positiveButton = function(val,func){
		$('.alertDialog .btn-ok').html(val);
		func();
	}

}

function isFormValid(user){//CREATE FUNCTION ERROR FIRST

	if(user.name != undefined){
		if(user.name ==""){
			Toast("Le nom est vide");
			return false;
		}
	}

	if(user.email != undefined){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(user.email ==""){
			Toast("Email est vide");
			return false;
		}else if(!re.test(String(user.email).toLowerCase())){
			Toast("Email incorrect");
			return false;
		}
	}

	if(user.phone != undefined){
		if(user.phone < 1){
			Toast("Le numero est requis");
			return false;
		}
		if(user.phone < 10000){
			Toast("Le numero est trop court");
			return false;
		}
	}


	if(user.password != undefined){
		if(user.password ==""){
			Toast("Le mot de passe est vide");
			return false;
		}else if(user.password.length<6){
			Toast("Mot de passe trop court");
			return false;
		}
	}

	if(user.password2 != undefined){
		 if(user.password2 != user.password){
			Toast("Les mots de passe ne correspondent pas");
			return false;
	}

	}

	return true;

}

function redirect(link){
	document.location.assign(link);
}

var drawerToggle = false;
function toggleDrawer(){

	if(drawerToggle){
		$('.drawer .content').animate({left:'-75vw'},200);
	
		$('.drawer').fadeOut(500);
	}else{

		$('.drawer .content').animate({left:'0vw'},250);
	
		$('.drawer').fadeIn(50);

	}

}

function hideDrawer(){
	$('.drawer .content').animate({left:'-75vw'},200);
	
	$('.drawer').fadeOut(400);
}