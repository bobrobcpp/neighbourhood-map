

//Actual data model
var dataModel = {
  locations: []
};


// viewModel
var viewModel =function (){
  var self = this;
  self.locationList = ko.observableArray( [] );
  // self.markers = ko.observableArray( [] );
  self.bigUrl = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20170821&m=foursquare&query=Historic+Site&mode=url&radius=1000&ll=51.507351,-0.127758&limit=10&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  $.getJSON(self.bigUrl, function(data){
    console.log(self.bigUrl);
    data.response.group.results.forEach(function(loc){
      console.log(loc.venue.name + ", Latitude: " + loc.venue.location.lat + ", Longitude: " + loc.venue.location.lng);
      this.test = new placeListItem(loc.venue);
      // self.markers.push(this.test.mark);
      dataModel.locations.push({lat: this.test.lat, lng: this.test.lng, name: this.test.name, getLocationData: this.test.getLocationData, rating: this.test.rating, checkins: this.test.checkins, formattedAddress: [this.test.formattedAddress], mark: this.test.mark});
    });
    dataModel.locations.forEach(function(boc){
      self.locationList.push(boc);
    });
            placeMarker(self.locationList());

  })
  .then(function() {

  })
  .fail(function() {
    console.log( "Error in bigUrl request, please check URL" );
  });


    self.currentItem = ko.observable(self.locationList()[0]);
  };

//TO do check if all these things need to be ko.observables
var placeListItem = function(data){
  var that = this;
  this.lat = ko.observable(data.location.lat);
  this.lng = ko.observable(data.location.lng);
  this.name = ko.observable(data.name);
  this.newUrl = null;
  this.formattedAddress = ko.observableArray([data.location.formattedAddress]);
  this.rating = ko.observable(data.rating);
  this.checkins = ko.observable(data.stats.checkinsCount);
  var theLatLng = new google.maps.LatLng(this.lat(), this.lng());
  this.mark = new google.maps.Marker({
          position: theLatLng,
          map: map,
          draggable: true,
          // label: (index+1).toString(),
          animation: null,
          getLoc: function(){that.getLocationData();},
          toggleBounce: function() {
            var that = this;
            if (this.getAnimation() !== null) {
              this.setAnimation(null);
            } else {

              this.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){
                that.setAnimation(null);
               },2000);
            }
          }
        });


  this.getLocationData = function(){
    var baseUrl = "https://api.foursquare.com/v2/venues/explore?ll=<latlng>&radius=10&limit=4&section=sights&venuePhotos=1&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
    var chosenLoc = data;
    newUrl = baseUrl.replace(/<latlng>/, chosenLoc.location.lat + "," + chosenLoc.location.lng);
    console.log("New url = " + newUrl);

    $.getJSON(newUrl, function(data){
      console.log(newUrl);
      console.log("Success " + data.response.groups[0].items[0].venue.name);

    })
    .fail(function() {
      console.log( "Error in getJSON request, please check URL" );
    });

  };
};

ko.applyBindings(new viewModel());



//Google maps code

  var map;
  function initMap() {
    var startCoord = {lat:51.507351, lng: -0.127758};
    map = new google.maps.Map(document.getElementById('map'), {
        center: startCoord,
        zoom: 13,
    });

  }




  function placeMarker(locations) {
      var infowindow = new google.maps.InfoWindow();
      var latlngbounds = new google.maps.LatLngBounds();
      locations.forEach(function(loc, index, array){
        var myLatLng = new google.maps.LatLng(loc.lat(), loc.lng());
        latlngbounds.extend(myLatLng);

        var mark = loc.mark;
        mark.addListener('click', function(){
          this.getLoc();
          this.toggleBounce();
        var contentString = "<h4>" + (loc.name()).toString() + "</h4><br><h5> Address: </h5><div id='info-window'>";
        for (i = 0; i < loc.formattedAddress[0]()[0].length; i ++){
          contentString += ("<p>" + loc.formattedAddress[0]()[0][i] + "<br> </p>");
        }
        contentString += "</div>";
          infowindow.close();
          infowindow.setContent(contentString);
          infowindow.open(map, this);
        });

      });

      map.fitBounds(latlngbounds);
          }
// end of google maps code





