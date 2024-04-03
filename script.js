var waypoints = [];
    var map = L.map('mapid').setView([23.684994, 90.356331], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

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
    function placeCurrentLocationMarker(latlng) {
        if (currentLocationMarker) {
            currentLocationMarker.setLatLng(latlng);
        } else {
            currentLocationMarker = L.marker(latlng, { zIndexOffset: 1000 }).addTo(map);
        }
        map.panTo(latlng);
        updateWaypointsDisplay();
        drawPath();
    
        // Update the current location display
        document.getElementById('currentLocation').innerHTML = 'Current Location: ' + latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5);
    }
    
    map.on('click', function onMapClick(e) {
        var newWaypoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        waypoints.push(newWaypoint);
        updateWaypointsDisplay();
        drawPath();
    });


    function addCustomWaypoint() {
        // Retrieve and parse latitude and longitude values
        var lat = parseFloat(document.getElementById('latitude').value);
        var lng = parseFloat(document.getElementById('longitude').value);
    
        // Validate the coordinates
        if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
            alert("Please enter valid latitude and longitude values.");
            return;
        }
    
        // Prompt for additional waypoint details
        var detail = prompt("Enter details for this waypoint (e.g., 'Survey' or 'Deliver Aid'):", "Survey");
        if (!detail) {
            return; // Exit if no detail is provided
        }
    
        // Create a new waypoint object and marker
        var newWaypoint = {
            lat: lat,
            lng: lng,
            detail: detail,
            marker: L.marker([lat, lng], {
                title: detail
            }).addTo(map).bindPopup(detail) // Add marker to the map
        };
    
        // Push the new waypoint into the waypoints array
        waypoints.push(newWaypoint);
    
        // Call functions to update the waypoints display list and redraw the path
        updateWaypointsDisplay();
        drawPath();
    
        // Optionally clear the input fields after adding the waypoint
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    }












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