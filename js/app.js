//Google maps code

  var map;
  var marker;
  function toggleBounce() {
    if (this.getAnimation() !== null) {
      this.setAnimation(null);
    } else {
      this.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: model.locations[0],
        zoom: 13,
    });
      model.locations.forEach(function(loc, index, array){
        mark = new google.maps.Marker({
          position: model.locations[index],
          map: map,
          draggable: true,
          title: "Hello London",
          label: "L",
          animation: null
        });
        mark.addListener('click', toggleBounce);


      });


  };

// function getLocationData(index){
// var baseUrl = "https://api.foursquare.com/v2/venues/search?ll=<latlng>&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
// var chosenLoc = model.locations[index];
// var newUrl = baseUrl.replace(/<latlng>/, chosenLoc.lat + "," + chosenLoc.lng);
//   console.log(newUrl)
// }

var model = {
  locations: [
   {lat: 51.507351, lng: -0.127758},
   {lat: 51.500175, lng: -0.133233},
   {lat: 51.500729, lng: -0.124625 },
   {lat: 51.513845, lng: -0.098351},
   {lat: 51.519413, lng: -0.126957},
   {lat: 51.513614, lng: -0.136549},
   {lat: 51.511894, lng: -0.159366},
   {lat: 51.5299092, lng: -0.1860307}
   ]
}



function viewModel(){
  var self = this;

  self.locationList = ko.observableArray( [] );


  model.locations.forEach(function(loc){
    self.locationList.push(new placeListItem(loc));
  });

  self.currentItem = ko.observable(self.locationList()[0]);

 // self.currentItem = ko.observable("Hello");
  // self.getLocationData = function(){

  //   var baseUrl = "https://api.foursquare.com/v2/venues/search?ll=<latlng>&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  //   var chosenLoc = self.currentItem;
  //   var newUrl = baseUrl.replace(/<latlng>/, chosenLoc.lat + "," + chosenLoc.lng);
  //   console.log(newUrl)
  // }


  // console.log("Current = " + self.currentItem);

  }


var placeListItem = function(data){
  this.lat = ko.observable(data.lat);
  this.name = "test";
}

ko.applyBindings(new viewModel());
