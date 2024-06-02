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
    let results = parseLinkRows(linkRows);
    console.log(results);
}
main();

/**
 * Helper Function: parseLinkRows
 * Parses the link rows and extracts relevant data.
 */
function parseLinkRows(linkRows) {
    let outStr = '';

    for (let i = 0; i < linkRows.length; i++) {
        let row = linkRows[i];

        // Extracting the link
        let linkElement = row.querySelector('a.tabLink');
        let linkHref = linkElement ? linkElement.href : 'No link found';
        let linkText = linkElement ? linkElement.textContent : 'No link text found';

        // Check for an image within the first div element
        let iconDiv = row.querySelector('div:first-child');
        let iconImg = iconDiv.querySelector('img');
        let iconSrc = iconImg ? iconImg.src : 'No image found';

        // Check for sprite image if no direct image is found
        if (!iconImg && iconDiv.style.backgroundImage) {
            iconSrc = iconDiv.style.backgroundImage;
            if (iconSrc.includes('iconGrid.webp')) {
                let bgSize = iconDiv.style.backgroundSize;
                let bgPosition = iconDiv.style.backgroundPosition;
                iconSrc += ` (Sprite Image: size=${bgSize}, position=${bgPosition})`;
            }
        }

        // Append extracted data to the output string
        outStr += `Row ${i + 1}:\n`;
        outStr += `Link Text: ${linkText}\n`;
        outStr += `Link URL: ${linkHref}\n`;
        outStr += `Icon Source: ${iconSrc}\n`;
        outStr += '\n';
    }

    return outStr;
}



// #GOTCHA: OneTab uses a sprite for images