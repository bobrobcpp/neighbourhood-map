

//Actual data model
var dataModel = {
  locations: []
};


// viewModel
var viewModel =function (){
  var self = this;

  self.filterText = ko.observable("");

  self.locationList = ko.observableArray( [] );
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
  self.bigUrl = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20170821&m=foursquare&query=Historic+Site&mode=url&radius=1000&ll=51.507351,-0.127758&limit=10&client_id=NYRK42K0WXYTE2W5YZQYISSRSPI13N40ZNX0VLOOLHDALLM0&client_secret=UJLKHHZUJOIFPXZZYJTQ3UUXCEI1OV4JOSQ1OOTWKIZHWWRX&v=20170821";
  $.getJSON(self.bigUrl, function(data){
    console.log(self.bigUrl);
    data.response.group.results.forEach(function(loc){
      console.log(loc.venue.name + ", Latitude: " + loc.venue.location.lat + ", Longitude: " + loc.venue.location.lng);
      this.record = new placeListItem(loc);
      self.locationList.push({lat: this.record.lat, lng: this.record.lng, name: this.record.name, bigPhoto: this.record.bigPhoto, smallPhoto: this.record.smallPhoto, rating: this.record.rating, checkins: this.record.checkins, infoContent: this.record.infoContent, formattedAddress: [this.record.formattedAddress], mark: this.record.mark});
    });
    self.locationList().forEach(function(rec){
      dataModel.locations.push(rec);
    });
    placeMarker(self.filteredList());




  })
  .then(function() {
//Empty

  })
  .fail(function() {
    alert( "Error in foursquare API request, please check site status" );
  });



    self.currentItem = ko.observable(self.locationList()[0]);
  };

//TO do check if all these things need to be ko.observables
var placeListItem = function(data){
  // var infowindow = new google.maps.InfoWindow();
  var self = this;
  self.lat = ko.observable(data.venue.location.lat);
  self.lng = ko.observable(data.venue.location.lng);
  self.name = ko.observable(data.venue.name);
  self.formattedAddress = ko.observableArray([data.venue.location.formattedAddress]);
  self.rating = ko.observable(data.venue.rating);
  self.checkins = ko.observable(data.venue.stats.checkinsCount);
  self.bigPhoto = data.photo.prefix + "200x200" + data.photo.suffix;
  self.smallPhoto = data.photo.prefix + "100x100" + data.photo.suffix;
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
    var contentString = "<div id='info-title'><h4>" + (self.name()).toString() + "</h4></div><div id='info-container'><br> <div id='info-window'><p><i class='fa fa-home info-icon' aria-hidden='true'> </i>";
    for (i = 0; i < self.formattedAddress()[0].length; i ++){
      contentString += ( self.formattedAddress()[0][i] + ", <br />");
    }

    contentString += ("</p><p> <i class='fa fa-star info-icon' aria-hidden='true'></i> " + self.rating() + "/10<br></p>" );
    contentString += ("<p> <i class='fa fa-child info-icon' aria-hidden='true'></i>" + self.checkins() + " total checkins </p></div>");
    contentString += ("<picture class='info-img'><source srcset='" + self.bigPhoto + "' media='(min-width: 500px)'><img srcset='" + self.smallPhoto + "'></picture></div>");


    contentString += "<p> Data sourced from <a href='https://developer.foursquare.com/'>Foursquare API </a></div>";
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

var infowindow;
    function showInfo(data){
    if(infowindow){
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow();
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
        });

      });

      map.fitBounds(latlngbounds);
          }
// end of google maps code

function googleError(){
  alert("Error in initialisation of google maps, please try reloading the page");
}

function listHide(){
  $('#listBox').toggleClass("collapse");
  $('#map').toggleClass("col-md-12");
  google.maps.event.trigger(map, "resize");
}

