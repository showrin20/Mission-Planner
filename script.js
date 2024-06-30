// Create a map centered at the coastal area of Bangladesh, for example, near Bhola Island
var map = L.map('map').setView([22.47, 90.70], 13); // Adjust the coordinates and zoom level

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to generate random latitude and longitude within a specific small range
function getRandomLatLng() {
    // Latitude range around Bhola Island: 22.42 to 22.52
    // Longitude range around Bhola Island: 90.65 to 90.75
    var lat = 22.42 + (Math.random() * (22.52 - 22.42));
    var lng = 90.65 + (Math.random() * (90.75 - 90.65));
    return { lat: lat, lng: lng };
}

// Function to generate random risk and impact levels
function getRandomRiskImpact() {
    var risks = ['high', 'medium', 'low'];
    var impacts = ['severe', 'moderate', 'low'];
    var risk = risks[Math.floor(Math.random() * risks.length)];
    var impact = impacts[Math.floor(Math.random() * impacts.length)];
    return { risk: risk, impact: impact };
}

// Function to get color based on risk and impact
function getColor(risk, impact) {
    if (risk === 'high' && impact === 'severe') {
        return 'red';
    } else if (risk === 'medium' && impact === 'moderate') {
        return 'orange';
    } else if (risk === 'low' && impact === 'low') {
        return 'green';
    } else {
        return 'blue'; // Default color
    }
}

// Generate random locations
var locations = [];
for (var i = 0; i < 50; i++) { // Generate 50 random locations
    var randomLatLng = getRandomLatLng();
    var randomRiskImpact = getRandomRiskImpact();
    locations.push({
        lat: randomLatLng.lat,
        lng: randomLatLng.lng,
        risk: randomRiskImpact.risk,
        impact: randomRiskImpact.impact
    });
}

// Add markers to the map
var markers = [];
locations.forEach(function(location) {
    var color = getColor(location.risk, location.impact);
    var marker = L.circleMarker([location.lat, location.lng], {
        radius: 10, // Larger radius for bigger markers
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map)
    .bindPopup(`Risk: ${location.risk}<br>Impact: ${location.impact}`);
    markers.push(marker);
});

// Function to update the locations and properties of the markers
function updateMarkers() {
    markers.forEach(function(marker, index) {
        var randomLatLng = getRandomLatLng();
        var randomRiskImpact = getRandomRiskImpact();
        var color = getColor(randomRiskImpact.risk, randomRiskImpact.impact);
        marker.setLatLng([randomLatLng.lat, randomLatLng.lng])
            .setStyle({
                fillColor: color,
                color: color
            })
            .bindPopup(`Risk: ${randomRiskImpact.risk}<br>Impact: ${randomRiskImpact.impact}`);
    });
}

// Update the markers every 2 seconds
setInterval(updateMarkers, 2000);

// Add a legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    var grades = ['high-severe', 'medium-moderate', 'low-low'];
    var labels = ['<strong>Risk & Impact</strong>'];
    var colors = {
        'high-severe': 'red',
        'medium-moderate': 'orange',
        'low-low': 'green'
    };

    grades.forEach(function(grade) {
        labels.push(
            '<i style="background:' + colors[grade] + '"></i> ' +
            grade.replace('-', ' & ')
        );
    });

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
