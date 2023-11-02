const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');

    // Filter the data based on the selected action
    if (action === 'block-wise') {
      // Filter the data to show only block-wise views
    } else if (action === 'routes-trails') {
      // Filter the data to show only routes and trails
    } else if (action === 'zoom-into-u-of-u') {
      // Zoom the map into the University of Utah
    } else if (action === 'macroscopic-view') {
      // Filter the data to show only macroscopic views
    }

    // Change the color of the active filter button
    filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    button.classList.add('active');
  });
});

var map = L.map('map').setView([40.7608,-111.8910], 100);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
   // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([40.7608,-111.8910]).addTo(map);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);