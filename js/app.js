

var geocoder;
var map;
var marker;
var directionsService;
var locArray = [];


function initMap() {

     directionsService = new google.maps.DirectionsService();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 5,
    });

};





