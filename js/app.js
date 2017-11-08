var intLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var largeInfowindow = new google.maps.InfoWindow();

var Location = function(data,marker) {
	var self = this;

	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.marker = marker;
	this.address = "";

	this.marker.addListener('click', function() {
		self.populateInfoWindow();
	});

	this.populateInfoWindow = function() {
	
		if (largeInfowindow.marker != this.marker) {
			largeInfowindow.setContent('');
			largeInfowindow.marker = this.marker;
			
			largeInfowindow.addListener('closeclick', function() {
				largeInfowindow.marker = null;
			});
			
			var url = "https://api.foursquare.com/v2/venues/search?ll=" + self.marker.position.lat() + "," + self.marker.position.lng() + "&radius=100&query=coffee&client_id=OAIH0OFTDDDNP4HTII3HF2EJAKCHCUFQQS5XODSYUEYBCIBL&client_secret=EBIUKBC44SJO1LLYHL1ECL33ICOEL542E4KP2XSTYRSLRNAN&v=20171106";

			$.ajax({
				url: url,
				success: function(data) {
					var html = '<div class="info-title"><strong>List of Near By Coffee Shops (100m)</strong></div><br>'
					if (data.response.venues.length != 0) {
						data.response.venues.forEach(function(venue){
							html += '<div class="info-item">' + venue.name + ': ' + venue.location.address + '</div>'
						});}
					else {
						html += 'Sorry, no coffee for you.';
					}
					largeInfowindow.setContent(html);
			 	},
			 	error: function() {

			 	}
			 })

			largeInfowindow.open(map,this.marker);
		}
	}
}

var ViewModel = function() {
	var self = this;

	this.map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13,
	});

	this.locations = ko.observableArray([]);
	this.searchTerm = ko.observable("");

	this.searchList = ko.computed(function(){
		var searchResult = ko.observableArray([]);
		self.locations().forEach(function(location) {
			if (location.title().toLowerCase().indexOf(self.searchTerm().toLowerCase()) >= 0) {
				location.marker.setMap(self.map);
				searchResult.push(location);
			} else {
				location.marker.setMap(null);
			}
		})
		return searchResult
	},this);
	
	intLocations.forEach(function(location) {
		self.locations.push(new Location(location, new google.maps.Marker({
			position: location.location,
			title: location.title,
			animation: google.maps.Animation.DROP
		})));
	});

}

ko.applyBindings(new ViewModel());

