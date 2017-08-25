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
          title: "Hello ",
          label: model.locations[index].name,
          animation: null
        });
        mark.addListener('click', toggleBounce);


      });


  };
// end of google maps code


//Data model shouldn't be used
var model = {
  locations: [
   {lat: 51.507351, lng: -0.127758, name: "1"},
   {lat: 51.500175, lng: -0.133233, name: "2"},
   {lat: 51.500729, lng: -0.124625, name: "3"},
   {lat: 51.513845, lng: -0.098351, name: "4"},
   {lat: 51.519413, lng: -0.126957, name: "5"},
   {lat: 51.513614, lng: -0.136549, name: "6"},
   {lat: 51.511894, lng: -0.159366, name: "7"},
   {lat: 51.5299092, lng: -0.1860307, name: "8"}
   ]
}


//Actual data model
var dataModel = {
  locations: []
}


// viewModel
var viewModel =function (){
  var self = this;
  self.locationList = ko.observableArray( [] );
  self.locationTest = ko.observableArray( [] );
  self.bigUrl = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20170821&m=foursquare&query=Historic+Site&mode=url&radius=1000&ll=51.507351,-0.127758&limit=10&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  $.getJSON(self.bigUrl, function(data){
    console.log(self.bigUrl);
    data.response.group.results.forEach(function(loc){
      console.log(loc.venue.name + ", Latitude: " + loc.venue.location.lat + ", Longitude: " + loc.venue.location.lng);
// self.locationList.push(new placeListItem(loc.venue));
      this.test = new placeListItem(loc.venue);
      dataModel.locations.push({name: this.test.name});
      // dataModel.locations.push(new placeListItem(loc.venue));
    });
    dataModel.locations.forEach(function(boc){
      self.locationList.push(new placeListItem(boc));
    });

  })
  .fail(function() {
    console.log( "Error in bigUrl request, please check URL" );
  });

//Shouldn't be required
      // model.locations.forEach(function(coc){
      //   self.locationTest.push(new placeListItem(coc));
      // });

    self.currentItem = ko.observable(self.locationList()[0]);
// Should be bound to locationList above!
  // self.currentItem = ko.observable(self.locationTest()[0]);

  }


var placeListItem = function(data){
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);

  // this.lat = ko.observable(data.location.lat);
  // this.lng = ko.observable(data.location.lng);
  this.name = ko.observable(data.name);
  this.newUrl;


  this.getLocationData = function(){
    var getLocationData;
    var baseUrl = "https://api.foursquare.com/v2/venues/explore?ll=<latlng>&limit=4&section=sights&venuePhotos=1&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
    var chosenLoc = data;
    newUrl = baseUrl.replace(/<latlng>/, chosenLoc.location.lat + "," + chosenLoc.location.lng);
    console.log("New url = " + newUrl);

    $.getJSON(newUrl, function(data){
      console.log(newUrl);
      // console.log("Success " + data.response.venues[0].name);
      console.log("Success " + data.response.groups[0].items[0].venue.name);

    })
    .fail(function() {
      console.log( "Error in getJSON request, please check URL" );
    });

  }
}

ko.applyBindings(new viewModel());
