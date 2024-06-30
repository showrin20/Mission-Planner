// Create a map centered at the coastal area of Bangladesh, for example, near Bhola Island
var map = L.map('map').setView([22.47, 90.70], 13); // Adjust the coordinates and zoom level

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to generate random latitude and longitude within clusters around a specific range
function getRandomLatLng(clusterCenter, clusterRadius) {
    var angle = Math.random() * Math.PI * 2;
    var radius = clusterRadius * Math.sqrt(Math.random());
    var lat = clusterCenter.lat + radius * Math.cos(angle);
    var lng = clusterCenter.lng + radius * Math.sin(angle);
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

// Define clusters with their centers and radius
var clusters = [
    { center: { lat: 22.47, lng: 90.70 }, radius: 0.02 },
    { center: { lat: 22.44, lng: 90.68 }, radius: 0.02 },
    { center: { lat: 22.49, lng: 90.72 }, radius: 0.02 }
];

// Generate random locations
var locations = [];
clusters.forEach(function(cluster) {
    for (var i = 0; i < 20; i++) { // Generate 20 random locations per cluster
        var randomLatLng = getRandomLatLng(cluster.center, cluster.radius);
        var randomRiskImpact = getRandomRiskImpact();
        locations.push({
            lat: randomLatLng.lat,
            lng: randomLatLng.lng,
            risk: randomRiskImpact.risk,
            impact: randomRiskImpact.impact
        });
    }
});

// Add markers to the map
locations.forEach(function(location) {
    var color = getColor(location.risk, location.impact);
    L.circleMarker([location.lat, location.lng], {
        radius: 10, // Larger radius for bigger markers
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map)
    .bindPopup(`Risk: ${location.risk}<br>Impact: ${location.impact}`);
});

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
