var map;
var ZOOM = 14.5;
var currentPosition ;
var positionMarker;
var destinationMarker;
var destination = {};
var departMarker;
var back = {exit:true,search:false};

//Directions
var directionsService, directionsDisplay;

var countries = ['cd', 'rw', 'bi', 'ug'];


      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 0.3476, lng: 32.5825},
          zoom: ZOOM,
          disableDefaultUI: true
        });

        
        //Initialize the search
        initSearch();

        //change the toolbar behavior when the input is focussed
        backHandler();


        //Direction
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#023e58" } });
        directionsDisplay.setOptions( { suppressMarkers: true } );

        //Depart marker
        departMarker = new google.maps.Marker({
          map: map,
          icon:'img/post.png',
          title: 'Ma position'
        });

        //Draw marker to position
        destinationMarker = new google.maps.Marker({
          map: map,
          icon:'img/marker.png',
          title: 'Ma position'
        });



      }




//Get the device current position;
navigator.geolocation.getCurrentPosition(function(position){

  currentPosition = {lat:position.coords.latitude,lng:position.coords.longitude};

  //Draw
  drawCurrentPosition(currentPosition); 


},function(err){
  Toast(err.message+'\n Activez votre GPRS');
});



//Initialize the device current position
function drawCurrentPosition(pos){

  positionMarker = new google.maps.Marker({
    position: pos,
    map: map,
    icon:'img/location.png',
    title: 'Ma position'
  });
  //Show marker
  positionMarker.setMap(map);
  //Move camera to marker
  map.panTo(new google.maps.LatLng(pos.lat,pos.lng));
  map.setZoom(ZOOM);

}



//Watch the device position
navigator.geolocation.watchPosition(function(position){

  //Reset marker
  positionMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
 

},function(err){
  Toast(err.message);
},2000);


function relocate(){

  //Draw
  drawCurrentPosition(currentPosition); 

  Toast('Ma position');

}




//listen for the user searching for the location
function initSearch(){


// //Search box input
var searchBox = document.getElementById('searchBox');


var options = {
    componentRestrictions: {country: countries}
};

//Google place autocomplete
var autocomplete = new google.maps.places.Autocomplete(searchBox);
    autocomplete.bindTo('bounds',map);


//Listen for the search box 
autocomplete.addListener('place_changed', function(){   

  var place = autocomplete.getPlace();

  //Get the destination name
  destination.name = place.formatted_address;

  if(!place.geometry){//The user entered a place that was not suggested and pressed enter.

    Toast("Aucun lieu n'a été trouvé à ce nom!");
    return;

  }
  
  //Destination
  var org = new google.maps.LatLng(currentPosition.lat,currentPosition.lng);

  //Draw depart marker
  drawDepartMarker(org);

  //Draw a marker at the position found
  drawDestinationMarker(place.geometry.location);

  //Draw a route between the two points
  drawRoute(org,place.geometry.location);

  map.setZoom(ZOOM); 


  $('#searchBox').val('');
    

});

}


//Draw marker
function drawDestinationMarker(pos){

  //Remove previous marker
  destinationMarker.setMap(null);
  
  //Position
  destinationMarker.setPosition(pos);

  //Show marker
  destinationMarker.setMap(map);

}

function drawDepartMarker(pos){

  //Remove previous marker
  departMarker.setMap(null);

  //Position
  departMarker.setPosition(pos);

  //Show marker
  departMarker.setMap(map);

}

//Draw a route between two points
function drawRoute(org,dest) {

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(org);
        bounds.extend(dest);
        map.fitBounds(bounds);
        var request = {
            origin: org,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);

                var dist= 0;
                for(i = 0; i < response.routes[0].legs.length; i++){
                 dist += parseFloat(response.routes[0].legs[i].distance.value);
                //for each 'leg'(route between two waypoints) we get the distance and add it to the total
                }

                //get the distance of multiple way points
                destination.distance = dist;

                //Show the request window
                requestWindow();

            } else {
                Toast('Réesayez');
            }
        });

}


//show the request window
function requestWindow(){

  $('.request').css({display:'-webkit-flex'});
  $('#destination').html(destination.name);
  $('#distance').html(destination.distance);

}


function backHandler(){

  //On search focused
  $('#searchBox').on('focus',function(){back.search = true;back.exit=false});
  $('#searchBox').on('blur',function(){back.search = false;back.exit=true});

  $(document).on('deviceready',function(){

    $(document).on('backbutton',function(){
      
      if(back.exit){
        navigator.app.exitApp();
      }

      if(back.search){
        $('#searchBox').blur();
      }

    });

  });

}


































var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];