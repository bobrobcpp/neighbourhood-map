

//Actual data model
var dataModel = {
  locations: []
};


// viewModel
var viewModel =function (){
  var self = this;

  self.locationList = ko.observableArray( [] );
  self.bigUrl = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20170821&m=foursquare&query=Historic+Site&mode=url&radius=1000&ll=51.507351,-0.127758&limit=10&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  $.getJSON(self.bigUrl, function(data){
    console.log(self.bigUrl);
    data.response.group.results.forEach(function(loc){
      console.log(loc.venue.name + ", Latitude: " + loc.venue.location.lat + ", Longitude: " + loc.venue.location.lng);
      this.record = new placeListItem(loc.venue);
      self.locationList.push({lat: this.record.lat, lng: this.record.lng, name: this.record.name, rating: this.record.rating, infoContent: this.record.infoContent, formattedAddress: [this.record.formattedAddress], mark: this.record.mark});
    });
    self.locationList().forEach(function(rec){
      dataModel.locations.push(rec);
    });
    placeMarker(self.locationList());

  })
  .then(function() {
//Empty

  })
  .fail(function() {
    console.log( "Error in bigUrl request, please check URL" );
  });



    self.currentItem = ko.observable(self.locationList()[0]);
  };

//TO do check if all these things need to be ko.observables
var placeListItem = function(data){
  // var infowindow = new google.maps.InfoWindow();
  var self = this;
  self.lat = ko.observable(data.location.lat);
  self.lng = ko.observable(data.location.lng);
  self.name = ko.observable(data.name);
  self.formattedAddress = ko.observableArray([data.location.formattedAddress]);
  self.rating = ko.observable(data.rating);
  self.checkins = ko.observable(data.stats.checkinsCount);
  var theLatLng = new google.maps.LatLng(self.lat(), self.lng());

  self.mark = new google.maps.Marker({
          position: theLatLng,
          map: map,
          draggable: true,
          // label: (index+1).toString(),
          animation: null,
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
  self.infoContent = function() {
    var contentString = "<h4>" + (self.name()).toString() + "</h4><br><h5> Address: </h5><div id='info-window'>";
    for (i = 0; i < self.formattedAddress()[0].length; i ++){
      contentString += ("<p>" + self.formattedAddress()[0][i] + "<br> </p>");
    }
    contentString += "</div>";
    return contentString;
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


function showInfo(data){
  if(infowindow){
      infowindow.close();
    }
    var infowindow = new google.maps.InfoWindow();


    infowindow.setContent(data.infoContent());
    infowindow.open(map, data.mark);
    data.mark.toggleBounce();
}

  function placeMarker(locations) {

      var latlngbounds = new google.maps.LatLngBounds();
      locations.forEach(function(loc, index, array){
        var myLatLng = new google.maps.LatLng(loc.lat(), loc.lng());
        latlngbounds.extend(myLatLng);

        var mark = loc.mark;
        mark.addListener('click', function(){
          showInfo(loc);
        // var contentString = "<h4>" + (loc.name()).toString() + "</h4><br><h5> Address: </h5><div id='info-window'>";
        // for (i = 0; i < loc.formattedAddress[0]()[0].length; i ++){
        //   contentString += ("<p>" + loc.formattedAddress[0]()[0][i] + "<br> </p>");
        // }
        // contentString += "</div>";
        //   infowindow.close();
        //   infowindow.setContent(contentString);
        //   infowindow.open(map, this);
        });

      });

      map.fitBounds(latlngbounds);
          }
// end of google maps code



