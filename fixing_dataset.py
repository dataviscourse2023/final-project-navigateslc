import pandas as pd
import re

# column_1 = ["File identification","State Postal Abbreviation","Summary Level","Geographic Component","Logical Record Number","US","Census Region","Census Division","State (Census Code)","State (FIPS Code)","County of current residence","County Subdivision (FIPS)","Place (FIPS Code)","Census Tract","Block Group","Consolidated City","American Indian Area/AlaskaNative Area/ Hawaiian Home Land(Census)","American Indian Area/AlaskaNative Area/ Hawaiian Home Land(FIPS)","American Indian Trust Land/Hawaiian Home Land Indicator","American Indian TribalSubdivision (Census)","American Indian TribalSubdivision (FIPS)","Alaska Native RegionalCorporation (FIPS)","Metropolitan and MicropolitanStatistical Area","Combined Statistical Area","Metropolitan Statistical Area-Metropolitan Division","Metropolitan Area Central City","Metropolitan/MicropolitanIndicator Flag","New England City and Town Area","New England City and TownCombined Statistical Area","New England City and Town AreaDivision","Urban Area","Current Congressional District ***","State Legislative District Upper","State Legislative District Lower","5-digit ZIP Code Tabulation Area","Subminor Civil Division (FIPS)","State-School District (Elementary)","State-School District (Secondary)","State-School District (Unified)","Urban/Rural","Principal City Indicator","Public Use Microdata Area - 5%File","Geographic Identifier","Area Name","Tribal Tract","Tribal Block Group","Qualifying Name","FIPS","Area (Land)","Area (Water)","Place (State FIPS + Place FIPS)","Urban Area Central Place","Voting District","ZIP Code Tabulation Area (3-digit)","Traffic Analysis Zone","Urban Growth Area","Public Use Microdata Area - 1% File","Total Population","Total Population","Population Density (Per Sq. Mile)","Area (Land)","Total Population:","Total Population: Male","Total Population: Female","Total Population:","Total Population: Under 5 Years","Total Population: 5 to 9 Years","Total Population: 10 to 14 Years","Total Population: 15 to 17 Years","Total Population: 18 to 24 Years","Total Population: 25 to 34 Years","Total Population: 35 to 44 Years","Total Population: 45 to 54 Years","Total Population: 55 to 64 Years","Total Population: 65 to 74 Years","Total Population: 75 to 84 Years","Total Population: 85 Years and Over","Total Population:","Total Population: White Alone","Total Population: Black or African American Alone","Total Population: American Indian and Alaska Native Alone","Total Population: Asian Alone","Total Population: Native Hawaiian and Other Pacific Islander Alone","Total Population: Some Other Race Alone","Total Population: Two or More Races","Households:","Households: Family Households","Households: Family Households: Married-Couple Family","Households: Family Households: Other Family","Households: Family Households: Other Family: Male Householder, No Wife Present","Households: Family Households: Other Family: Female Householder, No Husband Present","Households: Nonfamily Households","Households: Nonfamily Households: Male Householder","Households: Nonfamily Households: Female Householder","Median Household Income (In 2021 Inflation Adjusted Dollars)","Housing Units","Occupied Housing Units:","Occupied Housing Units: Owner Occupied","Occupied Housing Units: Renter Occupied","Population for Whom Poverty Status Is Determined:","Population for Whom Poverty Status Is Determined: Under 1.00 (Doing Poorly)","Population for Whom Poverty Status Is Determined: 1.00 to 1.99 (Struggling)","Population for Whom Poverty Status Is Determined: Under 2.00 (Poor or Struggling)","Population for Whom Poverty Status Is Determined: 2.00 and Over (Doing Ok)"]
# column_2 = ["Geo_FILEID","Geo_STUSAB","Geo_SUMLEV","Geo_GEOCOMP","Geo_LOGRECNO","Geo_US","Geo_REGION","Geo_DIVISION","Geo_STATECE","Geo_STATE","Geo_COUNTY","Geo_COUSUB","Geo_PLACE","Geo_TRACT","Geo_BLKGRP","Geo_CONCIT","Geo_AIANHH","Geo_AIANHHFP","Geo_AIHHTLI","Geo_AITSCE","Geo_AITS","Geo_ANRC","Geo_CBSA","Geo_CSA","Geo_METDIV","Geo_MACC","Geo_MEMI","Geo_NECTA","Geo_CNECTA","Geo_NECTADIV","Geo_UA","Geo_CDCURR","Geo_SLDU","Geo_SLDL","Geo_ZCTA5","Geo_SUBMCD","Geo_SDELM","Geo_SDSEC","Geo_SDUNI","Geo_UR","Geo_PCI","Geo_PUMA5","Geo_GEOID","Geo_NAME","Geo_BTTR","Geo_BTBG","Geo_QName","Geo_FIPS","Geo_AREALAND","Geo_AREAWATR","Geo_PLACESE","Geo_UACP","Geo_VTD","Geo_ZCTA3","Geo_TAZ","Geo_UGA","Geo_PUMA1","SE_A00001_001","SE_A00002_001","SE_A00002_002","SE_A00002_003","SE_A02001_001","SE_A02001_002","SE_A02001_003","SE_A01001_001","SE_A01001_002","SE_A01001_003","SE_A01001_004","SE_A01001_005","SE_A01001_006","SE_A01001_007","SE_A01001_008","SE_A01001_009","SE_A01001_010","SE_A01001_011","SE_A01001_012","SE_A01001_013","SE_A03001_001","SE_A03001_002","SE_A03001_003","SE_A03001_004","SE_A03001_005","SE_A03001_006","SE_A03001_007","SE_A03001_008","SE_A10008_001","SE_A10008_002","SE_A10008_003","SE_A10008_004","SE_A10008_005","SE_A10008_006","SE_A10008_007","SE_A10008_008","SE_A10008_009","SE_A14006_001","SE_A10001_001","SE_A10060_001","SE_A10060_002","SE_A10060_003","SE_B13004_001","SE_B13004_002","SE_B13004_003","SE_B13004_004","SE_B13004_005"]

