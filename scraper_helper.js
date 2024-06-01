// const testSet = [
//   "https://github.com/codewizard13 | codewizard13 (Eric L. Hepperle)",
//   "https://www.youtube.com/watch?v=S67gyqnYHmI | (223) Intro To Web Scraping With Puppeteer - YouTube",
// ]


const domainsDict = {}

const sel_group = '.tabGroup'
const sel_link = ''
const link_parts = []
const sel__link_rows = '.tab > div:nth-child(2)'

const iconGridURL = '/img/iconGrid.webp'

/**
 * MAIN
 */
function main() {

	let linkRows = document.querySelectorAll(sel__link_rows)
	// let linkRows = testSet

  let results = parseLinkRows(linkRows)
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

  for (i=0; i<linkRows.length; i++) {

    let row = linkRows[i]
		// console.log(row)

		let icon_el = row.querySelector('div:first-child')
		// console.log(`icon_el: `, icon_el)

		// If there's an IMG tag, use that. Otherwise use the sprite
		if (row.querySelector('div:first-child img')) {
			console.log(`/////////// YES THERE'S AN IMAGE! ////////////`)
			let out_rowIcon = document.createElement("img")
		console.log(`out_rowIcon: `, out_rowIcon)

		} else {
			// Use the sprite positioning styles
			let out_rowIcon = document.createElement("img")
			rowIcon_style = row.querySelector('div:first-child').style
			out_rowIcon.style = rowIcon_style
		// console.log(`rowIcon_style: `, rowIcon_style)
		console.log(`out_rowIcon: `, out_rowIcon)

		}

		// console.log(`out_rowIcon: `, out_rowIcon)

    // let rowParts = row.split("|")
    // let url = rowParts[0]
    // let title = rowParts[1]

    outStr += `${linkRows}<br>`
    // ${i}: ${title}
    //     [${url}]\n`

  }

  return outStr

}


// #GOTCHA: OneTab uses a sprite for images