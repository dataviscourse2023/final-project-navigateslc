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
