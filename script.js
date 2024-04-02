var waypoints = [];

var map = L.map('mapid').setView([40.7129822, -74.007205], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function onMapClick(e) {
    var newWaypoint = { lat: e.latlng.lat, lng: e.latlng.lng };
    waypoints.push(newWaypoint);
    updateWaypointsDisplay();
    drawPath();
}

map.on('click', onMapClick);

function updateWaypointsDisplay() {
    var waypointList = document.querySelector('.waypoint-list');
    waypointList.innerHTML = '';
    waypoints.forEach(function(wp, index) {
        waypointList.innerHTML += '<li>Waypoint ' + (index + 1) + ': ' + wp.lat + ', ' + wp.lng + '</li>';
    });
}

// Initialize a polyline layer to represent the path
var polyline = L.polyline([], {color: 'red'}).addTo(map);

function drawPath() {
    polyline.setLatLngs([]);
    waypoints.forEach(function(point) {
        polyline.addLatLng([point.lat, point.lng]);
    });

    map.fitBounds(polyline.getBounds());
}
