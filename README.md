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

`JavaScript` `ES6` `Web Scraping` `OneTab` `Bookmarks` `DOM Navigation` `Parse local file` `Hyperlinks` `Anchor Tags`

## Purpose

Parse links and information from OneTab. Displays categories in console. Uses vanilla JavaScript ES6.

## Usage

1. Open OneTab page in a browser and copy-paste the code in `scraper.js` into the console and run it (press Enter).
2. To save/archive the links results use code inspector in browser to grab the "body" tag and contents, then paste that into a new document and save it.

## Requires

* Browser opened to a YouTube video with developer console exposed.

## NOTES & CAVEATS

* _**_This README is in-progress and under construction._**_
* Can't	inject jQuery anymore due to "Content Security Policy", so this version use vanilla JavaScript ES6.

## FUTURE

Future plans include:

- [ ] Make searchable via JavaScript `match()` or `RegExp()`
- [ ] Consider pros/cons of async/await
- [ ] Write results to .htm file and auto execute in new browser tab
- [ ] Save file as CSV
- [ ] Make remote (Puppeteer? Cheerio?) so copy-paste not required
    
### Materials/References

#### Online:

- https://www.youtube.com/watch?v=lgyszZhAZOI
- https://www.youtube.com/watch?v=S67gyqnYHmI

#### Local Files:

- ehCode_2016.05.25_javascript_csvFromAllLinksOnPage_02.js.txt
- [ref/](./ref/)