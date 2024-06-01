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

  let results = parseLinkRows(testSet)
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


function parseLinkRows(linkRows) {

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