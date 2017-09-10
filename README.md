# Neighbourhood Map: London
This project has been created to fulfill requirements for the Udacity Front-End Developer Nanodegree.
It utilises an embedded google map centred on London.
An AJAX request to Foursquare API is used to gather a list of 10 recommended historic sites in the vicinity which are located on the map with google map markers.
A KnockoutJS view-model is used to handle the population of an interactive list sidebar with the site locations.
Clicking the list items or the associated marker will open a google maps infoWindow with information on the location (address, rating, checkinCount, photo) retrieved from the initial XHR data.

## Running the application
Simply clone the project and open index.html from within the dist directory to view the application.

## Utilising Gulp Build Tool
Gulp was used to minify files and move the final project from the src into a dist.  Manually delete all files from the dist folder and then run 'gulp' to recreate project files into the dist folder once again.

## Resources and attributions
* Google Maps API
* Foursquare API
* jQuery
* KnockoutJS
* Bootstrap
* Icons by font awesome
* SVG of Big ben used in navbar from Roundicons at https://www.flaticon.com/authors/roundicons




