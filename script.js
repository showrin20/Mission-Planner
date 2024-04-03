var waypoints = [];
    var map = L.map('mapid').setView([40.7129822, -74.007205], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define a variable for the current location marker so it can be updated
    var currentLocationMarker;
    var pathPolylines = [];

    function placeCurrentLocationMarker(latlng) {
        if (currentLocationMarker) {
            currentLocationMarker.setLatLng(latlng);
        } else {
            currentLocationMarker = L.marker(latlng, { zIndexOffset: 1000 }).addTo(map);
        }
        map.panTo(latlng);
        updateWaypointsDisplay();
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
            placeCurrentLocationMarker(latlng);
            drawPath();
            document.getElementById('locationStatus').style.display = 'none';
        }, function(error) {
            alert("Unable to retrieve your location due to " + error.message);
            document.getElementById('locationStatus').innerText = 'Unable to find your location.';
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        getCurrentLocation();
    });

    map.on('click', function onMapClick(e) {
        var newWaypoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        waypoints.push(newWaypoint);
        updateWaypointsDisplay();
        drawPath();
    });

    function updateWaypointsDisplay() {
        var waypointList = document.querySelector('.waypoint-list');
        waypointList.innerHTML = '';
        if (currentLocationMarker) {
            var currentLatLng = currentLocationMarker.getLatLng();
            waypoints.forEach(function(wp, index) {
                var waypointLatLng = L.latLng(wp.lat, wp.lng);
                var distance = currentLatLng.distanceTo(waypointLatLng) / 1000;
                distance = distance.toFixed(2);
                waypointList.innerHTML += '<li>Waypoint ' + (index + 1) + ': ' + wp.lat + ', ' + wp.lng +
                                          ' - ' + distance + ' km away</li>';
            });
        }
    }

    function drawPath() {
        pathPolylines.forEach(function(polyline) {
            map.removeLayer(polyline);
        });
        pathPolylines = [];

        if (currentLocationMarker) {
            var currentLatLng = currentLocationMarker.getLatLng();

            waypoints.forEach(function(point) {
                var waypointLatLng = L.latLng(point.lat, point.lng);
                var polyline = L.polyline([currentLatLng, waypointLatLng], { color: 'red' });
                polyline.addTo(map);
                pathPolylines.push(polyline);
            });

            if (waypoints.length > 0) {
                var group = new L.featureGroup(pathPolylines);
                map.fitBounds(group.getBounds());
            }
        }
    }