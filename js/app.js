var intLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

function populateInfoWindow(marker,infowindow) {
	if (infowindow.marker != marker) {
		infowindow.setContent('Hello');
		infowindow.marker = marker;
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});

		infowindow.open(map,marker)
	}
}

var largeInfowindow = new google.maps.InfoWindow();

var Location = function(data,marker) {
	var self = this;

	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.marker = marker;

	self.marker.addListener('click', function() {
		populateInfoWindow(self.marker, largeInfowindow);
	});
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
		var searchResult = [];
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
			title: location.title
		})));
	});



}

ko.applyBindings(new ViewModel());

