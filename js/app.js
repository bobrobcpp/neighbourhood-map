

//Empty data model initialised
var dataModel = {
  locations: []
};


// KnockoutJs viewModel
var viewModel =function (){
  var self = this;
  //Declare filtered list to display
  self.filterText = ko.observable("");
  //Declare backing list prefilter
  self.locationList = ko.observableArray( [] );
  //Define filtered list to be filter of locationList
        self.filteredList = ko.computed(function() {
        if(!self.filterText) {
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(item) {
              if(item.name().toLowerCase().indexOf((self.filterText().toLowerCase())) > -1){
                item.mark.setVisible(true);
              } else {
                item.mark.setVisible(false);
              }
                return (item.name().toLowerCase().indexOf((self.filterText().toLowerCase())) > -1);
            });
        }
    });
// Perform AJAX request to get data from the foursquare API
  self.bigUrl = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20170821&m=foursquare&query=Historic+Site&mode=url&radius=1000&ll=51.507351,-0.127758&limit=10&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  $.getJSON(self.bigUrl, function(data){
    //If AJAX request is succesful....
    data.response.group.results.forEach(function(loc){
      this.record = new placeListItem(loc);
      self.locationList.push({lat: this.record.lat, lng: this.record.lng, name: this.record.name, bigPhoto: this.record.bigPhoto, smallPhoto: this.record.smallPhoto, rating: this.record.rating, checkins: this.record.checkins, infoContent: this.record.infoContent, formattedAddress: [this.record.formattedAddress], mark: this.record.mark});
    });
    // Push data from the view Model locationList to the data model. TODO use local storage or firebase for this data model.
    self.locationList().forEach(function(rec){
      dataModel.locations.push(rec);
    });
    // Markers dynamically placed according to filteredList
    placeMarker(self.filteredList());

  })
  .fail(function() {
    // Handle error in AJAX request
    alert( "Error in foursquare API request, please check site status" );
  });



    self.currentItem = ko.observable(self.locationList()[0]);
    //end of viewModel
  };

// Structure of placeListItem with all the data properties for each location
var placeListItem = function(data){
  var self = this;
  self.lat = data.venue.location.lat;
  self.lng = data.venue.location.lng;
  self.name = ko.observable(data.venue.name);
  self.formattedAddress = [data.venue.location.formattedAddress];
  self.rating = data.venue.rating;
  self.checkins = data.venue.stats.checkinsCount;
  self.bigPhoto = data.photo.prefix + "200x200" + data.photo.suffix;
  self.smallPhoto = data.photo.prefix + "100x100" + data.photo.suffix;
  var theLatLng = new google.maps.LatLng(self.lat, self.lng);
// Properties of google maps marker defined including the bouncing animation of a marker when clicked
  self.mark = new google.maps.Marker({
          position: theLatLng,
          map: map,
          draggable: false,
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

  //Compose the contents of each infoWindow with the properties of the location
  self.infoContent = function() {
    var contentString = "<div id='info-title'><h4>" + (self.name()).toString() + "</h4></div><div id='info-container'><br> <div id='info-window'><p><i class='fa fa-home info-icon' aria-hidden='true'> </i>";
    for (i = 0; i < self.formattedAddress[0].length; i ++){
      contentString += ( self.formattedAddress[0][i] + ", <br />");
    }

    contentString += ("</p><p> <i class='fa fa-star info-icon' aria-hidden='true'></i> " + self.rating + "/10<br></p>" );
    contentString += ("<p> <i class='fa fa-child info-icon' aria-hidden='true'></i>" + self.checkins + " total checkins </p></div>");
    // Serve a larger image for PC and smaller image for mobile devices
    contentString += ("<picture class='info-img'><source srcset='" + self.bigPhoto + "' media='(min-width: 500px)'><img class='info-img' srcset='" + self.smallPhoto + "'></picture></div>");
// Foursquare attribution with link
    contentString += "<p> Data sourced from <a href='https://developer.foursquare.com/'> <i class='fa fa-foursquare fa-2x' aria-hidden='true'></i> Foursquare API </a></div>";
    return contentString;
  };
//End of placeListItem definition
};
// Neccessary for knockout JS bindings
ko.applyBindings(new viewModel());



//Google maps code
// Declare map
  var map;
// Intialise the map with coordinates in central london and zoom level set
  function initMap() {
    var startCoord = {lat:51.507351, lng: -0.127758};
    map = new google.maps.Map(document.getElementById('map'), {
        center: startCoord,
        zoom: 13,
    });
  }

  var infoWindow;
    function showInfo(data){
      //Close open infoWindow when a new one is opened
    if(infoWindow){
      infoWindow.close();
    }
    // On mobile devices hide the list once a location has been selected as list takes up entire view
    if(($(window).width() - $("#form-list").width()) < 500) {
      listHide();
    }
    infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(data.infoContent());
    infoWindow.open(map, data.mark);
    data.mark.toggleBounce();
    map.panTo(data.mark.getPosition());
}

  function placeMarker(locations) {
      var latlngbounds = new google.maps.LatLngBounds();
      locations.forEach(function(loc, index, array){
        var myLatLng = new google.maps.LatLng(loc.lat, loc.lng);
        //Create boundary parameters to extend around the markers
        latlngbounds.extend(myLatLng);
        var mark = loc.mark;
        //Open the info window when marker is clicked
        mark.addListener('click', function(){
          showInfo(loc);
        });
      });
//Scale the ap to the boundary parameters
      map.fitBounds(latlngbounds);
          }
// end of google maps code

//Handle errors in google maps load
function googleError(){
  alert("Error in initialisation of google maps, please try reloading the page");
}
// Function to collapse the list and expand map to full page
function listHide(){
  $('#listBox').toggleClass("collapse");
  $('#map').toggleClass("col-md-12");
  google.maps.event.trigger(map, "resize");
}