# data = ["ACSSF","ut","150","00","0001679",None,None,None,None,"49","011",None,None,"127002","4",None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,"15000US490111270024","Block Group 4",None,None,"Block Group 4, Census Tract 1270.02, Davis County, Utah","490111270024","11047544","164837",None,None,None,None,None,None,None,1316,1316,308.5233,4.26548076670626,1316,662,654,1316,145,94,112,41,129,144,159,115,130,78,138,31,1316,1052,0,0,0,0,91,173,483,373,300,73,54,19,110,0,110,48750,520,483,448,35,1316,77,615,692,624]

# print(len(column_1), len(column_2), len(data))
# print(column_1[46], column_2[46], data.index("Block Group 4, Census Tract 1270.02, Davis County, Utah")) # index 46 corresponds to the string containing block group and census tract number or whatever

# test_string = "Block Group 1, Census Tract 1005"

# pattern = r"Block Group (\d+), Census Tract (\d+)\.(\d+)"
pattern = r"Block Group (\d+), Census Tract (\d+)(?:\.(\d{2}))?"

# result = re.search(pattern_v2, test_string)

# block_number = result.group(1)
# tract_whole = result.group(2)
# tract_decimal = result.group(3) or "00"

# key = "{} {}{}".format(block_number, tract_whole, tract_decimal)

# print(test_string)
# print(key)

dataset = pd.read_csv("data/rent_data.csv")

def extract_final_key(row):
    match = re.search(pattern, row["Geo_QName"])
    if match:
        block_number = match.group(1)
        tract_whole = match.group(2)
        tract_decimal = match.group(3) or "00"
        return "{} {}{}".format(block_number, tract_whole, tract_decimal)
    else:
        return None

# Apply the function to create the new column
dataset["final_key"] = dataset.apply(extract_final_key, axis=1)

# Display the updated DataFrame
print(dataset.head())

dataset.to_csv("data/new_rent_data.csv")