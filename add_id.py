import geojson
with open('data/Utah_Census_Block_Groups_2020.geojson') as f:
    gj = geojson.load(f)
features = gj['features'][639]['properties']['NAMELSAD20'][-1]

for i in range(len(gj['features'])):
    temp_key = gj['features'][i]['properties']['NAMELSAD20'][-1] + ' ' + gj['features'][i]['properties']['TRACTCE20']
    gj['features'][i]['properties']['final_key'] = temp_key

with open('data/new_block_groups.geojson', 'w') as f:
   geojson.dump(gj, f)

#with open('myfile.geojson') as f:
#    gj = geojson.load(f)
#features = gj['features'][639]['properties']

#print(len(gj['features']))
