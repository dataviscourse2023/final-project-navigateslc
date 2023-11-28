
# NavigateSLC

As international students, we face difficulties moving into a new home and a new environment in another country. While numerous sites try to be helpful, there is a glaring gap: there isn't a single, all-inclusive website that can easily provide a comprehensive summary of crucial information.

Our goal is to create a web application that, in addition to filling the information gap, improves the educational experience for students by featuring an interactive map as its main feature. This interactive map will be a thorough resource, arming students with the information they need to choose a residence best suited to their unique needs and preferences.



## Overview

Our project is structured as shown below:
```
final-project-navigateslc
├── data/
│   ├── new_assorted_data.csv
│   ├── new_bock_groups.geojson
│   ├── new_rent_data.csv
│   ├── UTA_Routes_and_Most_Recent_Ridership.geojson
│   ├── Utah_Trails_and_Pathways.geojson
│   └── Utah_weather_yearround.csv
├── js/
│   ├── block_visualizations.js
│   ├── bus_list.js
│   ├── macroscopic_viz.js
│   ├── map.js
│   ├── script.js
│   └── trails_list.js
├── add_id.py
├── fixing_dataset.py
├── index.html
├── Process_book.pdf
└── style.css
```

The files necessary to build the website are the /data, /js, index.html and style.css

The files add_id.py and fixing_dataset.py are python scripts used for preprocessing the datasets.

Moving on to the js files, as shown above the various visualizations of the website are split across different files.

### script.js
This is our main script file and is what calls all the function from the other script files.
It handles functions to load the data from /data, instantiates the global variable to access this data from all the other script files and also handles the button events to switch between different visualzations.
***All the code in this file is handwritten, no libraries are used (apart from d3)***

### map.js
As mentioned in the process book, the interactive map is our main visualization. This file contains the code to create a map using the [Leaflet](https://leafletjs.com/) JavaScript library, and to add layers for the upcoming visualizations.
***Leaflet is the only external library used, remaining features are implemented by us***

### block_visualizations.js
Block visualiations are the main way we help the user zero in on a place to settle down in. Clicking the blockwise filter button executes functions from this script file.
***All the code in this file is handwritten, no libraries are used (apart from d3)***

In this section, we introduce three visualizations.

#### Heatmap
The heatmap shows the variation of one selected attribute across all the blocks in the city. This has been implemented as a drop-down list.

#### Radar Chart
The radar chart has been made to specifically show the variation of different attributes of each block in the city.

#### Donut Chart
The donut chart is made to show the proportion of homes for rent in the seleted city block.


### bus_list.js



## Project website

## Project video