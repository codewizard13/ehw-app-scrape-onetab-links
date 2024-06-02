// const testSet = [
//   "https://github.com/codewizard13 | codewizard13 (Eric L. Hepperle)",
//   "https://www.youtube.com/watch?v=S67gyqnYHmI | (223) Intro To Web Scraping With Puppeteer - YouTube",
// ]
/*
SAMPLE RESULTS:

0:  codewizard13 (Eric L. Hepperle)
    [https://github.com/codewizard13 ]

1:  (223) Intro To Web Scraping With Puppeteer - YouTube
    [https://www.youtube.com/watch?v=S67gyqnYHmI ]

*/

const domainsDict = {}

const iconGridURL = '/img/iconGrid.webp'





///// HELPER FUNCTIONS //////


const sel__link_rows = '.tab > div:nth-child(2)';

/**
 * MAIN
 */
function main() {
    let linkRows = document.querySelectorAll(sel__link_rows);
		
		console.log(`linkRows Total = ${linkRows.length}`)

    let resutls_obj = parseLinkRows(linkRows);
    console.log(resutls_obj.log_str);


		// Define styles for result tab
		let style_el = document.createElement("style")
		let styles = `
		.row-icon {
			width: 16px;
			height: 16px;
		}
		
		`
		style_el.textContent = styles


		// Launch in a new tab
		var new_tab = window.open('','TARGET')
		new_tab.document.body.innerHTML = resutls_obj.html_str
		new_tab.document.head.appendChild(style_el)
}
main();

/**
 * Helper Function: parseLinkRows
 * Parses the link rows and extracts relevant data.
 */
function parseLinkRows(linkRows) {
  
	let outObj = {}
	let log_str = ''
	let html_str = ''
	let hasSprite = false
	let row_htm = ''

	let bgSize = ''
	let bgPosition = ''

    for (let i = 0; i < linkRows.length; i++) {
        let row = linkRows[i];
				let rowNum = i+1

        // Extracting the link
        let linkElement = row.querySelector('a.tabLink');
        let linkHref = linkElement ? linkElement.href : 'No link found';
        let linkText = linkElement ? linkElement.textContent : 'No link text found';

				// Parse domain from link
				if (linkHref !== 'No link found') {

					let linkURL = new URL(linkHref)
					let domain = linkURL.hostname
					console.log(`Domain: ${domain}`)

				}

        // Check for an image within the first div element
        let iconDiv = row.querySelector('div:first-child');
        let iconImg = iconDiv.querySelector('img');
        let iconSrc = iconImg ? iconImg.src : 'No image found';

        // Check for sprite image if no direct image is found
        if (!iconImg && iconDiv.style.backgroundImage) {
            iconSrc = iconDiv.style.backgroundImage;
            if (iconSrc.includes('iconGrid.webp')) {
								hasSprite = true
                bgSize = iconDiv.style.backgroundSize
                bgPosition = iconDiv.style.backgroundPosition
                iconSrc += ` (Sprite Image: size=${bgSize}, position=${bgPosition})`;
            }
        }

				// BUILD LOG

        // Append extracted data to the output string
        log_str += `Row ${i + 1}:\n`;
        log_str += `Link Text: ${linkText}\n`;
        log_str += `Link URL: ${linkHref}\n`;
        log_str += `Icon Source: ${iconSrc}\n`;
        log_str += '\n';

				// BUILD DOM ELEMENT

if (hasSprite) {

	console.log(`bgSize: ${bgSize}`)

	row_htm = 				
	`<li class="row">
		[Row #: ${rowNum}]:
		<img alt="favicon" class="row-icon has-sprite" src=""
		style="
			display: inline-block;
			width: 16px;
			height: 16px;
			top: 5px;
			position: absolute;
			left: 25px;
			cursor: move;
			background-size: ${bgSize};
			background-position: ${bgPosition};
			background-image: url('images/iconGrid.webp');		
		" \="" />
		<a
			href="${linkHref}"
			target="_blank">
			${linkText}
		</a>
	</li>\n`

	// Reset variables
	bgSize = ''
	bgPosition = ''

} else {

	row_htm = 				
	`<li class="row">
		[Row #: ${rowNum}]:
		<img alt="favicon" class="row-icon" src="${iconSrc}" \="" />
		<a
			href="${linkHref}"
			target="_blank">
			${linkText}
		</a>
	</li>\n`
	
}

			html_str += row_htm


    }

		// Add data to outObj
		outObj.log_str = log_str
		outObj.html_str = html_str

    return outObj;
}



// #GOTCHA: OneTab uses a sprite for images

/*
REFERENCES:

- https://stackoverflow.com/questions/51328170/best-way-to-parse-url-in-es6


*/