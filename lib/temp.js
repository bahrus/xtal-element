"use strict";
// Tuples are arrays where the order is important to the type system,
// you can learn more about them in example:tuples
const locations = [
    [40.7144, -74.006],
    [53.6458, -1.785]
];
const newLocations = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
];
// The names now show up in the editor when you hover over
// the 0 and 1 at the end of the next line
const firstLat = newLocations[0][0];
const firstLong = newLocations[0][1];
// While that might seem a tad underwhelming, the main goal 
// is to ensure that information isn't lost when working
// with the type system. For example, when extracting
// parameters from a function using the Parameter 
// utility type:
function centerMap(lng, lat) { }
// Making some of the more complex type manipulation lossy
// for the parameter information.
