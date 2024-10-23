// Create a map centered along the Jamuna River, near Sariakandi, Bogura
var map = L.map('map').setView([24.833, 89.624], 13); // Centered on the Jamuna River

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to generate random latitude and longitude near the Jamuna River
function getRandomLatLng() {
    // Latitude range near the river: 24.82 to 24.85
    // Longitude range near the river: 89.60 to 89.65
    var lat = 24.82 + (Math.random() * (24.85 - 24.82));
    var lng = 89.60 + (Math.random() * (89.65 - 89.60));
    return { lat: lat, lng: lng };
}

// Function to assign risk levels with colors for erosion-prone areas
function getErosionRisk() {
    var risks = ['high', 'medium', 'low']; // Erosion risks
    var risk = risks[Math.floor(Math.random() * risks.length)];
    return risk;
}

// Function to determine marker color based on erosion risk
function getColor(risk) {
    if (risk === 'high') return 'red';     // High erosion risk
    if (risk === 'medium') return 'green'; // Medium erosion risk
    return 'blue';                         // Low erosion risk
}

// Generate random erosion-prone locations
var locations = [];
for (var i = 0; i < 50; i++) { // Generate 50 locations
    var randomLatLng = getRandomLatLng();
    var erosionRisk = getErosionRisk();
    locations.push({
        lat: randomLatLng.lat,
        lng: randomLatLng.lng,
        risk: erosionRisk
    });
}

// Add markers to the map with appropriate colors and popups
var markers = [];
locations.forEach(function (location) {
    var color = getColor(location.risk);
    var marker = L.circleMarker([location.lat, location.lng], {
        radius: 8, // Marker size
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    }).addTo(map)
    .bindPopup(`Erosion Risk: ${location.risk}`);
    markers.push(marker);
});

// Function to update marker positions and erosion risks dynamically
function updateMarkers() {
    markers.forEach(function (marker) {
        var randomLatLng = getRandomLatLng();
        var erosionRisk = getErosionRisk();
        var color = getColor(erosionRisk);
        marker.setLatLng([randomLatLng.lat, randomLatLng.lng])
            .setStyle({ fillColor: color, color: color })
            .bindPopup(`Erosion Risk: ${erosionRisk}`);
    });
}

// Update markers every 3 seconds to simulate dynamic changes
setInterval(updateMarkers, 3000);

// Add a legend to the map for erosion risk categories
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    var grades = ['high', 'medium', 'low'];
    var labels = ['<strong>Erosion Risk</strong>'];
    var colors = { high: 'red', medium: 'green', low: 'blue' };

    grades.forEach(function (grade) {
        labels.push(
            `<i style="background: ${colors[grade]}"></i> ${grade.charAt(0).toUpperCase() + grade.slice(1)}`
        );
    });

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
