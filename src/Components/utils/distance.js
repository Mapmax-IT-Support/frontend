import { buildMap, Boroughs } from './zipcodes';

const fiveMiles = 8.04672;
const oneMile = 1.6
const zipMap = buildMap();
const { Brooklyn, Bronx, Queens, Staten, Manhattan } = Boroughs;

export const determineRadius = (zip) => {
    switch (zipMap.get(zip)) {
        case Brooklyn:
            return { radius: oneMile };
        case Bronx:
            return { radius: oneMile };
        case Queens:
            return { radius: oneMile };
        case Staten:
            return { radius: oneMile };
        case Manhattan:
            return { radius: oneMile, isnyc: true };
        default: 
            return { radius: fiveMiles};
    }
};

export const getCounty = zip => zipMap.get(zip);


