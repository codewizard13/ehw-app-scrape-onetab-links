/*
Program Name:   App: Scrape OneTab Links
File Name:      scraper.js
Date Created:   05/18/23
Date Modified:  --
Version:        1.00.00
Programmer:     Eric Hepperle

PURPOSE: 

Parse links and information from OneTab. Displays categories in console. Uses vanilla JavaScript ES6.
	
USAGE: 

1) Open OneTab page in a browser and copy-paste the code in scraper.js into the console and run it (press Enter).
2) To save/archive the links results use code inspector in browser to grab the "body" tag and contents, then paste that into a new document and save it.
	
SAMPLE RESULTS: 
    N/A

REQUIRES:

- Browser opened to a YouTube video with developer console exposed.

FUTURE:

- Make searchable via JavaScript match() or RegExp()
- Consider pros/cons of async/await
- Write results to .htm file and auto execute in new browser tab
- Save file as CSV
- Make remote (Puppeteer? Cheerio?) so copy-paste not required


*/



/*
ALGORITHM:

DEFINE results array

/*


/*
ALGORITHM

DEFINE GLOBAL hashmap (urlsByDomainDict)

DEFINE group selector variable

DEFINE group link selector variable

LOOP through all groups

  LOOP through group links in current group

    STORE group link parts (url, title, icon_url)

  END

END

RETURN urlsByDomainDict

*/


const testSet = [
  "https://github.com/codewizard13 | codewizard13 (Eric L. Hepperle)",
  "https://www.youtube.com/watch?v=lgyszZhAZOI | (223) Web Scraping with Puppeteer & Node.js: Chrome Automation - YouTube",
  "https://www.youtube.com/watch?v=S67gyqnYHmI | (223) Intro To Web Scraping With Puppeteer - YouTube",
]


const domainsDict = {}

const sel_group = ''
const sel_link = ''
const link_parts = []

/**
 * MAIN
 */
function main() {
  console.table(testSet)
}
main()