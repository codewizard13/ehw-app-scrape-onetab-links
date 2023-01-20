| INFO PROPERTY | VALUE                                  |
| ------------- | -------------------------------------- |
| Program Name  | **App: Scrape OneTab Links** |
| File Name     | README.md                              |
| Date Created  | 02/27/18                               |
| Date Modified | 01/19/23                               |
| Version       | 0.2.2                                  |
| Programmer    | **Eric Hepperle**                      |

### TECHNOLOGIES

<img align="left" alt="JavaScript" title="JavaScript" width="26px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" style="padding-right:10px;" />

<img align="left" alt="JavaScript" title="JavaScript" width="26px" src="./img/logoPic_onetab_02.png" style="padding-right:10px;" />

<img align="left" alt="Git" title="Git" width="26px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" style="padding-right:10px;" />

<img align="left" alt="GitHub" title="GitHub" width="26px" src="https://user-images.githubusercontent.com/3369400/139448065-39a229ba-4b06-434b-bc67-616e2ed80c8f.png" style="padding-right:10px;" />

<br>

## TAGS
`JavaScript` `ES6` `Web Scraping` `OneTab` `Bookmarks` `DOM Navigation` `Parse local file`

## Purpose

Scrape blog (local .html/htm file) post data to JSON object
    
## NOTES
### About the demo folder
One might expect the `demo/` folder to hold a working demonstration of the app. Nope. This folder holds individual applications of concepts I learned while building this project. Basically, these are all standlone MVPs and the ones that start with "basic" pretty much handle one concept each.

- basic--get-screenshot.js
- basic--write-array-to-file.js
- basic--write-dom-nodelist-to-file.js
- get-links-and-image-urls.js
- get-page-save-html-to-file.js

## Requires
* Browser opened to a YouTube video with developer console exposed.
    
### Materials/References

- https://www.youtube.com/watch?v=lgyszZhAZOI
- https://www.youtube.com/watch?v=S67gyqnYHmI


Program Name:   Console: Scrape OneTab Links
File Name:      ehCode_2018.03.05_JavaScriptES6_ScrapeOneTabLinks_01.js
Date Created:   02/27/18
Date Modified:  04/01/18
Version:        1.02
Programmer:     Eric Hepperle

Purpose: Parses links and information from OneTab.
	Displays categories in console. Uses vanilla JavaScript ES6. 
	
	NOTE: Can't	inject jQuery anymore due to "Content Security Policy",
	 so this version use vanilla JavaScript ES6.

Usage: Open OneTab page in a browser and copy-paste the code below
	into the console.

	To save/archive the links results use code inspector in browser to
    grab the "body" tag and contents, then paste that into a new document
    and save it.	
	
    Sample results: N/A	

Requires: 
	* Browser console