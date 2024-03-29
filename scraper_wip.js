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

DEFINE GLOBAL hashmap (domainsDict)

DEFINE group selector variable

DEFINE group link selector variable

SCRAPE all groups into array

LOOP through all groups

  LOOP through group links in current group

    STORE group link parts (url, title, icon_url)

  END

END

RETURN urlsByDomainDict

*/


const testSet = [
  "https://github.com/codewizard13 | codewizard13 (Eric L. Hepperle)",
  "https://www.youtube.com/watch?v=S67gyqnYHmI | (223) Intro To Web Scraping With Puppeteer - YouTube",
]


const domainsDict = {}

const sel_group = '.tabGroup'
const sel_link = ''
const link_parts = []

/**
 * MAIN
 */
function main() {

  let results = parseLineSet(testSet)
  console.log(results)



}
main()


/*
RESULTS:

0:  codewizard13 (Eric L. Hepperle)
    [https://github.com/codewizard13 ]

1:  (223) Intro To Web Scraping With Puppeteer - YouTube
    [https://www.youtube.com/watch?v=S67gyqnYHmI ]

*/


///// HELPER FUNCTIONS //////


function parseLineSet(lineSet) {

  let outStr = ''

  for (i=0; i<testSet.length; i++) {

    let line = testSet[i]

    let lineParts = line.split("|")
    let url = lineParts[0]
    let title = lineParts[1]

    outStr += `
    ${i}: ${title}
        [${url}]\n`

  }

  return outStr

}