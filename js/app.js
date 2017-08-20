
var map;
var marker;
var locations = [
   {lat: 51.507351, lng: -0.127758},
   {lat: 51.500175, lng: -0.133233},
   {lat: 51.500729, lng: -0.124625 },
   {lat: 51.513845, lng: -0.098351},
   {lat: 51.519413, lng: -0.126957},
   {lat: 51.513614, lng: -0.136549},
   {lat: 51.511894, lng: -0.159366},
   {lat: 51.5299092, lng: -0.1860307}
   ]


function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: locations[0],
        zoom: 11,
    });

};





