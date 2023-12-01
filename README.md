
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

***Leaflet is the only external library used, remaining features are implemented by us (using d3)***


## Project website
Github pages does not work with git LFS (which we are using). Please use the final release of our code to view the website

## Project video
https://youtu.be/IfpbSF2XBuc

## Citations
[d3](http://d3js.org/)

[Openstreetmap](https://www.openstreetmap.org/copyright)

 [turf](https://turfjs.org/)
