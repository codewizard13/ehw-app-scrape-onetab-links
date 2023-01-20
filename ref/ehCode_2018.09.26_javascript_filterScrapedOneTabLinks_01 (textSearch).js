/*
Program Name:   Console: Filter Scraped OneTab links
File Name:      ehCode_2018.09.26_javascript_filterScrapedOneTabLinks_01 (textSearch).js
Date Created:   11/28/17
Date Modified:  --
Version:        2.0
Programmer:     Eric Hepperle

Purpose: Lets user search for a particular string in a scraped
	OneTab link list html page using vanilla ES6 JavaScript.
	
Usage: Open scraped OneTab bookmarks page in a browser and copy-paste the
    code below into the console.

	To save/archive the links results use code inspector in browser to
    grab the "body" tag and contents, then paste that into a new document
    and save it.	
	
Sample results: 
    N/A

Requires: 
	* Browser console
	* A scrape OneTab links list page created with 
		ehCode_2017.11.27_javascript_scrapeLinksFromOneTab_02 (from Algorithm)

*/

/* global $ */
/*jshint esversion: 6 */

console.clear();

// CREATE AND INITIALIZE GLOBAL VARIABLES

	// 




	// Blank Title Count
	var blankTitleCount = 1;
	
	// Row Link
	var rowLink = '';
	
	// Row Text
	var rowText = '';
	
	// Icon URL
	var rowIconLink = '';
	
	// Groups array to store all group info (this is the root)
	var objArrGroups = [];
	
	// Group Counter = 1
	var groupCount = 1;
	
	// Total number of groups counted
	var groupsTotal = 0;
	
	// Row Counter
	var rowCount = 1;
	
	// Output string to generate new page
	var strOut = '';
	
	// Row domain (parse from icon url)
	var rowDomain = '';
	
	// SELECTOR CONSTANTS:
	
	// skips first 3 children
	var selAllGroups = "#contentAreaDiv > div:nth-child(n+4):not(:nth-last-child(-n+1)";
	
	var selGroupTitle = "div.tabGroupTitleText";
		
	// CSS STYLE CONSTANTS:
	
	var aliceblue_dashed = "background:aliceblue; border-bottom: dashed 3px cadetblue";
	var lemonyellow_dashed = "background:#ffffb3; border-bottom: dashed 3px orange";
	var lemyel = "background:#ffffb3";	
	var ltgrn = "background:lightgreen";


// HELPER FUNCTIONS

/*
Pad number

Usage:

pad(10, 4);      // 0010
pad(9, 4);       // 0009
pad(123, 4);     // 0123
pad(10, 4, '-'); // --10
pad(10, 4, ' '); //   10
*/
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}	
		
// GET ALL GROUP AND ROW INFO AND STORE IN ARRAY OF OBJECTS
function getAllGroups() {

	// Grab list of all link groups and row info
	var groups = [...document.querySelectorAll(selAllGroups)];

	// Store the groups array length
	groupsTotal = groups.length;
	
	// FOREACH GROUP
	groups.forEach(function(el, i, arr) {
				
		// Create empty object to store group data
		var group = {};

		// Create empty group title variable
		var groupTitle = '';
		
		// Which line of group info the groupName is on
		var groupNameStartLineIndex = 2;
		
		// If group title exists, store in a variable. Else,
		//  build group title from blank title counter. NOTE:
		//	testing for "&nbsp;" doesn't work but fromCharCode does.
		if (el.querySelector(selGroupTitle).innerText && 
			el.querySelector(selGroupTitle).innerText !== String.fromCharCode(160)
		) {
			groupTitle = el.querySelector(selGroupTitle).innerText;
		} else {
			groupTitle = "blankGroup_" + blankTitleCount;
				
			// increment blank title counter
			++blankTitleCount;
			groupNameStartLineIndex = 1;
		}
		
		// Add group title to group object
		group.groupTitle = groupTitle;

		// Grab group details block
		var thisGroupDetails = el.querySelector("div > div > div").innerText
		console.log("%cGroup Info (incl. date):                         ", "background:orange");
		console.log(thisGroupDetails);

		// Parse group details block for 
		var arrGroupdDetails = thisGroupDetails.split('\n');
		
		var tempTimeDate = arrGroupdDetails[groupNameStartLineIndex];
		console.log("%ctempTimeDate: %s                                ", "background: lavender; border: solid gold 2px;", tempTimeDate);
		// Parse time date with Regex like: 
		// 	Created 6/21/2016, 1:41:28 PM
		var reg = /^Created\s+(\d{1,2})\/(\d{1,2})\/(\d{4}),\s(\d{1,2}):(\d{1,2}):(\d{1,2})\s([APM]{2})$/;
		var matches = reg.exec(tempTimeDate);
		
		var monthNum = matches[1];
		var dayNum = matches[2];
		var year4 = matches[3];
		var hourNum = matches[4];
		var minuteNum = matches[5];
		var secondNum = matches[6];
		var ampm = matches[7];
		
		// var date = matches[1] + "/" + matches[2] + "/" + matches[3];
		// var time = matches[4] + ":" + matches[5] + ":" + matches[6] + " " + matches[7];
		var date = monthNum + "/" + dayNum + "/" + year4;
		var time = hourNum + ":" + minuteNum + ":" + secondNum + " " + ampm;
		
		// Grab just date and time
		console.log("%cDate:                         ", "background:bisque");
		console.log(date);
		console.log("%cTime:                         ", "background:bisque");
		console.log(time);
		
		// Add date and time info to group object. This will help with sorting
		group.year = year4;
		group.date = date;
		group.time = time;
		group.monthNum = monthNum;
		group.dayNum = dayNum;
		group.hourNum = hourNum;
		group.minuteNum = minuteNum;
		group.secondNum = secondNum;
		group.ampm = ampm;
		
		// Grab list of all rows in this group
		var rows = Array.from(el.children[1].children);
		// debugging ... child rows
		console.log("%cChild Rows:                        ", lemonyellow_dashed);
		console.log(rows);
		
		// Create rows array
		arrGroupRows = [];
		
		// Reset row counter to 1
		rowCount = 1;
		
		// Foreach Row:
		rows.forEach(function(el, i, arr) {

			// Create row object
			var rowObj = {};
			
			// Grab row link
			// rowLink = el.querySelector('.row_text > a').href;
			rowLink = el.children[1].querySelector('a').href;
			
			// Grab row text
			rowText = el.children[1].querySelector('a').text;
			
			// Grab icon link
			rowIconLink = el.children[1].querySelector('img').src;
			
			// Add all row data to row object
			rowObj.rowText = rowText;
			rowObj.rowLink = rowLink;
			rowObj.rowIconLink = rowIconLink;
			
			// Push this row object onto group rows array
			arrGroupRows.push(rowObj);
									
			// Increment row counter
			++rowCount;
		
		});	
		// END processing rows in this group		
		
		// Add group rows array onto this group as property
		group.rows = arrGroupRows;
		
	// Push this group object onto groups array
	objArrGroups.push(group);
	
	}); 
	// END processing groups

	objArrGroups.blankTitleCount = blankTitleCount;
	
	return objArrGroups;
	
} // END function

var groupInfo = getAllGroups();

// uncomment to output object
// console.log("%c --- GROUP INFO ---                           ", "background:#ffffb3;");
// console.log(groupInfo); 






// --------------------------------------------------------------------
// Create webpage by parsing the groups object and
// 	launch in new window.

// add doctype and header to html output string
strOut += "<!DOCTYPE html>\n";
strOut += "<html lang='en'>\n";
strOut += "\t<head>\n";
strOut += "\t<title>Scraped Links Output Page</title>\n";
strOut += "\t<meta charset='utf-8'>\n";

var testTemplateLiteralStyle = `
<style>
.group-info {
    background-color: orange;
    border: solid black 2px;
    border-radius: 15px;
    padding: 10px;
    max- width: 1024px;
	display: inline-block;
}

.group-title {
	float: left;
    position: relative;
	top: -.6em;
}

.group-table {
    float: left;
    border: solid 3px gold;
    margin-left: 9em;
    background: #ffffb3;
    border-radius: .8em;
    padding: .6em;
    font-family: "courier new";
    font-size: .8em;
}

.clear:after {
  content: "";
  clear: both;
  display: table;
}

/* Note: clear the div and the table */
</style>
`;

strOut += testTemplateLiteralStyle;
strOut += "<body>\n";

groupInfo.forEach(function(group, groupIndex, groupArr) {

	// begin this group html string
	var htmGroup = '';

	var htmGroupInfo = "<div class='clear group-info'>\n";
	
	// Build formatted group title:
    var htmGroupTitle = "<h2 class='group-title'>" + group.groupTitle + "</h2>\n";

	// Build formatted group table:
	var htmGroupTable = "<table class='clear group-table'>\n";
	htmGroupTable += "\t<tr>\n\t\t<td class='info-label'>Date & Time:</td>\n\t\t<td>" + group.date + ", " + group.time + "</td>\n\t</tr>\n";
	htmGroupTable += "\t<tr>\n\t\t<td class='info-label'>Group #:</td>\n\t\t<td>" + (groupIndex+1) + "</td>\n\t</tr>\n";
	htmGroupTable += "</table>\n";
	
	// Build formatted group header and info:
	htmGroupInfo += htmGroupTitle + htmGroupTable + "</div>\n"
	
	// debugging ...
    console.log(group.groupTitle);
	
	// Begin current link list:
	var htmRowsList = "<ul style='list-style: none'>";
	
	// debugging ...
	//var linksCount = [...document.querySelector('.row_text > a')].length;
	//console.log("linksCount = " + linksCount);

	// Loop through all rows in this group ...        
	group.rows.forEach(function(row, rowIndex, rowArr) {

		// Format row index to 3 padded digits
		var formattedRowNum = pad((rowIndex+1), 3);
		// debugging ... formattedRowNum
		console.log("%cFormatted row number = %s", lemonyellow_dashed, formattedRowNum);

		
		// start row list item
		var htmRow = "<li class='row'>[Row #: " + formattedRowNum + "]: ";

		// add icon image to row
		htmRow += "\t<img alt='favicon for " + rowDomain + "'"
		+ "class='row-icon' src='" + row.rowIconLink + "'\\>";
		
		// add hyperlink to row
		htmRow += "\t<a href='" + row.rowLink + "' target='_blank' >" +
		row.rowText + "</a></li>";
		
		// add row html to the rows string
		htmRowsList += htmRow;

	});        

	// close current link list
	htmRowsList += "</ul><!-- END group -->\n";

	// assemble html parts for this group
	htmGroup += htmGroupInfo + htmRowsList + "<hr />";
	
	// Add this group's html to out page html
	strOut += htmGroup;

});

// Add closing tags to html page string
strOut += "</body>\n</html>\n";

// Launch results in new window:
var win = window.open("", "APPLES");
win.document.body.innerHTML = strOut;


/*

NOTES:

    11/01/17 - Created file, beginning from copy of scrapeLinksFromOneTab3.
			 - Converting from jQuery to vanilla javascript.	
	
	11/24/17 - Duplicated file to make edits. Versioned to 2.0.
			 - Added comments to document code and make it more understandable.
			 - Replaced MS Word apostrophes with single-quotes
			 - Changed arrTabGroups from const to a var and removed square
				brackets.
			 - Changed selector for arrTabGroups to: 
				#contentAreaDiv div.row_text > a');
			 - Adds elCount var as blank and undefines/unsets arrTabGroups
				at start of program.
			 - Removes co-existing 2nd version of top arrTabGroups code. This
				was just for testing if we actually are getting all the links.
				YES!!! It works! :) Now we will make that a function.
			 - Refactored code into getTabGroups() function. Still works! :)
			 - Added the ... with brackets back after learning this is the
				ES6 way to auto convert a nodelist to an array. Still works! :)
			 - Now we are going to see if we can parse more than just url.
			 - Works! I'm getting img icon and link url. NEXT, let's get link text
				and lets make sure to build objects that we can iterate over.
				Here is a great link: https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/#modifyingthedom
				
	11/25/17 - Versioned file to 5.0.
			 - Removed redundant function.
			 - Created algorithm on paper.
			 - Versioned to 6.0 based on my algorithm.
			 - Troubleshot code --> arrays and objects. This post helped:
			 
			 https://www.sitepoint.com/get-url-parameters-with-javascript/
			 
			 - 10:47 AM (CST) WORKS !!!! :) So far, this version builds a
			 groupInfo object which stores all group data as JSON.
			 
			 - NOTE: This works on sample links list page, but has not been
				converted for OneTab yet.
				
			 - Versioned to 7.0
			 - Started from scratch with algorithm and left out most debugging
				and console logging. This is cleaner code.
			 - WORKS!!! Generates new page! with grouped links! :) Next, test
				in OneTab
			 - Versioned to 8.0
			 - Added HTML header to results page --> sort of works. You will still
				need to copy the inner html of the whole document and move
				to a new file for archiving.
	
	11/26/17 - Versioned to 9.0 - This version we will adapt to work with
				OneTab.
			 - Refactored selectors as constants
			 - Adds color & CSS style constants.
			 - Adds groupsTotal to store total number of groups.
			 - Adds debugs in getAllGroups()
			 - SOLVED for How to exclude children from front and end with:

				var selAllGroups = "#contentAreaDiv > div:nth-child(n+4):not(:nth-last-child(-n+2)";
			 			 
			 - This link explains HOW TO TEST FOR &nbsp (non-breaking space)
				
				if (x == String.fromCharCode(160))
			 
			 - #GOTCHA Those last two wer gotchas.
			 - Adds blankTitleCount as property of objArrGroups.
			 - Grabs and stores group info
			 - We have an "off-by-one" error and are not grabbing the last group for some reason
			 
	11/27/17 - Parses date and time from group info block
		     - Versioned to 10.0
			 - Refactored time/date parts into better semantic variables
			 - Stores date and time info to groups.
			 - Correctly grabs rows and stores to group! :) WORKS!!!
			 - Generates new page correctly, except misses the last group.
			 - #GOTCHA Figure out this off-by-one error.
			 - Versioned to 11.0.
			 - Removed debugs
			 - Changed selAllGroups to (-n+1) from (-n+2). WORKS! :)
			 - Changed group heading to include some other info
			 - Adds template literal to inject styles into out page
			 - Replaced inline styles with classes including clearfix
			 - Formatted group info divs to be inline-block no float
			 - Adds number padding function from:
			 
			 https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
			 
			 - Formatted row numbers to pad with leading spaces
*/

/*

IDEAS & FUTURE IMPROVEMENTS:

- Consider de-duplicating icon urls
- Get domain from icon url
- Grab group date and time
- Sort by date and time
- Can I create a global row object?
- What is the expense of creating a new rowobject variable each iteration?
- Create JavaScript plugin or library from this.

*/

/*

ALGORITHM:

<!--
            Date: 11/27/11, 17:13
            NOTE: This file works so far!
            It finds all hyperlinks who's inner html contains a certain text.
            Then, it moves all the matched hyperlinks to a named grouping at the
            top of the screen.
-->
<html>
    <head>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>        
        <script type="text/javascript">
            jQuery(document).ready(function() {
                jQuery('body').css({
                    'background':'black',
                    'color': '#595959',
                    'font-family':'Helvetica,sans-serif' // note, IE breaks if you don't put a comma here
                });

                // add "debugOut" div as first child of the body element
                jQuery('body:first').prepend('<div id="debugOut" style="background:yellow">Hello World<br /></div>');
                var debugTop = jQuery('#debugOut');

                // SET HEADING: LIST ELEMENTS
                var elGroupHeaderText = 'LIST ELEMENTS';
                debugTop.append("<div id='listElements' name='listElements' value='' style='background:#c3d5fd;color:gray;'>" + elGroupHeaderText + "</div>");
                
                
                $('a').each(function() {
                    
                    var me = jQuery(this);
                    
                    // if found "youtube"
                    var isFound1 = $(this).html().toString().search(new RegExp(/youtube/i));                    
                    if (isFound1 >= 0) {
                        jQuery(this).css({
                            'background-color':'yellow'
                        });
                        jQuery(this).addClass('devil');
                        debugTop.append(me);
                        debugTop.append("<br />");
                    }
                    
                   // if found "youtube"
                    var isFound2 = $(this).html().toString().search(new RegExp(/computer/i));                    
                    if (isFound2 >= 0) {
                        jQuery(this).css({
                            'background-color':'yellow'
                            
                        });
                        jQuery(this).addClass('greenBall');
                    }
                    

                });

        
            }); // END READY FUNCTION
        </script>
        <style type="text/css">
            /* Sets up two classes that set different bullet images */
            .devil {
                background: url("images/smileyPic_devil.gif") no-repeat left;
                height: 22px;
                line-height: 1.2em;
                list-style: none outside none;
                margin-left: 0px;
                padding-bottom: 5px;
                padding-left: 22px;
             
            }
            
            .greenBall {
                background: url("images/Green%20Ball_16px.png") no-repeat left top;
                height: 70px;
                list-style-type: none;
                padding-left: 50px;
                padding-bottom: 10px;
                line-height: 2.5em;
                list-style: none outside none;
                margin-left: 0px;
                padding-left: 22px;                
            }            
        </style>
        
    </head>
    
    <body>
        <div id="wrap">
            <ol>
                <li>apple</li>
                <li>apple</li>
                <li>orange</li>                
                <li>apple</li>
                <li>Snapple</li>
                <li>apple</li>                
                <li>snapple</li>                
                <li>apple</li>
                
                <a href="#">apple</a>
                
                <H1>Bookmarks</H1>
<DL><p>
    <DT><H3 FOLDED ADD_DATE="1307330605">Bookmarks bar</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">COMPARISON &amp; REVIEWS</H3>
        <DL><p>
            <DT><A HREF="http://text-editors.findthebest.com/compare/8-9/EditPlus-vs-Notepad" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >EditPlus vs Notepad++ in Text Editor Software. Compare features, reviews, ratings..url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">EGOV SITES</H3>
        <DL><p>
            <DT><A HREF="https://192.168.1.43/v6/egov/apps/document/center.egov?view=browse;" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >City of Westfield, Indiana _ D&#39;MENT Center _ Browse Pages.url</A>
            <DT><A HREF="http://fishers.in.us/egov/apps/document/center.egov" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >document center v5.url</A>
            <DT><A HREF="https://192.168.1.43/v6/egov/apps/document/center.egov" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >document center v6.url</A>
            <DT><A HREF="https://192.168.1.43/v6/egov/apps/services/index.egov?view=browse;" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Services Index v6.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307330605">MARTIAL ARTS</H3>
        <DL><p>
            <DT><A HREF="http://www.martialfighter.com/martial-arts-strength-training/mariusz-pudzianowski-strongman-videos-and-strength-training" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >Mariusz Pudzianowski Strongman Videos and Strength Training Strength Training ».url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">METAL</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">New folder</H3>
            <DL><p>
            </DL><p>
            <DT><A HREF="http://www.theprp.com/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Theprp.com – Metal, Hardcore And Rock News, Reviews And More.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307330605">PROGRAMMING</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">CLOUD</H3>
            <DL><p>
                <DT><A HREF="http://www.rackspace.com/cloud/cloud_computing_101/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Cloud Computing 101 by the Rackspace Cloud.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">DIAGRAMS</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399699">Class Diagrams</H3>
                <DL><p>
                    <DT><A HREF="http://blog.caplin.com/2010/10/20/what-does-software-look-like/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >What does software look like_ _ Platformability.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=smTNWzNJV4E" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >YouTube - Day 03, Video 08 Core C# - Introduction to UML and Class Diagrams.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307330605">IDE</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307330605">ECLIPSE</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307330605">Search &amp; Replace</H3>
                    <DL><p>
                        <DT><H3 FOLDED ADD_DATE="1307330605">Multi-File Replace</H3>
                        <DL><p>
                            <DT><A HREF="http://www.coldfusionjedi.com/index.cfm/2009/3/16/Multifile-search-and-replace-in-Eclipse" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >Raymond Camden&#39;s ColdFusion Blog_ Multi-file search and replace in Eclipse.url</A>
                        </DL><p>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307330605">KOMODO</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307330605">License</H3>
                    <DL><p>
                        <DT><A HREF="http://btjunkie.org/torrent/Komodo-IDE-6-0-1-57903/3778b274242478fd5a887ef65de0d432b77617a17db4" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >Komodo-IDE-6.0.1-57903 Torrent - btjunkie.url</A>
                    </DL><p>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">JAVASCRIPT</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399699">FUNCTIONS</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307399699">Eval</H3>
                    <DL><p>
                        <DT><H3 FOLDED ADD_DATE="1307399699">How Not To Use Eval</H3>
                        <DL><p>
                            <DT><A HREF="http://24ways.org/2005/dont-be-eval" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >24 ways_ Don&#39;t be eval().url</A>
                        </DL><p>
                    </DL><p>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399698">MOBILE</H3>
            <DL><p>
                <DT><A HREF="http://blogs.msdn.com/b/silverlight_sdk/archive/2011/03/24/start-to-finish-guidance-for-windows-phone-7-application-development.aspx" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Start-to-Finish Guidance for Windows Phone 7 Application Development - Silverlight SDK - Site H.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">O&#39;REILLY BOOKS</H3>
            <DL><p>
                <DT><A HREF="http://oreilly.com/ebooks/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >O&#39;Reilly Media - DRM-Free Tech Ebooks_ PDF, .epub, Kindle .mobi, Android .apk, DAISY.url</A>
                <DT><A HREF="http://oreilly.com/openbook/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >O&#39;Reilly Open Books Project.url</A>
                <DT><A HREF="http://docstore.mik.ua/orelly/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >O&#39;Reilly&#39;s CD bookshelf.url</A>
                <DT><A HREF="http://svnbook.red-bean.com/" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Version Control with Subversion.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399698">OFFICE &amp; VB</H3>
            <DL><p>
                <DT><A HREF="http://lylt.org/?p=128" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Adding an ID field to an excel worksheet _ lylt.org.url</A>
                <DT><A HREF="http://support.microsoft.com/kb/190213#top" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >BUG_ Type Mismatch Error Comparing String With Byte Array.url</A>
                <DT><A HREF="http://www.cpearson.com/excel/cells.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Cells Within Ranges.url</A>
                <DT><A HREF="http://www.dailydoseofexcel.com/archives/2007/08/08/readability-with-custom-classes/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Daily Dose of Excel » Blog Archive » Readability with Custom Classes.url</A>
                <DT><A HREF="http://www.aivosto.com/vbtips/datatypes.html" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Data types in VB and .NET.url</A>
                <DT><A HREF="http://www.mrexcel.com/forum/showthread.php?t=513404" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Excel VBA Frustrating Run-time error &#39;13&#39; Type mismatch - MrExcel Message Board.url</A>
                <DT><A HREF="http://www.techonthenet.com/excel/formulas/index_vba_alpha.php" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >MS Excel Topics_ VBA Functions (Alphabetical).url</A>
                <DT><A HREF="http://www.mrexcel.com/forum/showthread.php?t=8625" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Runtime error &#39;13&#39;_ Type mismatch==SOLVED - MrExcel Message Board.url</A>
                <DT><A HREF="http://www.dummies.com/how-to/content/understanding-vba-functions-and-their-uses.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Understanding VBA Functions and Their Uses - For Dummies.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=z_eoTLIOVxI" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >YouTube - Automatic ID Column in Excel.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307330605">PERL</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399698">DOCUMENTATION</H3>
                <DL><p>
                    <DT><A HREF="http://www.perlmonks.org/?node_id=252477" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >POD in 5 minutes.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399698">INCLUDES</H3>
                <DL><p>
                    <DT><A HREF="http://www.perlmonks.org/?node_id=393426" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Including files.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399698">IO</H3>
                <DL><p>
                    <DT><A HREF="http://perl6advent.wordpress.com/2010/12/03/day-3-file-operations/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Day 3 – File operations « Perl 6 Advent Calendar.url</A>
                    <DT><A HREF="https://192.168.1.43/v6/egov/apps/manager/admin.egov" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >eGov Manager Administrator __ D&#39;MENT Center __ Modify Page.url</A>
                    <DT><A HREF="http://eric.lubow.org/2009/perl/file-read-write-create-with-iofile/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >File Read Write Create with IO__File _ Erics Tech Blog.url</A>
                    <DT><A HREF="http://www.perladvent.org/2002/2nd/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl 2002 Advent Calendar_ IO__AtomicFile.url</A>
                    <DT><A HREF="http://www.troubleshooters.com/codecorn/littperl/perlfile.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl File Input, Output and Sorting.url</A>
                    <DT><A HREF="http://perl-tutorial-file-handles.r3.sk/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl Tutorial - File Handles.url</A>
                    <DT><A HREF="http://www.davidpashley.com/articles/perl-io-objects.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl&#39;s IO__Handle.url</A>
                    <DT><A HREF="http://www.devshed.com/c/a/Perl/Perl-Appending-and-Writing-to-Files/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl_ Appending and Writing to Files in Perl.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399698">SPECIAL VARIABLES</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307399698">@ARGV</H3>
                    <DL><p>
                        <DT><A HREF="http://www.sthomas.net/roberts-perl-tutorial.htm/ch13/_ARGV__Command_Line_Arguments" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >ARGV Command Line Arguments - Robert&#39;s Perl Tutorial.url</A>
                        <DT><A HREF="http://ist.marshall.edu/ist334/perl_basics.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl basics..url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307330605">TIME &amp; DATE</H3>
                <DL><p>
                    <DT><A HREF="http://docstore.mik.ua/orelly/perl/prog/ch03_088.htm" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >[Chapter 3] 3.2.88 localtime.url</A>
                </DL><p>
                <DT><A HREF="http://www.rocketaware.com/perl/perlfaq4/How_do_I_compute_the_difference_.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >! Aware to Perl_ How do I compute the difference of two arrays_ How do I compute the intersecti.url</A>
                <DT><A HREF="http://news.oreilly.com/2008/06/a-beginners-introduction-to-pe.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >A Beginner&#39;s Introduction to Perl 5.10, part three - O&#39;Reilly News.url</A>
                <DT><A HREF="http://www.perl.com/pub/2005/04/21/win32ole.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Automating Windows Applications with Win32__OLE - Perl.com.url</A>
                <DT><A HREF="chrome-extension://eemcgdkfndhakfknompkggombfjjjeno/main.html#1" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Bookmark Manager.url</A>
                <DT><A HREF="http://www.justskins.com/forums/build-multidimensional-array-from-133850.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Build multidimensional array from arrays - PERL Beginners.url</A>
                <DT><A HREF="http://www.perlmonks.org/?node_id=1977" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >How do I make a hash of arrays_.url</A>
                <DT><A HREF="http://webdesign.about.com/od/http/a/http_status_codes.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >HTTP Status Codes - 200 400 404 500 - Web Error Messages - Web Error Codes.url</A>
                <DT><A HREF="http://webdesign.about.com/cs/http/p/http5xx.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >HTTP Status Messages 5xx - Server Error Status Messages.url</A>
                <DT><A HREF="http://www.devshed.com/c/a/Perl/Array-Manipulation-in-Perl/4/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Looping the Loop - Perl.url</A>
                <DT><A HREF="http://www.webmasterkb.com/Uwe/Forum.aspx/perl/1354/New-FAQ-How-do-I-compute-the-difference-of-two-arrays" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >New FAQ_ How do I compute the difference of two arrays_.url</A>
                <DT><A HREF="http://perl101.org/regexes.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl 101 - Regexes.url</A>
                <DT><A HREF="http://www.perlmeme.org/tutorials/arrays.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl Arrays - a tutorial.url</A>
                <DT><A HREF="http://perlmeme.org/howtos/data_structures/arrays.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl arrays.url</A>
                <DT><A HREF="http://www.webdeveloper.com/forum/showthread.php?t=212059" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl One Liner - absolute path to a directory - WebDeveloper.com.url</A>
                <DT><A HREF="http://www.tutorialspoint.com/perl/perl_qq.htm" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >PERL qq(string) Function.url</A>
                <DT><A HREF="http://www.docdroppers.org/wiki/index.php?title=Perl_Regular_Expressions" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl Regular Expressions - DocDroppers.url</A>
                <DT><A HREF="http://www.perlmonks.org/index.pl?node_id=431511" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Perl White Magic - Special Variables and Command Line Switches.url</A>
                <DT><A HREF="http://perldoc.perl.org/perlop.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >perlop - perldoc.perl.org.url</A>
                <DT><A HREF="http://docstore.mik.ua/orelly/perl/cookbook/ch04_09.htm#ch04-29528" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Recipe 4.8. Computing Union, Intersection, or Difference of Unique Lists.url</A>
                <DT><A HREF="http://samie.sourceforge.net/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >SAMIE.url</A>
                <DT><A HREF="http://www.stonehenge.com/merlyn/UnixReview/col35.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >So what&#39;s the difference_ (dec 00).url</A>
                <DT><A HREF="http://www.adp-gmbh.ch/perl/subst_dollar.html" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Substituting dollars with PERL.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">VISIO_Alternative</H3>
            <DL><p>
                <DT><A HREF="http://www.3alternatives.com/3-free-alternatives-visio" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >3 Free Alternatives to Visio.url</A>
                <DT><A HREF="http://www.rackspace.com/cloud/cloudU/?CMP=CL11_Geeknet_Cube_Q2" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Cloud University and Training Sponsored by Rackspace.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Dia_(software)" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Dia (software) - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://dia-installer.de/support/donations.html" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Donate to dia-installer.de.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=8HgitKou6IQ" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >YouTube - Ho to create an ERD with DIA.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=FVsvsrzxmnI" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >YouTube - Introduction to Diagrams with Dia.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=4-ZunY73i_c&feature=related" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >YouTube - Tutorial 1.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399698">WEB APPLICATION DEVELOPMENT</H3>
            <DL><p>
                <DT><A HREF="http://blogs.sitepoint.com/development-guide-success/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >Web Application Development – A Guide to Success » SitePoint.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">PROJECT MANAGEMENT</H3>
        <DL><p>
            <DT><A HREF="http://www.ralphyoung.net/articles/Young.pdf" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >www.ralphyoung.net_articles_Young.pdf.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">SEO</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1307399699">GOOGLE</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307399699">Hacks</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307399699">Search by daterange</H3>
                    <DL><p>
                        <DT><A HREF="http://www.freeopenbook.com/google-hacks/googlehks-chp-1-sect-17.html" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Hack 11 Date-Range Searching _ Google Hacks.url</A>
                        <DT><A HREF="http://aa.usno.navy.mil/data/docs/JulianDate.php" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >Julian Date Converter.url</A>
                    </DL><p>
                </DL><p>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">SIDE JOBS</H3>
        <DL><p>
            <DT><A HREF="http://finance.yahoo.com/news/My-Blog-Is-Also-Paying-My-nytimes-1951716015.html" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >My Blog Is Also Paying My Bills - Yahoo! Finance.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307330605">STRENGTH TRAINING</H3>
        <DL><p>
            <DT><A HREF="http://www.davedraper.com/fusionbb/showtopic.php?tid/22701/" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >Arnold&#39;s six month bodyweight program - IronOnline Weight Training Forum.url</A>
            <DT><A HREF="http://leanhybridmuscle.com/access/old-man-strength.html" ADD_DATE="1307330605" LAST_VISIT="1322361172" LAST_MODIFIED="1307330605" >Gym strong versus real life strength. _ Lean Hybrid Muscle Building.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307399699">WINDOWS</H3>
        <DL><p>
            <DT><A HREF="http://superuser.com/questions/237335/suddenly-windows-7-requires-uac-for-perl-programs" ADD_DATE="1307399699" LAST_VISIT="1322361172" LAST_MODIFIED="1307399699" >suddenly Windows 7 requires UAC for perl programs_ - Super User.url</A>
        </DL><p>
        <DT><A HREF="http://docs/perl/" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >ActivePerl User Guide.url</A>
        <DT><A HREF="http://egov/manager" ADD_DATE="1307399698" LAST_VISIT="1322361172" LAST_MODIFIED="1307399698" >New Tab.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1307330311">Bookmarks Toolbar</H3>
    <DL><p>
        <DT><A HREF="http://www.mozilla.com/en-US/firefox/central/" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >Getting Started.url</A>
        <DT><A HREF="place:sort=8&redirectsMode=2&maxResults=10" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >Most Visited.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">CELEBS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Nude Celeb sites</H3>
        <DL><p>
            <DT><A HREF="http://www.sexyhotbeauty.com/tag/ashley-greene/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Ashley Greene  Sexy Hot Beauty.url</A>
            <DT><A HREF="http://thedailyfix.com/2009/06/24/dakota-fanning-is-er-wounded-on-set/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Dakota Fanning is, er, wounded on set  The Daily Fix.url</A>
            <DT><A HREF="http://earsucker.com/?s=nude" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >earsucker search results nude ۠earsucker.url</A>
            <DT><A HREF="http://www.celebdirtylaundry.com/2010/11/09/emma-watson-topless-photo-is-the-talk-of-the-internet-nsfw/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Emma Watson Topless Photo Is The Talk Of The Internet [NSFW]  Celebrity Dirty Laundry.url</A>
            <DT><A HREF="http://earsucker.com/2010/07/02/katy-perry-nude-photo-leaked/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Katy Perry nude photo leaked ˠearsucker.url</A>
            <DT><A HREF="http://critdick1.salientlink.net/2010/11/kristen-stewart-see-through-bikini-naked-ass-on-the-bed/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Kristen Stewart's Naked Ass & See Through Vagina IN Panties  Critdick.url</A>
            <DT><A HREF="http://tragicomical.com/2010/12/02/nude-sex-tape-photos-of-ashton-kutchers-rumored-mistress-brittney-jones/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Nude sex tape photos of Ashton Kutcherӳ rumored mistress, Brittney Jones ˠTragicomical.url</A>
            <DT><A HREF="http://www.topsocialite.com/twilights-ashley-greene-nude-threatens-lawsuit-over-nude-photos/" ADD_DATE="1298088100" LAST_VISIT="1322361172" LAST_MODIFIED="1298088100" >Twilights Ashley Greene NUDE threatens lawsuit over nude photos  Top Socialite.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1287579947">Links</H3>
    <DL><p>
        <DT><A HREF="http://www.makeuseof.com/tag/3-methods-host-wordpress-blog-images-external-server/" ADD_DATE="1321237984" LAST_VISIT="1322361088" LAST_MODIFIED="1321237984" >3 Methods To Host Your Wordpress Blog Images On An External Server.url</A>
        <DT><A HREF="http://athp.hp.com/" ADD_DATE="1287579956" LAST_VISIT="1322361088" LAST_MODIFIED="1287579956" >@hp Employee Portal.url</A>
        <DT><A HREF="http://www.amazon.com/s?ie=UTF8&field-is_prime_benefit=1&rh=n%3A2858778011&page=1" ADD_DATE="1320720255" LAST_VISIT="1322361088" LAST_MODIFIED="1322283014" ICON_URI="http://www.amazon.com/favicon.ico" >Amazon.com Prime Eligible Amazon Instant Video.url</A>
        <DT><A HREF="http://www.fatsickandnearlydead.com/about-the-film/learn-more/recipies/" ADD_DATE="1320824259" LAST_VISIT="1322361088" LAST_MODIFIED="1320824276" >Fat Sick Nearly Dead  Recipies.url</A>
        <DT><A HREF="http://www.earthclinic.com/CURES/itchy-butt.html" ADD_DATE="1321318461" LAST_VISIT="1322361088" LAST_MODIFIED="1321318461" >itchy-butt.url</A>
        <DT><A HREF="http://demos.usejquery.com/ketchup-plugin/" ADD_DATE="1320725367" LAST_VISIT="1322361088" LAST_MODIFIED="1320725367" >jQuery Ketchup Plugin - Documentation.url</A>
        <DT><A HREF="http://rocketsquared.com/wiki/Plugins/Validation" ADD_DATE="1320722121" LAST_VISIT="1322361088" LAST_MODIFIED="1320722121" >Plugins-Validation - Jqueryplugins.url</A>
        <DT><A HREF="https://ieonline.microsoft.com/#ieslice" ADD_DATE="1309075776" LAST_VISIT="1322361078" LAST_MODIFIED="1309075776" FEEDURL="https://ieonline.microsoft.com/#ieslice" WEBSLICE="true" ISLIVEPREVIEW="true" PREVIEWSIZE="320x240" ICON_URI="https://ieonline.microsoft.com/favicon.ico" >Suggested Sites.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?LinkId=121315" ADD_DATE="1309073782" LAST_VISIT="1322361078" LAST_MODIFIED="1309073782" FEEDURL="http://go.microsoft.com/fwlink/?LinkId=121315" WEBSLICE="true" ISLIVEPREVIEW="true" >Web Slice Gallery.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1297709430">Microsoft Websites</H3>
    <DL><p>
        <DT><A HREF="http://go.microsoft.com/fwlink/?LinkId=50893" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1309073782" >IE Add-on site.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=44661" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1309073782" >IE site on Microsoft.com.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=69151" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1297709430" >Marketplace.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=55424" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1309073782" >Microsoft At Home.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=68920" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1309073782" >Microsoft At Work.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=140813" ADD_DATE="1309073782" LAST_VISIT="1322361172" LAST_MODIFIED="1309073782" >Microsoft Store.url</A>
        <DT><A HREF="http://go.microsoft.com/fwlink/?linkid=68919" ADD_DATE="1297709430" LAST_VISIT="1322361172" LAST_MODIFIED="1297709430" >Welcome to IE7.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1307330311">Mozilla Firefox</H3>
    <DL><p>
        <DT><A HREF="http://www.mozilla.com/en-US/firefox/about/" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >About Us.url</A>
        <DT><A HREF="http://www.mozilla.com/en-US/firefox/customize/" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >Customize Firefox.url</A>
        <DT><A HREF="http://www.mozilla.com/en-US/firefox/community/" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >Get Involved.url</A>
        <DT><A HREF="http://www.mozilla.com/en-US/firefox/help/" ADD_DATE="1307330311" LAST_VISIT="1322361172" LAST_MODIFIED="1307330311" >Help and Tutorials.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1307330294">Opera</H3>
    <DL><p>
        <DT><A HREF="http://www.opera.com/download/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >Download Opera.url</A>
        <DT><A HREF="http://www.opera.com/portal/startup/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >Get started with Opera.url</A>
        <DT><A HREF="http://my.opera.com/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >My Opera Community.url</A>
        <DT><A HREF="http://portal.opera.com/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >Opera Portal.url</A>
        <DT><A HREF="http://www.operamail.com/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >Opera Web Mail.url</A>
        <DT><A HREF="http://www.opera.com/support/" ADD_DATE="1307330294" LAST_VISIT="1322361172" LAST_MODIFIED="1307330294" >Support Desk.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1307675177">SURVIVAL & DISASTER PREPAREDNESS</H3>
    <DL><p>
        <DT><A HREF="http://www.amazon.com/get-dodge-survival-gear-part/lm/R3PXIVMYMMIAVA/ref=cm_lmt_fvsy_f_3_rysdsd0" ADD_DATE="1307676352" LAST_VISIT="1322361172" LAST_MODIFIED="1307676352" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com get out of dodge survival gear part 1.url</A>
        <DT><A HREF="http://www.amazon.com/gp/community-content-search/results/ref=cm_srch_q_col_rpli/?query=GOOD+BAG&search-alias=rp-listmania" ADD_DATE="1307676543" LAST_VISIT="1322361172" LAST_MODIFIED="1307676543" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com Listmania! - GOOD BAG.url</A>
        <DT><A HREF="http://www.amazon.com/SHTF-quot-things-times-come/lm/R38E3DK9TUD8BV/ref=cm_lmt_fvsy_f_2_rysdsd0" ADD_DATE="1307680168" LAST_VISIT="1322361172" LAST_MODIFIED="1307680168" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com SHTF or BUG IN things for times to come.url</A>
        <DT><A HREF="http://www.amazon.com/smart-survival-gear-bug-list/lm/R3TQU3R421K1FO/ref=cm_lmt_fvlm_f_5_rlrsrs0" ADD_DATE="1307680239" LAST_VISIT="1322361172" LAST_MODIFIED="1307680239" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com smart survival gear -bug out bag list.url</A>
        <DT><A HREF="http://www.amazon.com/gp/richpub/syltguides/fullview/R2P43TUXHES2AQ/ref=cm_syt_fvlm_f_4_rlrsrs1" ADD_DATE="1307676338" LAST_VISIT="1322361172" LAST_MODIFIED="1307676338" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com survive an apocalypse..url</A>
        <DT><A HREF="http://www.amazon.com/When-SHTF-it-s-time-to-GOOD-grab-your-Bug-Out-Bag-and-make-like-Eli/lm/R9HOYZTL3TFTK/ref=cm_srch_res_rpli_alt_2" ADD_DATE="1307679266" LAST_VISIT="1322361173" LAST_MODIFIED="1307679266" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com When SHTF, it's time to GOOD, grab your Bug Out Bag, and make like Eli.url</A>
        <DT><A HREF="http://www.survivaltopics.com/survival/the-5-basic-survival-skills/" ADD_DATE="1307675179" LAST_VISIT="1322361173" LAST_MODIFIED="1307675179" ICON_URI="http://www.survivaltopics.com/media/favicon.ico" >The 5 Basic Survival Skills.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1313424116">[FREELANCE WEB DESIGN]</H3>
    <DL><p>
        <DT><A HREF="http://www.svcreation.com/inglewood-california-web-design/" ADD_DATE="1313424118" LAST_VISIT="1322361173" LAST_MODIFIED="1313424118" >Inglewood California Web Design, Graphic Design, and Logo Design  SVCreation.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1313435208">[PIZZA DELIVERY]</H3>
    <DL><p>
        <DT><A HREF="http://deliverawaydebt.com/about-jeff-kosola-and-deliverawaydebt/" ADD_DATE="1313436186" LAST_VISIT="1322361173" LAST_MODIFIED="1313436186" >About Jeff Kosola and Deliver Away Debt.url</A>
        <DT><A HREF="http://wiki.answers.com/Q/How_much_money_does_the_average_pizza_man_earn" ADD_DATE="1313436807" LAST_VISIT="1322361173" LAST_MODIFIED="1313436807" ICON_URI="http://en.site1.answcdn.com/favicon.ico?v=8" >How much money does the average pizza man earn.url</A>
        <DT><A HREF="http://www.wikihow.com/Make-Good-Tips-Delivering-Pizza" ADD_DATE="1313531324" LAST_VISIT="1322361173" LAST_MODIFIED="1313531324" ICON_URI="http://pad1.whstatic.com/favicon.ico" >How to Make Good Tips Delivering Pizza - wikiHow.url</A>
        <DT><A HREF="http://livingstingy.blogspot.com/2011/02/pizza-delivery-real-job-or-just-selling.html" ADD_DATE="1313531250" LAST_VISIT="1322361173" LAST_MODIFIED="1313531250" ICON_URI="http://livingstingy.blogspot.com/favicon.ico" >Living Stingy Pizza Delivery - a Real Job or Just Selling Your Car in Slow Motion.url</A>
        <DT><A HREF="http://tightfistedmiser.com/2008/06/03/overview-of-delivering-pizza-to-make-extra-money/" ADD_DATE="1313436602" LAST_VISIT="1322361173" LAST_MODIFIED="1313436602" ICON_URI="http://tightfistedmiser.com/2008/06/03/overview-of-delivering-pizza-to-make-extra-money/favicon.ico" >Overview of Delivering Pizza to Make Extra Money.url</A>
        <DT><A HREF="http://deliverawaydebt.com/pizza-delivery/july-2010-pizza-deliveries/" ADD_DATE="1313435210" LAST_VISIT="1322361173" LAST_MODIFIED="1313435210" >Pizza Delivery  July 2010 Totals Earned.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1313885181">[WES GO GREEN]</H3>
    <DL><p>
        <DT><A HREF="http://www.amazon.com/Bricor-B100-Super-Max-Showerhead/dp/B0040MI3WQ" ADD_DATE="1313885225" LAST_VISIT="1322361173" LAST_MODIFIED="1313885225" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com Bricor B100 Super Max Showerhead Home Improvement.url</A>
        <DT><A HREF="http://www.cga.ct.gov/default.asp" ADD_DATE="1313885284" LAST_VISIT="1322361173" LAST_MODIFIED="1313885285" ICON_URI="http://www.cga.ct.gov/images/favicon.ico" >Connecticut General Assembly.url</A>
        <DT><A HREF="http://www.wesgogreen.com/contact.php" ADD_DATE="1313885411" LAST_VISIT="1322361173" LAST_MODIFIED="1313885411" ICON_URI="http://www.wesgogreen.com/www/favicon.ico" >Contact WES - Water and Energy Solutions Inc..url</A>
        <DT><A HREF="http://www.ilsos.gov/corporatellc/" ADD_DATE="1313885183" LAST_VISIT="1322361173" LAST_MODIFIED="1313885183" ICON_URI="http://www.ilsos.gov/favicon.ico" >CORP-LLC - CERTIFICATE OF GOOD STANDING.url</A>
        <DT><A HREF="https://secure.in.gov/sos/online_corps/name_search_results.aspx?search_name=water*energy&search_type=exact&client_id=&search_mode=search&submit.x=0&submit.y=0" ADD_DATE="1313885422" LAST_VISIT="1322361173" LAST_MODIFIED="1313885422" ICON_URI="https://secure.in.gov/favicon.ico" >Corporations Search Results.url</A>
        <DT><A HREF="http://www.jumpstartinc.org/Communications/EntrepreneurialStories/" ADD_DATE="1313885215" LAST_VISIT="1322361173" LAST_MODIFIED="1313885215" >Entrepreneurial Stories - JumpStart Inc..url</A>
        <DT><A HREF="http://www.wesgogreen.com/about.php" ADD_DATE="1313885359" LAST_VISIT="1322361173" LAST_MODIFIED="1313885359" ICON_URI="http://www.wesgogreen.com/www/favicon.ico" >http--www.wesgogreen.com-about.php.url</A>
        <DT><A HREF="http://www.linkedin.com/pub/janine-jasinski/12/751/438" ADD_DATE="1313885204" LAST_VISIT="1322361173" LAST_MODIFIED="1313885204" ICON_URI="http://static01.linkedin.com/scds/common/u/img/favicon_v3.ico" >Janine Jasinski  LinkedIn.url</A>
        <DT><A HREF="http://www.facebook.com/mark.witzig" ADD_DATE="1313885393" LAST_VISIT="1322361173" LAST_MODIFIED="1313885393" >Mark Witzig  Facebook.url</A>
        <DT><A HREF="http://www.nextstep.state.mn.us/member_detail.cfm?memberid=2188" ADD_DATE="1313885306" LAST_VISIT="1322361173" LAST_MODIFIED="1313885306" >MnSCN Member Directory Record.url</A>
        <DT><A HREF="http://awcprogram.com/4.html" ADD_DATE="1313885192" LAST_VISIT="1322361173" LAST_MODIFIED="1313885192" >Municipal - Aggressive Water Conservation Program.url</A>
        <DT><A HREF="http://www.awcprogram.com/newsroom.html" ADD_DATE="1313885344" LAST_VISIT="1322361173" LAST_MODIFIED="1313885344" >Newsroom - Aggressive Water Conservation Program.url</A>
        <DT><A HREF="http://www.onesource.com/free/Steve-Witzig/People/Profile/103977666-1" ADD_DATE="1313885296" LAST_VISIT="1322361173" LAST_MODIFIED="1313885296" ICON_URI="http://www.onesource.com/favicon.ico" >Steve Witzig Water & Energy Solutions Inc Executive Profile.url</A>
        <DT><A HREF="http://search.yahoo.com/search;_ylt=A0oG7lYVRlBOp2sAVONXNyoA;_ylc=X1MDUCMyNzY2Njc5BF9yAzIEYW8DMQRjc3JjcHZpZANSRHJtOUVvRzd2NnBRZzFIVGsuMTV3MzNHQTBaM1U1UVJoVUFCbVh5BGZyA3VzaDEtZmluYW5jZQRmcjIDc2J0bgRuX2dwcwMxBG9yaWdpbgNzcnAEcXVlcnkDIndhdGVyIGFuZCBlbmVyZ3kgc29sd" ADD_DATE="1313885245" LAST_VISIT="1322361173" LAST_MODIFIED="1313885245" ICON_URI="http://search.yahoo.com/favicon.ico" >water and energy solutions inc - Yahoo! Search Results.url</A>
        <DT><A HREF="http://www.b2benergy.com/business-information/305484774-water-and-energy-solutions-inc.html" ADD_DATE="1313885351" LAST_VISIT="1322361173" LAST_MODIFIED="1313885351" ICON_URI="http://www.b2benergy.com/favicon.ico" >Water and Energy Solutions Inc in Minneapolis MN 55430  b2bEnergy.com.url</A>
        <DT><A HREF="http://www.merchantcircle.com/business/Water.and.Energy.Solutions.Inc.763-205-1500" ADD_DATE="1313885339" LAST_VISIT="1322361173" LAST_MODIFIED="1313885339" ICON_URI="http://www.merchantcircle.com/favicon.ico" >Water and Energy Solutions Inc, Minneapolis MN 55430 -- MerchantCircle.com.url</A>
        <DT><A HREF="http://www.bbb.org/minnesota/business-reviews/energy-conservation-products-and-services/water-and-energy-solutions-in-brooklyn-center-mn-96114627" ADD_DATE="1313885401" LAST_VISIT="1322361173" LAST_MODIFIED="1313885401" ICON_URI="http://www.bbb.org/minnesota/images/2/favicon.ico" >Water and Energy Solutions Inc. Business Review in Brooklyn Center, MN - Minnesota and North Dakota BBB.url</A>
        <DT><A HREF="http://www.prlog.org/11427675-water-and-energy-solutions-inc-is-offering-complete-municipal-water-conservation-program.html" ADD_DATE="1313885239" LAST_VISIT="1322361173" LAST_MODIFIED="1313885239" ICON_URI="http://www.prlog.org/favicon.ico" >Water and Energy Solutions Inc., is offering a complete municipal water conservation program  PRLog.url</A>
        <DT><A HREF="http://www.apartmentratings.com/rate/IN-Indianapolis-Waterfront-Pointe.html" ADD_DATE="1313885266" LAST_VISIT="1322361173" LAST_MODIFIED="1313885266" ICON_URI="http://www.apartmentratings.com/favicon.ico" >Waterfront Pointe Apartment Ratings, Reviews, Map, Rents, and other Indianapolis apartments for rent from ApartmentRatings.com.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_800 Numbers</H3>
    <DL><p>
        <DT><A HREF="http://www.contacthelp.com/directory/Government/United+States+Departments/USPS?AID=5&ListingID=200" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS customer service phone numbers and support.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_ACTING & PERFORMANCE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Acting Jobs</H3>
        <DL><p>
            <DT><A HREF="http://www.exploretalent.com/model_page.php" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Eric Talent Profile - ExploreTalent Modeling Auditions & Casting ExploreTalent acting jobs acti.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_ANIMALS & PETS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1299519127">IVORY BILLED WOODPECKER</H3>
        <DL><p>
            <DT><A HREF="http://www.free-press-release.com/news-daniel-rainsong-finds-living-ivory-billed-woodpecker-1263914173.html" ADD_DATE="1299519134" LAST_VISIT="1322361173" LAST_MODIFIED="1299519134" ICON_URI="http://www.free-press-release.com/favicon.ico" >http--www.free-press-release.com-news-daniel-rainsong-finds-living-ivory-billed-woodpecker-1263914173.html.url</A>
            <DT><A HREF="http://www.ivory-bill-woodpecker.com/ivory-bill-news.htm" ADD_DATE="1299519346" LAST_VISIT="1322361173" LAST_MODIFIED="1299519347" ICON_URI="http://www.ivory-bill-woodpecker.com/ivory-billed.ico" >News for Ivory-billed Woodpecker Conservation Stamp Print Program.url</A>
            <DT><A HREF="http://www.ivory-bill-woodpecker.com/" ADD_DATE="1299519281" LAST_VISIT="1322361173" LAST_MODIFIED="1299519282" ICON_URI="http://www.ivory-bill-woodpecker.com/ivory-billed.ico" >Official Ivory-billed Woodpecker Conservation Stamp Print Program.url</A>
            <DT><A HREF="http://www.sciencedaily.com/releases/2009/01/090116142115.htm" ADD_DATE="1299519129" LAST_VISIT="1322361173" LAST_MODIFIED="1299519129" ICON_URI="http://www.sciencedaily.com/favicon.ico" >Study May Give Hope That Ivory-billed Woodpeckers Still Around.url</A>
        </DL><p>
        <DT><A HREF="http://www.domesticsale.com/Classifieds/search/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mini dachshund.url</A>
        <DT><A HREF="http://www.dogster.com/dog-breeds/Miniature_Dachshund" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Miniature Dachshund Information, Pictures of Miniature Dachshunds  Dogster.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_ART</H3>
    <DL><p>
        <DT><A HREF="http://graingnome.deviantart.com/art/012-DJ-Goh-Goh-148120809?q=boost%3Apopular+in%3Agameart+naruto&qo=17" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >012 - DJ Goh Goh by GrainGnome on deviantART.url</A>
        <DT><A HREF="http://browse.deviantart.com/?qh=&section=&global=1&q=GNOME" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Browsing deviantART.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_ART OF WAR</H3>
    <DL><p>
        <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/programmes/from_our_own_correspondent/8653689.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >amazon.com Hagakure The Book of the Samurai (9784770029164) Yamamoto Tsunetomo, William Scott W.url</A>
        <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/south_asia/8640016.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >SONSHI.COM  Purchase Sun Tzu books Sun Tzu Art of War Strategy and Leadership Site..url</A>
        <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/programmes/click_online/8654841.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Art of War - BusinessWeek.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_AUDIO & VIDEO</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CODECS</H3>
        <DL><p>
            <DT><A HREF="http://forums.afterdawn.com/thread_view.cfm/110747" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Avi codec audio problem.url</A>
            <DT><A HREF="http://www.afterdawn.com/software/general/download_splash.cfm/ffdshow" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Downloading FFDSHOW rev. 3489 (20100628)....url</A>
            <DT><A HREF="http://www.free-codecs.com/search.php?cx=partner-pub-7595495923317249%3A3csgxgupts4&cof=FORID%3A11&ie=ISO-8859-1&q=Windows+Mpeg4+Codec+&sa=GO&siteurl=www.free-codecs.com%2FAVIcodec_download.htm#1357" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >FREE-CODECS.com.url</A>
            <DT><A HREF="http://www.free-codecs.com/Microsoft_MPEG-4_V1_2_3_VKI_Codec_download.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.free-codecs.com-Microsoft_MPEG-4_V1_2_3_VKI_Codec_download.htm.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">FORMAT CONVERSION</H3>
        <DL><p>
            <DT><A HREF="http://koyotstar.free.fr/indexEn.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Koyote Soft.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">MAKING VIDEO TUTORIALS</H3>
        <DL><p>
            <DT><A HREF="http://camstudio.org/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >CamStudio - Free Screen Recording Software.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">PLAYLISTS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Print Playlist</H3>
            <DL><p>
                <DT><A HREF="http://www.recipester.org/Recipe:Generate_HTML_Playlist_on_Winamp_33103374" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Generate HTML Playlist on Winamp.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">RECORDING LIVE MUSIC</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">_Multitracking</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=1&oq=best+8+track+rec&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=best+8+track+recorder+review" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >best 8 track recorder review - Google Search.url</A>
                <DT><A HREF="http://www.studio-central.com/multi_track_recorders.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Overview of Multi Track Recorders.url</A>
                <DT><A HREF="http://homerecording.com/tas488review.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >TASCAM 488 Review - Home Recording dot com.url</A>
            </DL><p>
            <DT><A HREF="http://www.aqdi.com/zerocap.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Atlantic Quality Design, Inc., ZEROCAP(TM).url</A>
            <DT><A HREF="http://www.core-sound.com/lcmics/5.php" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Core Sound נCore Sound Low Cost Binaural Microphones and Low Cost Stealthy Cardioid Microphone.url</A>
            <DT><A HREF="http://www.free-codecs.com/AVIcodec_download.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Free-Codecs.com  AVIcodec 1.2.0.113  AVIcodec is a free multimedia files analyser..url</A>
            <DT><A HREF="http://superuser.com/questions/40549/how-to-convert-a-video-without-loss-in-quality" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to convert a video without loss in quality - Super User.url</A>
            <DT><A HREF="http://homerecording.about.com/od/tapingliveconcerts/a/ipod_taping.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Taping With The iPod - Using Apple's iPod As A Recording Device - Belkin TuneTalk Stereo Review.url</A>
            <DT><A HREF="http://homerecording.about.com/od/tapingliveconcerts/The_Tapers_Section_The_Hobby_Of_Taping_Live_Concerts.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Taper's Section -- Concert Taping Tips & Tricks.url</A>
            <DT><A HREF="http://wapedia.mobi/en/Bootleg_recording" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Wapedia - Wiki Bootleg recording.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TOOLS & UTILITIES</H3>
        <DL><p>
            <DT><A HREF="http://www.free-codecs.com/download/GSpot.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Free-Codecs.com  Download GSpot 2.70  GSpot identifies which video codec and audio compression .url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Video Editing & Production</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Tutorials</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=bzz4uaS46nk&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - After Effects Kamehameha 2.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=hKZyoHG0MeM&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Blue fire in my hand.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=fMSaFJ4NdWw&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Blue LIGHTNING In my hand.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=LdtcRyOUFdg&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Flaming Hands Test.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=rPN1h2Ywk_Y&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Heroes Effects - Fire Manipulation (After Effects).url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=9KoLWA2CqDY&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Heroes Effects-Blue Fire Blast.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=lL3rGFU6VMY&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - How to get that Cinematic Look on a zero budget.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=uSqvDRvv22M&NR=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - How to Make Your Video Look Like Film.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=hmJs8e9rRQ4&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Matrix Effect Tutorial for Sony Vegas 8.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=5V-eSFJ16B0&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - New Effects Using Sony Vegas 8.0 Pro.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=IP4n6wvxtHM&NR=1&feature=fvwp" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Sony Vegas 8 Pro - Cinematic Effect Tutorial.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=RoBrHgetupU&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - SONY VEGAS cinematic look in 3 steps.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=o9OYQK73gA0&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - The Best Rasengan.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">VIRTUALDUB</H3>
        <DL><p>
            <DT><A HREF="http://forums.afterdawn.com/thread_view.cfm/110747" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Avi codec audio problem.url</A>
            <DT><A HREF="http://www.divxland.org/video_edition.php" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >DivXLand.org - VirtualDub Video Edition Guide.url</A>
            <DT><A HREF="http://findhow.blogspot.com/2007/10/tutorial-how-to-change-resolution-of.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >findhow [Tutorial] How to change the resolution of a video.url</A>
            <DT><A HREF="http://codecs.necromancers.ru/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--codecs.necromancers.ru- nAVI Codec.url</A>
            <DT><A HREF="http://www.moviecodec.com/video-codecs/mp42-decompressor-for-virtualdub-1670/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >MP42 Decompressor for VirtualDub.url</A>
            <DT><A HREF="http://forums.virtualdub.org/index.php?act=ST&f=7&t=15093&s=2b7ec54a6a7a0ac694b810071ccc0a4f" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Unofficial VirtualDub Support Forums - Directshow Input Driver, 0.1.url</A>
            <DT><A HREF="http://www.jhepple.com/support/divxvirtualdub.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >VDub - DivX Tutorial.url</A>
            <DT><A HREF="http://forum.videohelp.com/threads/278555-Vdub-vs-Vdubmod-vs-Vdubmpeg2" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Vdub vs Vdubmod vs Vdubmpeg2.url</A>
            <DT><A HREF="http://www.animecrazy.net/forums/village-technology/54203-virtualdub-not-working.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >VirtualDub not working - AnimeCrazy.net Forums - The True Anime Streaming Community.url</A>
            <DT><A HREF="http://forum.videohelp.com/threads/286901-VirtualDub-Now-Has-a-Directshow-Driver-Plugin" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >VirtualDub Now Has a Directshow Driver Plugin.url</A>
            <DT><A HREF="http://www.filepie.us/?title=VirtualDub" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >VirtualDub.url</A>
            <DT><A HREF="http://www.virtualdub.org/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Welcome to virtualdub.org! - virtualdub.org.url</A>
            <DT><A HREF="http://forum.videohelp.com/threads/285337-What-is-Batch-mode-editing-in-Virtualdub" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >What is Batch mode editing in Virtualdub.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_AUTOMOTIVE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">ACCESSORIES</H3>
        <DL><p>
            <DT><A HREF="http://www.atpcarboutique.com/keystone_product.php?PartID=A50315052" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >atp Rear View Mirror Accessories Hanging Cuffs; silver.url</A>
            <DT><A HREF="http://www.me-mo.co.uk/category.asp?id=3" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Me-Mo - Car JewelleryDice, Magnets, Stickers, - Funky Car Accessories for Girls. Great Gift Ide.url</A>
            <DT><A HREF="http://www.me-mo.co.uk/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Me-Mo - Welcome - Funky Car Accessories for Girls. Great Gift Ideas!.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=surfboard+keyc&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=surfboard+keychains" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >surfboard keychains - Google Search.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">BUY & SELL</H3>
        <DL><p>
            <DT><A HREF="http://www.buy-and-sell-cars-for-profit.com/blog/they-stole-car-during-test-drive/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >They Stole His Car During The Test Drive - Part 1  Buy And Sell Cars For Profit!.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CITROEN</H3>
        <DL><p>
            <DT><A HREF="http://www.citroen-ca.com/News.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Citro쮠News.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">GIRLS</H3>
        <DL><p>
            <DT><A HREF="http://www.youtube.com/watch?v=lAZ5PJArqes&NR=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - THE BEST GIRLS TUNING.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">HANDS FREE DEVICES</H3>
        <DL><p>
            <DT><A HREF="http://www.bestbuy.com/site/BlueAnt+-+S4+Bluetooth+Speakerphone+for+Most+Vehicles+-+Black/9932056.p?skuId=9932056&id=1218197325956#tabbed-customerreviews" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >BlueAnt - S4 Bluetooth Speakerphone for Most Vehicles - Black - 34949BBR#tabbed-customerreviews.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1310913913">SCOOTERS & MOPEDS</H3>
        <DL><p>
            <DT><A HREF="http://www.scooterdepot.us/moped-scooters-p-1-c-31.html?gclid=CI6smuSPh6oCFYrJKgodL0GF0A" ADD_DATE="1310913967" LAST_VISIT="1322361173" LAST_MODIFIED="1310913967" >Moped Scooters - ScooterDepot.url</A>
            <DT><A HREF="http://www.saferwholesale.com/category-s/31.htm" ADD_DATE="1310913934" LAST_VISIT="1322361173" LAST_MODIFIED="1310913935" ICON_URI="https://saferwholesale.com/v/favicon.ico" >SaferWholesale - Scooters.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_AWESOME FEMALES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">SPORTS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">(Weightlifter) Bethann McCalla</H3>
            <DL><p>
                <DT><A HREF="http://www.the2012londonolympics.com/forum/showthread.php?t=11453" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >McCalla hopes to snatch Olympic dream in 2012 - Athletes & Sports news, facts & figures.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BARS & BARTENDING</H3>
    <DL><p>
        <DT><A HREF="http://hubpages.com/hub/101-on-treating-a-bartender" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >101 on What NOT to do in a bar.url</A>
        <DT><A HREF="http://hubpages.com/hub/Bar-Fine" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Bar Fine.url</A>
        <DT><A HREF="http://hubpages.com/hub/Top-Ten-Ways-to-Piss-Off-Your-Bartender-Part-2" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Top Ten Ways to Piss Off Your Bartender (Part 2).url</A>
        <DT><A HREF="http://hubpages.com/hub/Top-Ten-Ways-to-Piss-Off-Your-Bartender" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Top Ten Ways to Piss Off Your Bartender.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BLOGGING FOR CASH</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1301081864">Adsense Alternatives</H3>
        <DL><p>
            <DT><A HREF="http://www.tech-faq.com/alternatives-to-google-adsense.html" ADD_DATE="1307204579" LAST_VISIT="1322361173" LAST_MODIFIED="1307204579" ICON_URI="http://www.tech-faq.com/favicon.ico" >Alternatives to Google AdSense.url</A>
            <DT><A HREF="http://www.rosswalker.co.uk/adsense_top10/" ADD_DATE="1301081867" LAST_VISIT="1322361173" LAST_MODIFIED="1301081867" >The Top 10 Alternatives to Google Adsense.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307198310">EHOW</H3>
        <DL><p>
            <DT><A HREF="http://angelwingcorner.blogspot.com/" ADD_DATE="1307198311" LAST_VISIT="1322361173" LAST_MODIFIED="1307198312" ICON_URI="http://angelwingcorner.blogspot.com/favicon.ico" >Work From Home the eHow Way and More.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1300898578">Triond</H3>
        <DL><p>
            <DT><A HREF="http://fg2nmoneymaking.blogspot.com/2011/03/triond-payment-proof-and-review-video.html" ADD_DATE="1300898579" LAST_VISIT="1322361173" LAST_MODIFIED="1300898580" ICON_URI="http://fg2nmoneymaking.blogspot.com/favicon.ico" >Best of the Best Money Making Blog Triond Payment proof and review video.url</A>
            <DT><A HREF="http://www.suite101.com/content/get-paid-to-write---20-websites-for-freelance-writers-a322539" ADD_DATE="1300898585" LAST_VISIT="1322361173" LAST_MODIFIED="1300898585" ICON_URI="http://www.suite101.com/favicon_2.ico" >Get Paid to Write ֠20 Websites for Freelance Writers.url</A>
            <DT><A HREF="http://www.workfromhome-ideas.net/legitimate-work-from-home-site.html" ADD_DATE="1300898597" LAST_VISIT="1322361173" LAST_MODIFIED="1300898598" >Legitimate Work from Home Site ֠Triond Review  Work from Home Ideas.url</A>
            <DT><A HREF="http://www.onlinewebmarket.net/?p=263" ADD_DATE="1300898608" LAST_VISIT="1322361173" LAST_MODIFIED="1300898608" ICON_URI="http://www.onlinewebmarket.net/favicon.ico" >OWM Triond ֠get paid to write and review.url</A>
            <DT><A HREF="http://www.associatedcontent.com/article/292996/review_of_writing_site_triondcom__pg2.html?cat=9" ADD_DATE="1300898603" LAST_VISIT="1322361173" LAST_MODIFIED="1300898603" ICON_URI="http://www.associatedcontent.com/favicon.ico" >Review of Writing Site Triond.com , Page 2 of 2 - Associated Content from Yahoo! - associatedcontent.com.url</A>
            <DT><A HREF="http://www.suite101.com/content/triond-review-good-passive-income-opportunity-a181219" ADD_DATE="1300898591" LAST_VISIT="1322361173" LAST_MODIFIED="1300898591" ICON_URI="http://www.suite101.com/favicon_2.ico" >Triond Review נGood Passive Income Opportunity Freelance Writers Earn Cash With Residual Income Opportunity Website.url</A>
            <DT><A HREF="http://atozwriter.blogspot.com/2010/05/triond-review.html" ADD_DATE="1300898612" LAST_VISIT="1322361173" LAST_MODIFIED="1300898612" ICON_URI="http://atozwriter.blogspot.com/favicon.ico" >Writer's Paradise Triond - A Review.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1299356734">YouTube & WordPress</H3>
        <DL><p>
            <DT><A HREF="http://mrinternettips.com/youtube-options-examples/" ADD_DATE="1299356738" LAST_VISIT="1322361173" LAST_MODIFIED="1299356738" >YouTube Options Examples  Mr. Internet Tips.url</A>
        </DL><p>
        <DT><A HREF="http://consumer-warning.org/disclosure-privacy-policies/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Disclosure-Privacy  Consumer-Warning.org.url</A>
        <DT><A HREF="http://learn.wordpress.com/get-started/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Get Started  Learn WordPress.com.url</A>
        <DT><A HREF="http://www.dofollower.com/2011/04/google-adsense-revenue-sharing-sites/" ADD_DATE="1307199438" LAST_VISIT="1322361173" LAST_MODIFIED="1307199438" ICON_URI="http://www.dofollower.com/wp-content/themes/Snapwire/inc/admin/images/favicon.ico" >Google AdSense Revenue Sharing Sites  Dofollower.com.url</A>
        <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US376&as_q=make+money+blogging&as_epq=&as_oq=&as_eq=&num=10&lr=&as_filetype=&ft=i&as_sitesearch=&as_qdr=m&as_rights=&as_occt=any&cr=&as_nlo=&as_nhi=&safe=images" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >make money blogging - Google Search.url</A>
        <DT><A HREF="http://ijstyles.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Make Money Blogging 2.0.url</A>
        <DT><A HREF="http://www.bloggerearn.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Make Money Blogging, Make Money Online - Blogger Earn.url</A>
        <DT><A HREF="http://www.clementfaria.com/blog/making-money-online-with-cpalead/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Making Money Online With CPALead  cfWeblog - A Web Developer's Journal.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BLOGS</H3>
    <DL><p>
        <DT><A HREF="http://www.technovelgy.com/ct/Science-Fiction-News.asp?NewsNum=1242" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Chinese Fans Make Citroen C2 Transformer Science Fiction in the News.url</A>
        <DT><A HREF="http://www.fark.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Drew Curtis' FARK.com.url</A>
        <DT><A HREF="http://www.homestarrunner.com/main3.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Homestar Runner.url</A>
        <DT><A HREF="http://www.gobotsarepurelove.com/toys/strong-bot.shtml" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Playskool GO-BOTS are Pure Love Fansite [ STRONG-BOT ].url</A>
        <DT><A HREF="http://theoatmeal.com/comics/irony" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The 3 Most Common Uses of Irony - The Oatmeal.url</A>
        <DT><A HREF="http://www.mcsweeneys.net/links/monologues/15comicsans.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Timothy McSweeney's Internet Tendency I'm Comic Sans, Asshole..url</A>
        <DT><A HREF="http://www.mcsweeneys.net/links/monologues/17spade.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Timothy McSweeney's Internet Tendency Sam Spade Asks You Out On a Date..url</A>
        <DT><A HREF="http://www.urbansamurai.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >URBAN SAMURAI.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BODY ART</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TATTOOS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Chinese Characters</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=2&oq=chinese+charac&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=chinese+characters+and+meanings" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >chinese characters and meanings - Google Search.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BODYBUILDING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Warm-ups and Exercises</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">UNFKNBLVBL!</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=5VuCZlcK2ok&feature=player_embedded" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - super man warm up.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BOOK PUBLISHING</H3>
    <DL><p>
        <DT><A HREF="http://en.wikipedia.org/wiki/AuthorHouse" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >AuthorHouse - Wikipedia, the free encyclopedia.url</A>
        <DT><A HREF="http://www.prweb.com/releases/2009/08/prweb2722664.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >AuthorHouse Introduces Two New Color Book Publishing Packages.url</A>
        <DT><A HREF="http://www.48hrbooks.com/?gclid=CJ_4k-uLh6ICFQnyDAoddmCDUQ" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Book Printing, Book Publishing, Self Publishing.url</A>
        <DT><A HREF="http://www.authorhouse.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Book Publishing Company, Book Publishers, Self Publishing, Get Published.url</A>
        <DT><A HREF="http://dogearpublishing.net/landing_compare-authorhouse.aspx?gclid=CJq3r-WIh6ICFQ_yDAodpBD6Vg" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Compare Authorhouse.url</A>
        <DT><A HREF="http://online.wsj.com/article/SB10001424052748704912004575253132121412028.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Digital Self-Publishing Shakes Up Traditional Book Industry - WSJ.com.url</A>
        <DT><A HREF="http://www.time.com/time/magazine/article/0,9171,1617545,00.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Don't Call It Vanity Press - TIME.url</A>
        <DT><A HREF="http://www.fictionpress.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Let the Words Flow - FictionPress.com.url</A>
        <DT><A HREF="http://en.wikipedia.org/wiki/PublishAmerica" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >PublishAmerica - Wikipedia, the free encyclopedia.url</A>
        <DT><A HREF="http://www.lulu.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Self Publishing - Lulu.com.url</A>
        <DT><A HREF="http://www.authorhouse.com/bookstore/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Self Publishing Bookstore - AuthorHouse.url</A>
        <DT><A HREF="http://www.fonerbooks.com/q_vanity.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Subsidy Press Questions - Should I Publish with AuthorHouse, iUniverse or Xlibris.url</A>
        <DT><A HREF="http://en.wikipedia.org/wiki/Vanity_press" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Vanity press - Wikipedia, the free encyclopedia.url</A>
        <DT><A HREF="http://www.vantagepress.com/overview.html?gclid=COCP7u-Lh6ICFRbyDAod9kg_WA" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Vantage Press - Let's Make a Beautiful Book Togetherٮurl</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_BUYING & SELLING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">BID CACTUS</H3>
        <DL><p>
            <DT><A HREF="http://www.bidcactus.com/?ref=abnL&keyword=90091" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Bid on Penny Auctions. BidCactus.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">DONATING & FREE STUFF</H3>
        <DL><p>
            <DT><A HREF="http://groups.yahoo.com/group/waterloofreecycle/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >waterloofreecycle  Waterloo, Iowa Freecycle(TM) Network.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">EBAY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Business</H3>
            <DL><p>
                <DT><A HREF="http://www.amazon.com/Making-Living-Your-eBay-Business/dp/0789736462" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >amazon.com Making a Living from Your eBay Business (2nd Edition) (9780789736468) Michael Miller.url</A>
                <DT><A HREF="http://reviews.ebay.com/How-To-Do-Basic-USPS-Shipping-From-Home_W0QQugidZ10000000004572695" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >eBay Guides - How To Do Basic USPS Shipping From Home.url</A>
                <DT><A HREF="http://www.salehoo.com/blog/the-ebay-drop-shipping-cheat-sheet" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The eBay Drop Shipping Cheat Sheet!  SaleHoo.url</A>
                <DT><A HREF="http://onlineprofitable.com/ebay/will-ebay-ship-to-a-different-address-than-the-billing-address-of-my-debit-card-in-paypal" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Will eBay ship to a different address than the billing address of my debit card in Paypal  Onli.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Guides</H3>
            <DL><p>
                <DT><A HREF="http://pages.ebay.com/buy/guides/toy-selling-guide/#4" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >eBay Guides - Toys Selling Guide.url</A>
                <DT><A HREF="http://pages.ebay.com/help/buy/bid-retract.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Retracting or canceling your bid.url</A>
                <DT><A HREF="http://pages.ebay.com.my/help/search/questions/icons.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >What do the icons next to an item mean.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">International</H3>
            <DL><p>
                <DT><A HREF="http://ask.metafilter.com/150699/How-can-I-protect-myself-when-selling-internationally-on-eBay" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How can I protect myself when selling internationally on eBay  Ask MetaFilter.url</A>
                <DT><A HREF="http://www.opticsplanet.net/upic.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >International Orders - USPS Cannot Ship.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Photographing Stuff for Ebay</H3>
            <DL><p>
                <DT><A HREF="http://www.bhphotovideo.com/find/newsLetter/eBay.jsp" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Photographing Your Stuff for eBay  B&H Photo Video Pro Audio.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Problems</H3>
            <DL><p>
                <DT><A HREF="http://www.amazon.com/Making-Living-Your-eBay-Business/dp/0789736462" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >amazon.com Making a Living from Your eBay Business (2nd Edition) (9780789736468) Michael Miller.url</A>
                <DT><A HREF="http://community.ebay.co.uk/topic/Seller-Central/Buyer-Asks-Ship/1900008756?messageID=2000063846" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >buyer asks to ship to different address Selling on eBay  Community.url</A>
                <DT><A HREF="http://answercenter.ebay.com/forum.jspa?forumID=14&anticache=1292289488174" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >eBay Answer Center Packaging & Shipping.url</A>
                <DT><A HREF="http://answercenter.ebay.com/thread.jspa?tstart=0&threadID=900240775&mod=1292287459922&anticache=1292372439651" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >eBay Answer Center Why are buyers still waiting days to ....url</A>
                <DT><A HREF="http://www.google.com/search?q=ebay+can+I+ship+with+different+service+than+buyer+paid+for&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ebay can I ship with different service than buyer paid for - Google Search.url</A>
                <DT><A HREF="http://www.informit.com/articles/article.aspx?p=684649" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >informit Managing Customer Payments  Evaluating Different Payment Options.url</A>
                <DT><A HREF="http://pages.ebay.com/help/buy/paypal-buyer-protection.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >PayPal Buyer Protection.url</A>
                <DT><A HREF="http://www.readjunk.com/articles/sellers-cant-leave-negative-feedback-on-ebay-bullshit/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Sellers canӴ leave negative feedback on eBay! BULLSHIT!  ReadJunk.com.url</A>
                <DT><A HREF="http://sg51-blog.blogspot.com/2010/01/terms-of-service-and-protection-from.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >sg51's Ebay and Paypal blog Terms Of Service and Protection from Negs.url</A>
                <DT><A HREF="http://answers.yahoo.com/question/index?qid=20100430142729AAgnfAQ" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Sold something on ebay... do I ship to the ebay shipping address or the paypal one - Yahoo! Ans.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Sharing On Facebook</H3>
            <DL><p>
                <DT><A HREF="http://pages.ebay.com/help/sell/share-listings.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Promoting your items on other sites.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Shipping</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?q=ebay+can+i+ship+with+different+shipper&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ebay can i ship with different shipper - Google Search.url</A>
                <DT><A HREF="http://reviews.ebay.com/How-To-Do-Basic-USPS-Shipping-From-Home_W0QQugidZ10000000004572695" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >eBay Guides - How To Do Basic USPS Shipping From Home.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">When Buyers Don't Pay</H3>
            <DL><p>
                <DT><A HREF="http://pages.ebay.com/help/buy/communicate.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Communicating with your trading partner.url</A>
                <DT><A HREF="http://pages.ebay.com/help/sell/unpaid-items.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >What to do when a buyer doesn't pay (unpaid item process).url</A>
            </DL><p>
            <DT><A HREF="http://pages.ebay.com/sellerinformation/starting/top10tips.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ebay Seller Information.url</A>
            <DT><A HREF="http://cgi.ebay.com/ws/eBayISAPI.dll?ViewItem&item=170506410863&ssPageName=STRK:MEWAX:IT" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >TRANSFORMER AUTOBOT DECEPTION G1 Neon Light Sign pm018 - eBay (item 170506410863 end time Jul-0.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">SHIPPING RATES</H3>
        <DL><p>
            <DT><A HREF="http://www.usps.com/prices/USPS_prices_dw_pop.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS - Priority Mail Dimensional Weight.url</A>
            <DT><A HREF="http://www.usps.com/prices/priority-mail-prices.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS - Priority Mail Prices.url</A>
            <DT><A HREF="http://pages.ebay.com/help/pay/questions/shipping-dimensional-weight.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >What is dimensional weight.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">SHIPPING SERVICES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1300895724">Australia</H3>
            <DL><p>
                <DT><A HREF="http://www.kramerforum.com/forum/showthread.php?t=41413" ADD_DATE="1300897554" LAST_VISIT="1322361173" LAST_MODIFIED="1300897554" ICON_URI="http://www.kramerforum.com/favicon.ico" >Cheapest way to ship guitar + case - Kramer Guitar Forum.url</A>
                <DT><A HREF="http://www.ultimatemetal.com/forum/equipment/637973-cost-ship-guitar-us-australia.html" ADD_DATE="1300897561" LAST_VISIT="1322361173" LAST_MODIFIED="1300897561" ICON_URI="http://www.ultimatemetal.com/favicon.ico" >Cost to Ship a Guitar from the US to Australia - Ultimate Metal Forum.url</A>
                <DT><A HREF="http://www.jedistar.com/guide%20to%20guitar%20buying.htm" ADD_DATE="1300895726" LAST_VISIT="1322361173" LAST_MODIFIED="1300895726" >http--www.jedistar.com-guide%20to%20guitar%20buying.htm.url</A>
                <DT><A HREF="http://www.shipito.com/16-shipping/2448-shipping-a-guitar-to-australia-via-usps" ADD_DATE="1300897743" LAST_VISIT="1322361173" LAST_MODIFIED="1300897743" ICON_URI="http://www.shipito.com/templates/shipito.com/favicon.ico" >Shipping A Guitar to Australia Via USPS - Shipito Discussion.url</A>
                <DT><A HREF="http://www.thegearpage.net/board/archive/index.php/t-738642.html" ADD_DATE="1300897568" LAST_VISIT="1322361173" LAST_MODIFIED="1300897568" ICON_URI="http://www.thegearpage.net/favicon.ico" >Shipping Guitar to Australia Cheapest Way [Archive] - The Gear Page.url</A>
                <DT><A HREF="http://www.thegearpage.net/board//showthread.php?t=763427" ADD_DATE="1300897578" LAST_VISIT="1322361173" LAST_MODIFIED="1300897578" ICON_URI="http://www.thegearpage.net/favicon.ico" >Shipping Guitar to Australia.....EEEEEKKKK - The Gear Page.url</A>
                <DT><A HREF="http://www.xe.com/ucc/convert.cgi?Amount=700&From=USD&To=AUD" ADD_DATE="1300895733" LAST_VISIT="1322361173" LAST_MODIFIED="1300895733" ICON_URI="http://www.xe.com/favicon.ico" >xe (USD-AUD) United States Dollars to Australia Dollars Rate.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Comparisons</H3>
            <DL><p>
                <DT><A HREF="http://forums.roadbikereview.com/showthread.php?t=119550" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS Parcel Post Delivery Delays WTF - Road Bike, Cycling Forums.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">UPS Basic</H3>
            <DL><p>
                <DT><A HREF="http://www.complaintsboard.com/complaints/ups-basic-c301099.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >UPS Basic Complaints - Poor Service.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">US Postal Service</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">Problems</H3>
                <DL><p>
                    <DT><A HREF="http://www.consumeraffairs.com/delivery/usps_no_mail_p5.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Consumer complaints about USPS - No Mail Delivery.url</A>
                    <DT><A HREF="http://www.ehow.com/list_6021939_post-office-return-sender-reasons.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Post Office Return to Sender Reasons  eHow.com.url</A>
                    <DT><A HREF="http://www.complaintsboard.com/complaints/usps-c178983.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS Complaints - A joke of a tracking system!.url</A>
                    <DT><A HREF="http://board.spawn.com/forums/archive/index.php/t-534346.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS tracking help [Archive] - SPAWN.COM Message Board.url</A>
                </DL><p>
                <DT><A HREF="http://postcalc.usps.gov/MailServices.aspx?m=6&p=1&o=10&dz=93505&oz=50701&MailingDate=7/20/2010&MailingTime=9:03%20AM" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Postage Price Calculator.url</A>
                <DT><A HREF="http://pe.usps.com/text/qsg300/Q150.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >QSG 150 Retail Parcels - Parcel Post.url</A>
                <DT><A HREF="http://ebaysupplies.usps.com/odcs/custom.htm?Template=FAQ#program5" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS  eBay.url</A>
                <DT><A HREF="http://forums.roadbikereview.com/showthread.php?t=119550" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >USPS Parcel Post Delivery Delays WTF - Road Bike, Cycling Forums.url</A>
            </DL><p>
            <DT><A HREF="http://pages.ebay.com/sellerinformation/video/shippinglabels.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >SL-06-FINAL-APR.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">UNIFI</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >UNIFI Amazon Link.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">VALUING ITEMS</H3>
        <DL><p>
            <DT><A HREF="http://www.worthpoint.com/worthopedia/transformers-g1-robot-deception-neon-73507664" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers G1 ROBOT DECEPTION NEON LIGHT SIGN tb04 (06-29-2009)....url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">VENDIO</H3>
        <DL><p>
            <DT><A HREF="http://shop.vendio.com/remo032/item/958742501/?s=1282290962" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >REMO'S TOY CHEST.url</A>
        </DL><p>
        <DT><A HREF="http://www.nodebtplan.net/2009/12/26/go-radical-sell-everything/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Go Radical Sell Everything  No Debt Plan.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CAMPS</H3>
    <DL><p>
        <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=be+a+camp+cou&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=be+a+camp+counselor" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >be a camp counselor - Google Search.url</A>
        <DT><A HREF="http://www.mysummercamps.com/camps/Detailed/Camp_Okoboji_L19447.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Camp Okoboji - MySummerCamps.com.url</A>
        <DT><A HREF="http://www.greatcampjobs.com/jobs_counselors.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.greatcampjobs.com-jobs_counselors.htm.url</A>
        <DT><A HREF="http://www.mysummercamps.com/camps/iowa-summer-camps-more6.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Iowa Camp - Iowa Summer Camps - MySummerCamps.com - Pg. 6.url</A>
        <DT><A HREF="http://www.campsrus.com/cgi-bin/search/search2.cgi" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Midwestern Association of Independent Camps.url</A>
        <DT><A HREF="http://www.campchannel.com/Iowa/summer_camp_jobs.cgi" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Summer Camp Counselor Jobs & Employment in Iowa - CampChannel.com.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CHILD SEX</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">SEX WITH UNDERAGE PEOPLE</H3>
        <DL><p>
            <DT><A HREF="http://cfcamerica.org/index.php?option=com_content&view=article&id=1386:little-did-i-know-she-was-only-16-years-old&catid=67:letters-to-the-editor&Itemid=285" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Little did I know, She was Only 16 years old..url</A>
        </DL><p>
        <DT><A HREF="http://www.bluelineradio.com/pictorialhistory.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Pictorial History.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CLOTHING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Indian, Eastern</H3>
        <DL><p>
            <DT><A HREF="http://www.sitarsetc.com/samples/CIMG0807.JPG" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.sitarsetc.com-samples-CIMG0807.JPG.url</A>
            <DT><A HREF="http://www.kaneesha.com/mens-kurta_index.cfm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mens Kurta, Nehru Shirts, Jackets and wedding sherwani - Kaneesha.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Men&#39;s</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Paisley</H3>
            <DL><p>
                <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/entertainment/8656881.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Google Image Result for http--cdn.overstock.com-images-products-P11068805.jpg.url</A>
                <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/entertainment/8653361.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Paisley Cotton Indian Shirts.url</A>
            </DL><p>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/americas/8655569.stm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Google Image Result for http--cdn.overstock.com-images-products-P10821645.jpg.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Men's</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">JEANS</H3>
            <DL><p>
                <DT><A HREF="http://bravopua.com/blog/2010/06/30/7-fashion-tips-every-afc-should-follow-2/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >7 fashion tips every AFC should follow  Master Pick Up Artist Bravo.url</A>
                <DT><A HREF="http://www.askmen.com/fashion/fashiontip_200/231_fashion_advice.html#" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Buying The Perfect Pair Of Men's Jeans - AskMen.com.url</A>
                <DT><A HREF="http://www.askmen.com/fashion/fashiontip_600/635_in-between-sizes-sachin-on-fashion.html#" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >In Between Sizes Sachin On Fashion - AskMen.com.url</A>
                <DT><A HREF="http://clothing.shop.ebay.com/Mens-Clothing-/1059/i.html?_nkw=men%27s+designer+jeans&_catref=1&_dmpt=US_CSA_MC_Jeans&_fln=1&_trksid=p3286.c0.m282" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >men's designer jeans items - Get great deals on Men's Clothing, mens jeans items on eBay.com!.url</A>
                <DT><A HREF="http://www.shopwiki.com/wiki/Mens+Jeans" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mens Jeans Buying Guide.url</A>
                <DT><A HREF="http://www.pick-up-artist-forum.com/are-you-following-these-25-critical-fashion-tips-vt16839.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Pick Up Artist  Are You Following These 25 Critical Fashion Tips.url</A>
                <DT><A HREF="http://www.google.com/search?q=pua+fashion+tips&hl=en&rls=com.microsoft%3Aen-us&num=10&lr=&ft=i&cr=&safe=off&tbs=,qdr:y" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >pua fashion tips - Google Search.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=wen9YSM-WjE" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Every Man Needs Great Jeans (Alpha M Image Consulting).url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=tlCChQ6Hfi8&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Fashion Tips for Men & Women  How to Fit Men's Jeans.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=tf-Thkvxkqc" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - How to Buy Jeans Online  Trying On Jeans before Buying Online.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=z9YCtjPBDwM" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - How To Buy the Best Men's Jeans For Your Body.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=5omCwjEwWMs&feature=related" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - How to get the Proper Fit on Men's Premium Jeans.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=PB-e8jtYyGw" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >YouTube - Men's Jeans Buying Guide.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Paisley</H3>
            <DL><p>
                <DT><A HREF="http://images.google.com/imgres?imgurl=http://cdn.overstock.com/images/products/P11068805.jpg&imgrefurl=http://www.overstock.com/Clothing-Shoes/Robert-Graham-Mens-Paisley-Long-sleeve-Shirt/2897625/product.html&usg=__rUIdUYwMT9WnaiIemnWf6tlL3EM=&h=300&w=250&sz" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Google Image Result for http--cdn.overstock.com-images-products-P11068805.jpg.url</A>
                <DT><A HREF="http://www.greatenglish.co.uk/item.aspx?CID=038eb31b-03a8-4e7a-94a9-1ee6d50a449d&FID=&PID=517bceaa-e15d-4b1b-974b-2e03c14621e2" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Paisley Cotton Indian Shirts.url</A>
            </DL><p>
            <DT><A HREF="http://images.google.com/imgres?imgurl=http://cdn.overstock.com/images/products/P10821645.jpg&imgrefurl=http://www.overstock.com/Clothing-Shoes/Ted-Baker-Mens-Western-style-Paisley-Print-Shirt/2614113/product.html&usg=__uFBPYvKlvu1IaMn4sZGnjT22Zss=&h=300&w=25" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Google Image Result for http--cdn.overstock.com-images-products-P10821645.jpg.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Native American</H3>
        <DL><p>
            <DT><A HREF="http://images.google.com/imgres?imgurl=http://www.relist.net/indian/images/woodlandwarshirt.jpg&imgrefurl=http://www.relist.net/indian/woodland.html&usg=__SymCR094ZQak1wdS2icZU5ZMy0Y=&h=1074&w=1364&sz=305&hl=en&start=5&um=1&itbs=1&tbnid=6D3FQieeh6GMQM:&tbnh=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Google Image Result for http--www.relist.net-indian-images-woodlandwarshirt.jpg.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TSHIRTS</H3>
        <DL><p>
            <DT><A HREF="http://6dollarshirts.com/t-shirts/FFFFFUUUUUU-p-11336.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >FFFFFUUUUUU Funny Tees 6DollarShirts.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">Tunics</H3>
        <DL><p>
            <DT><A HREF="http://www.darkknightarmoury.com/c-147-mens-jerkins-and-tunics.aspx" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mens Jerkins and Tunics from Dark Knight Armoury.url</A>
            <DT><A HREF="http://www.dollsofindia.com/read/mens_kurta.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mens Kurta.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_COMICS & TOYS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">MOVIES</H3>
        <DL><p>
            <DT><A HREF="http://enewsi.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ENewsi.com - Pop Culture Entertainment Iron Man, Batman, Star Trek, Transformers, Twilight, Har.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">RECALLS</H3>
        <DL><p>
            <DT><A HREF="http://www.cpsc.gov/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >CPSC Home Page.url</A>
            <DT><A HREF="http://www.cpsc.gov/CPSCPUB/PUBS/REPORTS/2009rpt.pdf" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.cpsc.gov-CPSCPUB-PUBS-REPORTS-2009rpt.pdf.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TRANSFORMERS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Evolutions_Hearts Of Steel</H3>
            <DL><p>
                <DT><A HREF="http://www.seibertron.com/transformers/toys/3rd-party-products/knight-morpher-commander/2035/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Knight Morpher Commander - 3rd Party Products - Toy Gallery - Photos 1 - 25.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Merchandise</H3>
            <DL><p>
                <DT><A HREF="http://www.angelfire.com/scifi/bbfortress/titanmegswwi.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >6 Titanium War Within Megatron Toy Review.url</A>
                <DT><A HREF="http://www.alphaprimetoys.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Alpha Prime Toys.url</A>
                <DT><A HREF="http://www.amazon.com/Transformer-Generation-Exclusive-Soundwave-Decepticon/dp/B000KBHSNG/ref=pd_sim_t_1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >amazon.com Transformer Generation 1 Re-issue Exclusive Soundwave Decepticon . BananaToys.com To.url</A>
                <DT><A HREF="http://tformers.com/transformers_database/titanium/96/megatron_-_war_within_Decepticons_6-Inch.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Megatron - War Within - Transformers Titanium Toys Database - TFormers.com.url</A>
                <DT><A HREF="http://www.firstintoys.com/index.php?main_page=index&cPath=106" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers  First In Toys.url</A>
                <DT><A HREF="http://www.cmdstore.com/transformers-die-cast-action-figures-titanium-series-war-within-megatron.html?cmp=gglebase" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Die Cast Action Figures Titanium Series War Within Megatron.url</A>
                <DT><A HREF="http://www.urban-collector.com/tranb0004.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Grimlock mini bust at Urban Collector.url</A>
                <DT><A HREF="http://toyarena.com/transfomrers-takara-collection-bookset-reissue-tfc15-stepper-with-targetmaster-nebulon-p-1715.html?cPath=5" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Takara Collection Bookset Reissue G1 TFC-15 Stepper (with Targetmaster Nebulon).url</A>
                <DT><A HREF="http://www.toywiz.com/trmo20acfibc.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers The Movie 2007 Action Figures Tech & Real Gear Robots.url</A>
                <DT><A HREF="http://www.angelfire.com/scifi/bbfortress/tftitanium.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Titanium 6 Figures Toy Review Index.url</A>
                <DT><A HREF="http://www.transformers-universe.com/include.php?path=content/articles.php&contentid=1133" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Universe - Music Label Soundwave.url</A>
                <DT><A HREF="http://www.collectiondx.com/node/1992" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Wreckage (Deluxe-class)  CollectionDX.url</A>
                <DT><A HREF="http://www.youbuynow.com/item/1719" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >youbuynow Hardtop - Scout Class.url</A>
            </DL><p>
            <DT><A HREF="http://tfwiki.net/wiki/AFA" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Action Figure Authority - Transformers Wiki.url</A>
            <DT><A HREF="http://www.amazon.com/gp/search/ref=sr_nr_p_n_age_range_1?rh=n%3A165793011%2Cp_4%3ATransformers%2Cp_n_age_range%3A165890011&bbn=165793011&ie=UTF8&qid=1277134173&rnid=165794011" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >amazon.com 2 to 4 Years - Transformers Toys & Games.url</A>
            <DT><A HREF="http://transformers.wikia.com/wiki/Bruticus_(G1)" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Bruticus (G1) - Teletraan I the Transformers Wiki - Transformers 2, Revenge of The Fallen, Anim.url</A>
            <DT><A HREF="http://www.tfw2005.com/transformers-news/universe-classics-20-29/counterfeit-warning---fake-lucky-draw-henkei-galvatrons-circulating-167179/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Counterfeit Warning - Fake Lucky Draw Henkei Galvatrons Circulating - Transformers News.url</A>
            <DT><A HREF="http://www.cybertron.ca/boards/showthread.php?t=20388" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Cybertron.CA.url</A>
            <DT><A HREF="http://www.tfsource.com/products/view/product_id/795/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Device Label - Transforming USB Flash Memory (2 GB) - Ravage.url</A>
            <DT><A HREF="http://www.enclinedesigns.com/s/Home.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >EnclineDesigns.com (custom transformers).url</A>
            <DT><A HREF="http://www.tfu.info/2004/Autobot/HotShot/hotshot.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Hot Shot (2004) - Autobot - www.tfu.info.url</A>
            <DT><A HREF="http://www.tfu.info/2004/Autobot/Inferno/carded.jpg" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.tfu.info-2004-Autobot-Inferno-carded.jpg.url</A>
            <DT><A HREF="http://www.transformerland.com/show_parent_g12.php?action=full_size&toyid=3608" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.transformerland.com-show_parent_g12.phpaction=full_size&toyid=3608.url</A>
            <DT><A HREF="http://www.transformerland.com/identify-transformers.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Identify Transformers Figures and Parts from G1 and G2 and Machine Wars.url</A>
            <DT><A HREF="http://www.tfu.info/2004/Autobot/Inferno/inferno.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Inferno (2004) - Autobot - www.tfu.info.url</A>
            <DT><A HREF="http://www.transformersbay.com/forum/general-discussion/11635-meisters-transformers-collection-16.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Meister's Transformers Collection - Page 16 - Transformersbay Forums.url</A>
            <DT><A HREF="http://tfwiki.net/wiki/MOSC" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Mint in sealed box - Transformers Wiki.url</A>
            <DT><A HREF="http://www.tfu.info/2005/Autobot/Override/override.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Override (2005) - Autobot - www.tfu.info.url</A>
            <DT><A HREF="http://www.gobotsarepurelove.com/toys/strong-bot.shtml" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Playskool GO-BOTS are Pure Love Fansite [ STRONG-BOT ].url</A>
            <DT><A HREF="http://www.pbase.com/julienc/image/44506646" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Prototype Clear Blue Optimus Prime Cab & Trailer - Robot Mode photo - Julien Chiang photos at p.url</A>
            <DT><A HREF="http://transformers.wikia.com/wiki/Rampage_(BW)" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Rampage (BW) - Teletraan I the Transformers Wiki - Transformers 2, Revenge of The Fallen, Anima.url</A>
            <DT><A HREF="http://tfwiki.net/wiki/Rampage_(ROTF)" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Rampage (ROTF) - Transformers Wiki.url</A>
            <DT><A HREF="http://www.seibertron.com/database/character.php?version_id=854" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Seibertron.com - Wedge.url</A>
            <DT><A HREF="http://www.tfu.info/1988/Decepticon/Snaptrap/snaptrap.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Snaptrap (1988) - Decepticon Seacon Leader - www.tfu.info.url</A>
            <DT><A HREF="http://www.tfu.info/1990/Decepticon/Starscream/starscream.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Starscream (1990) - Decepticon Ground Assault - www.tfu.info.url</A>
            <DT><A HREF="http://www.tfu.info/2002/Autobot/Strong-Bot/strong-bot.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Strong-Bot (2002) - Autobot - www.tfu.info.url</A>
            <DT><A HREF="http://www.hasbro.com/transformers/en_US/shop/browse/Transformers/_/N-1rZ7pZgt/Nr-Locale:en-US?Ns=P_Name" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers 2 Revenge of the Fallen Movie Toys, Games, Video Games - Official Transformers Pro.url</A>
            <DT><A HREF="http://toys.goolian.com/index.php?case=product&proddb=12&pid=2264" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Transformers Robots In Disguise 2001 Action Figure - Wedge - Autobot Bulldozer.url</A>
            <DT><A HREF="http://transformers2trailer.com/wallpapers-of-bumblebee-from-transformers-movie/128/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Wallpapers of Bumblebee from Transformers movie  Transformers 2 Trailer, Wallpapers, Posters, S.url</A>
            <DT><A HREF="http://www.clearblueoptimusprime.com/clear-blue-optimus-prime.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Worlds Smallest Clear Blue Optimus Prime.url</A>
            <DT><A HREF="http://www.pbase.com/julienc/image/42904436" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >WSTF Collection as of 3rd May '05 (Robot Mode) photo - Julien Chiang photos at pbase.com.url</A>
            <DT><A HREF="http://www.zdistrict.com/2009/02/12/the-transformers-devastator/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Z District ۠Blog Archive ۠The TransformersҠDevastator.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_COMPUTING & DIGITAL TECH</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">ANTIVIRUS & MALWARE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">BitDefender</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">How to Uninstall</H3>
                <DL><p>
                    <DT><A HREF="http://kb.bitdefender.com/site/article/333/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Article 333 - How to uninstall BitDefender.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">Problems</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">AutoUpdate Unavailable</H3>
                    <DL><p>
                        <DT><A HREF="http://forum.bitdefender.com/index.php?showtopic=5049" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Help! Bf Auto Update Service Is Unavailable - BitDefender Forum.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">BD Blocks FTP from Explorer</H3>
                    <DL><p>
                        <DT><A HREF="http://fairfieldintranet.yolasite.com/resources/Q15.pdf" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >BitDefender blocks FTP from Windows Explorer.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">BD Prevents HD Partition Resizing</H3>
                    <DL><p>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">Can't delete NAG folder</H3>
                    <DL><p>
                        <DT><A HREF="http://forum.bitdefender.com/index.php?showtopic=19589&mode=threaded&pid=85765" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Update Problem - BitDefender Forum.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">Hard Drive Filling BD Not Cleaning Up Old Updates</H3>
                    <DL><p>
                        <DT><A HREF="http://forum.bitdefender.com/index.php?showtopic=10050&st=40" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Hard Drive Filling Up On It's Own... - BitDefender Forum.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088100">Services Not Responding</H3>
                    <DL><p>
                        <DT><A HREF="http://forums.cnet.com/7723-6132_102-341150.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Bit defender total security not responding - CNET Spyware, viruses, & security Forums.url</A>
                    </DL><p>
                </DL><p>
            </DL><p>
            <DT><A HREF="http://www.starreviews.com/antivirus-software.aspx" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Best AntiVirus Software Reviews - StarREVIEWS 2011.url</A>
            <DT><A HREF="http://www.ehow.com/about_6048090_comparison-anti_virus-programs.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Comparison of Anti-Virus Programs  eHow.com.url</A>
            <DT><A HREF="http://www.experts-exchange.com/Software/Internet_Email/Anti-Virus/Symantec/Q_24990730.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Symantec Definitions Folder Eating My Hard Drive.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CRC Error</H3>
        <DL><p>
            <DT><A HREF="http://thedailyreviewer.com/design/view/crc-error-damaged-file-111580980#10160317" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Crc Error Damaged File (  TheDailyReviewer.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">EXTERNAL HARD DRIVES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">VCD'S & BLOATWARE</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">Western Digital SmartWare</H3>
                <DL><p>
                    <DT><A HREF="http://wdc.custhelp.com/cgi-bin/wdc.cfg/php/enduser/std_alp.php?p_cats=&p_pv=1.228&p_prods=228&p_search_text=remove+smartware&p_new_search=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Find Answers (Page 1 of 10).url</A>
                    <DT><A HREF="http://community.wdc.com/t5/WD-Smartware/Firmware-FIX-to-R-E-M-O-V-E-WD-SmartWare-JUNK-ware-from-disk/td-p/23787" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Firmware FIX to R-E-M-O-V-E 'WD SmartWare' (JUNK-w... - Western Digital Community.url</A>
                    <DT><A HREF="http://community.wdc.com/t5/My-Book-for-PC/How-do-you-remove-the-WD-Smartware-virtual-CD-drive-from-your/td-p/20041" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How do you remove the WD Smartware virtual CD driv... - Western Digital Community.url</A>
                    <DT><A HREF="http://www.tech-faq.com/delete-wd-smartware.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to Delete WD SmartWare.url</A>
                    <DT><A HREF="http://community.wdc.com/t5/My-Passport-for-PC/How-to-remove-quot-SmartWare-quot-UDF-partition/td-p/14209" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to remove SmartWare UDF partition - Western Digital Community.url</A>
                    <DT><A HREF="http://wdc.custhelp.com/cgi-bin/wdc.cfg/php/enduser/std_adp.php?p_faqid=5373" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to uninstall WD SmartWare from Windows (7, Vista, or XP) and Mac OSX (10.4, 10.5, and 10.6).url</A>
                    <DT><A HREF="http://www.newegg.com/Product/Product.aspx?Item=N82E16822136397" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Newegg.com - Western Digital My Book Essential 2TB USB 2.0 External Hard Drive WDBAAF0020HBK-NE.url</A>
                    <DT><A HREF="http://superuser.com/questions/44318/how-do-i-remove-a-mybooks-wd-smartware-virtual-cd-from-my-desktop" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >osx - How do I remove a MyBook's WD SmartWare virtual CD from my desktop - Super User.url</A>
                    <DT><A HREF="http://www.google.com/search?q=remove+not+hide+smartware&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >remove not hide smartware - Google Search.url</A>
                    <DT><A HREF="http://community.wdc.com/t5/My-Passport-for-PC/Remove-the-VCD-from-my-drive/td-p/7066/page/3" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Remove the VCD from my drive. - Page 3 - Western Digital Community.url</A>
                    <DT><A HREF="http://community.wdc.com/t5/My-Passport-for-PC/Remove-the-VCD-from-my-drive/td-p/7066" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Remove the VCD from my drive. - Western Digital Community.url</A>
                    <DT><A HREF="http://www.marccizravi.com/2010/remove-wd-smartware/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Remove җD SmartWareҠfrom your Western Digital Passport or MyBook ˠLet Me Teach You Something.url</A>
                    <DT><A HREF="http://forums.whirlpool.net.au/archive/1353136" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >WD Passport Esential & Smartware removal - Storage - Peripherals.url</A>
                    <DT><A HREF="http://www.wdc.com/wdproducts/wdsmartwareupdate/utilitiesstep2.asp?id=wdfMP_SEEssential&os=win" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >WD Product Update - Download VCD Manager.url</A>
                    <DT><A HREF="http://www.samsclub.com/sams/shop/product.jsp?productId=prod1240018&navAction=push#BVRRWidgetID" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Western Digital My Book Essential 2 TB External Hard Drive - Sam's Club.url</A>
                </DL><p>
                <DT><A HREF="mhtml:file://C:\Documents and Settings\nunya\Desktop\[ALL]\2011_PROJECT_ResearchWesternDigitalSmartSoftware\2011.01.14_WDMyBookResearch_02.mht!http://wdc.custhelp.com/cgi-bin/wdc.cfg/php/enduser/std_alp.php?p_cats=&p_pv=1.228&p_prods=228&p_search_text=remove+" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Find Answers (Page 1 of 10).url</A>
                <DT><A HREF="mhtml:file://C:\Documents and Settings\nunya\Desktop\[ALL]\2011_PROJECT_ResearchWesternDigitalSmartSoftware\2011.01.14_WDMyBookResearch_01.mht!http://community.wdc.com/t5/My-Book-for-PC/How-do-you-remove-the-WD-Smartware-virtual-CD-drive-from-your/td-p/20041/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How do you remove the WD Smartware virtual CD driv... - Page 3 - Western Digital Community.url</A>
                <DT><A HREF="http://www.dedoimedo.com/computers/passport-vcd.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to remove hidden Virtual CD (VCD) partitions on your Western Digital external disks.url</A>
                <DT><A HREF="http://www.google.com/search?q=how+to+remove+wd+smartware+and+vcd+drive&hl=en&rls=com.microsoft%3Aen-us&num=10&lr=&ft=i&cr=&safe=images&tbs=,qdr:m" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >how to remove wd smartware and vcd drive - Google Search.url</A>
                <DT><A HREF="mhtml:file://C:\Documents and Settings\nunya\Desktop\[ALL]\2011_PROJECT_ResearchWesternDigitalSmartSoftware\2011.01.14_WDMyBookResearch_01.mht!http://superuser.com/questions/44318/how-do-i-remove-a-mybooks-wd-smartware-virtual-cd-from-my-desktop" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >osx - How do I remove a MyBook's WD SmartWare virtual CD from my desktop - Super User.url</A>
                <DT><A HREF="mhtml:file://C:\Documents and Settings\nunya\Desktop\[ALL]\2011_PROJECT_ResearchWesternDigitalSmartSoftware\2011.01.14_WDMyBookResearch_02.mht!http://community.wdc.com/t5/My-Passport-for-PC/Remove-the-VCD-from-my-drive/td-p/7066/page/3" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Remove the VCD from my drive. - Page 3 - Western Digital Community.url</A>
                <DT><A HREF="mhtml:file://C:\Documents and Settings\nunya\Desktop\[ALL]\2011_PROJECT_ResearchWesternDigitalSmartSoftware\2011.01.14_WDMyBookResearch_02.mht!http://community.wdc.com/t5/My-Passport-for-PC/Remove-the-VCD-from-my-drive/td-p/7066" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Remove the VCD from my drive. - Western Digital Community.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">FILE UTILITIES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Duplicates & Compares</H3>
            <DL><p>
                <DT><A HREF="http://lifehacker.com/5293767/fast-duplicate-file-finder-finds-your-file-dupes" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Fast Duplicate File Finder Finds Your File Dupes.url</A>
                <DT><A HREF="http://www.mindgems.com/products/Fast-Duplicate-File-Finder/Fast-Duplicate-File-Finder-Tutorials.htm?postinstall=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to Find Duplicate Files using Fast Duplicate File Finder.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">INTERNET SEARCH</H3>
        <DL><p>
            <DT><A HREF="http://duckduckgo.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >DuckDuckGo.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">INTERNET SECURITY</H3>
        <DL><p>
            <DT><A HREF="http://darkfaqs.boom.ru/SurfSafe.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >DarkFaqs - Surf Safe Basics.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">INTERNET TAX (eTax)</H3>
        <DL><p>
            <DT><A HREF="http://www.stopetaxes.com/amazon-argues-affiliate-nexus-tax-first-a3018" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Stop eTaxes.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">MEMORY RAM SCANNER</H3>
        <DL><p>
            <DT><A HREF="http://www.crucial.com/upgrade/compatible-memory-for/HP+-+Compaq/Business+Notebook+6910p+Series/list.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Computer memory upgrades for HP - Compaq Business Notebook 6910p Series Laptop-Notebook from Cr.url</A>
            <DT><A HREF="http://reviews.cnet.com/laptops/hp-compaq-6910p/4507-3121_7-32514552.html?tag=mncolBtm;rnav" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >HP Compaq 6910p Specs - Laptops - CNET Reviews.url</A>
            <DT><A HREF="http://partsurfer.hp.com/Search.aspx?searchText=GT513UC" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >HP PartSurfer.url</A>
            <DT><A HREF="http://www.sparepartswarehouse.com/HP-Compaq,6910p,GT513UC,Laptop,Memory.aspx" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >HP-Compaq 6910p (GT513UC) Laptop Memory - RAM, DIMM, DRAM Upgrade for Notebook Computers.url</A>
            <DT><A HREF="http://www.amazon.com/PNY-Channel-PC2-5300-Notebook-MN2048KD2-667/product-reviews/B000P6QFQW/ref=cm_cr_pr_hist_2?ie=UTF8&showViewpoints=0&filterBy=addTwoStar" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >http--www.amazon.com-PNY-Channel-PC2-5300-Notebook-MN2048KD2-667-product-reviews-B000P6QFQW-ref.url</A>
            <DT><A HREF="http://www.crucial.com/systemscanner/index.aspx" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Memory upgrades from Crucial.com - About CrucialMedia Toolbox.url</A>
            <DT><A HREF="http://www.tomshardware.com/forum/268796-30-pc5400-pc6400-pc4200" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Ram pc5400 vs pc6400 vs pc4200 - Memory - Motherboards-Memory.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">NET NEUTRALITY</H3>
        <DL><p>
            <DT><A HREF="http://hustlebear.com/2011/01/05/why-net-neutrality-regulation-is-the-path-to-ending-net-neutrality/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Why Net Neutrality Regulation is the Path to Ending Net Neutrality  Hustle Bear - A Blog for Ac.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">NEWS AGGREGATORS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Comparison_of_feed_aggregators" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Comparison of feed aggregators - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TEXAS INSTRUMENTS</H3>
        <DL><p>
            <DT><A HREF="http://computermuseum.50megs.com/brands/ti994a.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >TEXAS INSTRUMENTS TI 99-4A.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">USB 3.0</H3>
        <DL><p>
            <DT><A HREF="http://www.maximumpc.com/article/features/everything_you_need_know_about_usb_30_plus_first_spliced_cable_photos" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Everything You Need to Know About USB 3.0, Plus First Spliced Cable Photos  Maximum PC.url</A>
            <DT><A HREF="http://forum.notebookreview.com/hardware-components-aftermarket-upgrades/511369-photofast-expresscard-usb-3-0-gm3000ex-problems-usb-3-0-a.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Photofast Expresscard USB 3.0 GM3000EX problems with USB 3.0.url</A>
            <DT><A HREF="http://www.semiaccurate.com/2010/03/15/usb-30-too-fast-thumb-drives/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >SemiAccurate  USB 3.0 is too fast for thumb drives.url</A>
            <DT><A HREF="http://blog.premiumusb.com/2010/03/problems-and-issues-with-usb-3-0-superspeed/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >SuperSpeed USB 3.0 - Problems & Issues with USB 3.0 SuperSpeed  Premium USB Blog.url</A>
        </DL><p>
        <DT><A HREF="http://techcrunch.com/2009/10/13/lista-gets-an-angel-round-to-help-people-giveget-free-stuff/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Listia Gets An Angel Round To Help People Give-Get Free Stuff.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CONSPIRACIES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">BIG BROTHER</H3>
        <DL><p>
            <DT><A HREF="http://www.democracynow.org/2008/9/4/eight_members_of_rnc_activist_group" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Eight Members of RNC Activist Group Lodged with Terrorism Charges.url</A>
            <DT><A HREF="http://www.sfexaminer.com/opinion/columns/Gene_Healy/Healy-Britain-offers-cautionary-tale-of-camera-surveillance-overkill-93365639.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >healy Britain offers cautionary tale of camera-surveillance overkill  San Francisco Examiner.url</A>
            <DT><A HREF="http://mostlywater.org/living_age_conspiracy_charges" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Living in the Age of Conspiracy Charges  Mostly Water.url</A>
            <DT><A HREF="http://www.globalresearch.ca/index.php?context=va&aid=9832" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Operation Sentinel The High-Tech Police State Takes Shape.url</A>
            <DT><A HREF="http://www.dailypaul.com/node/133608" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Police cameras to flood Manhattan to prevent attacks  Ron Paul 2012  Campaign for Liberty at th.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Project_Chanology" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Project Chanology - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">BODY SCANNERS</H3>
        <DL><p>
            <DT><A HREF="http://www.infowars.com/naked-body-scanners-flyers-prove-public-not-told-about-dangers-profit-motives-and-invasions-of-privacy/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ҎakedҠBody Scanners Flyers prove public not told about dangers, profit motives and invasions .url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CHURCHES AND GROWING MEMEBERSHIP</H3>
        <DL><p>
            <DT><A HREF="http://www.getmorechurchmembers.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Get More Church Members - Grow Your Congregation.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TOTALITARIAN GOVERNMENTS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Volksgerichtshof" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >People's Court (Germany) - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">TSA</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Airport Pad Downs</H3>
            <DL><p>
                <DT><A HREF="http://www.elliott.org/blog/full-text-of-sd-1544-09-06-authorizing-pat-downs-physical-inspection/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Full text of SD 1544-09-06 authorizing pat-downs, physical inspections.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">WAR</H3>
        <DL><p>
            <DT><A HREF="http://www.nytimes.com/2010/07/31/world/31wiki.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Army Broadens Inquiry Into WikiLeaks Disclosure - NYTimes.com.url</A>
            <DT><A HREF="http://mindprod.com/politics/iraqdontmarry.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >DonӴ Marry A Soldier.url</A>
            <DT><A HREF="http://wikileaks.org/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Wikileaks - WikiLeaks.url</A>
        </DL><p>
        <DT><A HREF="http://mediamonarchy.blogspot.com/2010/01/poll-majority-would-give-up-liberty-to.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >media monarchy poll majority would give up liberty to be safe from terrorism.url</A>
        <DT><A HREF="http://www.thehemperor.net/politics.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Hemperor.url</A>
        <DT><A HREF="http://www.godlikeproductions.com/forum1/message868586/pg1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Who created the creator.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CONSTRUCTION & TOOLS</H3>
    <DL><p>
        <DT><A HREF="http://www.doityourself.com/stry/installwallanchors" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Choosing and Installing Wall Anchors  DoItYourself.com.url</A>
        <DT><A HREF="http://www.naturalhandyman.com/iip/inffastener/infanchor/infanchor.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >You Can Hang ALMOST Anything With Wall Anchors.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_CONSUMERISM</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">COMPLAINTS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">UPS Basic</H3>
            <DL><p>
                <DT><A HREF="http://www.complaintsboard.com/complaints/ups-basic-c301099.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >UPS Basic Complaints - Poor Service.url</A>
            </DL><p>
            <DT><A HREF="http://www.pissedconsumer.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Consumer Complaints, Reports, Scams and Service Reviews.url</A>
            <DT><A HREF="http://www.aarp.org/money/scams-fraud/info-11-2010/scam_alert_a_decade_of_deceit.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Scam Alert Decade of Deceit; Nigerian King E-mail, Letter, Tops Frauds - AARP Bulletin.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">REVIEWS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Wireless Range Extenders for TV</H3>
            <DL><p>
                <DT><A HREF="http://en.wikipedia.org/wiki/Media_extenders" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Digital media receiver - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4SUNA_enUS294US296&q=wireless+extender+comparison" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >wireless extender comparison - Google Search.url</A>
            </DL><p>
            <DT><A HREF="http://www.abcvacuumwarehouse.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Vacuum Cleaners, Parts, Bags & Filters - ABC Vacuum Warehouse.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_DARK FAIRY TALES</H3>
    <DL><p>
        <DT><A HREF="http://www.scaryforkids.com/scary-stories/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Short Scary Stories.url</A>
        <DT><A HREF="http://en.wikipedia.org/wiki/Tailypo" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Tailypo - Wikipedia, the free encyclopedia.url</A>
        <DT><A HREF="http://hubpages.com/hub/The-gruesome-origins-of-your-favourite-fairy-tales" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The gruesome origins of your favourite fairy tales..url</A>
        <DT><A HREF="http://listverse.com/2009/01/06/9-gruesome-fairy-tale-origins/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Top 10 Gruesome Fairy Tale Origins - Listverse.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_EDUCATION</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">ALUMNI</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Waterloo West High School</H3>
            <DL><p>
                <DT><A HREF="http://www.myschoolreunited.com/WaterlooWest/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Waterloo West High School Alumni WaterlooIowaIA.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1304132161">ASSISTANCE SCHOLARSHIPS GRANTS</H3>
        <DL><p>
            <DT><A HREF="http://www.iowacollegeaid.gov/index.php?option=com_content&task=view&id=43&Itemid=390" ADD_DATE="1304132163" LAST_VISIT="1322361173" LAST_MODIFIED="1304132166" ICON_URI="http://www.iowacollegeaid.gov/images/favicon.ico" >IOWACOLLEGEAID - Scholarships & Grants.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1304102177">COLLEGE LISTINGS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1304102234">HOTTEST WOMEN</H3>
            <DL><p>
                <DT><A HREF="http://www.mademan.com/mm/10-tips-meeting-women-clubs.html" ADD_DATE="1304102235" LAST_VISIT="1322361173" LAST_MODIFIED="1304102235" >10 Tips For Meeting Women In Clubs  Made Manual.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1304102207">Magic Wizard & Metaphysical</H3>
            <DL><p>
                <DT><A HREF="http://www.cms.edu/career.html" ADD_DATE="1304102208" LAST_VISIT="1322361173" LAST_MODIFIED="1304102209" >College of Metaphysical Studies.url</A>
            </DL><p>
            <DT><A HREF="http://collegesearch.collegeboard.com/search/CollegeDetail.jsp?collegeId=3184&type=adv" ADD_DATE="1304102178" LAST_VISIT="1322361173" LAST_MODIFIED="1304102179" >College Search - Albertus Magnus College - AMC - At a Glance.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088100">_EMPLOYMENT</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CAREER CHANGE</H3>
        <DL><p>
            <DT><A HREF="http://www.it-career-coach.net/2007/04/23/3-keys-of-successful-computer-programmer-careers/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >3 Keys Of Successful Computer Programmer Careers  IT Career Coach.url</A>
            <DT><A HREF="http://www.it-career-coach.net/book/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Book  IT Career Coach.url</A>
            <DT><A HREF="http://www.career-tests-guide.com/career-change-resumes.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Career Change Resumes - Combination and Functional Resume.url</A>
            <DT><A HREF="http://jobsearch.about.com/od/coverlettersamples/a/customcover.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Customized Cover Letter Example For Career Change.url</A>
            <DT><A HREF="http://susanireland.com/resume-examples/writer/editing/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Editing  Susan Ireland's Resume Site.url</A>
            <DT><A HREF="http://www.cvtips.com/resumes-and-cvs/information-services-technician.html" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Information Services Technician - CVTips.com.url</A>
            <DT><A HREF="http://career-advice.monster.com/resumes-cover-letters/resume-writing-tips/resume-dilemma-career-change/article.aspx" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Resume Dilemma Career Change  Monster.url</A>
            <DT><A HREF="http://www.google.com/search?q=technical+career+change+resume+examples&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >technical career change resume examples - Google Search.url</A>
            <DT><A HREF="http://www.it-career-coach.net/2007/07/18/the-job-of-a-computer-programmer/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Job Of A Computer Programmer  IT Career Coach.url</A>
            <DT><A HREF="http://www.it-career-coach.net/2007/07/16/the-secret-path-to-contract-programming/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Secret Path To Contract Programming  IT Career Coach.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">CONTESTS</H3>
        <DL><p>
            <DT><A HREF="http://contest.bestjobsever.net/pages/rules" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Dice - Best Interview Ever Contest - Contest Rules.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1303416218">Employers</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1303416231">Citizen Groove</H3>
            <DL><p>
                <DT><A HREF="http://www.citizengroove.com/PR/" ADD_DATE="1303416235" LAST_VISIT="1322361173" LAST_MODIFIED="1303416236" ICON_URI="http://www.citizengroove.com/media/images/icons/icon.ico" >CitizenGroove - Leaders in Education Technology and Digital Audition Services.url</A>
                <DT><A HREF="http://www.inside-business.com/Main/Archive/Musical_Chairs_11812.aspx" ADD_DATE="1303429612" LAST_VISIT="1322361173" LAST_MODIFIED="1303429612" ICON_URI="http://www.inside-business.com/favicon.ico" >Musical Chairs  Articles  Archive  Inside Business Magazine.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">INTERVIEWS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Programmer</H3>
            <DL><p>
                <DT><A HREF="file:///L:/%5BPROGRAMMING%5D/_PROGRAMMING%20CATEGORIES%20HEIRARCHY/%5BWEB%20RESOURCES%5D/%5Dfiles/Basic%20VB%20interview%20questions%20_%20TechInterviews.com%20_%20%AB%20Interview%20questions%20for%20tech%20companies.htm" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Basic VB interview questions  TechInterviews.com  ˠInterview questions for tech companies.url</A>
                <DT><A HREF="http://www.techinterviews.com/basic-vb-interview-questions" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Basic VB interview questions  TechInterviews.url</A>
                <DT><A HREF="http://www.w3answers.com/" ADD_DATE="1314503277" LAST_VISIT="1322361173" LAST_MODIFIED="1314503277" ICON_URI="http://www.w3answers.com/misc/favicon.ico" >PHP MySQL Web Interview Questions & Tutorials  w3Answers.com.url</A>
                <DT><A HREF="http://booleandreams.wordpress.com/php-mysql-interview-question/" ADD_DATE="1314502015" LAST_VISIT="1322361173" LAST_MODIFIED="1314502015" ICON_URI="http://booleandreams.wordpress.com/favicon.ico" >PHP-MySQL Interview Question ˠBoolean Dreams.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1302294500">QUESTIONS</H3>
            <DL><p>
                <DT><A HREF="http://www.maxproductivity.com/downloads/Clues_IT.pdf" ADD_DATE="1302294527" LAST_VISIT="1322361173" LAST_MODIFIED="1302294527" >http--www.maxproductivity.com-downloads-Clues_IT.pdf.url</A>
                <DT><A HREF="http://www.google.com/search?q=not+learning+new+things+%22tell+me+about+a+time+when+%22&hl=en&rlz=1T4GGHP_enUS419US419&num=10&lr=&ft=i&cr=&safe=images&tbs=" ADD_DATE="1302294502" LAST_VISIT="1322361173" LAST_MODIFIED="1302294502" ICON_URI="http://www.google.com/favicon.ico" >not learning new things tell me about a time when  - Google Search.url</A>
                <DT><A HREF="http://www.gowrikumar.com/interview/index.html" ADD_DATE="1302294552" LAST_VISIT="1322361173" LAST_MODIFIED="1302294552" >The Best Answers to Tough Interview Questions.url</A>
            </DL><p>
            <DT><A HREF="http://www.maxproductivity.com/downloads/Clues_IT.pdf" ADD_DATE="1302445763" LAST_VISIT="1322361173" LAST_MODIFIED="1302445763" >http--www.maxproductivity.com-downloads-Clues_IT.pdf.url</A>
            <DT><A HREF="http://www.cybercoders.com/InterviewTips.aspx?ad=&p=" ADD_DATE="1303390477" LAST_VISIT="1322361173" LAST_MODIFIED="1303390477" ICON_URI="http://www.cybercoders.com/cc.ico" >Interview Tips  CyberCoders.com.url</A>
            <DT><A HREF="http://www.google.com/search?q=not+learning+new+things+%22tell+me+about+a+time+when+%22&hl=en&rlz=1T4GGHP_enUS419US419&num=10&lr=&ft=i&cr=&safe=images&tbs=" ADD_DATE="1302445742" LAST_VISIT="1322361173" LAST_MODIFIED="1302445742" ICON_URI="http://www.google.com/favicon.ico" >not learning new things tell me about a time when  - Google Search.url</A>
            <DT><A HREF="http://www.gowrikumar.com/interview/index.html" ADD_DATE="1302445771" LAST_VISIT="1322361173" LAST_MODIFIED="1302445771" >The Best Answers to Tough Interview Questions.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088100">IT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Employers and Schools</H3>
            <DL><p>
                <DT><A HREF="http://adaptly.com/info/jobs" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Adaptly.url</A>
                <DT><A HREF="http://www.artlogic.com/careers/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Art & Logic Careers.url</A>
                <DT><A HREF="http://www.thebaileygroupllc.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >The Bailey Group Staffing.url</A>
                <DT><A HREF="http://www.yellowbook.com/yellowpages/?where=waterloo%2c+ia" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Waterloo Iowa, IA Yellow Pages and Local Listings.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Job Descriptions</H3>
            <DL><p>
                <DT><A HREF="http://www.bestjobsever.net/videos/meet-akash-parikh/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Dice - Best Job Ever - Meet Akash Parikh.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Online Training and Practice Tests</H3>
            <DL><p>
                <DT><A HREF="https://learningnetwork.cisco.com/community/learning_center/self_assessments" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Self-Assessments - The Cisco Learning Network.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088100">Programming</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">Freelance Web Design</H3>
                <DL><p>
                    <DT><A HREF="http://freelanceswitch.com/general/5-mistakes-to-end-your-freelance-career/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+FreelanceSwitch+%28Freelance+Switch%29" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >5 Mistakes to End Your Freelance Career.url</A>
                    <DT><A HREF="http://www.freelancer.com/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Freelancer.com  Online Jobs  Freelance Employment  Outsourcing Services  Programmers  Web Desig.url</A>
                    <DT><A HREF="http://www.freshbooks.com/?ref=345" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >FreshBooks - Online Invoicing, Time Tracking & Billing Software.url</A>
                    <DT><A HREF="http://www.elance.com/p/blog/2011/04/helping-the-cause-your-earth-day-tips.html?rid=20H8J" ADD_DATE="1303416409" LAST_VISIT="1322361173" LAST_MODIFIED="1303416409" ICON_URI="http://www.elance.com/p/misc/favicon.ico" >Helping the Cause Your Earth Day Tips for Freelancers  Elance.url</A>
                    <DT><A HREF="http://www.howdesign.com/GeneralMenu/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >HOW Design - The leading creativity, business and technology magazine for Graphic Designers..url</A>
                    <DT><A HREF="http://www.skillsoft.com/Books24x7/Product_Information/Collections/ITPro.asp" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >ITPro٠- SkillSoft.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088100">It-Career-Coach.net</H3>
                <DL><p>
                    <DT><A HREF="http://www.it-career-coach.net/2010/02/17/always-be-learning/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >#5 Success Principle Always Be Learning  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/12/14/a-day-in-the-life-of-a-data-analyst/#comment-11604" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >A Day In The Life Of A Data Analyst  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/02/10/are-you-inspired-enough/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Are You Inspired Enough  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2006/08/26/become-a-master-programmer-highly-skilled-developer-or-competent-programmer/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Become a Master Programmer Highly Skilled Developer or Competent Programmer  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/05/26/can-you-perform-prove-it/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Can You Perform Prove It!  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2006/08/20/dot-net-developers-in-top-5-careers-with-big-pay-and-big-demand/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Dot NET Developers In Top 5 Careers With Big Pay And Big Demand  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/11/24/how-outsourcing-affects-it-jobs/#comment-11678" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How Does Outsourcing Affect IT Jobs  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/01/11/how-to-become-a-project-manager-work-on-a-project/#comment-11578" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How To Become A Project Manager Work On A Project!  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/03/07/how-to-break-the-unemployment-cycle/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How To Break The Unemployment Cycle  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/06/04/how-to-handle-recruiters-phone-calls/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How To Handle Recruiterӳ Phone Calls  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/08/22/how-to-prepare-real-world-without-college/#comment-11677" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How to Prepare for the Real World When College DoesnӴ Help!  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/04/08/transitioning-from-a-business-analyst-job-when-your-boss-keeps-you-career-back/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How To Quit your Job the Right Way!  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/02/05/how-to-slam-dunk-job-interviews/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >How To Slam Dunk Job Interviews  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/05/20/is-a-college-degree-required-for-a-career-in-computer-programming/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Is a College Degree Required For a Career in Computer Programming  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2007/03/19/is-my-resume-killing-my-career/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Is My Resume Killing My Career  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2007/07/25/learning-c-programming-language-is-bad-for-your-career-c-programmers-cant-find-jobs/#comment-11593" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Learning C++ Programming Language Is Bad For Your Career ŠC++ Programmers CanӴ Find Jobs  IT .url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/02/09/programming-interviews-exposed-secrets-to-landing-your-next-job/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Programming Interviews Exposed Secrets to Landing Your Next Job  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2011/01/08/pros-cons-business-analysts-computer-programmers/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Pros and Cons of Business Analysts vs Computer Programmer Careers  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2007/01/28/s-i-x-figures-six-figures-programming-job-with-two-years-of-computing-experience/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >S-I-X figures! Six Figures Programming Job With Two Years Of Computing Experience  IT Career Co.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/04/10/use-practice-tests-quizzes-boost-skills-rapidly-ace-job-interviews/" ADD_DATE="1298088100" LAST_VISIT="1322361173" LAST_MODIFIED="1298088100" >Use Practice Tests Or Quizzes To Boost Your Skills Rapidly Or Ace Job Interviews  IT Career Coa.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/05/21/what-does-it-take-to-learn-business-analysis/#comment-11778" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >What Does It Take To Learn Business Analysis  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/11/24/when-life-throws-you-a-curve-ball-throw-it-back/" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >When Life Throws You a Curve Ball, Throw it Back!  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/12/18/which-programming-language-is-best-to-start-with/#comment-11641" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Which Programming Language Is Best To Start With  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2009/07/13/why-cant-i-find-a-job/" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Why CanӴ I Find A Job  IT Career Coach.url</A>
                    <DT><A HREF="http://www.it-career-coach.net/2010/03/17/why-microsoft-net-jobs-for-cobol-mainframe-programmers/" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Why Microsoft .NET Jobs for COBOL Mainframe Programmers  IT Career Coach.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1303390892">RUBY RAILS</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=Gzj723LkRJY&feature=related&wl_token=TlwXs6PdHZAjRSM5gopWxFL7JuJ8MTMwMzQ3NTIzNkAxMzAzMzg4ODM2&wl_id=Gzj723LkRJY" ADD_DATE="1303390894" LAST_VISIT="1322361173" LAST_MODIFIED="1303390894" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Ruby on Rails demo.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">What Languages Are Worth Learning</H3>
                <DL><p>
                    <DT><A HREF="http://www.it-career-coach.net/2010/12/18/which-programming-language-is-best-to-start-with/" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Which Programming Language Is Best To Start With  IT Career Coach.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1303390510">SOFTWARE & GAME TESTER</H3>
            <DL><p>
                <DT><A HREF="http://www.opensourcetesting.org/functional.php" ADD_DATE="1303404959" LAST_VISIT="1322361173" LAST_MODIFIED="1303404959" >Open source functional testing tools.url</A>
                <DT><A HREF="http://vodpod.com/watch/4072077-pycon-2010testing-websites-with-python-and-selenium" ADD_DATE="1303404273" LAST_VISIT="1322361173" LAST_MODIFIED="1303404273" ICON_URI="http://vodpod.com/favicon.ico" >PyCon 2010Testing Websites With Python and Selenium Video.url</A>
                <DT><A HREF="http://www.softwareqatest.com/" ADD_DATE="1303390536" LAST_VISIT="1322361173" LAST_MODIFIED="1303390536" >Software QA and Testing Resource Center.url</A>
                <DT><A HREF="http://www.aptest.com/resources.html" ADD_DATE="1303390513" LAST_VISIT="1322361173" LAST_MODIFIED="1303390514" ICON_URI="http://www.aptest.com/favicon.ico" >Software Quality Assurance Testing and Test Tool Resources.url</A>
                <DT><A HREF="http://www.testingfaqs.org/" ADD_DATE="1303390520" LAST_VISIT="1322361173" LAST_MODIFIED="1303390520" >Software Testing FAQs.url</A>
                <DT><A HREF="http://www.testinggeek.com/index.php/testing-tools/test-execution/145-flash-object-automation-using-selenium" ADD_DATE="1303414713" LAST_VISIT="1322361173" LAST_MODIFIED="1303414713" ICON_URI="http://www.testinggeek.com/templates/jw_clean_pro/favicon.ico" >Software Testing Geek -Software Testing - Flash Object Automation using Selenium.url</A>
                <DT><A HREF="http://www.testinggeek.com/" ADD_DATE="1303390530" LAST_VISIT="1322361173" LAST_MODIFIED="1303390531" ICON_URI="http://www.testinggeek.com/templates/jw_clean_pro/favicon.ico" >Software Testing Geek.url</A>
                <DT><A HREF="http://www.successful-quality-assurance.com/software-testing-methodologies.html" ADD_DATE="1303390541" LAST_VISIT="1322361173" LAST_MODIFIED="1303390541" >Software Testing Methodologies.url</A>
                <DT><A HREF="http://agileintro.wordpress.com/2008/01/09/taking-agile-mainstream/" ADD_DATE="1303390548" LAST_VISIT="1322361173" LAST_MODIFIED="1303390549" ICON_URI="http://s1.wp.com/i/favicon-stacked.ico?m=1293299723g" >Taking Agile Mainstream ˠAgile Introduction For Dummies.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=-4pR_dWZwnI&feature=related" ADD_DATE="1303390525" LAST_VISIT="1322361173" LAST_MODIFIED="1303390525" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Basic Software Testing Interview Questions.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=sxss1ji6ZFA&feature=related" ADD_DATE="1303415866" LAST_VISIT="1322361173" LAST_MODIFIED="1303415866" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Software Testing SDLC.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1303390629">VOIP</H3>
            <DL><p>
                <DT><A HREF="http://www.allthetests.com/quiz07/dasquiztd.php3?testid=1078506100" ADD_DATE="1303390722" LAST_VISIT="1322361173" LAST_MODIFIED="1303390722" ICON_URI="http://www.allthetests.com/bild/favicon.ico" >About VoIP.url</A>
                <DT><A HREF="http://stackoverflow.com/questions/606550/watir-vs-selenium-vs-sahi" ADD_DATE="1303390758" LAST_VISIT="1322361173" LAST_MODIFIED="1303390758" ICON_URI="http://sstatic.net/stackoverflow/img/favicon.ico" >automated tests - Watir vs Selenium vs Sahi - Stack Overflow.url</A>
                <DT><A HREF="http://www.resumebucket.com/bmbommarito" ADD_DATE="1303390822" LAST_VISIT="1322361173" LAST_MODIFIED="1303390822" ICON_URI="http://www.resumebucket.com/favicon.ico" >Brian Bommarito's Online Resume  Current Status In need of a job.url</A>
                <DT><A HREF="http://www.google.com/search?hl=&q=free+voip+quiz&sourceid=navclient-ff&rlz=1B3GGHP_enUS419US420&ie=UTF-8" ADD_DATE="1303390704" LAST_VISIT="1322361173" LAST_MODIFIED="1303390704" ICON_URI="http://www.google.com/favicon.ico" >free voip quiz - Google Search.url</A>
                <DT><A HREF="http://www.python.org/about/success/esr/" ADD_DATE="1303390776" LAST_VISIT="1322361173" LAST_MODIFIED="1303390776" ICON_URI="http://www.python.org/favicon.ico" >Python Success Stories.url</A>
                <DT><A HREF="http://packetlife.net/blog/2010/apr/7/voip-basics-cheat-sheet/" ADD_DATE="1303390668" LAST_VISIT="1322361173" LAST_MODIFIED="1303390668" >VOIP Basics Cheat Sheet - Packet Life.url</A>
                <DT><A HREF="http://www.petri.co.il/voip-basics-ccna-voice-exam.htm" ADD_DATE="1303390689" LAST_VISIT="1322361173" LAST_MODIFIED="1303390690" ICON_URI="http://www.petri.co.il/favicon.ico" >VoIP Basics for CCNA Voice Exam.url</A>
                <DT><A HREF="http://www.voiptroubleshooter.com/basics/index.html" ADD_DATE="1303390631" LAST_VISIT="1322361173" LAST_MODIFIED="1303390631" ICON_URI="http://www.voiptroubleshooter.com/favicon.ico" >VoIP Troubleshooter  The Basics.url</A>
            </DL><p>
            <DT><A HREF="http://www.bestjobsever.net/videos/meet-akash-parikh/" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Dice - Best Job Ever - Meet Akash Parikh.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">JOB HUNTING</H3>
        <DL><p>
            <DT><A HREF="http://finance.yahoo.com/news/Outofwork-job-applicants-told-cnnm-3498252371.html?x=0" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Out-of-work job applicants told unemployed need not apply - Yahoo! Finance.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1302294147">MOTOR DRIVE REPAIR (VFD)</H3>
        <DL><p>
            <DT><A HREF="http://www.drivesys.com/asdis.html" ADD_DATE="1302294190" LAST_VISIT="1322361173" LAST_MODIFIED="1302294190" >About AC Drives.url</A>
            <DT><A HREF="http://www.youadlist.com/UNITED+STATES/Technical+Support_/AC+amp+DC+Drive+Technician+part+time+or+motor+drive+tech+Baton+Rouge_101219.html" ADD_DATE="1302294204" LAST_VISIT="1322361173" LAST_MODIFIED="1302294204" ICON_URI="http://www.youadlist.com/favicon.ico" >AC & DC Drive Technician part time or motor drive tech (Baton Rouge) Louisiana, UNITED STATES.url</A>
            <DT><A HREF="http://www.testpoint.com/casestudy01.htm" ADD_DATE="1302294160" LAST_VISIT="1322361173" LAST_MODIFIED="1302294160" >AC drive repair, VFD repair, variable frequency drive repair, inverter drive repair in Forest Hill MD.url</A>
            <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4GGHP_enUS419US419&q=ac+motor+drive+technician&aq=f&aqi=&aql=&oq=" ADD_DATE="1302294185" LAST_VISIT="1322361173" LAST_MODIFIED="1302294185" ICON_URI="http://www.google.com/favicon.ico" >ac motor drive technician - Google Search.url</A>
            <DT><A HREF="http://www.cbsalary.com/salary-calculator/Electronic+Test+Bench+Technician?ns=1" ADD_DATE="1302294256" LAST_VISIT="1322361173" LAST_MODIFIED="1302294256" ICON_URI="http://clib.icbdr.com/images/cbsalary/favicon.ico" >Electronic Test Bench Technician Salary - CBsalary.url</A>
            <DT><A HREF="http://www.electricaltrainingusa.com/ac_drives.html" ADD_DATE="1302294199" LAST_VISIT="1322361173" LAST_MODIFIED="1302294199" ICON_URI="http://www.electricaltrainingusa.com/favicon.ico" >How do variable frequency drives (VFDs) work or AC Drive Troubleshooting, Repair and Applications.url</A>
            <DT><A HREF="http://articles.directorym.com/Electronic_Equipment_Repairer_Indiana-r861729-Indiana.html" ADD_DATE="1302294209" LAST_VISIT="1322361173" LAST_MODIFIED="1302294209" ICON_URI="http://articles.directorym.com/App_Themes/Articles_enUS/Images/favicon.ico" >http--articles.directorym.com-Electronic_Equipment_Repairer_Indiana-r861729-Indiana.html.url</A>
            <DT><A HREF="http://careers.stateuniversity.com/pages/361/Electrical-Electronics-Engineering-Technician.html" ADD_DATE="1302296086" LAST_VISIT="1322361173" LAST_MODIFIED="1302296086" >http--careers.stateuniversity.com-pages-361-Electrical-Electronics-Engineering-Technician.html.url</A>
            <DT><A HREF="http://www.overview.com/career_summaries/Electrical_Electronics_Tech.htm" ADD_DATE="1302444863" LAST_VISIT="1322361173" LAST_MODIFIED="1302444864" ICON_URI="http://www.overview.com/favicon.ico" >http--www.overview.com-career_summaries-Electrical_Electronics_Tech.htm.url</A>
            <DT><A HREF="http://www1.salary.com/Facilities-Maintenance-and-Repair-salaries.html" ADD_DATE="1302295121" LAST_VISIT="1322361173" LAST_MODIFIED="1302295121" ICON_URI="http://www1.salary.com/favicon.ico" >http--www1.salary.com-Facilities-Maintenance-and-Repair-salaries.html.url</A>
            <DT><A HREF="http://www.jobrapido.com.ng/?q=bench%20technician" ADD_DATE="1302294249" LAST_VISIT="1322361173" LAST_MODIFIED="1302294249" ICON_URI="http://www.jobrapido.com.ng/favicon.ico" >Jobrapido  Bench Technician jobs, job vacancies.url</A>
            <DT><A HREF="http://www.middough.com/Careers/Chicago,-IL/CHI-Sr--Electrical-Engineer.aspx" ADD_DATE="1302444961" LAST_VISIT="1322361173" LAST_MODIFIED="1302444961" ICON_URI="http://www.middough.com/favicon.ico" >Middough - CHI-Sr. Electrical Engineer.url</A>
            <DT><A HREF="http://www.indeed.com/q-Motor-Drive-Engineer-l-Chicago,-IL-jobs.html" ADD_DATE="1302294170" LAST_VISIT="1322361173" LAST_MODIFIED="1302294170" ICON_URI="http://www.indeed.com/favicon.ico" >Motor Drive Engineer Jobs, Employment in Chicago, IL  Indeed.com.url</A>
            <DT><A HREF="http://www.nicet.org/" ADD_DATE="1302296093" LAST_VISIT="1322361173" LAST_MODIFIED="1302296093" ICON_URI="http://www.nicet.org/images/favicon.ico" >National Institute for Certification in Engineering Technologies Home Page.url</A>
            <DT><A HREF="http://jobview.monster.com/Power-Electronics-Engineer-right-here!-Job-Baltimore-MD-US-97098183.aspx" ADD_DATE="1302294174" LAST_VISIT="1322361173" LAST_MODIFIED="1302294175" ICON_URI="http://media.newjobs.com/favicon.ico" >Power Electronics Engineer ~ right here! Job in Baltimore, Maryland US.url</A>
            <DT><A HREF="https://sjobs.brassring.com/EN/ASP/TG/cim_jobdetail.asp?SID=^zCSsdquoyUoq4UzywjZrFWgcg91RgV7/zgLS0uU7tiymobHP6kNuXsCRk8Xj0mvn&jobId=1390355&type=search&JobReqLang=1&recordstart=1&JobSiteId=107&JobSiteInfo=1390355_107&GQId=0" ADD_DATE="1302294266" LAST_VISIT="1322361173" LAST_MODIFIED="1302294266" ICON_URI="https://sjobs.brassring.com/favicon.ico" >Rockwell Automation - Job details.url</A>
            <DT><A HREF="http://dailyreporter.com/blog/2009/06/10/rockwell-automation-to-close-iowa-plant-950-am-61009/" ADD_DATE="1302294243" LAST_VISIT="1322361173" LAST_MODIFIED="1302294243" >Rockwell Automation to close Iowa plant (950 a.m. 6-10-09) ˠThe Daily Reporter.url</A>
            <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4GGHP_enUS419US419&q=%22salary%22+variable+frequency+motor+drive&aq=f&aqi=&aql=f&oq=" ADD_DATE="1302294156" LAST_VISIT="1322361173" LAST_MODIFIED="1302294156" ICON_URI="http://www.google.com/favicon.ico" >salary variable frequency motor drive - Google Search.url</A>
            <DT><A HREF="http://swz.salary.com/SalaryWizard/Electric-Electronics-Technician-I-Job-Description.aspx" ADD_DATE="1302295116" LAST_VISIT="1322361173" LAST_MODIFIED="1302295116" ICON_URI="http://swz.salary.com/favicon.ico" >Salary.com - Electric Electronics Technician I - Job Description, Statistics and Salary Information.url</A>
            <DT><A HREF="http://www.hayward-pool.com/prd/Senior-Electrical-Motor-Drive-Design-Engineer_10201_10551_30503_-1___.htm" ADD_DATE="1302294149" LAST_VISIT="1322361173" LAST_MODIFIED="1302294149" >Senior Electrical Motor Drive Design Engineer.url</A>
            <DT><A HREF="http://jobview.monster.com/Sr-Field-Service-Technician-Job-Fayetteville-NC-98441137.aspx" ADD_DATE="1302444932" LAST_VISIT="1322361173" LAST_MODIFIED="1302444932" ICON_URI="http://media.newjobs.com/favicon.ico" >Sr Field Service Technician Job in Fayetteville 28301, North Carolina US.url</A>
            <DT><A HREF="http://www.maintenanceresources.com/referencelibrary/acdrives/drive.htm" ADD_DATE="1302294194" LAST_VISIT="1322361173" LAST_MODIFIED="1302294194" >Troubleshooting Variable Speed AC Motor Drives.url</A>
            <DT><A HREF="http://www.rockwellautomation.com/university_relations_gateway/" ADD_DATE="1302294272" LAST_VISIT="1322361173" LAST_MODIFIED="1302294272" >University Relations Gateway from Rockwell Automation.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Variable-frequency_drive" ADD_DATE="1302294164" LAST_VISIT="1322361173" LAST_MODIFIED="1302294164" ICON_URI="http://en.wikipedia.org/favicon.ico" >Variable-frequency drive - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.joliettech.com/what_is_a_variable_frequency_drive.htm" ADD_DATE="1302295201" LAST_VISIT="1322361173" LAST_MODIFIED="1302295201" >What is a Variable Frequency Drive (VFD) How Does a VFD Work.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">RESUME WRITING</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Programmer Resumes</H3>
            <DL><p>
                <DT><A HREF="http://www.jobbankusa.com/resumes/free_samples/examples_templates_formats/computer_programmer.html" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Computer Programmer Free Sample Resume - Resume Example - Free Resume Template - Resume Format .url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/NP1676A2905D9" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >entry level- jr programmer Resume in Carlsbad, CA  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/keywords/entry%20level/%20jr%20programmer" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >entry level- jr programmer Resumes  Tech Resumes  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/carlsheehan" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Front End Web Developer Resume in Plaistow, NH  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/BD11DB61C730A" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Jr. Web Developer or Web Programmer Resume in Oklahoma City, OK  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/servlet/resumes?keywords=perl&type=any&scope=full&city=&location=" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >perl Resumes  Tech Resumes  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/STurner" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Programmer Analyst VI Resume in Oklahoma City, OK  Dev Bistro.url</A>
                <DT><A HREF="http://www.jobbankusa.com/resumewrite/Resumes/TechnicalResumes/tresumesample1.html" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Sample Resumes, Resume Samples, Resume Examples, Resume Example.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/steverough@yahoo.co.uk" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Senior Application Developer Resume in Vancouver City and Metro Area, BC  Dev Bistro.url</A>
                <DT><A HREF="http://www.devbistro.com/resumes/willie.johnson@gmail.com" ADD_DATE="1298088101" LAST_VISIT="1322361173" LAST_MODIFIED="1298088101" >Software Engineer Resume in Starkville, MS  Dev Bistro.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1303402027">STARTUPS</H3>
        <DL><p>
            <DT><A HREF="http://www.cybercoders.com/InterviewTips.aspx?ad=&p=" ADD_DATE="1303415737" LAST_VISIT="1322361174" LAST_MODIFIED="1303415737" ICON_URI="http://www.cybercoders.com/cc.ico" >Interview Tips  CyberCoders.com.url</A>
            <DT><A HREF="http://www.wepay.com/blog/2010/10/21/the-6-reasons-i-stopped-going-to-college-to-work-for-a-startup/" ADD_DATE="1303415727" LAST_VISIT="1322361174" LAST_MODIFIED="1303415728" ICON_URI="http://www.wepay.com/favicon.ico" >The 6 reasons I stopped going to college to work for a startup  WePay.url</A>
            <DT><A HREF="http://www.ceobraintrust.com/686/the-start-up-guru-y-combinators-paul-graham/" ADD_DATE="1303402031" LAST_VISIT="1322361174" LAST_MODIFIED="1303402031" ICON_URI="http://www.ceobraintrust.com/favicon.ico" >The Start-up Guru Y Combinator's Paul Graham  CEO Brain Trust.url</A>
        </DL><p>
        <DT><A HREF="http://www.careerbuilder.com/JobSeeker/Jobs/JobDetails.aspx?job_did=J3G0MX5W6RHLN6BY6FY&cbRecursionCnt=1&cbsid=8b67e15c1b6b45e597d477545df48e6c-329509739-ww-6&ns_siteid=ns_us_g_coldfusion_dot_net" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Adecco - Java-Cold Fusion-DotNet Web Developer.url</A>
        <DT><A HREF="http://www.indeed.com/job/Java-Cold-Fusion-Dotnet-Web-Developer-at-RCE-in-Kansas-City,-MO-6df2c940fa580b7d" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Java-Cold Fusion-DotNet Web Developer - RCE - Kansas City, MO  Indeed.com.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_ERIC'S PAGES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">ERIC'S BANDS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Brown Sugar Cracker</H3>
            <DL><p>
                <DT><A HREF="http://www.reverbnation.com/artist/control_room/1107066?subnav=profile_songs&tab=profile" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >ReverbNation - Brown Sugar Cracker.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1321107694">Eric's Programming Posts</H3>
        <DL><p>
            <DT><A HREF="http://askville.amazon.com/pass-AJAX-JavaScript-Perl-CGI/AnswerViewer.do?requestId=83098451" ADD_DATE="1321107696" LAST_VISIT="1322361174" LAST_MODIFIED="1321107696" ICON_URI="http://askville.amazon.com/favicon.ico" >how do i pass a value from AJAX or JavaScript to Perl or CGI.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Eric's Reviews</H3>
        <DL><p>
            <DT><A HREF="http://richinwriters.com/wavee-scam/comment-page-2/#comment-3414" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Wavee scam.url</A>
        </DL><p>
        <DT><A HREF="http://webcache.googleusercontent.com/search?q=cache:pSb3SkHSUQwJ:www.nandcc.info/english/definition/word/futurists+kristobaldude&cd=60&hl=en&ct=clnk&gl=us" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >A directory of Information and search results around the word 'Futurists'.url</A>
        <DT><A HREF="http://www.amazon.com/gp/pdp/profile/A18QZ96UBIICG" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Profile for Kristobal Dude.url</A>
        <DT><A HREF="http://line6.com/community/thread/37333" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >community How can I access more than 4 tones with....url</A>
        <DT><A HREF="http://en.wordpress.com/tag/consumer-electronics-appliances/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Consumer Electronics Appliances נBlogs, Pictures, and more on WordPress.url</A>
        <DT><A HREF="http://keithmoore1.wordpress.com/2008/12/11/cool-guitar-songs-in-drop-d-tuning/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Cool Guitar Songs in Drop D TuningŠˠMusic, Movies and Marin County.url</A>
        <DT><A HREF="http://www.rateitall.com/i-2764166-cuisinart-gr-4-griddler.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Cuisinart GR-4 Griddler - Reviews on RateItAll.url</A>
        <DT><A HREF="http://www.dipity.com/timeline/Danny-Devito-Height" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Danny Devito Height.url</A>
        <DT><A HREF="http://erichepperle.50megs.com/eh_EmploymentSites_061203.html" ADD_DATE="1302979568" LAST_VISIT="1322361174" LAST_MODIFIED="1302979568" >ERIC HEPPERLE Local Employment Website List.url</A>
        <DT><A HREF="http://wwww.siliconindia.com/profiles/oIcqh9EC/Eric_Hepperle_Web_Programmer.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Eric Hepperle Web Programmer   Eric Hepperle.url</A>
        <DT><A HREF="http://groups.google.com/groups/profile?hl=en&enc_user=wZCwJRgAAAAnPz_hkuaeoAOYPIvJ9_caMxB39KJNQ76SLnMRgR9a0A" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Google Groups - weedmonster & Codeslayer.url</A>
        <DT><A HREF="http://208.86.2.42/showthread.php?p=565172" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hollywoodprofiles.com Scam Exposed Repost.url</A>
        <DT><A HREF="http://www.cartoonextra.com/video/J7v6w2DUIKw/Kristobaldude-tells-storys-EIGHT-HUNDRED-THOUSAND-POUND-GOD.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.cartoonextra.com-video-J7v6w2DUIKw-Kristobaldude-tells-storys-EIGHT-HUNDRED-THOUSAND-.url</A>
        <DT><A HREF="http://www.nartube.net/845c57b319:O0ZUusvgZik.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.nartube.net-845c57b319O0ZUusvgZik.html.url</A>
        <DT><A HREF="http://en.kendincos.net/video-djjjjrrf-kristobaldude-plays-guitar-acoustic-original-spanish-flamenco-esqe.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Kristobaldude plays guitar acoustic original spanish flamenco-esqe - Watch Video - Kendin Cos.url</A>
        <DT><A HREF="http://www.smashbeats.com/v2180180/kristobaldude_plays_pantera_mouth_for_war_09_10_09" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Kristobaldude Plays Pantera Mouth For War (09-10-09).url</A>
        <DT><A HREF="http://www.tweetchennai.com/?s=solar-eclipses-st-century" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Solar-eclipses-st-century  Tweet Chennai.url</A>
        <DT><A HREF="http://www.wolfstechnologytabernacle.com/vlhs.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Valley Lutheran Middle & High School - Cedar Falls, IA.url</A>
        <DT><A HREF="http://www.nme.com/awards/video/search/hepperle" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Video  NME.COM.url</A>
        <DT><A HREF="http://www.musicnewshound.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Welcome to Heavy as Hell.url</A>
        <DT><A HREF="http://www.godlikeproductions.com/forum1/message868586/pg1#13710423" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Who created the creator.url</A>
        <DT><A HREF="http://wonder-tonic.com/geocitiesizer/content.php?theme=2&music=6&url=www.heavyashell.com" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Wonder-Tonic.com.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_FAMILY & FRIENDS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Casey Jensen</H3>
        <DL><p>
            <DT><A HREF="http://caseyjensenphotography.weebly.com/portraits.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Portraits -.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Dan Derifield</H3>
        <DL><p>
            <DT><A HREF="http://www.google.com/search?q=DANIEL+derifield&hl=en&rls=com.microsoft:en-us&prmd=ivnso&ei=Nt9ATbC7Coa8lQe8nZC7Aw&start=10&sa=N" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >DANIEL derifield - Google Search.url</A>
            <DT><A HREF="http://www.answers.com/topic/stand-up-2009-album-by-daniel-derifield" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Stand Up Information from Answers.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Daniel Megivern</H3>
        <DL><p>
            <DT><A HREF="http://www.reddit.com/comments/audwm/blogroll/?sort=old" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Blogroll  reddit.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Horsepower Freaks</H3>
        <DL><p>
            <DT><A HREF="http://www.horsepowerfreaks.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Auto & truck performance parts & aftermarket car parts from HorsepowerFreaks.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Isaac Podolefsky</H3>
        <DL><p>
            <DT><A HREF="http://www.buffalostate.edu/news.xml?prid=3201" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buffalo State College - News and Events - News - SUNY Chancellor Recommends Podolefsky as Presi.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">James Crawley</H3>
        <DL><p>
            <DT><A HREF="http://webstudentwork.com/jcrawley/PHP/individual/index.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >James Crawley - Build your PC.url</A>
            <DT><A HREF="http://webstudentwork.com/jcrawley/samples.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >James Crawley Samples.url</A>
            <DT><A HREF="http://webstudentwork.com/jcrawley/index.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >James Crawley Web Design Major.url</A>
            <DT><A HREF="http://www.webstudentwork.com/jcrawley/EL/Kickitupkarate/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Kick It Up Karate.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Jerry Hepperle</H3>
        <DL><p>
            <DT><A HREF="http://eatatbens.com/index.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Benjamin's Coffeehouse  Franklin, Indiana.url</A>
            <DT><A HREF="http://www.beyondthecave.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Beyond the Cave  Welcome.url</A>
            <DT><A HREF="http://bigcartel.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Big Cartel - Simple shopping cart for artists, designers, bands, record labels, jewelry, crafte.url</A>
            <DT><A HREF="http://blog.coffeeandpieohmy.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Coffee and Pie Oh My!.url</A>
            <DT><A HREF="http://maps.google.com/?ie=UTF8&hq&hnear=3546+Langley+Dr%2C+South+Bend%2C+St+Joseph%2C+Indiana+46614&ll=41.638555%2C-86.240788&spn=0.011739%2C0.019205&z=16" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Google Maps - Jerry Hepperle.url</A>
            <DT><A HREF="http://jhepperle.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hepperle  Design - Development.url</A>
            <DT><A HREF="http://www.jhepperle.com/nbc/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.jhepperle.com-nbc-.url</A>
            <DT><A HREF="http://projects.jhepperle.com/about.html" ADD_DATE="1298816241" LAST_VISIT="1322361174" LAST_MODIFIED="1298816241" >Kirsten May.url</A>
            <DT><A HREF="http://stuartbranigin.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Stuart & Branigin LLP.url</A>
            <DT><A HREF="http://shirtshop.jhepperle.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >T-Shirt Shop.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1299518850">Joe Hepperle</H3>
        <DL><p>
            <DT><A HREF="http://www.free-press-release.com/news-daniel-rainsong-finds-living-ivory-billed-woodpecker-1263914173.html" ADD_DATE="1299518854" LAST_VISIT="1322361174" LAST_MODIFIED="1299518854" ICON_URI="http://www.free-press-release.com/favicon.ico" >http--www.free-press-release.com-news-daniel-rainsong-finds-living-ivory-billed-woodpecker-1263914173.html.url</A>
            <DT><A HREF="http://www.free-press-release.com/news/200904/1239279630.html" ADD_DATE="1299522799" LAST_VISIT="1322361174" LAST_MODIFIED="1299522799" ICON_URI="http://www.free-press-release.com/favicon.ico" >Joe Hepperle Chides Wikipedians - Wikipedia, Joe Hepperle.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Nick Covington</H3>
        <DL><p>
            <DT><A HREF="http://www.unifreethought.com/search/label/Eyewitness%20Hypothesis%20Series" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UNI Freethinkers and Inquirers Eyewitness Hypothesis Series.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Seth Coster</H3>
        <DL><p>
            <DT><A HREF="http://stozstudios.blogspot.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Stoz Studios.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Spanky</H3>
        <DL><p>
            <DT><A HREF="http://www.err-ordesign.com/err-news.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.err-ordesign.com-err-news.php.url</A>
        </DL><p>
        <DT><A HREF="http://jhepperle.com/index.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hepperle Studio  A design studio.url</A>
        <DT><A HREF="http://www.singsnap.com/snap/watchAndListen/play/add77db0" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >SingSnap  It Matters To Me by Dawn72.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_FONTS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Free Downloads</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">60's & Retro Fonts</H3>
            <DL><p>
                <DT><A HREF="http://www.fontspace.com/category/60s" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Free 60s fonts - FontSpace.url</A>
            </DL><p>
            <DT><A HREF="http://www.myfont.de/fonts/famous/movie-2.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Download Film Schriftarten kostenlos Film Fonts - Seite 2  MyFont.de.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Research</H3>
        <DL><p>
            <DT><A HREF="http://new.myfonts.com/search/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Advanced Search ˠMyFonts.url</A>
            <DT><A HREF="http://www.dafont.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >dafont.com.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1307845951">_FOOD & NUTRITION</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1307845964">EATING ON A BUDGET</H3>
        <DL><p>
            <DT><A HREF="http://www.hillbillyhousewife.com/" ADD_DATE="1307845966" LAST_VISIT="1322361174" LAST_MODIFIED="1307845966" ICON_URI="http://www.hillbillyhousewife.com/wp-content/themes/lifestyle/images/favicon.ico" >Hillbilly Housewife  Low Cost Home Cooking from Scratch.url</A>
            <DT><A HREF="http://www.thebatt.com/2.8483/how-to-eat-on-20-a-week-1.1180994" ADD_DATE="1307845983" LAST_VISIT="1322361174" LAST_MODIFIED="1307845983" >How to eat on $20 a week - Features - The Battalion - Texas A&M.url</A>
            <DT><A HREF="https://www.wesabe.com/groups/92-eating-on-a-budget/discussions/1373-the-cheapest-food-out-there-that-are-still-good-for-ya" ADD_DATE="1307845972" LAST_VISIT="1322361174" LAST_MODIFIED="1307845972" ICON_URI="https://www.wesabe.com/favicon.ico" >wesabe Eating On A Budget The Cheapest Food Out There (That Are Still Good For Ya).url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_FURNITURE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Bead Curtains</H3>
        <DL><p>
            <DT><A HREF="http://www.endlesssummerlifestyles.com/index.php?l=product_detail&p=9" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Surf decor - tropical decor, beach decor, surf gifts and surfer gift ideas..url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Beanbags</H3>
        <DL><p>
            <DT><A HREF="http://www.ultimatesack.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Bean Bag Chairs - Love Sac like Bean Bags from Ultimate Sack  Love Sack Chairs.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Cleaning Microfiber Furniture</H3>
        <DL><p>
            <DT><A HREF="http://www.cleanyourmicrofiber.com/index.php/Clean_Microfiber_Furniture" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Clean Microfiber Furniture - How To Clean Microfiber Furniture.url</A>
            <DT><A HREF="http://askville.amazon.com/Techniques-Cleaning-Microfiber-Furniture/AnswerDetails.do?requestId=4951554&responseId=4954903" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Techniques for Cleaning Microfiber Furniture.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Floating Shelves</H3>
        <DL><p>
            <DT><A HREF="http://4.bp.blogspot.com/_TatPpSnJCYc/SdiijWSYWvI/AAAAAAAACTo/ua7GO7M84-k/s1600-h/03.jpg" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >03.jpg (image).url</A>
            <DT><A HREF="http://www.doityourself.com/stry/installwallanchors" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Choosing and Installing Wall Anchors  DoItYourself.com.url</A>
            <DT><A HREF="http://www.contractortalk.com/f13/floating-shelving-76528/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Floating Shelving - Contractor Talk - Professional Construction and Remodeling Forum.url</A>
            <DT><A HREF="http://www.ikea.com/us/en/catalog/products/80116681" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >IKEA  Bookcases  BILLY system  BILLY  Wall shelf.url</A>
            <DT><A HREF="http://reasonmodern.com/category/shelving/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Shelving ˠREASON furniture design.url</A>
            <DT><A HREF="http://www.apartmenttherapy.com/ny/good-questions/sources-for-wood-floating-shelves-good-questions-111301" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Sources for Wood Floating Shelves Good Questions  Apartment Therapy New York.url</A>
            <DT><A HREF="http://www.shelvingcompany.co.uk/wallshelves.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Shelving Company Floating Shelves - Wall Shelves.url</A>
            <DT><A HREF="http://shop.temahome.com/epages/1641-080514.sf/en_US/?ObjectPath=/Shops/1641-080514/Products/wallShelfPrairie/SubProducts/9000.165740" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Wall Shelf Prairie - TemaHome.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Furnishings & Decor</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Unique</H3>
            <DL><p>
                <DT><A HREF="http://www.amazon.com/s/ref=bl_sr_kitchen?ie=UTF8&search-alias=garden&field-brandtextbin=Kikkerland" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Kikkerland - Home, Garden & Pets Home & Garden.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Humidifiers</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/Lasko-12-0-Gallon-Humidifier-Black/dp/B003HFAFD2/ref=pd_sim_sbs_e_1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com 12.0-Gallon Humidifier Black Electronics.url</A>
            <DT><A HREF="http://www.consumersearch.com/humidifiers/review" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >ConsumerSearch.com - Humidifiers Reviews.url</A>
            <DT><A HREF="http://www.sylvane.com/learning-center/humidifier-buying-guide.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Humidifier Buying Guide.url</A>
            <DT><A HREF="http://www.sylvane.com/learning-center/understanding-relative-humidity.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Understanding Relative Humidity.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Inflatable</H3>
        <DL><p>
            <DT><A HREF="http://www.blofield.com/Seater2.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Blofield Air Design - Big Blo 2.url</A>
            <DT><A HREF="http://www.onlinesports.com/pages/I,SSI-BEARSCT.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Chicago Bears Inflatable Coffee Table.url</A>
            <DT><A HREF="http://www.google.com/imgres?imgurl=http://ecx.images-amazon.com/images/I/51gz1ANhy-L._SL500_AA300_.jpg&imgrefurl=http://www.amazon.com/Intex-Oasis-Inflatable-Island-Lounge/dp/B001AHB5L0&usg=__beraMQ5dnw_ASc-76_4N7yIha1k=&h=300&w=300&sz=21&hl=en&start=1&um=1&" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Google Image Result for http--ecx.images-amazon.com-images-I-51gz1ANhy-L._SL500_AA300_.jpg.url</A>
            <DT><A HREF="http://shop.ebay.com/?_from=R40&_trksid=m570&_nkw=inflatable+hot+tub+" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >inflatable hot tub items - Get great deals on Home Garden, Baby items on eBay.com!.url</A>
            <DT><A HREF="http://www.mademan.com/best-inflatable-hot-tub/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Best Inflatable Hot Tub.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Kitchen</H3>
        <DL><p>
            <DT><A HREF="http://www.crateandbarrel.com/family.aspx?c=14393&f=36374" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Crate and Barrel - Bamboo Dish Rack shopping in Crate and Barrel Kitchen and Food.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Mystical Furnishings</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Buddhas</H3>
            <DL><p>
                <DT><A HREF="http://www.amazon.com/s/?ie=UTF8&keywords=statues+of+buddha&tag=googhydr-20&index=garden&hvadid=2892833541&ref=pd_sl_4lr17jjfte_b" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com statues of buddha - Home, Garden & Pets Home & Garden.url</A>
                <DT><A HREF="http://www.target.com/s?keywords=buddha&searchNodeID=1038576%7C1287991011&ref=sr_bx_1_1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >buddha  Target Search Results.url</A>
                <DT><A HREF="http://www.smarter.com/se--qq-buddha%2Bgarden%2Bstatues.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buddha Garden Statues - Shop Smarter.com.url</A>
                <DT><A HREF="http://www.buddhagroove.com/?ctt_id=3173769&ctt_adnw=Google&ctt_kw=statues%20of%20buddha&ctt_ch=ps&ctt_entity=tc&ctt_adid=3438088228&ctt_nwtype=search&ctt_cli=8x10700x55962x480151&gclid=CLWajsqikqMCFRxinAodS2BHnw" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buddha Statue  Buddha Statues  Buddhist Gifts  Buddha Garden Statues  Buddha Garden Statue.url</A>
                <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US376&&sa=X&ei=mfhRTKb9AZCMnQf3lqWIAw&ved=0CCUQvwUoAQ&q=buddha+statue+for+living+room&spell=1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >buddha statue for living room - Google Search.url</A>
                <DT><A HREF="http://hubpages.com/hub/Buddha-Statue-Why-do-you-need-to-buy-Buddha-Statue-Answer-to-choose-the-right-one" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buddha Statue ֠Why do you need to buy Buddha Statue Answer to choose the right one..url</A>
                <DT><A HREF="http://www.fengshuihandbook.com/about/buddha-statues/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buddha Statues  Feng Shui Handbook.url</A>
                <DT><A HREF="http://www.basearticles.com/Art/37618/277/Buddha-Statues-How-To-Choose-the-Right-Ones-8-Critical-Factors.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Buddha Statues - How To Choose the Right Ones - 8 Critical Factors.url</A>
                <DT><A HREF="http://www.overstock.com/search?SearchType=K&keywords=BUDDHA+STATUES&cid=128510&kid=47817280&fp=f&kenshoo_id_=7766f240-6cc2-b608-42c1-000018dc7418" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >BUDDHA STATUES Search Results  Overstock.com.url</A>
                <DT><A HREF="http://buy-fengshui.com/fengshui_products_category/laughing_buddha.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Feng Shui Enhancers and Cure - Laughing Buddha, Happy Buddha.url</A>
                <DT><A HREF="http://www.buzzle.com/articles/information-that-can-help-you-choose-the-perfect-buddha-statue.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Information That Can Help You Choose The Perfect Buddha Statue.url</A>
                <DT><A HREF="http://www.target.com/Large-Buddha-Fountain-29/dp/B000NGIU2G/ref=sc_qi_detaillink" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Large Buddha Fountain - 29  Target.url</A>
                <DT><A HREF="http://sculpture.novica.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >SCULPTURE & CARVINGS - Metal, Bronze & Wood Sculpture - NOVICA.url</A>
                <DT><A HREF="http://www.thebuddhagallery.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Buddha Gallery.url</A>
                <DT><A HREF="http://www.thefind.com/garden/info-wooden-buddha-statue" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Wooden buddha statue - Shop sales, stores & prices at TheFind.com.url</A>
                <DT><A HREF="http://www.livingroom-furniture-stores.com/alist/Meditating_Buddha_Statue,459608942.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >ĤĠMeditating Buddha Statue.url</A>
            </DL><p>
            <DT><A HREF="http://www.sacredsource.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Sacred Source.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Over Sink Shelf</H3>
        <DL><p>
            <DT><A HREF="http://www.target.com/gp/detail.html/189-5226896-4382664?asin=B000MM8WNI&AFID=Performics_ShopWiki.com&ci_src=15781033&ci_sku=B000MM8WNI&LNM=Primary&ref=tgt_adv_XASD0001" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Lipper International Bamboo Over-the-Sink Shelf  Target.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Plastic Cup Dispenser</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/San-Jamar-Dispenser-Removable-Stainless/dp/B001GKO1GC/ref=sr_1_1?ie=UTF8&s=office-products&qid=1294727061&sr=8-1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com San Jamar Large Water Cup Dispenser W-Removable Cap,Wall Mounted, Stainless Steel Of.url</A>
            <DT><A HREF="http://www.sears.com/shc/s/p_10153_12605_SPM173766531P?sid=IDx20101019x00001a&ci_src=14110944&ci_sku=SPM223911265" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >San Jamar SAN C3400P Large Water Pull-Type Cup Dispenser with Removable Cap- Stainless Steel.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Pop-up Hampers</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/Household-Essentials-2032-Clothing-Polyster/dp/B003VYAGOW" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Household Essentials 2032 Pop Up Clothing Hamper, Round, Oatmeal Polyster With Coffe.url</A>
            <DT><A HREF="http://www.ivgstores.com/IVG2/Y/ProductID-209078-.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Coffee Trim Pop Up Hamper in Oatmeal.url</A>
            <DT><A HREF="http://www.ivgstores.com/IVG2/Y/ProductID-209079-.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Rolling Pop Up Hamper in Blue.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Posters & Wall Decor</H3>
        <DL><p>
            <DT><A HREF="http://www.urbanoutfitters.com/urban/catalog/productdetail.jsp?itemdescription=true&itemCount=80&startValue=1&selectedProductColor=&sortby=&id=19039122&parentid=A_FURN_WALL&sortProperties=+subCategoryPosition,+product.marketingPriority&navCount=175&navAction=" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UrbanOutfitters.com  You Must Be Guilty Framed Poster 11x17.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Shopping General</H3>
        <DL><p>
            <DT><A HREF="http://www.onewayfurniture.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Furniture, Bar Stools Furniture, Bedroom Furniture, Dining Room Furniture, Kitchen Counter Stoo.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Shower Curtains</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/FUN-WORLD-DIV-EASTER-UTLD-Curtain/dp/B001AXBMDK/ref=sr_1_16?ie=UTF8&s=home-garden&qid=1280793124&sr=8-16" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Bloody Shower Curtain Home & Garden.url</A>
            <DT><A HREF="http://www.amazon.com/Destroyer-Fabric-Bathroom-Shower-Curtain/dp/B0031QTIY4/ref=sr_1_6?ie=UTF8&s=home-garden&qid=1280798709&sr=1-6" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Kiss Destroyer Fabric Bathroom Shower Curtain Home &Ůurl</A>
            <DT><A HREF="http://www.amazon.com/Floyd-Fabric-Bathroom-Shower-Curtain/dp/B0031QWUZS/ref=sr_1_67?ie=UTF8&s=home-garden&qid=1280798649&sr=1-67" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Pink Floyd Dark Side Moon Fabric Bathroom Shower Curtain Home & Garden.url</A>
            <DT><A HREF="http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=shower+curtain&ih=12_2_0_0_0_0_0_0_0_1.94_147&fsc=3" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com shower curtain.url</A>
            <DT><A HREF="http://www.cb2.com/search.aspx?query=shower%20curtain" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >CB2 - Search.url</A>
            <DT><A HREF="http://www.shower-curtains.org/coolshowercurtains.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Cool Shower Curtains.url</A>
            <DT><A HREF="http://community.livejournal.com/hip_domestics/6653627.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >hip_domestics COOL Shower Curtains.url</A>
            <DT><A HREF="http://www.showercurtainsgalore.com/shower-curtains/vinyl-shower-curtains/howlingwolfshowercurtain.cfm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Howling Wolf Shower Curtain - Shower Curtains at Shower Curtains Galore.url</A>
            <DT><A HREF="http://www.yelp.com/topic/san-francisco-i-need-a-cool-shower-curtain-seriously" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >I need a cool shower curtain. Seriously  San Francisco  Yelp.url</A>
            <DT><A HREF="http://kazowie.com/gilfish/Guy+Shower+Curtains" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >KAZOWIE! - Guy Shower Curtains.url</A>
            <DT><A HREF="http://sportschristmasgifts.com/LSU-Tigers-Locker-Room-Shower-Curtain/M/B0017VBWTE.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >LSU Tigers Locker Room Shower Curtain  Sports Christmas Gifts.url</A>
            <DT><A HREF="http://www.shower-curtains.org/fabricshowercurtains.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Shop Fabric Shower Curtains at Shower-Curtains.Org.url</A>
            <DT><A HREF="http://www.showercurtainsgalore.com/shower-curtains/4637+4639.cfm?source=googleaw&kwid=cool%20shower%20curtains&tid=exact" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Shower Curtain  Shop Fabric Shower Curtains at ShowerCurtainsGalore.com.url</A>
            <DT><A HREF="http://www.target.com/s?keywords=shower+curtain&searchNodeID=1038576%7C1287991011&ref=sr_bx_1_1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >shower curtain  Target Search Results.url</A>
            <DT><A HREF="http://www.bedbathstore.com/showcurlin.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Shower Curtain Liners - Fabric Shower Curtain Liner - Extra Long Liners.url</A>
            <DT><A HREF="http://www.google.com/products?hl=en&rlz=1T4HPIC_enUS349US376&q=shower+curtain+liners+for+men&um=1&ie=UTF-8&ei=s19XTPyrOsuJnAfcmtjAAw&sa=X&oi=product_result_group&ct=title&resnum=3&ved=0CDwQrQQwAg" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >shower curtain liners for men - Google Product Search.url</A>
            <DT><A HREF="http://www.crookedbrains.net/2008/06/interesting_12.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Some Really Cool & Interesting Shower Curtains..url</A>
            <DT><A HREF="http://sunshinedaydream.biz/store/item/35sy7/Jimi_Hendrix_Stuff/Jimi_Hendrix_-_Shower_Curtain.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Sunshine Daydream Tie Dye Chicago Hippie Store Jimi Hendrix - Shower Curtain.url</A>
            <DT><A HREF="http://thecoolshowercurtains.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Cool Shower Curtains  Information...Tips...Product Displays.url</A>
            <DT><A HREF="http://www.urbanoutfitters.com/urban/catalog/category.jsp?popId=APARTMENT&navAction=poppushpush&isSortBy=true&navCount=63&pushId=APARTMENT_FURNISH&id=A_FURN_BATH&cm_guid=1-_-100000000000000284483-_-3535589627&cm_mmc=Google-_-d_Home_Furnishing_L2-_-showercurta" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UrbanOutfitters.com  Apartment Furnish & Decorate  Bath.url</A>
            <DT><A HREF="http://www.urbanoutfitters.com/urban/catalog/productdetail.jsp?id=14161533&navAction=jump&navCount=18" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UrbanOutfitters.com  Learn a New Language Shower Curtain.url</A>
            <DT><A HREF="http://www.showercurtainsgalore.com/shower-curtains/fabric-shower-curtains/nepalbambooshowercurtain1.cfm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Zinnas Poppies Shower Curtain - Shower Curtains at Shower Curtains Galore.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Shower Rod</H3>
        <DL><p>
            <DT><A HREF="http://www.bedbathandbeyond.com/product.asp?SKU=13088624" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Contour Curved Shower Rod - Bed Bath & Beyond.url</A>
            <DT><A HREF="http://www.overstock.com/Home-Garden/Curved-Shower-Rod-w-Shower-Liner-and-Hooks-Set/2943813/product.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Curved Shower Rod w- Shower Liner and Hooks Set  Overstock.com.url</A>
            <DT><A HREF="http://www.shopgetorganized.com/item/dual_shower_curtain_rod/25640" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >DUAL SHOWER CURTAIN ROD from Get Organized.url</A>
            <DT><A HREF="http://www.walmart.com/ip/Canopy-Curved-Hotel-Shower-Rod-Chrome/10227057" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >walmart.com Canopy Curved Hotel Shower Rod, Chrome Bath.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Tabletop Fountains</H3>
        <DL><p>
        </DL><p>
        <DT><A HREF="http://www.atrendyhome.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Towel Warmers, Portable Air Conditioners, Curved Shower Rods, Fans, Home Improvement Store.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GAMBLING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">BLACK JACK</H3>
        <DL><p>
            <DT><A HREF="http://www.blackjack-primer.com/table.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Blackjack Primer  The Blackjack Table.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">MAKING MONEY AT CASINOS</H3>
        <DL><p>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=1&oq=best+way+to+make+money+at+&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=best+way+to+make+money+at+a+casino" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >best way to make money at a casino - Google Search.url</A>
            <DT><A HREF="http://answers.yahoo.com/question/index?qid=20090122212726AAh8G19" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >What is the best game to gain money from the casino - Yahoo! Answers.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GARAGE RUMMAGE & YARD SALES</H3>
    <DL><p>
        <DT><A HREF="http://www.ehow.com/how_3327_have-yard-sale.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to Have a Yard Sale  eHow.com.url</A>
        <DT><A HREF="http://www.ifg-inc.com/Consumer_Reports/GarageSale.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How To Operate A Successful Garage Sale.url</A>
        <DT><A HREF="http://www.yardsalequeen.com/customers.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Yard Sale Customers from Hell.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GARDENING & LANDSCAPING</H3>
    <DL><p>
        <DT><A HREF="http://www.learn2grow.com/gardeningguides/tools/powertools/SelectingAPowerHedgeTrimmer.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Garden Article Selecting a Power Hedge Trimmer.url</A>
        <DT><A HREF="http://www.consumersearch.com/hedge-trimmers/reviews" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hedge Trimmer Ratings, Best Rated Hedge Trimmer.url</A>
        <DT><A HREF="http://www.onlinetips.org/hedges/trimming-mistakes" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hedge Trimming Mistakes  OnlineTips.org.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GEEK SHIT</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">BLOGS</H3>
        <DL><p>
            <DT><A HREF="http://www.heavy.com/action/girls/2011/01/20-girls-we-want-to-drink-with/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >20 Girls We Want To Drink With  HEAVY.url</A>
            <DT><A HREF="http://www.mgid.com/pnews/943631/i/1473/pp/8/1/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Chicks in Spider-Man Costumes - MGID.url</A>
            <DT><A HREF="http://www.holycool.net/2010/10/dont-talk-over-music-print.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >holycool.net Don't Talk Over Music Print.url</A>
            <DT><A HREF="http://www.mgid.com/pnews/941725/i/1637/60/r/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >If Cartoon Characters Were Real... - MGID.url</A>
            <DT><A HREF="http://www.digitalbusstop.com/realistic-cartoon-characters/#3" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Realistic Cartoon Characters  Digital Bus Stop.url</A>
            <DT><A HREF="http://www.techeblog.com/elephant/photo.phtml?post_key=162585&photo_key=56382" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >TechEBlog ۠Geeky Girls in Spidey Costumes - Photo.url</A>
        </DL><p>
        <DT><A HREF="http://www.amazon.com/s/ref=bl_sr_kitchen?ie=UTF8&search-alias=garden&field-brandtextbin=Kikkerland" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >amazon.com Kikkerland - Home, Garden & Pets Home & Garden.url</A>
        <DT><A HREF="http://www.neatorama.com/2010/07/26/comic-sans-gets-dissed/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Comic Sans Gets Dissed.url</A>
        <DT><A HREF="http://www.geekybitch.com/blog/geeky-stuff/geek-tattoos/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Geek Tattoos  Geeky Bitch.url</A>
        <DT><A HREF="http://www.denofgeek.com/television/4892/heroes_s201_review.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Heroes s201 review - Den of Geek.url</A>
        <DT><A HREF="http://www.threadless.com/product/659/Needful_Things" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Needful Things - T-shirt by Travis Pitts.url</A>
        <DT><A HREF="http://nerdbastards.com/2010/07/12/westboro-baptist-to-protest-at-comic-con/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >nerdbastards.com  GOD HATES NERDS!!! Westboro Baptist to Protest at Comic-Con.url</A>
        <DT><A HREF="http://www.gadget-blog.co.uk/news/raytheon-anti-aircraft-laser-showcased/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Raytheon anti-aircraft laser showcased  News  Gadget Reviews.url</A>
        <DT><A HREF="http://geekblips.dailyradar.com/story/transformers-g1-robot-deception-neon-light-sign-tb040/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Transformers G1 Robot Deception Neon Light Sign Tb040 - Geek.url</A>
        <DT><A HREF="http://store.xkcd.com/breadpig/#Awesomesauce" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >xkcd store.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GENEALOGY</H3>
    <DL><p>
        <DT><A HREF="http://www.firthessence.net/firthfile.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Colin Firth's Lineage.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GIRLS GIRLS GIRLS</H3>
    <DL><p>
        <DT><A HREF="http://slagzombie.wordpress.com/2008/08/07/sexy-female-movie-characters/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Sexy Female Movie Characters ˠSlag Zombie Sideshow.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=lAZ5PJArqes&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >YouTube - THE BEST GIRLS TUNING.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_GOVERNMENT</H3>
    <DL><p>
        <DT><A HREF="http://showcase.netins.net/web/creative/lincoln/speeches/gettysburg.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Gettysburg Address by Abraham Lincoln.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_HAIR</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">CELEBRITY LOOKALIKE PHOTOS</H3>
        <DL><p>
            <DT><A HREF="http://celebrity.myheritage.com/FP/Company/face-recognition-results.php?temp=53ddd3c43xeq0811&server=Server74&database=2&startYear=1800&endYear=2005" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >MyHeritage.com face recognition - celebrity matches - MyHeritage.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Men&#39;s</H3>
        <DL><p>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/europe/8651984.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Cornrow Styles - Cornrow Braids of All Styles - Black Braided Hairstyles  CoolMensHair.com.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/middle_east/8656929.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >european hair braiding styles for men - Google Search.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/middle_east/8654604.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hair Art at Ananke Designs.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/south_asia/8656894.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hair Braiding - Page 4 - Skadi Forum.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/south_asia/8655749.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Handcrafted Celtic, Viking &amp; Scandinavian Hair Barrettes.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/south_asia/8656978.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to Grow Long Hair As a Guy - wikiHow.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/education/10094998.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--the-light.com-mens-6-full-brad.jpg.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/uk_news/england/kent/8656694.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men&#39;s Hair Braids Oklahoma City, OK  Style by Anastasia.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/uk_news/england/beds/bucks/herts/8657028.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men&#39;s Long Hair Hyperboard.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/education/10094877.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men&#39;s Long Hair Site.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/uk_news/england/leicestershire/8656814.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men&#39;s Long Hairstyles - Long Hairstyles for Men.url</A>
            <DT><A HREF="http://www.heavyashell.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >On Being a Longhair.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Men's</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Dreadlocks</H3>
            <DL><p>
                <DT><A HREF="http://www.videojug.com/interview/how-to-make-dreadlocks-2" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How To Make Dreadlocks (Beauty & Style Hair Care For Men).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Find A Hairdresser</H3>
            <DL><p>
                <DT><A HREF="http://www.videojug.com/interview/how-to-find-a-decent-hairdresser" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How To Find A Decent Hairdresser (Beauty & Style Hair Care For Men).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Long Hair</H3>
            <DL><p>
                <DT><A HREF="http://www.videojug.com/interview/how-to-get-your-hair-cut-if-you-are-trying-to-grow-it" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How To Get Your Hair Cut If You Are Trying To Grow It (Beauty & Style Hair Care For Men).url</A>
                <DT><A HREF="http://www.videojug.com/film/styling-tips-for-long-hair-on-men" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Styling Tips For Long Hair On Men (Beauty & Style Hair Care For Men).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Receding Hairline</H3>
            <DL><p>
                <DT><A HREF="http://www.videojug.com/film/how-to-cope-with-a-receding-hairline" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How To Cope With A Receding Hairline (Beauty & Style Hair Care For Men).url</A>
            </DL><p>
            <DT><A HREF="http://coolmenshair.com/2008/04/cornrow-styles.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Cornrow Styles - Cornrow Braids of All Styles - Black Braided Hairstyles  CoolMensHair.com.url</A>
            <DT><A HREF="http://images.google.com/images?hl=en&safe=off&rlz=1T4HPIC_enUS349US349&q=european%20hair%20braiding%20styles%20for%20men&um=1&ie=UTF-8&sa=N&tab=wi" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >european hair braiding styles for men - Google Search.url</A>
            <DT><A HREF="http://www.bead-art.com/HairArt.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hair Art at Ananke Designs.url</A>
            <DT><A HREF="http://forums.skadi.net/showthread.php?p=948679" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hair Braiding - Page 4 - Skadi Forum.url</A>
            <DT><A HREF="http://hairtwisters.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >hairtwisters.com.url</A>
            <DT><A HREF="http://www.urweg.com/list/hairs.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Handcrafted Celtic, Viking & Scandinavian Hair Barrettes.url</A>
            <DT><A HREF="http://www.wikihow.com/Grow-Long-Hair-As-a-Guy" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to Grow Long Hair As a Guy - wikiHow.url</A>
            <DT><A HREF="http://the-light.com/mens/6/full/brad.jpg" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--the-light.com-mens-6-full-brad.jpg.url</A>
            <DT><A HREF="http://www.georgecaroll.com/male%20stars%20beards/male-stars-beards1.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Male Movie Stars Beard, Facial Hair Styles,Mustache, Goatee , Sideburns  Celebrity facial hair .url</A>
            <DT><A HREF="http://stylebyanastasia.com/2009/08/man-braids-keep-long-hair-neat/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men's Hair Braids Oklahoma City, OK  Style by Anastasia.url</A>
            <DT><A HREF="http://www.mlhh.org/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men's Long Hair Hyperboard.url</A>
            <DT><A HREF="http://the-light.com/mens/longhair.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men's Long Hair Site.url</A>
            <DT><A HREF="http://mensfashion.about.com/od/goominghair/ss/longhairstyles.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Men's Long Hairstyles - Long Hairstyles for Men.url</A>
            <DT><A HREF="http://www.choisser.com/longhair/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >On Being a Longhair.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_HEALTH & WELLNESS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">ACCESS TO RECORDS</H3>
        <DL><p>
            <DT><A HREF="http://myopennotes.org/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >OpenNotes Project - Home.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">DIGESTION</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1299182669">Bran Muffins</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4GGHP_enUS419US419&q=buy+organic+bran+muffins&aq=f&aqi=&aql=&oq=" ADD_DATE="1299182680" LAST_VISIT="1322361174" LAST_MODIFIED="1299182680" ICON_URI="http://www.google.com/favicon.ico" >buy organic bran muffins - Google Search.url</A>
                <DT><A HREF="http://community.tasteofhome.com/forums/t/622950.aspx" ADD_DATE="1299182692" LAST_VISIT="1322361174" LAST_MODIFIED="1299182692" >Can you still buy 100% bran cereal (made by post)  Taste of Home Community.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=can%27t+I+buy+bran+muffins%3f" ADD_DATE="1299182686" LAST_VISIT="1322361174" LAST_MODIFIED="1299182686" ICON_URI="http://www.google.com/favicon.ico" >can't I buy bran muffins - Google Search.url</A>
                <DT><A HREF="http://cookiedoc.blogspot.com/2007/04/bran-muffins.html" ADD_DATE="1299182671" LAST_VISIT="1322361174" LAST_MODIFIED="1299182671" ICON_URI="http://cookiedoc.blogspot.com/favicon.ico" >Cooking is Medicine Bran Muffins.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Gall Bladder</H3>
            <DL><p>
                <DT><A HREF="http://www.digitalnaturopath.com/treat/T143745.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Bile Salts.url</A>
                <DT><A HREF="http://www.newswithviews.com/Howenstine/james63.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Dr. James Howenstine -- Bile Salts Can Heal Psoriasis, Septicemia, Viral Infections & Excess Es.url</A>
                <DT><A HREF="http://www.gallbladderattack.com/questionnaire.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Gallbladder Symptom Questionnaire.url</A>
                <DT><A HREF="http://www.gallbladderattack.com/gallbladdersymptoms.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >GallBladderAttack.com - Gallbladder Symptoms.url</A>
                <DT><A HREF="http://www.gallbladderattack.com/products_bilesalts.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >GallBladderAttack.com_Bile Salts.url</A>
                <DT><A HREF="http://www.newswithviews.com/HNB/Hot_New_Books31.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Hundred-Year Lie.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Hemorrhoids</H3>
            <DL><p>
                <DT><A HREF="http://www.ronfez.net/forums/showthread.php?t=84345" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hemorrhoids again - RonFez.net Messageboard.url</A>
                <DT><A HREF="http://www.health.harvard.edu/newsweek/Hemorrhoids_and_what_to_do_about_them.htm" ADD_DATE="1306787978" LAST_VISIT="1322361174" LAST_MODIFIED="1306787978" ICON_URI="http://www.health.harvard.edu/favicon.ico" >Hemorrhoids and what to do about them - Harvard Health Publications.url</A>
                <DT><A HREF="http://www.blogofherbs.com/herbs/hemorrhoids-my-2-day-quick-fix" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Hemorrhoids ֠My 2 day quick fix  Blog of Herbs & Health.url</A>
                <DT><A HREF="http://www.google.com/search?hl=en&safe=off&rls=com.microsoft%3Aen-us&q=herbal+hemorrhoid+suppositories&aq=f&aqi=g-v1&aql=&oq=" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >herbal hemorrhoid suppositories - Google Search.url</A>
                <DT><A HREF="http://www.articleclick.com/Article/What-Makes-Hemorrhoids-Itch-/993180" ADD_DATE="1306791159" LAST_VISIT="1322361174" LAST_MODIFIED="1306791159" ICON_URI="http://www.articleclick.com/favicon.ico" >What Makes Hemorrhoids Itch.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Probiotics & Microflora</H3>
            <DL><p>
                <DT><A HREF="http://myirritablebowelsyndrometreatment.com/188/do-probiotics-make-you-feel-tired-and-sluggish/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Do Probiotics Make You Feel Tired And Sluggish  Irritable Bowel Syndrome Treatment.url</A>
                <DT><A HREF="http://www.answeranimal.com/When_taking_probiotics_why_does_it_make_me_feel_so_tired-qna115550.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.answeranimal.com-When_taking_probiotics_why_does_it_make_me_feel_so_tired-qna115550.h.url</A>
                <DT><A HREF="http://www.google.com/search?q=probiotic+side+effects&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >probiotic side effects - Google Search.url</A>
                <DT><A HREF="http://altmedicine.about.com/cs/herbsvitaminsad/a/Acidophilus.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Probiotics - What are Acidophilus and Other Probiotics.url</A>
                <DT><A HREF="http://www.google.com/search?q=probiotics+make+my+face+burn&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >probiotics make my face burn - Google Search.url</A>
                <DT><A HREF="http://www.medicinenet.com/probiotics/article.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Probiotics Types, Health Benefits, Side Effects, Research and Food Sources on MedicineNet.com.url</A>
                <DT><A HREF="http://www.imithome.org/probiotics-side-effects" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Side Effects Of Probiotics  Probiotic Side Effects.url</A>
                <DT><A HREF="http://www.life123.com/health/nutrition/probiotics/side-effects-of-probiotics.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Side Effects of Probiotics - Life123.url</A>
                <DT><A HREF="http://www.nutralegacy.com/blog/general-healthcare/top-10-probiotic-side-effects-everyone-should-be-aware-of/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Top 10 Probiotic Side Effects Everyone Should Be Aware of ֠Updated Article With Additional Inf.url</A>
            </DL><p>
            <DT><A HREF="http://www.digitalnaturopath.com/treat/T143745.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >DigitalNaturopath - Bile Salts.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">EAR NOSE & THROAT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Rhinitis & Post-Nasal Drip</H3>
            <DL><p>
                <DT><A HREF="http://www.medicinenet.com/script/main/art.asp?articlekey=6725&pf=3&page=2" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Chronic Rhinitis and Post Nasal Drip Causes and Symptoms on MedicineNet.com.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1312227880">EVOLUTIONARY MEDICINE</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Evolutionary_medicine#.E2.80.9CDiseases_of_civilization.E2.80.9D" ADD_DATE="1312227881" LAST_VISIT="1322361174" LAST_MODIFIED="1312227882" ICON_URI="http://en.wikipedia.org/favicon.ico" >Evolutionary medicine - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">EXERCISE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Parkour & Free Running</H3>
            <DL><p>
                <DT><A HREF="http://betterfly.com/category/freerunning-parkour?utm_source=facebookad&utm_medium=cpc&utm_campaign=odoor1-20-11-9" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Find a Freerunning-Parkour Betterist to help you learn, look & feel better  Betterfly.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Working Out Without Weights</H3>
            <DL><p>
                <DT><A HREF="http://www.bodybuilding.com/fun/becker20.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Bodybuilding.com - Workout WITHOUT Weights Dynamic Tension Revised! - Paul Becker.url</A>
            </DL><p>
            <DT><A HREF="http://www.animal-kingdom-workouts.com/isometric-isotonic.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Isometric-Isotonic Contractions - What Is The Difference.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">EYES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Cross-Eyed</H3>
            <DL><p>
                <DT><A HREF="http://vision.about.com/od/sportsvision/p/Strabismus.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Strabismus - Crossed Eyes and Strabismus.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Double Vision (diplopia)</H3>
            <DL><p>
                <DT><A HREF="http://vision.about.com/od/sportsvision/qt/Double_Vision.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Double Vision - What Is Double Vision.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=medical+double+vi&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=medical+double+vision" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >medical double vision - Google Search.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">FEMALE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Vagina Smell</H3>
            <DL><p>
                <DT><A HREF="http://answers.yahoo.com/question/index?qid=20090216192228AAq2jQL" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to prevent from smelling like pee and having vagina discharge during body paint - Yahoo! An.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">HEALTH FOOD VENDORS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1304566451">COCONUT</H3>
            <DL><p>
                <DT><A HREF="http://www.dcnutrition.com/Miscellaneous/detail.cfm?recordnumber=569" ADD_DATE="1304566452" LAST_VISIT="1322361174" LAST_MODIFIED="1304566452" >DC Nutrition -- Coconut Oil & Milk.url</A>
            </DL><p>
            <DT><A HREF="http://www.swansonvitamins.com/?SourceCode=INTL097&cm_mmc_o=7BBTkw%20-pcByplCjCPyzEpwpCjCmczElBECjClczElBE%20MbfzFbEl&gclid=CNPJ-8Ceh6ICFQQhDQodCW0-UA" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Discount Vitamins and Supplements, Health Products at Lowest Price - Swanson Health Products.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">HISTORY OF MEDICINE</H3>
        <DL><p>
            <DT><A HREF="http://www.nlm.nih.gov/hmd/pdf/witchcraft.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.nlm.nih.gov-hmd-pdf-witchcraft.pdf.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">HOLISTIC & ALTERNATIVE MEDICINE</H3>
        <DL><p>
            <DT><A HREF="http://www.iowaholisticresources.com/index.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Iowa Holistic Resources.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1312227801">MYTH OF DISEASE & CANCER AS FRIEND</H3>
        <DL><p>
            <DT><A HREF="http://www.damaris-art.com/2011/07/theres-no-such-thing-as-disease-medicines-are-fake/" ADD_DATE="1312227803" LAST_VISIT="1322361174" LAST_MODIFIED="1312227803" >Damaris ֠Art ֠The Art of Medicine ۠Thereӳ No Such Thing as Disease Medicines are Fake!.url</A>
            <DT><A HREF="http://www.seegerscanceranswer.com/" ADD_DATE="1312227838" LAST_VISIT="1322361174" LAST_MODIFIED="1312227838" >Seeger's Cancer Answer.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">REIKI</H3>
        <DL><p>
            <DT><A HREF="http://soul2soultreasures.com/reiki_jewelry.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Reiki Jewelry, Wands, Tools, Supplies & Gifts.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">SPLINTERS & SLIVERS</H3>
        <DL><p>
            <DT><A HREF="http://www.diagnose-me.com/cond/C120793.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >diagnose-me Condition Boils, Abscesses, Carbuncles.url</A>
            <DT><A HREF="http://health.howstuffworks.com/wellness/natural-medicine/home-remedies/home-remedies-for-splinter-removal.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Discovery Health 5 Home Remedies for Splinter Removal.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=how+to+lance+a+boil+at&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=how+to+lance+a+boil+at+home" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >how to lance a boil at home - Google Search.url</A>
            <DT><A HREF="http://healthmad.com/alternative/how-to-lance-boils-and-cysts-at-home/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to Lance Boils and Cysts at Home  HealthMad.url</A>
            <DT><A HREF="http://firstaid.about.com/od/firstaidbasics/ht/07_splinter.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >How to Remove a Splinter - Splinter Removal - Removing a Splinter.url</A>
            <DT><A HREF="http://www.livestrong.com/infected-splinter/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Infected Splinter  LIVESTRONG.COM.url</A>
            <DT><A HREF="http://www.tylerhameldc.com/heal.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Pinnacle Health & Wellness - Can the Body Heal Itself.url</A>
            <DT><A HREF="http://firstaid.webmd.com/splinters-treatment" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Splinters Treatment First Aid Information for Splinters.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=treat+infected+sliver" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >treat infected sliver - Google Search.url</A>
            <DT><A HREF="http://wiki.answers.com/Q/Will_epsom_salt_draw_out_infection" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >WikiAnswers - Will epsom salt draw out infection.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">TOXINS & CHEMICALS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Aspartame (NutraSweet)</H3>
            <DL><p>
                <DT><A HREF="http://aspartame.ca/page_a2a.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >ASPARTAME - THE SILENT KILLER.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">WATER</H3>
        <DL><p>
            <DT><A HREF="http://www.ewg.org/tap-water/welcome" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >EWG's Drinking Water Quality Analysis and Tap Water Database.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_HISTORY</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">BRITTANIA</H3>
        <DL><p>
            <DT><A HREF="http://www.electricscotland.com/history/domestic/chiefs/preface2.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Scottish Chiefs - Preface to a Subsequent Edition.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">JEWS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Alois_Hitler" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Alois Hitler - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/History_of_Zionism" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >History of Zionism - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.jewwatch.com/index.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Jew Watch News.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Jewish_question" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Jewish question - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Jewish_refugees" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Jewish refugees - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.straightdope.com/columns/read/797/was-hitler-part-jewish" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Straight Dope Was Hitler part Jewish.url</A>
            <DT><A HREF="http://www.worldoftak.nl/forum/showthread.php?tid=71" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Zionist Mafia The Kosher Nostra Scam.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">NAZIS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1299565595">Hitler Christian Or Atheist</H3>
            <DL><p>
                <DT><A HREF="http://www.infidels.org/library/historical/unknown/hitler.html" ADD_DATE="1299565604" LAST_VISIT="1322361174" LAST_MODIFIED="1299565604" >Hitler's Religion.url</A>
                <DT><A HREF="http://answers.org/apologetics/hitquote.html" ADD_DATE="1299565615" LAST_VISIT="1322361174" LAST_MODIFIED="1299565615" >Was Hitler a Christian.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Legal System & Government</H3>
            <DL><p>
                <DT><A HREF="http://atheism.about.com/od/bookreviews/fr/HitlersJustice_2.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Courts of the Third Reich Nazi Justice in Democratic West Germany.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Volksgerichtshof" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >People's Court (Germany) - Wikipedia, the free encyclopedia.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1299525560">SOUTH USA & CONFEDERACY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1299525575">Confederate Rebel Flag</H3>
            <DL><p>
                <DT><A HREF="http://www.fgfbooks.com/Mills-Charles/2010/Mills100729.html" ADD_DATE="1299525614" LAST_VISIT="1322361174" LAST_MODIFIED="1299525614" >07-29-10 Mills.url</A>
                <DT><A HREF="http://alterdestiny.blogspot.com/2007/08/vilification-of-language.html" ADD_DATE="1299525603" LAST_VISIT="1322361174" LAST_MODIFIED="1299525603" ICON_URI="http://alterdestiny.blogspot.com/favicon.ico" >alterdestiny The Vilification of Language.url</A>
                <DT><A HREF="http://www.freerepublic.com/focus/f-news/1013548/posts" ADD_DATE="1299533309" LAST_VISIT="1322361174" LAST_MODIFIED="1299533309" ICON_URI="http://www.freerepublic.com/l/favicon.ico" >Black man supports Confederate flag in march.url</A>
                <DT><A HREF="http://forum.beyond3d.com/archive/index.php/t-7504.html" ADD_DATE="1299525579" LAST_VISIT="1322361174" LAST_MODIFIED="1299525579" ICON_URI="http://forum.beyond3d.com/favicon.ico" >Confederate Flag = Racist [Archive] - Beyond3D Forum.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Flags_of_the_Confederate_States_of_America#Third_national_flag_.28.22the_Blood_Stained_Banner.22.29" ADD_DATE="1299527556" LAST_VISIT="1322361174" LAST_MODIFIED="1299527557" ICON_URI="http://en.wikipedia.org/favicon.ico" >Flags of the Confederate States of America - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.scvcamp469-nbf.com/OriginofConfederateBattleflag.htm" ADD_DATE="1299525632" LAST_VISIT="1322361174" LAST_MODIFIED="1299525632" >Origin of the Confederate Battleflag.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=story+of+rebel+flag" ADD_DATE="1299525680" LAST_VISIT="1322361174" LAST_MODIFIED="1299525680" ICON_URI="http://www.google.com/favicon.ico" >story of rebel flag - Google Search.url</A>
                <DT><A HREF="http://www.onenewsnow.com/Legal/Default.aspx?id=1248292" ADD_DATE="1299525589" LAST_VISIT="1322361174" LAST_MODIFIED="1299525589" >Student vilified by homosexuals, seeks legal help (OneNewsNow.com).url</A>
                <DT><A HREF="http://socyberty.com/religion/three-religious-symbols-whose-meanings-have-changed-with-time/" ADD_DATE="1299525785" LAST_VISIT="1322361174" LAST_MODIFIED="1299525785" ICON_URI="http://s3.amazonaws.com/readers/socyberty/favicon.ico" >Three Religious Symbols Whose Meanings Have Changed with Time  Socyberty.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=villification+of+the+confederate+flag" ADD_DATE="1299525623" LAST_VISIT="1322361174" LAST_MODIFIED="1299525623" ICON_URI="http://www.google.com/favicon.ico" >villification of the confederate flag - Google Search.url</A>
                <DT><A HREF="http://www.civilwarnews.com/archive/articles/edgerton.htm" ADD_DATE="1299532865" LAST_VISIT="1322361174" LAST_MODIFIED="1299532865" >When The Flag's Under Attack Look For H.K. Edgerton.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=_GVIAypsnh8&feature=related" ADD_DATE="1299525660" LAST_VISIT="1322361174" LAST_MODIFIED="1299525660" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - A Tribute To Our Black Confederate Heroes.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=o8hPo6mYnks" ADD_DATE="1299525671" LAST_VISIT="1322361174" LAST_MODIFIED="1299525671" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Black Confederate.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=Um9yHU2ahOc&feature=related" ADD_DATE="1299525650" LAST_VISIT="1322361174" LAST_MODIFIED="1299525650" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Black Confederates honors.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=S14tUQbHlJI&feature=related" ADD_DATE="1299525642" LAST_VISIT="1322361174" LAST_MODIFIED="1299525642" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Neo Black Confederates.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">USA</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">McCarthyism, Red Scare, & Blacklisting</H3>
            <DL><p>
                <DT><A HREF="http://books.google.com/books?id=VCE_7C6YnboC&pg=PA125&dq=david+merrill+testimony+house+un+american#v=onepage&q=david%20merrill%20testimony%20house%20un%20american&f=false" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Congressional Theatre Dramatizing ... - Google Books.url</A>
                <DT><A HREF="http://books.google.com/books?id=f7d_iHYIDMcC&pg=PA231&dq=david+merrill+testimony+house+un+american#v=onepage&q=david%20merrill%20testimony%20house%20un%20american&f=false" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Rhetoric and community studies in ... - Google Books.url</A>
            </DL><p>
            <DT><A HREF="http://showcase.netins.net/web/creative/lincoln/speeches/gettysburg.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The Gettysburg Address by Abraham Lincoln.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">WARS</H3>
        <DL><p>
            <DT><A HREF="http://www.historyguy.com/War_list.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >The History Guy The War List.url</A>
        </DL><p>
        <DT><A HREF="http://www.k-web.org/public_html/jbmessage.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Knowledge Web - A message from James Burke.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_HOLIDAYS & CELEBRATIONS</H3>
    <DL><p>
        <DT><A HREF="http://chris.com/ascii/index.php?art=holiday/christmas/santa" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Chris.com - ASCII ART - Christmas - Santa Claus.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_HUMOR</H3>
    <DL><p>
        <DT><A HREF="http://www.partyvan.info/wiki/Main_Page" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >-i-nsurgency W-i-ki.url</A>
        <DT><A HREF="http://www.humorsphere.com/sms/one_liners.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >101 One Liners.url</A>
        <DT><A HREF="http://www.fark.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Drew Curtis' FARK.com.url</A>
        <DT><A HREF="http://www.google.com/imgres?imgurl=http://cnsdev.dk/hosted/Loof/Motivational%2520Posters/4chan%25205.jpg&imgrefurl=http://cnsdev.dk/hosted/Loof/Motivational%2520Posters/&usg=__KPkVCs_VHIFkf4wrbeQdyLD9ip8=&h=600&w=750&sz=66&hl=en&start=4&um=1&itbs=1&tbnid=-6L" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Google Image Result for http--cnsdev.dk-hosted-Loof-Motivational%20Posters-4chan%205.jpg.url</A>
        <DT><A HREF="http://cnsdev.dk/hosted/Loof/Motivational%20Posters/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Index of -hosted-Loof-Motivational Posters.url</A>
        <DT><A HREF="http://www.boneyourmother.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Lick  Funny random pictures.url</A>
        <DT><A HREF="http://www.theonion.com/articles/new-delicious-species-discovered,1331/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >New, Delicious Species Discovered  The Onion - America's Finest News Source.url</A>
        <DT><A HREF="http://www.somethingawful.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Something Awful The Internet Makes You Stupid.url</A>
        <DT><A HREF="http://hubpages.com/hub/Top-Ten-Ways-to-Piss-Off-Your-Bartender-Part-3" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Top Ten Ways to Piss Off Your Bartender (Part 3).url</A>
        <DT><A HREF="http://hubpages.com/hub/Top-Ten-Ways-to-Piss-Off-Your-Bartender" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Top Ten Ways to Piss Off Your Bartender.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_ICONS</H3>
    <DL><p>
        <DT><A HREF="http://www.howtogeek.com/howto/windows/customizing-your-icons-in-windows-xp/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Customizing Your Icons in Windows XP - How-To Geek.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_IMAGE SHARING</H3>
    <DL><p>
        <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/programmes/from_our_own_correspondent/8652601.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >imgur The Simple Image Sharer  Upload and Host an Image.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_ITUNES</H3>
    <DL><p>
        <DT><A HREF="http://cybernetnews.com/cybernotes-add-album-art-in-itunes/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >cybernotes Add Album Art in iTunes.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_JEWELRY</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Men</H3>
        <DL><p>
            <DT><A HREF="http://www.urweg.com/list/hairs.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Handcrafted Celtic, Viking & Scandinavian Hair Barrettes.url</A>
            <DT><A HREF="http://news.bbc.co.uk/go/rss/-/2/hi/south_asia/8655749.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Handcrafted Celtic, Viking &amp; Scandinavian Hair Barrettes.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_KITCHEN & COOKING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Ceramic Knives</H3>
        <DL><p>
            <DT><A HREF="http://www.kyoceraadvancedceramics.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Welcome to Kyocera - Ceramic Consumer Products.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_LANGUAGES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">CHINESE</H3>
        <DL><p>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=2&oq=chinese+charac&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=chinese+characters+and+meanings" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >chinese characters and meanings - Google Search.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">FRENCH</H3>
        <DL><p>
            <DT><A HREF="http://www.syvum.com/cgi/online/serve.cgi/squizzes/french/fssm1/frenchsl4.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >French Translation Lesson 4  Meals - French to English.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">LATIN</H3>
        <DL><p>
            <DT><A HREF="http://www.translation-guide.com/free_online_translators.php?from=Latin&to=English" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Free Online Latin to English Translators.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">SPANISH</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Windows Spanish Characters</H3>
            <DL><p>
                <DT><A HREF="http://tlt.its.psu.edu/suggestions/international/accents/codealt.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Windows Alt Key Codes.url</A>
            </DL><p>
            <DT><A HREF="http://www.wordreference.com/es/translation.asp?tranword=hold" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >hold - English-Spanish Dictionary - WordReference.com.url</A>
            <DT><A HREF="http://www.spanishdict.com/translation" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >SpanishDict  Spanish Translation - Free English Spanish Translator - Traductor ingles espa񯬮url</A>
            <DT><A HREF="http://wiki.answers.com/Q/How_can_an_upside_down_exclamation_point_be_created_using_the_keyboard" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >WikiAnswers - How can an upside down exclamation point be created using the keyboard.url</A>
        </DL><p>
        <DT><A HREF="http://www.dictionarist.com/abideth" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >abideth.url</A>
        <DT><A HREF="http://www.nd.edu/~archives/latgramm.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Latin Dictionary and Grammar Aid.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_LAW</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Employment Law</H3>
        <DL><p>
            <DT><A HREF="http://www.iowaworkforce.org/labor/wageclaimform3096058.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >http--www.iowaworkforce.org-labor-wageclaimform3096058.pdf.url</A>
            <DT><A HREF="http://www.leagle.com/xmlResult.aspx?xmldoc=In%20IACO%2020101124311.xml&docbase=CSLWAR3-2007-CURR" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >OLVER v. TANDEM HCM, INC..url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Intellectual Property</H3>
        <DL><p>
            <DT><A HREF="http://www.plagiarismtoday.com/2010/03/09/3-count-deja-vued/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >3 Count Deja Vu  PlagiarismToday.url</A>
            <DT><A HREF="http://www.newmediarights.org/guide/legal/copyright/citizens_legal_guide_digital_millenium_copyright_act_dmca" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >A citizen's legal guide to the Digital Millenium Copyright Act (DMCA)  New Media Rights.url</A>
            <DT><A HREF="http://torrentfreak.com/category/anti-piracy-gangs/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Anti-Piracy Gangs  TorrentFreak.url</A>
            <DT><A HREF="http://www.securityfocus.com/news/8279" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Anti-piracy vigilantes track file sharers.url</A>
            <DT><A HREF="http://www.baytsp.com/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >BayTSP - Piracy Protection For Your Digital Assets.url</A>
            <DT><A HREF="http://news.cnet.com/8301-10784_3-9925178-7.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >BayTSP to track piracy at YouTube, other video sites  News Blog - CNET News.url</A>
            <DT><A HREF="http://news.bbc.co.uk/2/hi/8004060.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >BBC NEWS  Business  Q&A Pirate Bay verdict.url</A>
            <DT><A HREF="http://news.bbc.co.uk/2/hi/8003799.stm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >BBC NEWS  Technology  Court jails Pirate Bay founders.url</A>
            <DT><A HREF="http://www.zeropaid.com/news/8370/big_media_dmca_notices_guilty_until_proven_innocent/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Big Media DMCA Notices Guilty until proven innocent.url</A>
            <DT><A HREF="http://www.eff.org/cases/capitol-v-foster" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Capitol v. Foster  Electronic Frontier Foundation.url</A>
            <DT><A HREF="http://darkfaqs.boom.ru/SurfSafe.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >DarkFaqs - Surf Safe Basics.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Digital_Millennium_Copyright_Act" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Digital Millennium Copyright Act - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.eff.org/issues/dmca" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >DMCA  Electronic Frontier Foundation.url</A>
            <DT><A HREF="http://www.chillingeffects.org/piracy/faq.cgi" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >FAQ about Piracy or Copyright Infringement -- Chilling Effects Clearinghouse.url</A>
            <DT><A HREF="http://www.thenichestorebuilder.com/i-lost-a-site-due-to-dmca-violation-trademark-infringement.htm" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >I Lost a Site Due to DMCA Violation ֠Trademark Infringement!  Niche Store Builder.url</A>
            <DT><A HREF="http://www.techdirt.com/articles/20070820/111927.shtml" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Is It A DMCA Violation To Tell People To Delete Some Files From Their Hard Drive  Techdirt.url</A>
            <DT><A HREF="http://www.torproject.org/eff/tor-legal-faq.html.en" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Legal FAQ for Tor Relay Operators.url</A>
            <DT><A HREF="http://www.google.com/search?q=newmediarights.org+citizen+legal+guide+to+the+digital+millenium&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >newmediarights.org citizen legal guide to the digital millenium - Google Search.url</A>
            <DT><A HREF="http://www.chillingeffects.org/dmca512/notice.cgi?NoticeID=817" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Notice of Copyright Infringement (Using BitTorrent) -- Chilling Effects Clearinghouse.url</A>
            <DT><A HREF="http://www.pigdog.org/auto/scary_tech/link/2155.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Pigdog Journal (Scary Technology) -- Russian Programmer Imprisoned for DMCA Violations.url</A>
            <DT><A HREF="http://www.guardian.co.uk/music/2009/may/13/pirate-bay-owners" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Pirate Bay owners devise scheme to bankrupt law firm  Music  guardian.co.uk.url</A>
            <DT><A HREF="http://archives.seul.org/or/talk/Dec-2008/msg00292.html" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >re TOS Violation - DMCA Complaint.url</A>
            <DT><A HREF="http://www.slyck.com/forums/viewtopic.php?p=517704&sid=218378e80586f457f8167f4463de961c" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Slyck.com ՠView topic - Pirate Bay owners devise scheme to bankrupt law firm.url</A>
            <DT><A HREF="http://www.chillingeffects.org/dmca512/notice.cgi?NoticeID=1405" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Universal to Cable Subscriber for BitTorrent Use -- Chilling Effects Clearinghouse.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/DMCA/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  DMCA  DMCA.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/DMCA/Exceptions.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  DMCA  Exceptions.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/DMCA/Penalties.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  DMCA  Penalties.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/DMCA/Potential.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  DMCA  Potential Defenses.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/DMCA/Provisions.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  DMCA  Provisions.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/Fair_Use/Factors.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  Fair Use  Fair Use Factors.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/Fair_Use/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  Fair Use  Fair Use.url</A>
            <DT><A HREF="http://depts.washington.edu/uwcopy/Copyright_Law/Fair_Use/Four.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >UW Copyright Connection  Fair Use  Four Factor Test.url</A>
            <DT><A HREF="http://www.binrev.com/forums/index.php/topic/36562-virginia-tech-dmca-violations/" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Virginia Tech DMCA Violations - Binary Revolution Forums.url</A>
            <DT><A HREF="http://importance.corante.com/archives/2005/07/19/wayback_dmca_violations.php" ADD_DATE="1298088101" LAST_VISIT="1322361174" LAST_MODIFIED="1298088101" >Wayback DMCA Violations. The Importance of....url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298826278">JURY DUTY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298826299">If You Missed Jury Duty</H3>
            <DL><p>
                <DT><A HREF="http://books.google.com/books?id=Fdys83jkLGUC&pg=SA23-PA11&lpg=SA23-PA11&dq=how+a+foreperson+is+chosen&source=bl&ots=bnK27ZqgRL&sig=5m5ColXDExCwF0UALe9pbxtceNE&hl=en&ei=DZlqTfvpDIqr8AaEhaSUCw&sa=X&oi=book_result&ct=result&resnum=6&ved=0CCoQ6AEwBQ#v=onepage&q=" ADD_DATE="1298831792" LAST_VISIT="1322361174" LAST_MODIFIED="1298831792" ICON_URI="http://books.google.com/favicon.ico" >A handbook of jury research - Google Books.url</A>
                <DT><A HREF="http://books.google.com/books?id=dbdQf0P05ZkC&pg=RA1-PA135&lpg=RA1-PA135&dq=how+a+foreperson+is+chosen&source=bl&ots=Gb8pM3uE95&sig=_yghpch5QSkyFZ3kF3tPRrGu3sI&hl=en&ei=8JxqTdGYMY-u8Aajg_WlCw&sa=X&oi=book_result&ct=result&resnum=7&ved=0CDAQ6AEwBjgK#v=onepage&" ADD_DATE="1298832909" LAST_VISIT="1322361174" LAST_MODIFIED="1298832909" ICON_URI="http://books.google.com/favicon.ico" >Angles on Applied Psychology - Google Books.url</A>
                <DT><A HREF="http://fija.org/" ADD_DATE="1298830244" LAST_VISIT="1322361174" LAST_MODIFIED="1298830244" ICON_URI="http://fija.org/wp-content/themes/traveller/favicon.ico" >Fully Informed Jury Association.url</A>
                <DT><A HREF="http://www.ehow.com/how_4752401_getting-trouble-missing-jury-duty.html" ADD_DATE="1298826303" LAST_VISIT="1322361174" LAST_MODIFIED="1298826303" ICON_URI="http://ui.ehowcdn.com/images/favicon.ico" >How to Avoid Getting Into Trouble for Missing Jury Duty  eHow.com.url</A>
                <DT><A HREF="http://www.associatedcontent.com/article/472381/how_to_be_a_good_jury_foreperson.html?cat=17" ADD_DATE="1298832438" LAST_VISIT="1322361174" LAST_MODIFIED="1298832438" ICON_URI="http://www.associatedcontent.com/favicon.ico" >How to Be a Good Jury Foreperson - Associated Content from Yahoo! - associatedcontent.com.url</A>
                <DT><A HREF="http://www.associatedcontent.com/article/472381/how_to_be_a_good_jury_foreperson_pg2.html?cat=17" ADD_DATE="1298832598" LAST_VISIT="1322361174" LAST_MODIFIED="1298832598" ICON_URI="http://www.associatedcontent.com/favicon.ico" >How to Be a Good Jury Foreperson, Page 2 of 2 - Associated Content from Yahoo! - associatedcontent.com.url</A>
                <DT><A HREF="http://www.fija.org/docs/JG_Jurors_Handbook.pdf" ADD_DATE="1298830567" LAST_VISIT="1322361174" LAST_MODIFIED="1298830567" >http--www.fija.org-docs-JG_Jurors_Handbook.pdf.url</A>
                <DT><A HREF="http://books.google.com/books?id=V4mq0fdSulAC&pg=PA150&lpg=PA150&dq=how+to+be+elected+jury+foreperson&source=bl&ots=ViRPuNosIs&sig=4wBHZqeTSvHfE1uaPybMXqrNyIY&hl=en&ei=sZVqTc7-BMP98AbcusieCw&sa=X&oi=book_result&ct=result&resnum=6&ved=0CCsQ6AEwBQ#v=onepage&q=h" ADD_DATE="1298832312" LAST_VISIT="1322361174" LAST_MODIFIED="1298832312" ICON_URI="http://books.google.com/favicon.ico" >Psychology and law a critical ... - Google Books.url</A>
                <DT><A HREF="http://www.funtrivia.com/en/Movies/Runaway-Jury-12354.html" ADD_DATE="1298831614" LAST_VISIT="1322361174" LAST_MODIFIED="1298831615" ICON_URI="http://www.funtrivia.com/favicon.ico" >Runaway Jury - Fun Facts and Information.url</A>
                <DT><A HREF="http://iowafreedomreport.com/?tag=jury-nullification" ADD_DATE="1298830083" LAST_VISIT="1322361174" LAST_MODIFIED="1298830083" ICON_URI="http://iowafreedomreport.com/wp-content/themes/amerifecta/img/favicon.ico" >Steve Hoodjer's Iowa Freedom Report  jury nullification.url</A>
                <DT><A HREF="http://www.wisegeek.com/what-happens-if-i-forget-to-report-for-jury-duty.htm" ADD_DATE="1298834473" LAST_VISIT="1322361174" LAST_MODIFIED="1298834473" ICON_URI="http://www.wisegeek.com/favicon.ico" >What Happens if I Forget to Report for Jury Duty.url</A>
                <DT><A HREF="http://www.astcweb.org/public/publication/article.cfm/1/22/6/What-the-literature-tells-us-about-the-jury-foreperson" ADD_DATE="1298828873" LAST_VISIT="1322361174" LAST_MODIFIED="1298828873" >What the literature tells us about the jury foreperson - The Jury Expert.url</A>
            </DL><p>
            <DT><A HREF="http://books.google.com/books?id=dbdQf0P05ZkC&pg=RA1-PA135&lpg=RA1-PA135&dq=how+a+foreperson+is+chosen&source=bl&ots=Gb8pM3uE95&sig=_yghpch5QSkyFZ3kF3tPRrGu3sI&hl=en&ei=8JxqTdGYMY-u8Aajg_WlCw&sa=X&oi=book_result&ct=result&resnum=7&ved=0CDAQ6AEwBjgK#v=onepage&" ADD_DATE="1298834535" LAST_VISIT="1322361175" LAST_MODIFIED="1298834535" ICON_URI="http://books.google.com/favicon.ico" >Angles on Applied Psychology - Google Books.url</A>
            <DT><A HREF="http://juryargument.homestead.com/Sample4.html" ADD_DATE="1298834515" LAST_VISIT="1322361175" LAST_MODIFIED="1298834515" >Jury Arguments re Jury Deliberation.url</A>
            <DT><A HREF="http://www.jurysync.com/" ADD_DATE="1298834505" LAST_VISIT="1322361175" LAST_MODIFIED="1298834505" ICON_URI="http://www.jurysync.com/favicon.ico" >Jurysync   Litigation Consulting.url</A>
            <DT><A HREF="http://www.designedthinking.com/Workshops/Law/law.html" ADD_DATE="1298834564" LAST_VISIT="1322361175" LAST_MODIFIED="1298834564" >Law & NLP, psychology of influence, jury selection judicial hypnosis.url</A>
            <DT><A HREF="http://vimeo.com/5735073" ADD_DATE="1298833147" LAST_VISIT="1322361175" LAST_MODIFIED="1298833147" ICON_URI="http://vimeo.com/favicon.ico" >Opinion Search's Mock Juries on Vimeo.url</A>
            <DT><A HREF="http://books.google.com/books?id=V4mq0fdSulAC&pg=PA150&lpg=PA150&dq=how+to+be+elected+jury+foreperson&source=bl&ots=ViRPuNosIs&sig=4wBHZqeTSvHfE1uaPybMXqrNyIY&hl=en&ei=sZVqTc7-BMP98AbcusieCw&sa=X&oi=book_result&ct=result&resnum=6&ved=0CCsQ6AEwBQ#v=onepage&q=h" ADD_DATE="1298834527" LAST_VISIT="1322361175" LAST_MODIFIED="1298834527" ICON_URI="http://books.google.com/favicon.ico" >Psychology and law a critical ... - Google Books.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=psychology+of+jur&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=psychology+of+juries" ADD_DATE="1298834551" LAST_VISIT="1322361175" LAST_MODIFIED="1298834551" ICON_URI="http://www.google.com/favicon.ico" >psychology of juries - Google Search.url</A>
            <DT><A HREF="http://www.trialjuries.com/trialjuries/" ADD_DATE="1298834496" LAST_VISIT="1322361175" LAST_MODIFIED="1298834496" >Welcome to TrialJuries -- Online Jury Review.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=XLTg8iNHrv4&feature=related" ADD_DATE="1298833581" LAST_VISIT="1322361175" LAST_MODIFIED="1298833581" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Jury Selection Tips.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=ZTksq0Z6LnQ&feature=related" ADD_DATE="1298833726" LAST_VISIT="1322361175" LAST_MODIFIED="1298833726" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Jury Selection What Should You Ask.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=_SqAu9RAfFw" ADD_DATE="1298833203" LAST_VISIT="1322361175" LAST_MODIFIED="1298833203" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Opinions Search's Mock Jury.url</A>
        </DL><p>
        <DT><A HREF="http://www.zeropaid.com/news/8370/big_media_dmca_notices_guilty_until_proven_innocent/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Big Media DMCA Notices Guilty until proven innocent.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MAKING MONEY WITH ADVERTISING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Wordpress</H3>
        <DL><p>
            <DT><A HREF="http://en.support.wordpress.com/advertising/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Advertising ˠSupport נWordPress.com.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MAN STUFF</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">MEN'S MAGAZINES</H3>
        <DL><p>
            <DT><A HREF="http://www.manofest.com/Content/25-shocking-celebrities-before-and-after-plastic-surgery.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >25 Celebrities Before And After Plastic Surgery  Content.url</A>
            <DT><A HREF="http://www.manofest.com/Galleries/Celebrity/25-Amazing-Celebrities-Before-And-After-Plastic-Surgery/stars_plastic_surgery_46-6936.html#joomimg" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Galleries - 25 Amazing Celebrities Before And After Plastic Surgery - stars_plastic_surgery_46#.url</A>
            <DT><A HREF="http://www.manolith.com/2010/06/01/hurt-locker-producer-sues-bittorrent-users/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Hurt Locker Producer Sues BitTorrent Users  Manolith.url</A>
            <DT><A HREF="http://www.geeksaresexy.net/2010/06/01/the-history-of-rickrolling-infographic/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The History of Rickrolling [Infographic].url</A>
            <DT><A HREF="http://www.geeksaresexy.net/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >[Geeks are Sexy] Technology News - We make technology sexy!.url</A>
        </DL><p>
        <DT><A HREF="http://cfcamerica.org/index.php?option=com_content&view=article&id=1386:little-did-i-know-she-was-only-16-years-old&catid=67:letters-to-the-editor&Itemid=285" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Little did I know, She was Only 16 years old..url</A>
        <DT><A HREF="http://www.gadget-blog.co.uk/news/raytheon-anti-aircraft-laser-showcased/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Raytheon anti-aircraft laser showcased  News  Gadget Reviews.url</A>
        <DT><A HREF="http://www.mademan.com/best-inflatable-hot-tub/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Best Inflatable Hot Tub.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MARIJUANA</H3>
    <DL><p>
        <DT><A HREF="http://www.bcnorthernlights.com/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Grow Box  Hydroponic Systems  Indoor Grow Boxes.url</A>
        <DT><A HREF="http://boards.cannabis.com/introduce-yourself/54410-pot-smoking-gnome-bc.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Pot Smoking Gnome from BC - Cannabis Forums Message Boards - Medical Marijuana, Cannabis Club, .url</A>
        <DT><A HREF="http://www.shabong.com/" ADD_DATE="1302710001" LAST_VISIT="1322361175" LAST_MODIFIED="1302710001" ICON_URI="http://www.shabong.com/templates/yoo_enterprise/favicon.ico" >Shabong.com - A Medical Marijuana Community Colorado California Michigan Dispensary Listings.url</A>
        <DT><A HREF="http://www.thehemperor.net/politics.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Hemperor.url</A>
        <DT><A HREF="http://www.tokeofthetown.com/2010/07/marijuana_church_founder_called_too_dangerous_for.php" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Toke of the Town - Marijuana Church Founder Called 'Too Dangerous' For Bail.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MARTIAL ARTS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Blogs</H3>
        <DL><p>
            <DT><A HREF="http://betterfly.com/category/martial-arts-and-combat-sports?utm_source=facebookad&utm_medium=cpc&utm_campaign=martialarts112-18-10-22" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Find a Martial Arts and Combat Sports Betterist to help you learn, look & feel better  Betterfl.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">DEFINITIONS</H3>
        <DL><p>
            <DT><A HREF="http://www.superiormartialarts.com/cgi-bin/dictionary/dictionary.cgi?ACTION=SHOWLETTER&LETTER=S" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Superior Martial Arts Dictionary.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">IA - Waterloo Area</H3>
        <DL><p>
            <DT><A HREF="http://www.oxf-usa.com/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >O'Connell Extreme Fitness  Official Website.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">LONG HAIR AND MARTIAL ARTS</H3>
        <DL><p>
            <DT><A HREF="http://www.sherdog.net/forums/f12/bjj-long-hair-727951/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >BJJ and long hair - Sherdog Mixed Martial Arts Forums.url</A>
            <DT><A HREF="http://www.hairboutique.com/tips/tip169.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Hair and Self Defense (Martial Arts).url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=hair+scroos" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >hair scroos - Google Search.url</A>
            <DT><A HREF="http://www.martialartsplanet.com/forums/archive/index.php/t-16135.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Long Hair [Archive] - Martial Arts Planet.url</A>
            <DT><A HREF="http://community.livejournal.com/longhair/2865926.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >longhair Long Hair for Martial Arts.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=martial+artists+with+long+hair%3f" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >martial artists with long hair - Google Search.url</A>
            <DT><A HREF="http://archive.longhaircommunity.com/showthread.php?t=59649" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Long Hair Community - Martial Arts style.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">POSTERS</H3>
        <DL><p>
            <DT><A HREF="https://www.playwell.co.uk/index.php?main_page=advanced_search_result&search_in_description=1&zenid=a9e2cd3b17e311660205507866f6c2af&keyword=poster&Search.x=20&Search.y=11" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Search Results  Playwell, Martial Arts.url</A>
        </DL><p>
        <DT><A HREF="http://www.closequarterscombatnewyork.com/Rochester-Self-Defense.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Rochester Self Defense.url</A>
        <DT><A HREF="http://video.google.com/videosearch?sourceid=navclient&rlz=1T4SUNA_enUS294US296&q=learn%20to%20defend%20yourself%20in%20an%20unfair%20fight%3F&um=1&ie=UTF-8&sa=N&hl=en&tab=wv#q=self+defense++in+close+quarters&hl=en&emb=0&start=10" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >self defense in close quarters - Google Videos.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MEMES</H3>
    <DL><p>
        <DT><A HREF="http://knowyourmeme.com/memes/keanu-is-sad-sad-keanu" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Keanu Is Sad-Sad Keanu  Know Your Meme.url</A>
        <DT><A HREF="http://www.geeksaresexy.net/2010/06/01/the-history-of-rickrolling-infographic/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The History of Rickrolling [Infographic].url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MONEY & FINANCE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">SHOPPING</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Food</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Apple Cider</H3>
                <DL><p>
                    <DT><A HREF="http://zeiglers.com/products/Organic-Apple-Cider" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Zeigler's Organic Apple Cider.url</A>
                </DL><p>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">TAXES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">W-2's</H3>
            <DL><p>
                <DT><A HREF="http://www.ehow.com/how_2273571_access-w2-online.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How to Access a W-2 Online  eHow.com.url</A>
            </DL><p>
        </DL><p>
        <DT><A HREF="http://www.nodebtplan.net/2009/12/26/go-radical-sell-everything/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Go Radical Sell Everything  No Debt Plan.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MOTIVATION & GOALS</H3>
    <DL><p>
        <DT><A HREF="http://www.buy-and-sell-cars-for-profit.com/blog/best-new-years-advice/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Best New Years GET OFF YOUR FAT ASS Advice  Buy And Sell Cars For Profit!.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MS OFFICE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">EXCEL</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Remove Characters</H3>
            <DL><p>
                <DT><A HREF="http://office.microsoft.com/en-us/excel-help/remove-characters-from-text-HP003056120.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Remove characters from text - Excel - Microsoft Office.url</A>
                <DT><A HREF="http://thedailyreviewer.com/office/view/remove-first-10-characters-107337867" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Remove First 10 Characters  TheDailyReviewer.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Uppercase First Letter</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?hl=en&expIds=17259,26696,27493,27586&sugexp=ldymls&xhr=t&q=excel+uppercase+formula+first+letter&cp=36&pf=p&sclient=psy&client=firefox-a&hs=bRB&rls=org.mozilla:en-US%3Aofficial&aq=f&aqi=&aql=&oq=excel+uppercase+formula+first+letter" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >excel uppercase formula first letter - Google Search.url</A>
            </DL><p>
            <DT><A HREF="http://www.excelforum.com/excel-general/605094-append-characters.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Append characters - Excel Help Forum.url</A>
            <DT><A HREF="http://www.eggheadcafe.com/forumarchives/Excelworksheetfunctions/Dec2005/post25546319.asp" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >excel worksheet functions Escape character for double quotes.url</A>
            <DT><A HREF="http://www.ehow.com/how_2209775_use-excels-substitute-function.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How to Use Excel's SUBSTITUTE Function  eHow.com.url</A>
            <DT><A HREF="http://www.techonthenet.com/excel/formulas/char.php" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >MS Excel Char Function.url</A>
            <DT><A HREF="http://www.mrexcel.com/forum/showthread.php?t=84358" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >sort by row - MrExcel Message Board.url</A>
            <DT><A HREF="http://www.tipstechtricks.com/2010/10/how-to-use-escape-characters-in-excel.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Tips Tech Tricks How to Use Escape Characters in Excel.url</A>
            <DT><A HREF="http://www.mrexcel.com/forum/showthread.php?t=66289" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Warning about Illegal Characters - MrExcel Message Board.url</A>
        </DL><p>
        <DT><A HREF="http://office.microsoft.com/en-us/excel/HP012163831033.aspx" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Change the column width and row height - Excel - Microsoft Office Online.url</A>
        <DT><A HREF="http://accurapid.com/journal/15msw.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >MS Word's Advanced Find and Replace Function.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088101">_MUSIC</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">AMPS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1299249696">Cleaning</H3>
            <DL><p>
                <DT><A HREF="http://www.ehow.com/how_2040321_clean-guitar-amplifier.html" ADD_DATE="1299249700" LAST_VISIT="1322361175" LAST_MODIFIED="1299249700" ICON_URI="http://ui.ehowcdn.com/images/favicon.ico" >How to Clean a Guitar Amplifier  eHow.com.url</A>
                <DT><A HREF="http://www.thegearpage.net/board/showthread.php?t=581310" ADD_DATE="1299250301" LAST_VISIT="1322361175" LAST_MODIFIED="1299250301" ICON_URI="http://www.thegearpage.net/favicon.ico" >OK to use ArmorAll to clean vintage Ampeg tolex - The Gear Page.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=FmJITO76cs8" ADD_DATE="1299250486" LAST_VISIT="1322361175" LAST_MODIFIED="1299250486" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Restoring and servicing a trashed vintage amplifier.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">CRATE</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Blue Voodoo</H3>
                <DL><p>
                    <DT><A HREF="http://www.petrucciforum.com/forums/archive/index.php?t-15764.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Crate Blue Voodoo vs. Marshall DSL 100 [Archive] - John Petrucci Forums.url</A>
                    <DT><A HREF="http://www.guitarlodge.com/archive/index.php/t-16366.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Crate Blue Voodoo vs. Marshall JCM800 for 80's hair metal [Archive] - GuitarLodge.com Guitar & .url</A>
                    <DT><A HREF="http://acapella.harmony-central.com/showthread.php?2706890-Marshall-AVT275-vs-Blue-Voodoo&p=41500992" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Marshall AVT275 vs Blue Voodoo.url</A>
                    <DT><A HREF="http://www.jcfonline.com/threads/114781-Peavey-Valveking-VS.Crate-BlueVoodoo-120H" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Peavey Valveking VS.Crate BlueVoodoo 120H.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=i9ZIHOQtGxY" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Crate Blue Voodoo Head!.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=rDIQpSm7ymA" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Crate Blue Voodoo...great amp for cheap!.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=6B9orq8T1iE&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Ibanez and Crate Blue Voodoo Tryout.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=enVbP9H_aiQ&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - kill 'em all riffs on a crate blue voodoo.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">GUIDES AND REVIEWS</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">BUYING GUIDES & TIPS</H3>
                <DL><p>
                    <DT><A HREF="http://factoidz.com/10-tips-for-buying-an-amplifier-to-your-guitar/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >10 Tips For Buying an Amplifier to Your Guitar.url</A>
                    <DT><A HREF="http://www.mahalo.com/answers/any-tips-on-buying-a-used-guitar-amp" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Any tips on buying a used guitar amp.url</A>
                    <DT><A HREF="http://guitar.about.com/cs/brandsofamps/a/buying_an_amp.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Buying an Amplifier - finding the best guitar amp at the best price.url</A>
                    <DT><A HREF="http://www.sweetwater.com/shop/guitars/guitar-amps/buying-guide.php" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Guitar Amp Buying Guide.url</A>
                    <DT><A HREF="http://www.acousticguitarforum.com/forums/showthread.php?t=19861" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >On buying a used tube amp.... - The Acoustic Guitar Forum.url</A>
                    <DT><A HREF="http://acapella.harmony-central.com/showthread.php?1490894-Questions-to-ask-when-buying-a-used-amp" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Questions to ask when buying a used amp.url</A>
                    <DT><A HREF="http://ezinearticles.com/?Used-Guitar-Amps---A-Buyers-Guide&id=5689880" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Used Guitar Amps - A Buyer's Guide.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">ORANGE TINY TERROR</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=fuo7j4jqifA&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Buying Guide for Orange Tiny Terror Guitar Combo Amp.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">TUBES</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=LZpSVQwB2HQ" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Guitar amplifier output tubes or power tube lesson Marshall Fender Crate Mesa Badcat .url</A>
                </DL><p>
                <DT><A HREF="http://www.musicradar.com/tuition/guitars/12-best-amps-for-heavy-metal-222150" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >12 best amps for heavy metal  MusicRadar.com.url</A>
                <DT><A HREF="https://store.bluebookinc.com/InstantAccess/Model.aspx?product=1&id=440" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Blue Book Publications - Online Subscription - Model.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Guitar_amplifier" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Guitar amplifier - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.wikihow.com/Choose-a-Guitar-Amplifier-for-Rock-Music" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How to Choose a Guitar Amplifier for Rock Music - wikiHow.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Marshall_Amplifiers" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Marshall Amplification - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://cgi.ebay.com/Vox-Custom-Classic-AC30-AC30VR-Amplifier-Amp-2x12-/320637561624?pt=LH_DefaultDomain_0&hash=item4aa77ceb18" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Vox Custom Classic AC30 AC30VR Amplifier Amp 2x12 - eBay (item 320637561624 end time Jan-10-11 .url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">LINE-6</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">FBV Floorboard</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=zTvN9HhTYqI&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Line 6 FBV Floorboard Mk 2 & Spider 4 editing - Nevada Music UK.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">FBV Shortboard</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=fVdP10H8wvw&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Fade To Black guitar loop Line 6 FBV Shortboard pedal.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=rLPix_aJ7i4&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - FBV Shortboard Pedal Flaw in Sun.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=0Hg9tkPZISE" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Line 6 Spider III 75w Jam-Test with new FBV ShortBoard.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=n3P6yBYFkS8&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Quick Loop - Spider IV  Line 6.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Spider III</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=uvlZHn0J7RA&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Buying Guide for Line6 spider III 15 Guitar Combo Amp.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Spider Jam</H3>
                <DL><p>
                    <DT><A HREF="http://www.clarkbakermusic.com/line6.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >ClarkBakerMusic.com - Line-6.url</A>
                    <DT><A HREF="http://line6.com/community/thread/37333" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >community How can I access more than 4 tones with....url</A>
                    <DT><A HREF="http://line6.com/community/thread/17017" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >community Spider Jam and FBV Shortboard MKII.url</A>
                    <DT><A HREF="http://line6.com/data/l/0a060072178e54aa1904ecce5c/application/pdf/FBV%20Control%20Application%20Basic%20User%20Guide%20(Rev%20B)%20-%20English.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >FBV Control Application Basic User Guide (Rev B) - English.pdf.url</A>
                    <DT><A HREF="http://line6.com/data/l/0a06000fe62d44e39827abedd/application/pdf/FBV%20User%20Manual%20-%20English.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >FBV User Manual - English.pdf.url</A>
                    <DT><A HREF="http://line6.com/data/l/0a060072160544a85908a34020/application/pdf/FBV%20MkII%20Series%20Pilot's%20Guide%20(Rev%20C)%20-%20English.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >http--line6.com-data-l-0a060072160544a85908a34020-application-pdf-FBV%20MkII%20Series%20Pilot's.url</A>
                    <DT><A HREF="http://answers.yahoo.com/question/index?qid=20090406060521AANrWwb" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Is the spider jam compatible with Line 6 FBV2 Footswitch - Yahoo! Answers.url</A>
                    <DT><A HREF="http://cgi.ebay.com/Line-6-Spider-Jam-1x12-75-watt-Combo-/160534318322?pt=LH_DefaultDomain_0&hash=item2560974cf2" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Line 6 Spider Jam 1x12'' 75 watt Combo - eBay (item 160534318322 end time Jan-18-11 142422 PST).url</A>
                    <DT><A HREF="http://cgi.ebay.com/Line-6-Spider-Jam-1x12-75-watt-Combo-Foot-board-/140498452321?pt=LH_DefaultDomain_0&hash=item20b65c3f61" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Line 6 Spider Jam 1x12'' 75 watt Combo With Foot board - eBay (item 140498452321 end time Jan-0.url</A>
                    <DT><A HREF="http://cgi.ebay.com/Line-6-Spider-Jam-75W-1x12-Guitar-Combo-Amp-/200563178737?pt=LH_DefaultDomain_0&hash=item2eb27f3cf1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Line 6 Spider Jam 75W 1x12 Guitar Combo Amp - eBay (item 200563178737 end time Jan-15-11 084507.url</A>
                    <DT><A HREF="http://www.americanmusical.com/Item--i-LIN-SPJAM-LIST?SRC=D0301DT0HAMS0000&utm_source=shopping&utm_medium=feed&" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Line 6 Spider Jam Guitar Combo Amplifier at AmericanMusical.com.url</A>
                    <DT><A HREF="http://cgi.ebay.com/New-Line-6-Spider-Jam-112-Guitar-Combo-75w-1x12-/290376761604?pt=LH_DefaultDomain_0&hash=item439bcdc104" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >New Line 6 Spider Jam 112 Guitar Combo 75w 1x12 - eBay (item 290376761604 end time Jan-10-11 04.url</A>
                    <DT><A HREF="http://line6.com/data/l/0a0600726998490212ba88448/application/pdf/Spider%20Jam%20Advanced%20Guide%20(Rev%20B)%20-%20English.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Spider Jam Advanced Guide (Rev B) - English.pdf.url</A>
                    <DT><A HREF="http://line6.com/data/l/0a0600724a334af318bd2fcd4/application/pdf/Spider%20Jam%20Pilot's%20Guide%20(Rev%20F)%20-%20English.pdf" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Spider Jam Pilot's Guide (Rev F) - English.pdf.url</A>
                    <DT><A HREF="http://line6.com/community/message/53204#53204" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >You can use any normal CAT5 cable. .url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=VHF2tZy7850&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Buying Guide for Line6 Spider Jam Guitar Combo Amp.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=GQbRMEBRWk4&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Line 6 Spider Jam Demo at Portland Music Company.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=_sLErl8QcY8&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Line 6 Spider Jam Guitar Amp Demo.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=iRw1Y1euxfo&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - QUICK How to Record loops, line 6 spider jam amp.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=gNMnIbbL6rw&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Spider jam recording tutorial.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Marshall</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Valvestate VS100 (Combo)</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=DI9RkdEkFtw" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Marshall Valvestate VS100 Combo Demo.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Valvestate VS100 (Head)</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=pNnTwVSlwds" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Marshall Valvestate Vs100 Dethklok Fan song remake, my own solo.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=1MBKqvGGbxM&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Marshall VS100 & Gibson Les Paul custom.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=2NwlH_6ZILk&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Testing my Marshall Valvestate.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1299245420">Packing & Shipping</H3>
            <DL><p>
                <DT><A HREF="http://www.acousticguitarforum.com/forums/showthread.php?t=116422" ADD_DATE="1299246474" LAST_VISIT="1322361175" LAST_MODIFIED="1299246474" ICON_URI="http://www.acousticguitarforum.com/favicon.ico" >Best way to ship an amp - The Acoustic Guitar Forum.url</A>
                <DT><A HREF="http://acapella.harmony-central.com/showthread.php?2729810-How-much-does-it-cost-to-ship-a-big-honkin-combo-amp" ADD_DATE="1299246762" LAST_VISIT="1322361175" LAST_MODIFIED="1299246763" ICON_URI="http://acapella.harmony-central.com/favicon.ico" >How much does it cost to ship a big, honkin combo amp.url</A>
                <DT><A HREF="http://www.rocknrollvintage.com/how-to-pack-an-amp-for-shipment.htm" ADD_DATE="1299246081" LAST_VISIT="1322361175" LAST_MODIFIED="1299246081" ICON_URI="http://www.rocknrollvintage.com/favicon.ico" >How to pack a tube amp for shipment.url</A>
                <DT><A HREF="http://forum.grailtone.com/viewtopic.php?f=12&t=39349" ADD_DATE="1299245432" LAST_VISIT="1322361175" LAST_MODIFIED="1299245432" >The Boogie Board ՠView topic - Amp Packing tutorial (Sticky in classifieds maybe).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">PEAVY</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">ValveKing</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=j2LJIQvwvKw&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Metallica Riffs on ValveKing.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=VywlVf3lE1s&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Pantera Riffs on Valveking.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=6CI117wHoKQ&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Peavey Valveking 112 METAL Demo.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=dD7EoehgpsA" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Peavey ValveKingΠ212 Combo.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">VTM 120</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=PhGw3seP1QI" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - FJA modded Peavey VTM 120 6550's c.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=UsOF5DI-uXw" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Peavey VTM 120.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=T6oJwWJEu1g&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - vtm120 demo.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">VOX AC30</H3>
            <DL><p>
                <DT><A HREF="http://www.voxamps.com/forum/topic.php?id=3376" ADD_DATE="1299276404" LAST_VISIT="1322361175" LAST_MODIFIED="1299276404" >Buying my first AC30 and really need help. To get an vintage one or a new one ˠVOX  Discussion Forums.url</A>
                <DT><A HREF="http://www.gearslutz.com/board/so-much-gear-so-little-time/52630-has-anyone-had-problems-new-vox-ac30.html" ADD_DATE="1299247656" LAST_VISIT="1322361175" LAST_MODIFIED="1299247656" >Has anyone had problems with the new Vox AC30 - Gearslutz.com.url</A>
                <DT><A HREF="http://musicdfw.com/showthread.php?1095-Vox-AC30-craigslist-deal-o-the-week" ADD_DATE="1299247872" LAST_VISIT="1322361175" LAST_MODIFIED="1299247872" ICON_URI="http://musicdfw.com/favicon.ico" >Vox AC30 - craigslist deal o' the week.url</A>
                <DT><A HREF="http://www.officialguitarbuyersguide.com/vox-ac30-custom-classic-common-issues/" ADD_DATE="1299250724" LAST_VISIT="1322361175" LAST_MODIFIED="1299250724" ICON_URI="http://www.officialguitarbuyersguide.com/favicon.ico" >Vox AC30 Custom Classic Common Issues.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=fZyzmZn6gfc&feature=related" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1299247200" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Buying Guide for Vox ac30cc1 Guitar Combo Amp.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=HItu73c_Qhg&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Rob Math, Vox AC30.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=DRCCA3C_OcM&NR=1" ADD_DATE="1299248908" LAST_VISIT="1322361175" LAST_MODIFIED="1299248908" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Vox AC-30 and Fender Stratocaster.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=jI4tuvWAyys" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1299247240" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - VOX AC30 Custom Classic Video Tour and Demo.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=vlG5jgVv-GU" ADD_DATE="1299248640" LAST_VISIT="1322361175" LAST_MODIFIED="1299248640" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - VOX AC30CC Samples.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=iutsK9HJB2Y&NR=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - VOX AC30CC with Dave Kilminster.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Blogs</H3>
        <DL><p>
            <DT><A HREF="http://www.rockband.com/blog/when_everything_goes_wrong" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Gig from Hell What Happens When Everything Goes Wrong -- Blog -- Rock Bandήurl</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">BOOKING VENUES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Publicity & Promotion</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088101">Radio Stations</H3>
                <DL><p>
                    <DT><A HREF="http://www.1021thex.com/pages/localxposure2011.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Local X-posure 2011 - 102.1 The X!.url</A>
                </DL><p>
                <DT><A HREF="http://www.allaccess.com/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Radio Industry News, New Music, Music Promotion, Radio Station Song Charts  AllAccess.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Publicity for My Venues</H3>
            <DL><p>
                <DT><A HREF="http://rock108.com/page.php?form_id=5448" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >ROCK 108 - Unsigned Band Calendar Submission Form.url</A>
            </DL><p>
            <DT><A HREF="http://gig-getter.blogspot.com/2010/10/do-you-interact-with-your-band-booking.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Band Booking Gig-Getter Do You Interact with Your Band Booking Audience.url</A>
            <DT><A HREF="http://jbrickman.wordpress.com/2008/03/23/booking-gigs-for-your-band-checklists-of-things-to-know-and-do/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Booking Gigs for Your Band Checklists Of Things To Know and Do ˠjbrickman.url</A>
            <DT><A HREF="http://musicians.about.com/od/gigsandtouring/ht/smalltowncrowd.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Build a Music Audience in a Small Town - Music Careers and Small Towns.url</A>
            <DT><A HREF="http://www.coverbandbook.com/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Cover Band 101.url</A>
            <DT><A HREF="http://www.gigsalad.com/Music-Groups/Cover-Band" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Cover Bands, Hire a Cover Band.url</A>
            <DT><A HREF="http://www.facebook.com/topic.php?uid=117890234904074&topic=34" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Facebook (8)  Lowering Your Live Band Rates To Get A Gig.url</A>
            <DT><A HREF="http://musicians.about.com/od/beingamusician/ht/getgig.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Get a Gig.url</A>
            <DT><A HREF="http://www.gigmasters.com/CoverBand/Cover-Music-Band.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Hire A Cover Band, Music Covers, Book Cover Bands.url</A>
            <DT><A HREF="http://uk.answers.yahoo.com/question/index?qid=20080804061226AAEtNpV" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How much do bands-artists get paid for doing small gigs - Yahoo! UK & Ireland Answers.url</A>
            <DT><A HREF="http://www.google.com/search?q=How+much+should+bar+bands+charge+in+USA%3F&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How much should bar bands charge in USA - Google Search.url</A>
            <DT><A HREF="http://www.google.com/search?hl=en&rls=com.microsoft%3Aen-us&q=how+much+should+my+band+charge&aq=0&aqi=g1&aql=&oq=how+much+should+my+band+&gs_rfai=" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >how much should my band charge - Google Search.url</A>
            <DT><A HREF="http://www.ehow.com/video_4939758_charge-performing.html?wa%5Fvlsrc=continuous&cp=1&pid=1&wa%5Fvrid=914d7cd7%2D493d%2D479e%2Dbe1d%2Dbe48adbffc42" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How to Charge for Performing Booking a Music Tour  eHow.com.url</A>
            <DT><A HREF="http://mediawebsource.com/howtoget.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How To Get Band Gigs and Shows For Your Band.url</A>
            <DT><A HREF="http://mediawebsource.com/howtoget.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How To Get Band Gigs and Shows For Your Band_01.url</A>
            <DT><A HREF="http://www.inside-the-music-biz.com/getting-gigs/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >How to Get Gigs for Bands  Recording studio Plans ֠Inside The Music Biz.url</A>
            <DT><A HREF="http://www.badearl.com/content/bands" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Earl  For Bands  Booking.url</A>
            <DT><A HREF="http://www.google.com/search?client=firefox-a&rls=org.mozilla%3Aen-US%3Aofficial&channel=s&hl=en&source=hp&q=tips+for+booking+gigs+for+bands&btnG=Google+Search" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >tips for booking gigs for bands - Google Search.url</A>
            <DT><A HREF="http://www.google.com/search?hl=en&client=firefox-a&hs=aYI&rls=org.mozilla%3Aen-US%3Aofficial&q=tips+for+booking+your+cover+band&aq=f&aqi=&aql=&oq=&gs_rfai=" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >tips for booking your cover band - Google Search.url</A>
            <DT><A HREF="http://www.facebook.com/topic.php?uid=95740686900&topic=10875" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Tips on Booking Band for Weddings & Private Events (part II)  Facebook.url</A>
            <DT><A HREF="http://www.crossculturalsolutions.org/countries/latin-america/volunteer-costa-rica.aspx?siteID=Facebook_Costa_Rica" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Volunteer Abroad in Costa Rica with Cross-Cultural Solutions.url</A>
            <DT><A HREF="http://www.google.com/search?q=what+to+say+when+booking+gigs%3F&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >what to say when booking gigs - Google Search.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">CHARTS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/2005_in_heavy_metal_music" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >2005 in heavy metal music - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://scenereleases.info/2010/11/billboard-top-25-rock-songs-27-november-2010.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Billboard Top 25 Rock Songs ֠27 November 2010  Scene Releases.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Number_one_modern_rock_hits_of_1998" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Number one modern rock hits of 1998 - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.rockonthenet.com/archive/1998/bbyearend.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Rock On The Net Billboard Year-End Chart-Toppers 1998.url</A>
            <DT><A HREF="http://theofficialmetalshowmetalblog.blogspot.com/2009/09/heavy-metal-billboard-charts-update.html" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Official Metal Show Metal Blog Heavy Metal Billboard Charts Update.url</A>
            <DT><A HREF="http://modernrock.com/charts/rock_chart_2005.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Top 400 Modern Rock Songs of 2005.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">Contests</H3>
        <DL><p>
            <DT><A HREF="http://1021thex.clearcontests.com/front/OpenContest.asp?Action=Login&SurveyID=109586&zx=556" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Richmond's Rock Station - 102.1 The X! (Deadline Jan 23, 2011).url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088136">CONTRACTS & RIDERS</H3>
        <DL><p>
            <DT><A HREF="http://www.30daysout.com/band-tech-rider/band-tech-rider.htm" ADD_DATE="1298089939" LAST_VISIT="1322361175" LAST_MODIFIED="1298089939" >Band Tech Rider  30DaysOut.url</A>
            <DT><A HREF="http://www.jemsite.com/forums/f27/do-you-have-a-band-rider-61839.html" ADD_DATE="1298088151" LAST_VISIT="1322361175" LAST_MODIFIED="1298088151" ICON_URI="http://www.jemsite.com/favicon.ico" >Do you have a Band Rider - Jemsite.url</A>
            <DT><A HREF="http://articles.chicagotribune.com/1991-01-24/features/9101070607_1_rider-promoters-cellar-door-concerts" ADD_DATE="1298088139" LAST_VISIT="1322361175" LAST_MODIFIED="1298088139" ICON_URI="http://articles.chicagotribune.com/favicon.ico" >For Touring Musicians, Contract `Riders` Make Life Easier - Chicago Tribune.url</A>
            <DT><A HREF="http://articles.chicagotribune.com/1991-01-24/features/9101070607_1_rider-promoters-cellar-door-concerts/2" ADD_DATE="1298090373" LAST_VISIT="1322361175" LAST_MODIFIED="1298090373" ICON_URI="http://articles.chicagotribune.com/favicon.ico" >For Touring Musicians, Contract `Riders` Make Life Easier - Page 2 - Chicago Tribune.url</A>
            <DT><A HREF="http://www.gearslutz.com/board/remote-possibilities-acoustic-music-location-recording/88617-iggy-stooges-tour-rider.html" ADD_DATE="1298091447" LAST_VISIT="1322361175" LAST_MODIFIED="1298091447" >Iggy and The Stooges Tour Rider.. - Gearslutz.com.url</A>
            <DT><A HREF="http://www.thesmokinggun.com/backstage/arena-rock/iggy-pop" ADD_DATE="1298088648" LAST_VISIT="1322361175" LAST_MODIFIED="1298088648" >Iggy Pop BACKSTAGE RIDER  The Smoking Gun.url</A>
            <DT><A HREF="http://www.musicbizacademy.com/directory/copyright.htm" ADD_DATE="1298088167" LAST_VISIT="1322361175" LAST_MODIFIED="1298088167" >Music Copyright, Trademark, Publishing and Entertainment Law Directory.url</A>
            <DT><A HREF="http://sputnikmusic.com/forums/showthread.php?t=278667" ADD_DATE="1298088155" LAST_VISIT="1322361175" LAST_MODIFIED="1298088155" ICON_URI="http://sputnikmusic.com/favicon.ico" >Technical Rider example - Music & Musician Forums.url</A>
            <DT><A HREF="http://www.jemsite.com/forums/f34/use-my-laptop-to-record-live-music-10654.html" ADD_DATE="1298089851" LAST_VISIT="1322361175" LAST_MODIFIED="1298089851" ICON_URI="http://www.jemsite.com/favicon.ico" >Use my laptop to record live music - Jemsite.url</A>
            <DT><A HREF="http://acapella.harmony-central.com/showthread.php?975099-What-band-artist-so-far-had-the-most-DEMANDING-technical-rider" ADD_DATE="1298088145" LAST_VISIT="1322361175" LAST_MODIFIED="1298088145" ICON_URI="http://acapella.harmony-central.com/favicon.ico" >What band-artist so far had the most DEMANDING technical rider.url</A>
            <DT><A HREF="http://answers.yahoo.com/question/index?qid=20061129085152AAhq2Y6" ADD_DATE="1298088159" LAST_VISIT="1322361175" LAST_MODIFIED="1298088160" ICON_URI="http://l.yimg.com/a/i/us/sch/gr/answers_favicon.ico" >What is a band rider and also what is a stage plot - Yahoo! Answers.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298092469">COPYRIGHT LAW</H3>
        <DL><p>
            <DT><A HREF="http://www.nolo.com/products/a-legal-guide-to-web-&-software-development-SFT.html;jsessionid=A33A3FE90414129F5C610078B2DCA1F0" ADD_DATE="1298093496" LAST_VISIT="1322361175" LAST_MODIFIED="1298093496" >A Legal Guide to Web & Software Development by Stephen Fishman - Nolo.url</A>
            <DT><A HREF="http://wowvectors.com/" ADD_DATE="1298092933" LAST_VISIT="1322361175" LAST_MODIFIED="1298092933" ICON_URI="http://wowvectors.com/favicon.ico" >Free Vector Art & Graphics  WOW Vectors.url</A>
            <DT><A HREF="http://www.nolo.com/legal-encyclopedia/getting-permission-publish-ten-tips-29933.html" ADD_DATE="1298093490" LAST_VISIT="1322361175" LAST_MODIFIED="1298093490" >Getting Permission to Publish Ten Tips for Website Managers - Free Legal Information - Nolo.url</A>
            <DT><A HREF="http://www.rockbandaide.com/5468/rbn-artist-interview-loren-dircks-of-guitar-hero-gone-fame/" ADD_DATE="1298094910" LAST_VISIT="1322361175" LAST_MODIFIED="1298094910" ICON_URI="http://www.rockbandaide.com/favicon.ico" >RBN Artist Interview Loren Dircks of ԇuitar Hero GoneԠFame  RockBandAide.url</A>
            <DT><A HREF="http://fairuse.stanford.edu/Copyright_and_Fair_Use_Overview/chapter1/1-b.html" ADD_DATE="1298092940" LAST_VISIT="1322361175" LAST_MODIFIED="1298092940" >Stanford Copyright & Fair Use - The Basics of Getting Permission.url</A>
            <DT><A HREF="http://www.nolo.com/legal-encyclopedia/fair-use-rule-copyright-material-30100.html" ADD_DATE="1298093516" LAST_VISIT="1322361175" LAST_MODIFIED="1298093516" >The 'Fair Use' Rule When Use of Copyrighted Material is Acceptable - Free Legal Information - Nolo.url</A>
            <DT><A HREF="http://www.copyright.gov/help/faq/faq-fairuse.html" ADD_DATE="1298092470" LAST_VISIT="1322361175" LAST_MODIFIED="1298092470" ICON_URI="http://www.copyright.gov/images/favicon_cop.ico" >U.S. Copyright Office - Can I Use Someone Else's Work Can Someone Else Use Mine (FAQ).url</A>
            <DT><A HREF="http://www.copyright.gov/fls/fl102.html" ADD_DATE="1298092475" LAST_VISIT="1322361175" LAST_MODIFIED="1298092476" ICON_URI="http://www.copyright.gov/images/favicon_cop.ico" >U.S. Copyright Office - Fair Use.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">COUNTRY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Chicken Picking</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=s2WQk5M2OCk" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Guitar Tube 2 - Chicken Picking Lesson.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">Heavy Country Music</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US349&q=heavy+country&aq=0&aqi=g3g-m2&aql=&oq=heavy+count" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >heavy country - Google Search.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Hicktown" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Hicktown - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://answers.yahoo.com/question/index;_ylt=Air0P74B3sA3myWRmtqWSyMjzKIX;_ylv=3?qid=20090310211025AAXgMHk" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >What are some heavy metal songs with a country influence on them - Yahoo! Answers.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">COVER SONGS</H3>
        <DL><p>
            <DT><A HREF="http://www.metallicaworld.co.uk/covers.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Metallica Cover Songs.url</A>
            <DT><A HREF="http://savethehumans.com/punkcoverproject/index.shtml#D" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >The Ultimate Punk Rock Cover Song Project.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">EQUIPMENT TUTORIALS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088101">LINE 6</H3>
            <DL><p>
                <DT><A HREF="http://line6.com/community/community/support/videotutorials/?utm_source=July2010news&utm_medium=Email&utm_campaign=P4BttmLink2" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >community Community Video Tutorials.url</A>
                <DT><A HREF="http://line6.com/spidervalvemkii/?utm_source=July2010news&utm_medium=Email&utm_campaign=WeRec3" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >Line 6 - Spider Valve MkII - Amp and Effects Models in a Tube Amplifier.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=iktooH7LHrc" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Guitar Amplifier review Line 6 Spider IV 75 & Gibson SG.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=xV-pHZRydxw" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >YouTube - Line 6 M9 Review.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">FOLK TALES & MYTHS</H3>
        <DL><p>
            <DT><A HREF="http://bolesblues.com/2010/07/11/american-folklore-and-the-blues-black-cat-bone/" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088101" >American Folklore and the Blues Black Cat Bone  Boles Blues.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088101">GIGGING</H3>
        <DL><p>
            <DT><A HREF="http://www.bluesforpeace.com/guitars/gig-from-hell.htm" ADD_DATE="1298088101" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Gig From Hell - Music Humor, Guitar Humor.url</A>
            <DT><A HREF="http://www.rentmyband.com/search_gig.php?gclid=CJvW9KrWt6YCFQS7KgodQSHeJQ" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Rent My Band - Bands For Hire, Booking Agents, Wedding Music, Live Entertainment, Event Planner.url</A>
            <DT><A HREF="http://www.rockband.com/blog/when_everything_goes_wrong" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The Gig from Hell What Happens When Everything Goes Wrong -- Blog -- Rock Bandήurl</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">GUITAR</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">CHORDS</H3>
            <DL><p>
                <DT><A HREF="http://www.hobby-hour.com/guitar/chords.php?chord=d2-fret2" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >D2 Chord on fret 2.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Country</H3>
            <DL><p>
                <DT><A HREF="http://www.250r.us/luther/sound.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Luther Perkins.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298838010">Soloing</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=Squ_vYskY3M&feature=related" ADD_DATE="1298838669" LAST_VISIT="1322361175" LAST_MODIFIED="1298861475" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - five positions of minor pentatonic scale.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=hCYBq8DAJCc&playnext=1&list=PLF21135EEAB1D6881" ADD_DATE="1298838397" LAST_VISIT="1322361175" LAST_MODIFIED="1298838397" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Guitar Basics for Beginners  How to Play Minor Pentatonic Scales on Guitar.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=6c7qkShlhv4" ADD_DATE="1298839826" LAST_VISIT="1322361175" LAST_MODIFIED="1298839826" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Guitar Lesson-Octaves and New Pentatonic Scale Position.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=kyqAPNxSGtE" ADD_DATE="1298839753" LAST_VISIT="1322361175" LAST_MODIFIED="1298839753" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Guitar Lesson-Rock Licks.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=uWxRqtAzzpk&feature=relmfu" ADD_DATE="1298838140" LAST_VISIT="1322361175" LAST_MODIFIED="1298838140" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Learn Guitar - Pentatonic Scale Confusion.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=mxc0RvmwpH4&feature=related" ADD_DATE="1298838014" LAST_VISIT="1322361175" LAST_MODIFIED="1298838014" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Learn Guitar - Pentatonic Scale Patterns - 01.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=n4b1B_IFQpU&feature=related" ADD_DATE="1298838213" LAST_VISIT="1322361175" LAST_MODIFIED="1298838213" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Memorizing the 5 pentatonic shpes.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Tablature & Instruction</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Doobie Brothers</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Long Train Runnin'</H3>
                    <DL><p>
                        <DT><A HREF="http://www.youtube.com/watch?v=gyxOVU95rv8" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Guitar Cover #6 - 'Long Train Runnin' - The Doobie Brothers.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=ETHFjlAJaQA" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How to Play Long Train Runnin' - Pat Simmons' Genius Lick. Pt. 1 of 3.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=BpC0VY7Se2c&NR=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How to Play Long Train Runnin' Part 2 - Pat Simmons' Genius Lick Cont'd.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=6mLvn6fOaeA&NR=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Long Train Runnin' Part 3 - Pat Simmons' Genius Lick.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=B0Zy6qqDmAk&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - [Standard Tuning] Long Train Runnin' - Pat Simmons guitar [+ tab].url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Eagles</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=S-qYrz3QtoA" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Hotel California solo (lead) lesson.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Jimi Hendrix</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Voodoo Chile</H3>
                    <DL><p>
                        <DT><A HREF="http://www.youtube.com/watch?v=4GDFO49j88Y&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - GuitarCam - Voodoo Chile - Always On The Run.url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Joe Walsh</H3>
                <DL><p>
                    <DT><A HREF="http://www.ultimate-guitar.com/tabs/j/joe_walsh/rocky_mountain_way_ver4_tab.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Rocky Mountain Way tab (ver 4) by Joe Walsh @ Ultimate-Guitar.Com.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Lenny Kravitz</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Always On The Run</H3>
                    <DL><p>
                        <DT><A HREF="http://www.youtube.com/watch?v=SYBzu3DJFfU&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Always on the Run Guitar Lesson - Lecci󮠤e Guitarra.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=2YRiZBP87gY&playnext=1&videos=dR8JIcF_j0o&feature=grec_index" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Always On The Run Lesson - Lenny Kravitz-Slash.url</A>
                        <DT><A HREF="http://www.youtube.com/watch?v=4GDFO49j88Y&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - GuitarCam - Voodoo Chile - Always On The Run.url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Rise Against</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Savior</H3>
                    <DL><p>
                        <DT><A HREF="http://www.youtube.com/watch?v=E1WzRd5NSOQ" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Savior - Rise Against - Dual Guitar Cover.url</A>
                    </DL><p>
                </DL><p>
                <DT><A HREF="http://www.250r.us/luther/sound.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Luther Perkins.com.url</A>
                <DT><A HREF="http://betweenthelicks.com/blues-guitar/various-blues-shuffles" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Various Blues Shuffles  Between The Licks  Free Guitar Lessons.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=xbOokmkuTT4" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Basic Blues Shuffle with Eric Madis (Jimmy Reed style).url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=BTT0VP_axt8&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Blues Guitar Lesson (Jimmy Reed Style) Vol. 11.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=PheVL1aS_Ko&NR=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Blues Rock Guitar Lessons - Kings Johnny Winter - Andy Aledort - Hoochie Solo 2.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=w_99eESoauA&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Guitar Lessons - Rick Derringer - Rock n Roll Hoochie Coo.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=03CiprgNv7I" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How to play Big Boss Man intro by Jerry Reed.url</A>
                <DT><A HREF="http://www.heavyashell.com/php/advanced-search.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Jimmy Reed I Ain&#39;t Got You Guitar Lesson @ GuitarInstructor.com.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=sd1vML31kQM" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Jimmy Reed I Ain't Got You Guitar Lesson @ GuitarInstructor.com.url</A>
                <DT><A HREF="http://www.heavyashell.com/search?q=iowa&type=0&popular=2&ordering=0" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Johnny Winter-inspired Jimmy Reed Style Lesson by Al Eck @ GuitarInstructor.com (exce.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">TUNINGS</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">DROP D</H3>
                <DL><p>
                    <DT><A HREF="http://guitar.about.com/od/alternatetunings/ss/alternate_tune_2.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Alternate Tuning Guide - Drop D Tuning - D A D G B E.url</A>
                    <DT><A HREF="http://keithmoore1.wordpress.com/2008/12/11/cool-guitar-songs-in-drop-d-tuning/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Cool Guitar Songs in Drop D TuningŠˠMusic, Movies and Marin County.url</A>
                    <DT><A HREF="http://www.guitarchordsmagic.com/drop-d-tuning.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Drop D Tuning  Nirvana All Apologies  Led Zeppelin Moby Dick.url</A>
                    <DT><A HREF="http://en.wikipedia.org/wiki/Drop_D_tuning" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Drop D tuning - Wikipedia, the free encyclopedia.url</A>
                    <DT><A HREF="http://www.google.com/search?q=how+to+keep+drop+d+in+tune%3F&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >how to keep drop d in tune - Google Search.url</A>
                    <DT><A HREF="http://www.torvund.net/guitar/index.php?page=bl_opend-minorpenta" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Open D-tuning - The Minor Pentatonic Scale.url</A>
                    <DT><A HREF="http://www.guitarzone.com/forum/topic/129676-songs-in-drop-d-tuning/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Songs in Drop D tuning - GuitarZone.com Guitar Discussion Forum and Lessons.url</A>
                    <DT><A HREF="http://www.gearslutz.com/board/instruments-guitar-bass-amps/517468-string-gauge-drop-d-dadgbe.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >String gauge for drop-d (DADGBE) - Gearslutz.com.url</A>
                    <DT><A HREF="http://open-d.blogspot.com/2006/03/songs-i-play-in-open-d-tuning.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The Open-D Tuning Guitar Spot Songs I Play in Open-D Tuning.url</A>
                    <DT><A HREF="http://www.wikihow.com/Tune-Your-Guitar-in-Drop-D" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Tune Your Guitar in Drop D - wikiHow.url</A>
                    <DT><A HREF="http://www.howtotuneaguitar.org/tuning/drop-d/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >What is Drop D Guitar Tuning.url</A>
                </DL><p>
                <DT><A HREF="http://www.howtotuneaguitar.org/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Guitar Tuner @ HowToTuneAGuitar.org.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">IOWA</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Truth & Janey</H3>
            <DL><p>
                <DT><A HREF="http://www.myspace.com/billyleejaney" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >BillyLee Janey on MySpace Music - Free Streaming MP3s, Pictures & Music Downloads.url</A>
                <DT><A HREF="http://www.iowarocknroll.com/inductee-details.php?id=104" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Truth & Janey - 2005 IRRMA Hall of Fame Inductee.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">KARAOKE</H3>
        <DL><p>
            <DT><A HREF="http://www.heavykaraoke.com/index.php?s=blogs&p=products" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Heavykaraoke  Products.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">LABELS & IMPRINTS</H3>
        <DL><p>
            <DT><A HREF="http://top40.about.com/od/popmusic101/tp/majorlabels.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Major Pop Record Labels The Big Four.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">LYRICS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Evergrey</H3>
            <DL><p>
                <DT><A HREF="http://www.lyricsaholic.com/dilba-im-sorry-lyrics.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dilba - I'M SORRY lyrics.url</A>
            </DL><p>
            <DT><A HREF="http://www.bluesforpeace.com/lyrics/big-boss-man.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Big Boss Man Lyrics - Jimmy Reed.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">MERCH & ADVERTISING</H3>
        <DL><p>
            <DT><A HREF="http://www.rockshowusa.com/content/8-clever-ideas-custom-band-merch" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >8 Clever Ideas For Custom Band Merch  Rock Show USA.url</A>
            <DT><A HREF="http://www.altpress.com/features/entry/no_money_mo_problems/#" ADD_DATE="1298302464" LAST_VISIT="1322361175" LAST_MODIFIED="1298302464" ICON_URI="http://www.altpress.com/favicon.ico" >Alt Press  Features  No Money, MoҠProblems Why even successful bands struggle financially#.url</A>
            <DT><A HREF="http://www.customink.com/t-shirts/band-t-shirts.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Band T-Shirts - Design Custom Band Merch & T Shirts Online.url</A>
            <DT><A HREF="http://www.band-tees.com/istar.asp?a=3&dept=ROCK&sortby=TOPSELLER&numperpage=18&pos=0&gclid=CLX5scKOl6cCFc9w5QodMk72dQ" ADD_DATE="1298302407" LAST_VISIT="1322361175" LAST_MODIFIED="1298302407" >Band-Tees.com.url</A>
            <DT><A HREF="http://www.curlyandspike.com/lighters/index.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Curly & Spike Custom Merch - Lighters.url</A>
            <DT><A HREF="http://www.weneedmerch.com/bag-printing/index.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Custom T-shirt Screen Printing and Foil Merch for your Band.url</A>
            <DT><A HREF="http://www.fashionpunk.com/" ADD_DATE="1298302449" LAST_VISIT="1322361175" LAST_MODIFIED="1298302449" ICON_URI="http://www.fashionpunk.com/Images/fp.ico" >FashionPunk.com.url</A>
            <DT><A HREF="http://www.discmakers.com/merch/tips/howtosell.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How To Sell Merchandise.url</A>
            <DT><A HREF="http://www.crystalclearcds.com/services/success.php" ADD_DATE="1298302477" LAST_VISIT="1322361175" LAST_MODIFIED="1298302477" >Marketing Guide for Successful Band Promotion Crystal Clear Dallas Texas.url</A>
            <DT><A HREF="http://www.mycustombandmerch.com/portfolio/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >PORTFOLIO  My Custom Band Merch.url</A>
            <DT><A HREF="http://www.zazzle.com/rock_band_business_card-240873936771021176" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Rock Band Business Card from Zazzle.com.url</A>
            <DT><A HREF="http://www.rockabilia.com/category.php?cat=2234&gclid=CML56MCOl6cCFdtx5QodsnCBdA" ADD_DATE="1298302430" LAST_VISIT="1322361175" LAST_MODIFIED="1298302430" ICON_URI="http://www.rockabilia.com/favicon.ico" >Rockabilia.com.url</A>
            <DT><A HREF="http://mises.org/daily/4662" ADD_DATE="1298302469" LAST_VISIT="1322361175" LAST_MODIFIED="1298302469" ICON_URI="http://mises.org/favicon.ico" >Secrets of the Most Successful Touring Band of All Time - Doug French - Mises Daily.url</A>
            <DT><A HREF="http://www.slingshottshirts.com/?gclid=COi688OOl6cCFcbd4AodER0bdw" ADD_DATE="1298302371" LAST_VISIT="1322361175" LAST_MODIFIED="1298302371" ICON_URI="http://slingshottshirts.com/skin/frontend/default/slingshot/favicon.ico" >Slingshot T-Shirts  Music T-Shirts  Superhero T-Shirts  Superman T-Shirts  Rock and Roll Shirts and Tees  Hip Hop Tees.url</A>
            <DT><A HREF="http://terminustees.com/" ADD_DATE="1298522139" LAST_VISIT="1322361175" LAST_MODIFIED="1298522139" ICON_URI="http://terminustees.com/favicon.ico" >Terminus Tees.url</A>
            <DT><A HREF="http://www.attitudeclothing.co.uk/product_19840-77-1198_Women's-Plain-Black-T-shirt.htm" ADD_DATE="1298177416" LAST_VISIT="1322361175" LAST_MODIFIED="1298177416" ICON_URI="http://www.attitudeclothing.co.uk/favicon.ico" >Women's Plain Black T-shirt - Girl's T-shirts.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">METAL</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Magazines & Blogs</H3>
            <DL><p>
                <DT><A HREF="http://lambgoat.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Hardcore music and metal music -- Lambgoat.url</A>
                <DT><A HREF="http://www.metalhammer.co.uk/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Metal Hammer.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Metal - 60's and 70's</H3>
            <DL><p>
                <DT><A HREF="http://orexisofdeath.blogspot.com/2007/08/truth-and-janey-no-rest-for-wicked-1976.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Orexis Of Death TRUTH AND JANEY - NO REST FOR THE WICKED ֠1976 (US) hard rock.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Metal Torrents</H3>
            <DL><p>
                <DT><A HREF="http://www.heavytorrents.org/phpbb/index.php?sid=6f8de06d8798264033a758a6e598f03f" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Heavy Torrents ՠP⨩na principal.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Metallica Tone</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?q=HOW+to+get+that+metallica+sound&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >HOW to get that metallica sound - Google Search.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Reference & Research</H3>
            <DL><p>
                <DT><A HREF="http://metal-archives.com/release.php?id=52164" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Encyclopaedia Metallum - Deifecation - Reciprocreation.url</A>
            </DL><p>
            <DT><A HREF="http://hairbangersradio.ning.com/profiles/blogs/hair-metal-mansion-interview-33" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Hair Metal Mansion Interview with Mark Carras from HeavyAsHell.com - Hair Metal Mansion.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PEDALS</H3>
        <DL><p>
            <DT><A HREF="http://cgi.ebay.com/Line-6-FBV-MKII-shortboard-usb-midi-controller-/230576339636?pt=Guitar_Accessories&hash=item35af6bbab4" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Line 6 FBV MKII shortboard usb midi controller - eBay (item 230576339636 end time Jan-20-11 203.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=60wlk7VamqQ" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Boss MT-2 Metal Zone Keeley Mod Demonstration 'Heavy Metal' - 'Muscle Memory' by Viny.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=EM9FcAifbMw&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Modded Boss MT-2 Metal Zone Demo.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PICKS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Custom</H3>
            <DL><p>
                <DT><A HREF="http://www.intunegp.com/Artist%20shots%204.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Imprinted Guitar Picks artist shots.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">ROCK</H3>
        <DL><p>
            <DT><A HREF="http://www.google.com/search?client=firefox-a&rls=org.mozilla%3Aen-US%3Aofficial&channel=s&hl=en&source=hp&q=truth+and+janey&btnG=Google+Search" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Taringa! - Guns N&#39; Roses discografia.url</A>
            <DT><A HREF="http://www.taringa.net/posts/musica/2699783/Guns-N'-Roses-discografia.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Taringa! - Guns N' Roses discografia.url</A>
            <DT><A HREF="http://www.npr.org/templates/story/story.php?storyId=4278540" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The Pre-Zeppelin Jimmy Page  NPR.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=YVDPSZe21KI&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Metallica Guitar Lesson.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">SHOPPING</H3>
        <DL><p>
            <DT><A HREF="http://www.westmusic.com/locations?utm_term=mainbanner&utm_source=MailingList&utm_medium=email&utm_campaign=RETAIL17+Event%3A+So+Long+Santa" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Stores  West Music.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">SOCIAL NET PRESENCE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Posting Band Videos & Audio</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?q=how+can+I+share+my+band%27s+mp3%27s&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:official&client=firefox-a" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >how can I share my band's mp3's - Google Search.url</A>
                <DT><A HREF="http://www.ilike.com/garageband" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >iLike - GarageBand.url</A>
                <DT><A HREF="http://www.boutell.com/newfaq/creating/freemp3hosting.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >WWW FAQs Where can I host my MP3 files for free.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Publicity</H3>
            <DL><p>
                <DT><A HREF="http://artists.likezebra.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >likeZEBRA  The World's Largest Hub for Independent Music..url</A>
            </DL><p>
            <DT><A HREF="http://diymusician.cdbaby.com/2010/01/facebook-101-setting-up-an-artistband-page-pt-1/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Facebook 101 Setting up an artist-band page Pt 1  DIY Musician.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">Song Meanings</H3>
        <DL><p>
            <DT><A HREF="http://www.amiright.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Am I Right - Misheard Lyrics, Song Parodies, music humor and satire.url</A>
            <DT><A HREF="http://www.songfacts.com/detail.php?id=574" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Jailhouse Rock by Elvis Presley Songfacts.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">SONG MEH</H3>
        <DL><p>
            <DT><A HREF="http://www.youtube.com/watch?v=t_td4bBSeA0&feature=PlayList&p=3AF9A6DD89BE23A1&playnext=1&index=42" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Bleed The Sky - Killtank.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">SONGS I DISLIKE</H3>
        <DL><p>
            <DT><A HREF="http://www.youtube.com/watch?v=YjzIBI3jkKY" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Meshuggah - Shed.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=gmDWvGKLzBE" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Nightwish - Sleeping Sun.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">THEORY</H3>
        <DL><p>
            <DT><A HREF="http://www.ibreathemusic.com/forums/archive/index.php/t-8144.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >What is a riff [Archive] - iBreatheMusic Forums.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_NUDE MODELING</H3>
    <DL><p>
        <DT><A HREF="http://www.amazon.com/gp/cart/view-upsell.html?ie=UTF8&storeID=books&nodeID=283155&newItems=UJIHF7WN6MT0U" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Amazon.com Shopping Cart.url</A>
        <DT><A HREF="http://www.wikihow.com/Be-a-Nude-Art-Model" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Be a Nude Art Model 12 steps - wikiHow.url</A>
        <DT><A HREF="http://www.slate.com/id/2132130" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >In which I pose nude. - By Emily Yoffe - Slate Magazine.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_ORGANIZING & STORAGE</H3>
    <DL><p>
        <DT><A HREF="http://www.goer.org/Journal/2008/07/decluttering_for_geeks_computer_components.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Decluttering for Geeks Computer Components - goer.org.url</A>
        <DT><A HREF="http://www.shopgetorganized.com/prodetail~itemNo~24829.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >from Get Organized.url</A>
        <DT><A HREF="http://jdorganizer.blogspot.com/2008_07_01_archive.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Jeri's Organizing & Decluttering News July 2008.url</A>
        <DT><A HREF="http://www.studentmarket.com/Redmon-6116HPK-RDM1076.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Redmon The Original Bongo Bag Pop Up Hamper in Hot Pink - 6116HPK  StudentMarket.com, Inc..url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_OWNERS MANUALS</H3>
    <DL><p>
        <DT><A HREF="http://tv.manualsonline.com/manuals/mfg/polaroid/tlx03210b.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Polaroid HD Widescreen LCD Television Owner's Manual  ManualsOnline.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_P2P & DOWNLOADING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1307210694">From Blocked Libraries & Public Places</H3>
        <DL><p>
            <DT><A HREF="http://anonymouse.org/anonwww.html" ADD_DATE="1307211058" LAST_VISIT="1322361175" LAST_MODIFIED="1307211058" ICON_URI="http://anonymouse.org/favicon.ico" >Anonymouse.org.url</A>
            <DT><A HREF="http://ports.my-addr.com/check-all-open-ports-online.php" ADD_DATE="1307210704" LAST_VISIT="1322361175" LAST_MODIFIED="1307210704" ICON_URI="http://ports.my-addr.com/favicon.ico" >Check ALL open ports, scan open ports online free tool.url</A>
            <DT><A HREF="http://filesharefreak.com/2008/04/16/how-to-download-torrents-through-a-proxyfirewall/" ADD_DATE="1307210696" LAST_VISIT="1322361175" LAST_MODIFIED="1307210696" ICON_URI="http://filesharefreak.com/favicon.ico" >How To Download Torrents Through a Proxy-Firewall  THE source for BitTorrent & P2P Tips, Tricks and Info.  FileShareFreak.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">Peerguardian, Bluetack, & Blocklists</H3>
        <DL><p>
            <DT><A HREF="http://www.iblocklist.com/lists.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >I-BlockList  Lists.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=hcGCajENVW0&NR=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - BUSTED FOR DOWNLOADING, NOW WHAT (Copyright Infringement Letters).url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=9U-f47S5Cb8" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How people are tracked using bittorrent.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=oi_HSPg6Xcw" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - PeerGuardian 3 Download And Tutorial.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=vBLlFvwPxNQ&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Torrenting Safely PeerBlock.url</A>
            <DT><A HREF="http://search.utorrent.com/search.php?q=blocklist&e=http%3a%2f%2fwww.bittorrent.com%2fsearch%3fclient%3dutorrent1850%26search%3d&u=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >֔orrent Search.url</A>
        </DL><p>
        <DT><A HREF="http://forum.utorrent.com/viewtopic.php?id=70222" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >PeerBlock shows LOTS of uTorrent port activity while no peers.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PARENTING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BABIES & TODDLERS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Potty Training</H3>
            <DL><p>
                <DT><A HREF="http://www.babycenter.com/0_the-abcs-of-potty-training_4399.bc" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The ABCs of potty training  BabyCenter.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PHILOSOPHY</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BLOGS</H3>
        <DL><p>
            <DT><A HREF="http://www.urbansamurai.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >URBAN SAMURAI.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PHOTOGRAPHY</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">CAMERA REVIEWS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">COMPARISONS</H3>
            <DL><p>
                <DT><A HREF="http://www.dpreview.com/reviews/sidebyside.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Buying Guide Side-by-side Digital Photography Review.url</A>
                <DT><A HREF="http://digital-cameras.toptenreviews.com/compact/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Compact Digital Camera 2010 - TopTenREVIEWS.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=1&oq=compare+digital+c&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=compare+digital+cameras+side+by+side" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >compare digital cameras side by side - Google Search.url</A>
                <DT><A HREF="http://www.dpreview.com/reviews/compare_post.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Digital Cameras Side-by-Side, 2 cameras Digital Photography Review.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">DIGITAL</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Point-And-Shoot</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">NIKON</H3>
                    <DL><p>
                        <DT><H3 FOLDED ADD_DATE="1298088102">Coolpix L22</H3>
                        <DL><p>
                            <DT><A HREF="http://cheapdigitalslrcamera.info/shop.php?k=NIKON+l22&c=Camera" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >NIKON l22   Digital Camera  Cheap Digital SLR Camera.url</A>
                        </DL><p>
                        <DT><H3 FOLDED ADD_DATE="1298088102">S3000</H3>
                        <DL><p>
                            <DT><A HREF="http://www.digitalcamera-hq.com/products/nikon-coolpix-s3000" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Nikon Coolpix S3000 - Unbiased digital camera reviews, prices, and advice.url</A>
                        </DL><p>
                    </DL><p>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Tripods</H3>
            <DL><p>
                <DT><A HREF="http://www.adorama.com/alc/article/8169" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >BUYING GUIDE Tripods for Photographers from Adorama Learning Center.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">WATERPROOF SHOCKPROOF RUGGED</H3>
            <DL><p>
                <DT><A HREF="http://www.amazon.com/Canon-PowerShot-D10-Waterproof-Stabilized/product-reviews/B001SER460/ref=cm_cr_dp_hist_1?ie=UTF8&showViewpoints=0&filterBy=addOneStar" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Amazon.com - Canon PowerShot D10 12.1 MP.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=4&oq=best+waterpro&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=best+waterproof+camera+2010" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >best waterproof camera 2010 - Google Search.url</A>
                <DT><A HREF="http://www.beachcamera.com/shop/searchresults.aspx?cti=2014&scs=true&kwd=&x=17&y=8" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Digital Cameras  BeachCamera.com.url</A>
                <DT><A HREF="http://www.popphoto.com/Features/The-5-Best-Waterproof-Compact-Cameras?pnid=64004" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The 5 Best Waterproof Compact Cameras  Photography - PopPhoto.com Offers Camera Reviews and Exc.url</A>
                <DT><A HREF="http://www.waterproof-camera.org/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Waterproof digital camera reviews, tips and news  Waterproof-Camera.org.url</A>
                <DT><A HREF="http://reviews.photographyreview.com/blog/waterproof-digital-cameras-pma-2010/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Waterproof Digital Cameras At PMA 2010  Camera News & Reviews.url</A>
            </DL><p>
            <DT><A HREF="http://www.dpreview.com/reviews/sidebyside.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Buying Guide Side-by-side Digital Photography Review.url</A>
            <DT><A HREF="http://www.dpreview.com/reviews/compare_post.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Digital Cameras Side-by-Side, 8 cameras Digital Photography Review.url</A>
            <DT><A HREF="http://www.ashtonscoolpix.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Nikon Digital Zoom Cameras from Ashton's COOLPIX.url</A>
            <DT><A HREF="http://cheapdigitalslrcamera.info/shop.php?k=NIKON+l22&c=Camera" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >NIKON l22   Digital Camera  Cheap Digital SLR Camera.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">CANDIDS</H3>
        <DL><p>
            <DT><A HREF="http://www.cityphotolab.com/nude/index.php?cat=4" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >- Home  Erotic Photo Contest.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=amateur+nude+candids" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >amateur nude candids - Google Search.url</A>
            <DT><A HREF="http://tangotime.com/rating/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Amateur nude photo rating and video rating community - TangoTime.com Rating Home.url</A>
            <DT><A HREF="http://en.mimi.hu/photography/candid_picture.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Candid picture - (Photography) Definition.url</A>
            <DT><A HREF="http://www.candidportal.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Candid Portal Picture Blog - Hand-picked Quality Candid and Amateur Updates!.url</A>
            <DT><A HREF="http://exgfpics.com/blog/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Ex Girlfriend Pictures - Real Ex Girlfriends and Ex Wives Nude.url</A>
            <DT><A HREF="http://www.privateamateurphotos.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Private Amateur photos.url</A>
            <DT><A HREF="http://www.candidspot.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The Candid Spot - The Best Candid, Party Girl, Voyeur and Nude Beach Pictures from around the w.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">LOW-LIGHT ACTION PHOTOGRAPHY</H3>
        <DL><p>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=home+erotic+photography" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >home erotic photography - Google Search.url</A>
            <DT><A HREF="http://photocritic.org/low-light-photography/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Low-light action photography  Photocritic photography blog.url</A>
            <DT><A HREF="http://www.have-better-sex.com/taking-sexy-videos-and-photos-can-you-say-home-grown-porn/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Taking Sexy Private Photos and Videos, Can You Say Home Grown Porn  Have Better Sex.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PHOTOBOOKS</H3>
        <DL><p>
            <DT><A HREF="http://inkubook.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photo Books  Make a Photobook in Minutes  Inkubook.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PHOTOGRAPHS</H3>
        <DL><p>
            <DT><A HREF="http://www.camvista.com/users-photo-gallery/ia/458,14,117.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Camvista.com Users Photo Gallery - IA - Page 14.url</A>
            <DT><A HREF="http://www.pbase.com/julienc/image/44506646" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Prototype Clear Blue Optimus Prime Cab & Trailer - Robot Mode photo - Julien Chiang photos at p.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PHOTOSHOP TUTORIALS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Advanced Techniques</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298142018">Black & White with Some Color</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=zgsILVkDitU&feature=related" ADD_DATE="1298142132" LAST_VISIT="1322361175" LAST_MODIFIED="1298142132" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Coloring a Black & White Picture in Photoshop CS3.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=VEE3wBElz-8&feature=related" ADD_DATE="1298142079" LAST_VISIT="1322361175" LAST_MODIFIED="1298142079" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop - How to make one object in a picture color and the rest Black and white.(Sin city effect).url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=cGc7oGWIrGg&feature=related" ADD_DATE="1298142114" LAST_VISIT="1322361175" LAST_MODIFIED="1298142114" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Turning a Black and White Photo into Colour.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=DPdMW-3Ohmk&feature=related" ADD_DATE="1298142021" LAST_VISIT="1322361175" LAST_MODIFIED="1298142021" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Tutorial Photoshop CS3 - color splash - partial black and white.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=uZNSxgMBMNU&feature=relmfu" ADD_DATE="1298142043" LAST_VISIT="1322361175" LAST_MODIFIED="1298142043" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Tutorial Photoshop CS4 - color splash - photo in black and white with colored parts.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Chiseled & Worked</H3>
                <DL><p>
                    <DT><A HREF="http://pacific.orconhosting.net.nz/tutorial/index.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Untitled Document.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Color Swapping</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">House Painting</H3>
                    <DL><p>
                        <DT><A HREF="http://www.ehow.com/how_4928634_paint-house-photoshop.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Paint a House in Photoshop  eHow.com.url</A>
                    </DL><p>
                    <DT><A HREF="http://forums.steves-digicams.com/editors-photoshop-etc/76861-replacing-color.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Replacing color - Steve's Digicams Forums.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Cutting Out Images & Crisping Edges</H3>
                <DL><p>
                    <DT><A HREF="http://programanddesign.com/ps/cut-out-an-image-w-lasso-tool-layer-masks-and-gaussian-blur/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Cut out an Image w- Lasso Tool, Layer Masks and Gaussian Blur ˠProgram & Design.url</A>
                    <DT><A HREF="http://www.webdesign.org/photoshop/photo-editing/how-to-easily-cut-out-someone-using-adobe-photoshop-cs3-video-tutorial.17410.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Easily Cut Out Someone using Adobe Photoshop CS3 (Video Tutorial)  Photo Editing.url</A>
                    <DT><A HREF="http://photoshopper27.blogspot.com/2009/09/cut-out-image-with-layer-mask.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >photoshopper27 Cut out image with a Layer Mask.url</A>
                    <DT><A HREF="http://akvis.com/en/smartmask-tutorial/examples/cut-out-human.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Separate A Person From A Photo with AKVIS SmartMask.url</A>
                    <DT><A HREF="http://www.photoshopsupport.com/tutorials/colin/masking-images.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Using Channels To Mask Out Images In Photoshop  PhotoshopSupport.com.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Edge Smoothing</H3>
                <DL><p>
                    <DT><A HREF="http://www.photoshopcafe.com/cs3/qs.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop CS3 training, Quick selection tool, refine edge CS3 Photoshop Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=sEms5ULgmEs&NR=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298651103" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - How to Smoothen Edges in Photoshop.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Fire</H3>
                <DL><p>
                    <DT><A HREF="http://abduzeedo.com/create-amazing-ad-photoshop" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Create an amazing Ad in Photoshop  Abduzeedo  Graphic Design Inspiration and Photoshop Tutorial.url</A>
                    <DT><A HREF="http://psd.tutsplus.com/tutorials/text-effects-tutorials/dramatic-text-on-fire-effect-in-photoshop/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dramatic Text on Fire Effect in Photoshop  Psdtuts+.url</A>
                    <DT><A HREF="http://www.photoshopessentials.com/photoshop-text/text-effects/fire-text/page-3.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Fire Text - Flame Text - Photoshop Fire Text - Text On Fire - Page 3.url</A>
                    <DT><A HREF="http://www.photoshop-dragon.com/Tutorials/Text_Effects/Text_on_Fire.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Tutorial Text on Fire Effect.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298140633">Glass Orbs</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=9Z4Lfh8nwqI&feature=related" ADD_DATE="1298140663" LAST_VISIT="1322361175" LAST_MODIFIED="1298140663" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Create a Metallic Gear Logo! Photoshop CS4 Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=FV_lPqLFLgA&feature=related" ADD_DATE="1298140638" LAST_VISIT="1322361175" LAST_MODIFIED="1298140638" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop cs4 tutorial. How to make a realistic glass orb.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=PDIvtP6NPnw&feature=related" ADD_DATE="1298142376" LAST_VISIT="1322361175" LAST_MODIFIED="1298142376" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - PhotoShop Glass-Crystal BALL-Orb. Better glass distortion!.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=DxcIkCuMn4Y&feature=related" ADD_DATE="1298140651" LAST_VISIT="1322361175" LAST_MODIFIED="1298140651" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop in Action Make Sony Ericsson logo.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298142184">Hair Color</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=3B4nthGZhnE&feature=relmfu" ADD_DATE="1298142187" LAST_VISIT="1322361175" LAST_MODIFIED="1298142187" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Tutorial Photoshop CS4 - How to change the color of the hair.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Lighting Effects</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Glow</H3>
                    <DL><p>
                        <DT><A HREF="http://designora.com/tutorials/text-images-glow/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >6 Different Ways to Make Your Text and Images Glow - Flash Web Design and Design Photography  D.url</A>
                        <DT><A HREF="http://www.marcofolio.net/photoshop/glowing_and_sparkling_intense_light_3d_logo.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Create a super glowing and sparkling intense light 3d logo in Photoshop & Illustrator.url</A>
                        <DT><A HREF="http://abduzeedo.com/create-amazing-ad-photoshop" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Create an amazing Ad in Photoshop  Abduzeedo  Graphic Design Inspiration and Photoshop Tutorial.url</A>
                        <DT><A HREF="http://www.photoshopcamp.com/Free-photosho-essential-skill-lesson-trick-how-to-create-glowing-shadow-text-effect--57.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Free photosho essential skill lesson trick how to create glowing shadow text effect - Photoshop.url</A>
                        <DT><A HREF="http://www.viprasys.org/vb/f76/photoshop-glow-text-tutorial-62462/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop - glow text tutorial - Yahoo Booters And Yahoo Tools.url</A>
                        <DT><A HREF="http://forum-fx.com/blog/photoshop-tutorial-how-to-do-a-rainbow-neon-glow-text-effect-and-a-mirror-reflective-effect.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop tutorial How to do a rainbow neon glow text effect and a mirror reflective effect  Fo.url</A>
                    </DL><p>
                    <DT><A HREF="http://www.webmastergrade.com/10-excellent-light-glow-effect-photoshop-tutorials/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >10+ Excellent Light & Glow Effect Photoshop Tutorials.url</A>
                    <DT><A HREF="http://vandelaydesign.com/blog/design/photoshop-lighting-effects/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >40 Photoshop Tutorials for Lighting and Abstract Effects  Vandelay Design Blog.url</A>
                    <DT><A HREF="http://psd.tutsplus.com/tutorials-effects/advanced-glow-effects/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Advanced Glow Effects  Psdtuts+.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298143011">Line Drawing Sketch</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=gb-ao_f4Duc" ADD_DATE="1298143016" LAST_VISIT="1322361175" LAST_MODIFIED="1298143016" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Drawing in Photoshop - Girl With a Sword [Lineart].url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">LOTR</H3>
                <DL><p>
                    <DT><A HREF="http://www.learnit2.com/photoshop/Lord-Of-The-Rings-Poster/page4.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Learn It 2  Page 4 - Lord Of The Rings Poster Adobe Photoshop Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298139655">Metal Sparkle Bling</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=9Z4Lfh8nwqI&feature=relmfu" ADD_DATE="1298141798" LAST_VISIT="1322361175" LAST_MODIFIED="1298141798" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Create a Metallic Gear Logo! Photoshop CS4 Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=vo8IX4U-otc&feature=related" ADD_DATE="1298142467" LAST_VISIT="1322361175" LAST_MODIFIED="1298142467" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial - Episode 20 - Text Effect Light Flare.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=cQEQo_hzQmQ&feature=fvst" ADD_DATE="1298139657" LAST_VISIT="1322361175" LAST_MODIFIED="1298139657" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial - Realistic Chrome Text effect!.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=rr4EhkL_gig&feature=relmfu" ADD_DATE="1298141877" LAST_VISIT="1322361175" LAST_MODIFIED="1298141877" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Web 2.0 Letterpress Effect Photoshop CS4 Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Molten</H3>
                <DL><p>
                    <DT><A HREF="http://psdguides.com/2009/09/create-a-blazing-lava-text-effect-in-photoshop/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Create a Blazing Lava Text Effect in Photoshop  Psdguides.url</A>
                    <DT><A HREF="http://www.graphic-design.com/photoshop/tutorial/flaming-text-tutorials-photoshop" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Flaming Text Tutorials in Photoshop  Photoshop  Graphic Design & Publishing Center.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Montage</H3>
                <DL><p>
                    <DT><A HREF="http://www.photoshopsupport.com/tutorials/masking-and-montage/photoshop-masks.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Masking & Montage Tutorial נUsing Masks To Improve Landscape Images  PhotoshopSuppor.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298140728">Neon Glow Laser</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=QcWWoURrqY0&feature=related" ADD_DATE="1298141930" LAST_VISIT="1322361175" LAST_MODIFIED="1298141930" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Awesome Magic Looking Effect- Photoshop CS3, CS4 and CS5 Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=uG44PL4hP0g&feature=channel" ADD_DATE="1298140754" LAST_VISIT="1322361175" LAST_MODIFIED="1298140755" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Create an Explosive Color Swath Photoshop Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=YDqJs9baw4I&feature=related" ADD_DATE="1298141913" LAST_VISIT="1322361175" LAST_MODIFIED="1298141913" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Electric Text effect in Adobe Photoshop CS4 and CS3.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=Fsm14uE_gYc&feature=related" ADD_DATE="1298141267" LAST_VISIT="1322361175" LAST_MODIFIED="1298141267" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - How To Create Multi-Colored Glowing Lines Photoshop Tutorial w- updated links.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=3QaOqoht7fQ&feature=channel" ADD_DATE="1298140785" LAST_VISIT="1322361175" LAST_MODIFIED="1298140785" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Metal Lightning Bolt & Vector Leather! Illustrator Tutorial.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=g_G8oGw2Jf8&feature=related" ADD_DATE="1298141951" LAST_VISIT="1322361175" LAST_MODIFIED="1298141951" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop  Beam Tutorial [HD].url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=QGDkai7RTC8&feature=channel" ADD_DATE="1298140739" LAST_VISIT="1322361175" LAST_MODIFIED="1298140739" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial Incredible Neon Tube Text!.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=mw37ilsQ_sU&feature=channel" ADD_DATE="1298140770" LAST_VISIT="1322361175" LAST_MODIFIED="1298140770" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - [HD] 3D Light Glowing Vector Ribs Adobe Illustrator Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">PEOPLE</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=S3hoDihxH7E&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How To Remove Background Around Lots Of Hair Photoshop.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298174836">Reflection</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=dmjwRsKOeh4&feature=related" ADD_DATE="1298174839" LAST_VISIT="1322361175" LAST_MODIFIED="1298174840" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Text Masking Tips.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298141439">Tattoos</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=TynVZHRmpUU&feature=related" ADD_DATE="1298141443" LAST_VISIT="1322361175" LAST_MODIFIED="1298141444" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial - Applying Fake Tattoos!.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Transformers</H3>
                <DL><p>
                    <DT><A HREF="http://www.pixel2life.com/forums/lofiversion/index.php/t44834.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Pixel2Life Forum  Transformers Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Transparency</H3>
                <DL><p>
                    <DT><A HREF="http://www.photoshopessentials.com/photo-effects/transparent-type/page-3.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Tutorials Add Transparent Type To An Image.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Watermarks</H3>
                <DL><p>
                    <DT><A HREF="http://photoshoptutorials.ws/photography-tutorials/workflow/creating-safe-and-effective-watermarks.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Creating Safe and Effective Watermarks  Workflow.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=w9xWfF-ejQY" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How To Watermark Images In Photoshop CS3.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298141373">Weight Loss</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=7B7QC9D4YJU&feature=related" ADD_DATE="1298141377" LAST_VISIT="1322361175" LAST_MODIFIED="1298141377" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial How To Use The Liquify Tool To Look Skinny.url</A>
                </DL><p>
                <DT><A HREF="http://www.dennisplucinik.com/blog/2007/08/28/60-advanced-adobe-photoshop-tutorials/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >60 Advanced Adobe Photoshop Tutorials.url</A>
                <DT><A HREF="http://www.photoshoptutorials.us/text-effects/2/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Free Adobe Photoshop Tutorials  Text Effects.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Brushes</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1299521962">Brush Sites</H3>
                <DL><p>
                    <DT><A HREF="http://www.brushesdownload.com/bfile.asp?id=4391" ADD_DATE="1299522307" LAST_VISIT="1322361175" LAST_MODIFIED="1299522307" ICON_URI="http://www.brushesdownload.com/images/elicon.ico" >BrushesDownload.com.url</A>
                    <DT><A HREF="http://www.starwalt.com/photoshop_stuff4.html" ADD_DATE="1299521964" LAST_VISIT="1322361175" LAST_MODIFIED="1299521964" >Photoshop Brushes by Starwalt Design.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Gothic & Evil</H3>
                <DL><p>
                    <DT><A HREF="http://www.obsidiandawn.com/dark-n-gothic-photoshop-gimp-brushes" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dark -n- Gothic Photoshop & GIMP Brushes  Obsidian Dawn.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298143233">Sparkle Bling Shine Gleam</H3>
                <DL><p>
                    <DT><A HREF="http://www.brushesdownload.com/bfile.asp?id=3412" ADD_DATE="1298143236" LAST_VISIT="1322361175" LAST_MODIFIED="1298143236" ICON_URI="http://www.brushesdownload.com/images/elicon.ico" >7 Sparkle Photoshop Brushes  Brushes Download  Free Photoshop Brushes  Gradients  Layer Styles  Tutorials  Icons.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Bullets</H3>
            <DL><p>
                <DT><A HREF="http://www.photoshopessentials.com/photoshop-text/photoshop-text-paragraph-palette.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe Photoshop Text Tutorials - Paragraph Palette - Free Adobe Photoshop Tutorials.url</A>
                <DT><A HREF="http://www.ianhoar.com/2008/04/12/photoshop-tip-3-bullets-in-photoshop/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Tip #3 Bullets in Photoshop  Ian Hoar ֠Passion for Technology ֠Geeking Out.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Columns</H3>
            <DL><p>
                <DT><A HREF="http://www.video-animation.com/photo_04.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Layout Tutorial.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Errors & Problems</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Can't Paste Screenshot</H3>
                <DL><p>
                    <DT><A HREF="http://www.dennisplucinik.com/blog/2007/09/18/photoshop-cs3-problems/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop CS3 Problems - Screenshot SOLUTION!!!.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Crashing & Freezing</H3>
                <DL><p>
                    <DT><A HREF="http://forums.adobe.com/thread/573361?decorator=print&displayFullThread=true" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe Forums Photoshop CS3 keeps crashing on....url</A>
                    <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US376&q=photoshop+cs3+keeps+crashing&aq=f&aqi=g2&aql=&oq=&gs_rfai=" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >photoshop cs3 keeps crashing - Google Search.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Polygonal Lasso</H3>
                <DL><p>
                    <DT><A HREF="http://forums.adobe.com/message/2775777" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe Forums Polygonal lasso tool problem in cs4.url</A>
                    <DT><A HREF="http://photography-on-the.net/forum/showthread.php?p=8832782" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Does Your Photoshop Do This (Annoying Polygonal Lasso Tool) - Page 2 - Canon Digital Photograph.url</A>
                    <DT><A HREF="http://www.gamedev.net/reference/art/features/pixelart2/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >GameDev.net -- Creating Minimal Pixel Art with Photoshop (Part 2).url</A>
                    <DT><A HREF="http://photography-on-the.net/forum/archive/index.php/t-706212.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop CS3 lasso problem [Archive] - Canon Digital Photography Forums.url</A>
                    <DT><A HREF="http://www.photoshopessentials.com/basics/selections/lasso-tool/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Selections Tutorials - The Lasso Tool Pt.1.url</A>
                    <DT><A HREF="http://www.photoshopessentials.com/basics/selections/lasso-tool/page-2.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop Selections Tutorials - The Lasso Tool Pt.2.url</A>
                </DL><p>
                <DT><A HREF="http://forums.adobe.com/thread/573361" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe Forums Photoshop CS3 keeps crashing on....url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Healing Brush</H3>
            <DL><p>
                <DT><A HREF="http://digital-photography-school.com/using-the-healing-tools-in-photoshop-cs3" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Using the Healing Tools in Photoshop CS3.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Lasso Tool</H3>
            <DL><p>
                <DT><A HREF="http://www.5min.com/Video/How-to-Use-the-Lasso-Tool-in-Adobe-Photoshop-CS3-86624958" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Use the Lasso Tool in Adobe Photoshop CS3 Video ֠5min.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Layer Masking</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=DA8TgyTruV8" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Lesson 1 Introduction to Photoshop Layer Masks.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Max Number Of Layers</H3>
            <DL><p>
                <DT><A HREF="http://www.peachpit.com/articles/article.aspx?p=26275" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >peachpit Photoshop Layer Sets  Appropriate Naming and Logical Grouping.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Optimizing Performance</H3>
            <DL><p>
                <DT><A HREF="http://kb2.adobe.com/cps/401/kb401088.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Optimize Photoshop performance  CS3  XP, Vista.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Pen Tool</H3>
            <DL><p>
                <DT><A HREF="http://www.5min.com/Video/How-to-Use-the-Pen-Tool-in-Adobe-Photoshop-CS3-86624983" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Use the Pen Tool in Adobe Photoshop CS3 Video ֠5min.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Performance Optimization</H3>
            <DL><p>
                <DT><A HREF="http://photography-on-the.net/forum/showthread.php?t=436966" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Ever wonder how much memory PS CS3 is hogging - Canon Digital Photography Forums.url</A>
                <DT><A HREF="http://kb2.adobe.com/cps/401/kb401088.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Optimize performance of Photoshop CS3 on Windows XP and Vista.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">PHOTOSHOP ART</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Photoshop Phriday</H3>
                <DL><p>
                    <DT><A HREF="http://www.somethingawful.com/d/photoshop-phriday/breakfast-cereals-2.php?page=2" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Breakfast Cereals 2.url</A>
                </DL><p>
                <DT><A HREF="http://www.freakingnews.com/Lord-of-the-Rings-Pictures---105.asp" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Lord of the Rings Pictures Gallery - Photoshop Lord of the Rings Pics.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Quickmask</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Feathering</H3>
                <DL><p>
                    <DT><A HREF="http://www.planetphotoshop.com/taking-advantage-of-quickmask.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Taking Advantage of Quickmask  Planet Photoshop.url</A>
                    <DT><A HREF="http://www.youtube.com/watch?v=WijsMtrYYiA" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - How To Use A Mask With A Feather In Adobe Photoshop cs3.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Scratch Disks</H3>
            <DL><p>
                <DT><A HREF="http://photo.net/digital-darkroom-forum/004kHS" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Create A Scratch Disk on an External Drive - Photo.net Digital Darkroom Forum.url</A>
                <DT><A HREF="http://kb2.adobe.com/cps/401/kb401088.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Optimize Photoshop performance  CS3  XP, Vista.url</A>
                <DT><A HREF="http://www.easyelements.com/scratch-disk.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Scratch Disk.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Selection</H3>
            <DL><p>
                <DT><A HREF="http://www.photoshopcafe.com/cs3/qs.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photoshop CS3 training, Quick selection tool, refine edge CS3 Photoshop Tutorial.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">TEXTURES</H3>
            <DL><p>
                <DT><A HREF="http://www.adobe.com/cfusion/marketplace/index.cfm?event=marketplace.global" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe - Adobe Marketplace.url</A>
                <DT><A HREF="http://www.cgtextures.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >[CG Textures] - Textures for 3D, graphic design and Photoshop!.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298141571">YOUTUBE SITES</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298140531">YouTube - Techlife</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=y5UB11TstcM&feature=channel" ADD_DATE="1298140546" LAST_VISIT="1322361175" LAST_MODIFIED="1298140546" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop CS3 Chrome-Glossy Logo Design (Not a tut!).url</A>
                    <DT><A HREF="http://www.youtube.com/watch?annotation_id=annotation_805569&feature=iv&v=riPjM8Ltfmk" ADD_DATE="1298140533" LAST_VISIT="1322361175" LAST_MODIFIED="1298140533" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial - Glossy Apple Logo!.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298141730">YouTube - Tutvid</H3>
                <DL><p>
                    <DT><A HREF="http://www.youtube.com/watch?v=QGDkai7RTC8&feature=channel" ADD_DATE="1298141734" LAST_VISIT="1322361175" LAST_MODIFIED="1298141734" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Tutorial Incredible Neon Tube Text!.url</A>
                </DL><p>
            </DL><p>
            <DT><A HREF="http://www.adobe.com/designcenter/video_workshop/?id=vid0027" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe Design Center - CS3 Adobe Video Workshop.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">TAKING NUDE PHOTOS</H3>
        <DL><p>
            <DT><A HREF="http://digital-photography-school.com/9-nude-photography-tips" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >9 Nude Photography Tips.url</A>
            <DT><A HREF="http://www.lovechess.nl/artoflove/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Art of Love  Erotic Art , 3D Art & Nude Photography.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US349&q=best+camera+for+taking+nude+photos" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >best camera for taking nude photos - Google Search.url</A>
            <DT><A HREF="http://forum.lookbook.nu/show/1020-BEST-CAMERA-to-take-naked-pictures-with" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Best Camera(To Take Naked Pictures With) -- LB FORUM.url</A>
            <DT><A HREF="http://www.cracked.com/blog/how-to-look-at-people-naked" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Take Naked Pictures of People  Cracked.com.url</A>
            <DT><A HREF="http://www.ehow.com/how_4456236_pictures-nude-beach.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >How to Take Pictures at a Nude Beach  eHow.com.url</A>
            <DT><A HREF="http://photocritic.org/nude-girlfriend-photography/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Nude photography 101 Photographing your girlfriend  Photocritic photography blog.url</A>
            <DT><A HREF="http://photo.net/photodb/member-photos?user_id=1062671" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photos by Norm Murray - photo.net.url</A>
            <DT><A HREF="http://www.dphotojournal.com/start-up-a-nude-photography-business/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Start Up a Nude Photography Business - Digital Camera Reviews & Photography Tips.url</A>
            <DT><A HREF="http://www.facebook.com/home.php?#!/profile.php?id=569676986&v=wall&story_fbid=392004041986" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Start Up a Nude Photography Business - Digital Camera Reviews &amp; Photography Tips.url</A>
            <DT><A HREF="http://ezinearticles.com/?The-Best-Secrets-When-Taking-Nude-Photos&id=3499817" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >The Best Secrets When Taking Nude Photos.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_POLITICS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">ARGUMENT WINNING</H3>
        <DL><p>
            <DT><A HREF="http://www.facebook.com/home.php?#!/profile.php?id=569676986&ref=profile" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >You’re So Vain - Paul Krugman Blog - NYTimes.com.url</A>
            <DT><A HREF="http://krugman.blogs.nytimes.com/2010/02/27/youre-so-vain/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouӲe So Vain - Paul Krugman Blog - NYTimes.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BLOGS</H3>
        <DL><p>
            <DT><A HREF="http://wonkette.com/402775/computer-handbook-publisher-wants-to-help-john-mccain-personally" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Computer Handbook Publisher Wants To Help John McCain, Personally!.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PORN</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BLOGS</H3>
        <DL><p>
            <DT><A HREF="http://www.babegala.com/2008/12/03/ashlynn-brooke-2/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Ashlynn Brooke ֠Babe Gala.url</A>
            <DT><A HREF="http://twistys.bentsblogs.com/2009/08/beautiful-twistys-babe-ashlynn-brooke-videos/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Beautiful Twistys Babe Ashlynn Brooke Videos  Inside Twistys.url</A>
            <DT><A HREF="http://www.fatbackmedia.com/nsfw/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Naked Celebrities - NSFW and Boobies on Fatback Media.url</A>
            <DT><A HREF="http://www.swankpad.org/blather/tag/nude/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Swankyӳ Blather ۠nude.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BODY PAINTING</H3>
        <DL><p>
            <DT><A HREF="http://bodypaintingpictures.blogspot.com/2010/04/body-painting-women-2010.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >. Body Painting Pictures . Body Painting Women 2010.url</A>
            <DT><A HREF="http://bodypaintingpictures.blogspot.com/2010/03/xxx-girl-body-painting.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >. Body Painting Pictures . XXX Girl Body Painting.url</A>
            <DT><A HREF="http://tattoo-art-designs-gallery.blogspot.com/2006/11/all-about-sexy-adult-body-painting_130.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >All About Sexy Adult Body Painting  Tattoo Art Designs Gallery.url</A>
            <DT><A HREF="http://www.sessionmagazine.com/beautiful-body-art/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Beautiful body art - Session Magazine.url</A>
            <DT><A HREF="http://body-paint-body-art.blogspot.com/2005/01/body-art-gallery.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Body Art and Body Paint Gallery  Body Paint - Body Art Pictures Gallery.url</A>
            <DT><A HREF="http://photo.net/photodb/photo?photo_id=3516567" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Body paint 1 Photo by Photographer Norm Murray - photo.net.url</A>
            <DT><A HREF="http://www.zimbio.com/Body+Painting/pictures/2/Body+Painting+Member+Pictures?Page=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Body Painting Member Pictures - Body Painting - Zimbio.url</A>
            <DT><A HREF="http://www.book530.com/painting/13432/buy-oil-paintings-suppliers-china-oil.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >buy oil paintings suppliers china oil painting,We produce oil paintings of all.url</A>
            <DT><A HREF="http://www.google.com/images?rlz=1T4HPIC_enUS349US376&q=full+body+painting&um=1&ie=UTF-8&source=univ&ei=bIn1S6LtNoKclgfloLzrCg&sa=X&oi=image_result_group&ct=title&resnum=1&ved=0CCcQsAQwAA&start=0&uss=1" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >full body painting - Google Search.url</A>
            <DT><A HREF="http://curiousphotos.blogspot.com/2009/08/full-body-painting-nsfw-40-pics.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Full body painting - NSFW - 40 Pics  Curious, Funny Photos - Pictures.url</A>
            <DT><A HREF="http://1.bp.blogspot.com/_zSBZ8fTr9K8/SwZ9goOmmmI/AAAAAAAABOw/oYrPp260Ju0/s1600/b-body-painting-women-4512bd19c22f.jpeg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--1.bp.blogspot.com-_zSBZ8fTr9K8-SwZ9goOmmmI-AAAAAAAABOw-oYrPp260Ju0-s1600-b-body-painting-.url</A>
            <DT><A HREF="http://2.bp.blogspot.com/_YniKlbPh29k/ShtqpxulsqI/AAAAAAAAEcw/Yt1071joAys/s400/Absinthe-Kubler-Body-Painting2.jpg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--2.bp.blogspot.com-_YniKlbPh29k-ShtqpxulsqI-AAAAAAAAEcw-Yt1071joAys-s400-Absinthe-Kubler-B.url</A>
            <DT><A HREF="http://c3.ac-images.myspacecdn.com/images02/38/l_51adfad8b6e04ba989119c010e21a6c6.jpg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--c3.ac-images.myspacecdn.com-images02-38-l_51adfad8b6e04ba989119c010e21a6c6.jpg.url</A>
            <DT><A HREF="http://upload.wikimedia.org/wikipedia/commons/d/df/Body_painting.JPG" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--upload.wikimedia.org-wikipedia-commons-d-df-Body_painting.JPG.url</A>
            <DT><A HREF="http://www.2dayblog.com/images/2010/january/body_paint_2.jpg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--www.2dayblog.com-images-2010-january-body_paint_2.jpg.url</A>
            <DT><A HREF="http://www.accidentscene.org/images/BodyPaint.jpg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--www.accidentscene.org-images-BodyPaint.jpg.url</A>
            <DT><A HREF="http://www.gunaxin.com/wp-content/uploads/2008/12/bodypaint66.jpg" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--www.gunaxin.com-wp-content-uploads-2008-12-bodypaint66.jpg.url</A>
            <DT><A HREF="http://en.plataformasuperior.com/images_1000/body_painting/32a35_spacial_women.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Pics women. Erotic body painting art. Body painting photos..url</A>
            <DT><A HREF="http://master-bodypainting.blogspot.com/2010/01/body-paint-on-women.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Various Kinds of Body Painting Art Body Paint on Women.url</A>
            <DT><A HREF="http://master-bodypainting.blogspot.com/2010/04/body-paint-women.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Various Kinds of Body Painting Art Body Paint Women.url</A>
            <DT><A HREF="http://master-bodypainting.blogspot.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Various Kinds of Body Painting Art.url</A>
            <DT><A HREF="http://www.zimbio.com/Body+Painting/articles/YbrVucejsVV/Whole+Full+Body+Paint" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Whole Full Body Paint - Body Painting - Zimbio.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">FREE</H3>
        <DL><p>
            <DT><A HREF="http://www.artnudegalleries.com/beautyteennude/266/index.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Teen Nude Picture - Nude Teen Pics, Nude Teen Photos.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">NUDE ART</H3>
        <DL><p>
            <DT><A HREF="http://www.book530.com/painting/13432/buy-oil-paintings-suppliers-china-oil.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >buy oil paintings suppliers china oil painting,We produce oil paintings of all.url</A>
            <DT><A HREF="http://www.domai.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >DOMAI, Nude Art photography, Nude photos, nudism, nude women, amateur models.url</A>
            <DT><A HREF="http://photo.net/photodb/photo?photo_id=7138089" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >lips Photo by Photographer Norm Murray - photo.net.url</A>
            <DT><A HREF="http://photo.net/photodb/member-photos?user_id=1062671" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Photos by Norm Murray - photo.net.url</A>
        </DL><p>
        <DT><A HREF="http://upcomingnudescenes.net/index.php/2007/08/26/1_9" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >http--upcomingnudescenes.net-index.php-2007-08-26-1_9.url</A>
        <DT><A HREF="http://blog.mrskin.com/mr-skins-top-20-movie-nude-scenes-2007---706" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Mr. Skin's Top 20 Movie Nude Scenes of 2007 - Nov 26, 2007.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PRINTING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">Calendars</H3>
        <DL><p>
            <DT><A HREF="http://www.keepandshare.com/htm/calendars/2011_calendars/free_2011_calendar.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >2011 Calendar Easy-to-Use Free 2011 Calendar.url</A>
            <DT><A HREF="http://www.myfreecalendarmaker.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Print your own free calendar.url</A>
            <DT><A HREF="http://www.yearlycalendarmaker.net/welcome.do" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Yearly Calendar Maker.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PRIVACY & SECURITY</H3>
    <DL><p>
        <DT><A HREF="http://finance.yahoo.com/family-home/article/110212/how-to-avoid-the-prying-eyes" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >how-to-avoid-the-prying-eyes Personal Finance News from Yahoo! Finance.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088102">_PROGRAMMING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">.NET</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1300664551">Naming Conventions</H3>
            <DL><p>
                <DT><A HREF="http://10rem.net/articles/net-naming-conventions-and-programming-standards---best-practices" ADD_DATE="1300664553" LAST_VISIT="1322361175" LAST_MODIFIED="1300664553" ICON_URI="http://10rem.net/favicon.ico" >.net Naming Conventions and Programming Standards - Best Practices - Pete Brown's 10rem.net.url</A>
                <DT><A HREF="http://www.experts-exchange.com/Programming/Languages/Visual_Basic/Q_24179069.html" ADD_DATE="1300666042" LAST_VISIT="1322361175" LAST_MODIFIED="1300666042" ICON_URI="http://www.experts-exchange.com/images/ee.ico" >Valid characters in variable names in VB.NET  VB, visual basic, .NET.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1300715542">VB.NET</H3>
            <DL><p>
                <DT><A HREF="http://www.dotnetuncle.com/OOPS/19_virtual.aspx" ADD_DATE="1300717630" LAST_VISIT="1322361175" LAST_MODIFIED="1300717630" >.NET Interview Questions - Explain the use of the virtual keyword.url</A>
                <DT><A HREF="http://10rem.net/articles/net-naming-conventions-and-programming-standards---best-practices" ADD_DATE="1300725256" LAST_VISIT="1322361175" LAST_MODIFIED="1300725256" ICON_URI="http://10rem.net/favicon.ico" >.net Naming Conventions and Programming Standards - Best Practices - Pete Brown's 10rem.net.url</A>
                <DT><A HREF="http://dotnet-concepts-queries-interviews.blogspot.com/2007/08/string-vs-stringbuilder-how-they-work.html" ADD_DATE="1300719372" LAST_VISIT="1322361175" LAST_MODIFIED="1300719372" ICON_URI="http://dotnet-concepts-queries-interviews.blogspot.com/favicon.ico" >.netics String vs. StringBuilder - How they Work.url</A>
                <DT><A HREF="http://www.15seconds.com/issue/030429.htm" ADD_DATE="1300720317" LAST_VISIT="1322361175" LAST_MODIFIED="1300720317" ICON_URI="http://www.15seconds.com/favicon.ico" >15 Seconds  Using Collections in .NET.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/76453kax.aspx" ADD_DATE="1300715552" LAST_VISIT="1322361175" LAST_MODIFIED="1300715552" ICON_URI="http://msdn.microsoft.com/favicon.ico" >Access Levels in Visual Basic.url</A>
                <DT><A HREF="http://addressof.com/blog/articles/codingguidelines.aspx" ADD_DATE="1300725261" LAST_VISIT="1322361175" LAST_MODIFIED="1300725261" ICON_URI="http://addressof.com/favicon.ico" >AddressOf.com  VB.NET Coding Guidelines.url</A>
                <DT><A HREF="http://www.startvbdotnet.com/language/arrays.aspx" ADD_DATE="1300716221" LAST_VISIT="1322361175" LAST_MODIFIED="1300716221" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >Arrays in VB .NET.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/microsoft.visualbasic.collection.aspx" ADD_DATE="1300720424" LAST_VISIT="1322361175" LAST_MODIFIED="1300720424" ICON_URI="http://msdn.microsoft.com/favicon.ico" >Collection Class (Microsoft.VisualBasic).url</A>
                <DT><A HREF="http://forums.asp.net/t/807298.aspx" ADD_DATE="1300719774" LAST_VISIT="1322361175" LAST_MODIFIED="1300719774" ICON_URI="http://i2.asp.net/common/www-css/i/favicon.ico?cdn_id=20110225" >convert string to array  The Official Microsoft ASP.NET Forums.url</A>
                <DT><A HREF="http://visualbasic.about.com/od/usingvbnet/a/datatypes.htm" ADD_DATE="1300726120" LAST_VISIT="1322361175" LAST_MODIFIED="1300726120" ICON_URI="http://0.tqn.com/f/a08.ico" >Data types in VB.NET.url</A>
                <DT><A HREF="http://www.startvbdotnet.com/language/datatypes.aspx" ADD_DATE="1300715544" LAST_VISIT="1322361175" LAST_MODIFIED="1300715544" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >Data Types, Access Specifiers in VB .NET.url</A>
                <DT><A HREF="http://www.vbdotnetheaven.com/UploadFile/ajaiman/EventHandlingVbDotNet04202005052805AM/EventHandlingVbDotNet.aspx" ADD_DATE="1300718285" LAST_VISIT="1322361175" LAST_MODIFIED="1300718285" ICON_URI="http://www.vbdotnetheaven.com/Images/McnIcon.ico" >Event Handling in VB.NET.url</A>
                <DT><A HREF="http://www.c-sharpcorner.com/UploadFile/mahesh/exceptionhandling06222007060938AM/exceptionhandling.aspx" ADD_DATE="1300716668" LAST_VISIT="1322361175" LAST_MODIFIED="1300716668" ICON_URI="http://www.c-sharpcorner.com/Images/McnIcon.ico" >Exception Handling in VB.Net.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/system.exception_members(v=vs.71).aspx" ADD_DATE="1300716759" LAST_VISIT="1322361175" LAST_MODIFIED="1300716759" ICON_URI="http://msdn.microsoft.com/favicon.ico" >Exception Members.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/system.diagnostics.fileversioninfo.aspx" ADD_DATE="1300721491" LAST_VISIT="1322361175" LAST_MODIFIED="1300721491" ICON_URI="http://msdn.microsoft.com/favicon.ico" >FileVersionInfo Class (System.Diagnostics).url</A>
                <DT><A HREF="http://visualbasic.about.com/od/learnvbnet/a/eventhandler.htm" ADD_DATE="1300718669" LAST_VISIT="1322361175" LAST_MODIFIED="1300718669" ICON_URI="http://0.tqn.com/f/a08.ico" >Handling Events in VB.NET.url</A>
                <DT><A HREF="http://bytes.com/topic/asp-net/answers/300462-how-test-if-object-supports-given-interface-runtime" ADD_DATE="1300722084" LAST_VISIT="1322361175" LAST_MODIFIED="1300722085" ICON_URI="http://bytes.com/favicon.ico" >how to test if an object supports a given interface at runtime - ASP.NET answers.url</A>
                <DT><A HREF="http://www.aspnettutorials.com/tutorials/advanced/ilist-aspnet2-csharp.aspx" ADD_DATE="1300722888" LAST_VISIT="1322361175" LAST_MODIFIED="1300722888" >How to use IList Generic Interface to store data C#.url</A>
                <DT><A HREF="http://support.microsoft.com/kb/307222" ADD_DATE="1300717885" LAST_VISIT="1322361175" LAST_MODIFIED="1300717885" ICON_URI="http://support.microsoft.com/favicon.ico" >How to use inheritance in Visual Basic 2005 or in Visual Basic .NET.url</A>
                <DT><A HREF="http://vb.net-informations.com/collections/vb.net_Stack.htm" ADD_DATE="1300721450" LAST_VISIT="1322361175" LAST_MODIFIED="1300721450" >How to use VB.NET Stack.url</A>
                <DT><A HREF="http://vb.net-informations.com/string/vb.net_String_Compare.htm" ADD_DATE="1300719929" LAST_VISIT="1322361175" LAST_MODIFIED="1300719929" >How to vb.net String Compare().url</A>
                <DT><A HREF="http://www.freevbcode.com/ShowCode.Asp?ID=3854" ADD_DATE="1300721682" LAST_VISIT="1322361175" LAST_MODIFIED="1300721683" >Implement the VB6 App Object in VB.NET.url</A>
                <DT><A HREF="http://www.informit.com/articles/article.aspx?p=23020#" ADD_DATE="1300718076" LAST_VISIT="1322361175" LAST_MODIFIED="1300718076" ICON_URI="http://www.informit.com/display/InformIT/images/objects/favicon.ico" >informit Creating Events and Delegates in VB.NET  Mapping Events to Delegates.url</A>
                <DT><A HREF="http://www.informit.com/articles/article.aspx?p=101592&seqNum=5#" ADD_DATE="1300720899" LAST_VISIT="1322361175" LAST_MODIFIED="1300720899" ICON_URI="http://www.informit.com/display/InformIT/images/objects/favicon.ico" >informit Understanding Objects and Collections in VB.NET  Understanding Collections.url</A>
                <DT><A HREF="http://www.startvbdotnet.com/oop/interface.aspx" ADD_DATE="1300717045" LAST_VISIT="1322361175" LAST_MODIFIED="1300717045" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >Interfaces in VB .NET.url</A>
                <DT><A HREF="http://ondotnet.com/pub/a/dotnet/2003/05/20/introvbnetoo.html" ADD_DATE="1300721844" LAST_VISIT="1322361175" LAST_MODIFIED="1300721844" ICON_URI="http://ondotnet.com/favicon.ico" >Introduction to VB.NET Object-Oriented Features - O'Reilly Media (instatiate).url</A>
                <DT><A HREF="http://www.startvbdotnet.com/language/loops.aspx" ADD_DATE="1300716297" LAST_VISIT="1322361175" LAST_MODIFIED="1300716297" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >Loops in VB .NET - For Loop, While Loop, Do Loop.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/aa260972(v=vs.60).aspx" ADD_DATE="1300718957" LAST_VISIT="1322361175" LAST_MODIFIED="1300718957" ICON_URI="http://msdn.microsoft.com/favicon.ico" >Manipulate Strings Faster in VB.NET.url</A>
                <DT><A HREF="http://www.startvbdotnet.com/forms/mdi.aspx" ADD_DATE="1300722467" LAST_VISIT="1322361175" LAST_MODIFIED="1300722468" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >MDI Applications in VB .NET.url</A>
                <DT><A HREF="http://www.developerfusion.com/article/5251/delegates-in-vbnet/2/" ADD_DATE="1300717988" LAST_VISIT="1322361175" LAST_MODIFIED="1300717988" ICON_URI="http://www.developerfusion.com/favicon.ico" >Multicast Delegates - Delegates in VB.NET - VB.NET tutorial - developer Fusion.url</A>
                <DT><A HREF="http://forums.asp.net/t/921582.aspx" ADD_DATE="1300716534" LAST_VISIT="1322361175" LAST_MODIFIED="1300716534" ICON_URI="http://i2.asp.net/common/www-css/i/favicon.ico?cdn_id=20110225" >need help  The Official Microsoft ASP.NET Forums.url</A>
                <DT><A HREF="http://www.developerfusion.com/article/1047/new-objectoriented-capabilities-in-vbnet/3/" ADD_DATE="1300716867" LAST_VISIT="1322361175" LAST_MODIFIED="1300716867" ICON_URI="http://www.developerfusion.com/favicon.ico" >Object Lifecycle - New Object-Oriented Capabilities in VB.NET - VB.NET tutorial - developer Fusion.url</A>
                <DT><A HREF="http://www.prestwoodboards.com/ASPSuite/kb/document_view.asp?qid=101947" ADD_DATE="1300717767" LAST_VISIT="1322361175" LAST_MODIFIED="1300717767" ICON_URI="http://www.prestwoodboards.com/favicon.ico" >prestwoodboards VB.Net Overriding (Overridable, Overrides) (VB.Net Language).url</A>
                <DT><A HREF="http://visualbasic.about.com/od/usingvbnet/a/printvb2005.htm" ADD_DATE="1300721772" LAST_VISIT="1322361175" LAST_MODIFIED="1300721772" ICON_URI="http://0.tqn.com/f/a08.ico" >Printing in Visual Basic .NET.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/system.collections.sortedlist.aspx" ADD_DATE="1300721400" LAST_VISIT="1322361175" LAST_MODIFIED="1300721400" ICON_URI="http://msdn.microsoft.com/favicon.ico" >SortedList Class (System.Collections).url</A>
                <DT><A HREF="http://www.codeproject.com/KB/vb/StepByStepEventsInVBNET.aspx" ADD_DATE="1300718798" LAST_VISIT="1322361175" LAST_MODIFIED="1300718798" ICON_URI="http://www.codeproject.com/favicon.ico" >Step by Step Event handling in VB.NET - CodeProject.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/92h5dc07.aspx" ADD_DATE="1300718411" LAST_VISIT="1322361175" LAST_MODIFIED="1300718411" ICON_URI="http://msdn.microsoft.com/favicon.ico" >String.PadLeft Method (Int32, Char) (System).url</A>
                <DT><A HREF="http://www.codeproject.com/KB/cs/StringBuilder_vs_String.aspx" ADD_DATE="1300719466" LAST_VISIT="1322361175" LAST_MODIFIED="1300719466" ICON_URI="http://www.codeproject.com/favicon.ico" >StringBuilder vs. String - Fast String Operations with .NET 2.0 - CodeProject.url</A>
                <DT><A HREF="http://www.startvbdotnet.com/oop/structure.aspx" ADD_DATE="1300721977" LAST_VISIT="1322361175" LAST_MODIFIED="1300721977" ICON_URI="http://www.startvbdotnet.com/favicon.ico" >Structures in VB .NET.url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/system.diagnostics.aspx" ADD_DATE="1300721588" LAST_VISIT="1322361175" LAST_MODIFIED="1300721588" ICON_URI="http://msdn.microsoft.com/favicon.ico" >System.Diagnostics Namespace ().url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/system.reflection.aspx" ADD_DATE="1300721543" LAST_VISIT="1322361175" LAST_MODIFIED="1300721543" ICON_URI="http://msdn.microsoft.com/favicon.ico" >System.Reflection Namespace ().url</A>
                <DT><A HREF="http://msdn.microsoft.com/en-us/library/2839d5h5(v=vs.71).aspx" ADD_DATE="1300719200" LAST_VISIT="1322361175" LAST_MODIFIED="1300719200" ICON_URI="http://msdn.microsoft.com/favicon.ico" >Using the StringBuilder Class.url</A>
                <DT><A HREF="http://ondotnet.com/pub/a/dotnet/excerpt/vbnetnut_appa/index.html?page=2" ADD_DATE="1300716027" LAST_VISIT="1322361175" LAST_MODIFIED="1300716027" ICON_URI="http://ondotnet.com/favicon.ico" >VB .NET Language in a Nutshell What's New and Different in VB .NET - O'Reilly Media.url</A>
                <DT><A HREF="http://www.harding.edu/fmccown/vbnet_csharp_comparison.html" ADD_DATE="1300715558" LAST_VISIT="1322361175" LAST_MODIFIED="1300715558" ICON_URI="http://www.harding.edu/favicon.ico" >VB.NET and C# Comparison.url</A>
                <DT><A HREF="http://vb.net-informations.com/language/vb.net_data_types.htm" ADD_DATE="1300715922" LAST_VISIT="1322361175" LAST_MODIFIED="1300715922" >VB.NET data types.url</A>
                <DT><A HREF="http://www.dotnetperls.com/datetime-format-vbnet" ADD_DATE="1300719979" LAST_VISIT="1322361175" LAST_MODIFIED="1300719979" ICON_URI="http://www.dotnetperls.com/favicon.ico" >VB.NET DateTime Format Functions.url</A>
                <DT><A HREF="http://www.winnershtriangle.com/w/VBNetHelp_QueueCollectionClass.asp" ADD_DATE="1300721371" LAST_VISIT="1322361175" LAST_MODIFIED="1300721371" >VB.NET Help Using the .NET Framework Queue class in VB.NET.url</A>
                <DT><A HREF="http://www.programmersheaven.com/2/Les_VBNET_5_p3" ADD_DATE="1300722174" LAST_VISIT="1322361175" LAST_MODIFIED="1300722174" ICON_URI="http://www.programmersheaven.com/favicon.ico" >VB.NET School - Constructor Calls in Inheritance - Lesson #5 - Page 3 - Programmer's Heaven.url</A>
                <DT><A HREF="http://www.dotnetperls.com/stringbuilder-vbnet" ADD_DATE="1300720235" LAST_VISIT="1322361175" LAST_MODIFIED="1300720235" ICON_URI="http://www.dotnetperls.com/favicon.ico" >VB.NET StringBuilder Examples.url</A>
                <DT><A HREF="http://www.mka-soft.com/vbnet-tutorial/13-vbnet-tutorial-10" ADD_DATE="1300720090" LAST_VISIT="1322361175" LAST_MODIFIED="1300720090" >VB.NET tutorial 10 Collections.url</A>
                <DT><A HREF="http://www.dotnetperls.com/underscore" ADD_DATE="1300715563" LAST_VISIT="1322361175" LAST_MODIFIED="1300715563" ICON_URI="http://www.dotnetperls.com/favicon.ico" >VB.NET Underscore Line Example.url</A>
                <DT><A HREF="http://www.homeandlearn.co.uk/net/nets7p3.html" ADD_DATE="1300715801" LAST_VISIT="1322361175" LAST_MODIFIED="1300715801" ICON_URI="http://www.homeandlearn.co.uk/favicon.ico" >Visual Basic .NET programming for Beginners - Char and Chars.url</A>
                <DT><A HREF="http://www.techrepublic.com/article/work-with-vbnets-arraylist-methods-and-properties/6101934" ADD_DATE="1300721032" LAST_VISIT="1322361175" LAST_MODIFIED="1300721032" ICON_URI="http://www.techrepublic.com/favicon.ico" >Work with VB.NET's ArrayList methods and properties  TechRepublic.url</A>
                <DT><A HREF="http://www.c-sharpcorner.com/UploadFile/mahesh/WorkingWithStringsP311232005021723AM/WorkingWithStringsP3.aspx" ADD_DATE="1300719865" LAST_VISIT="1322361175" LAST_MODIFIED="1300719865" ICON_URI="http://www.c-sharpcorner.com/Images/McnIcon.ico" >Working with Strings in VB.NET.url</A>
            </DL><p>
            <DT><A HREF="http://www.tomkitta.com/guides/cf_101.cfm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Basic ColdFusion - Tutorial.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1306888588">AUTHORS & INSTRUCTORS</H3>
        <DL><p>
            <DT><A HREF="http://www.horstmann.com/" ADD_DATE="1306888591" LAST_VISIT="1322361175" LAST_MODIFIED="1306888591" >Cay Horstmann's Home Page.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">BLOGS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298136569">Counters & Visitor Statistics</H3>
            <DL><p>
                <DT><A HREF="http://flagcounter.boardhost.com/" ADD_DATE="1298136572" LAST_VISIT="1322361175" LAST_MODIFIED="1298136572" >Flag Counter Forum.url</A>
                <DT><A HREF="http://flagcounter.com/faq.html" ADD_DATE="1298136630" LAST_VISIT="1322361175" LAST_MODIFIED="1298136630" >Flag Counter ۠Frequently Asked Questions.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">WordPress</H3>
            <DL><p>
                <DT><A HREF="http://en.forums.wordpress.com/topic/ltbrgtbreak-tags-not-working?replies=16" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >BrBreak Tags not working ˠWordPress.com Forums.url</A>
                <DT><A HREF="http://www.google.com/search?q=HOW+TO+use+br+tag+in+wordpress&hl=en&rls=com.microsoft%3Aen-us&num=10&lr=&ft=i&cr=&safe=images&tbs=,qdr:y" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >HOW TO use br tag in wordpress - Google Search.url</A>
                <DT><A HREF="http://www.clementfaria.com/blog/moving-an-entire-wordpress-website-to-another-web-host/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Moving an Entire Wordpress Website to Another Web Host  cfWeblog - A Web Developer's Journal.url</A>
                <DT><A HREF="http://en.forums.wordpress.com/topic/new-line-and-ltbrgt-not-working?replies=8" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >New line and br not working! ˠWordPress.com Forums.url</A>
                <DT><A HREF="http://wordpress.org/support/topic/cant-put-in-ltbr-gttag-in-wordpress-post" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >WordPress ۠Support ۠Can't put in br - tag in wordpress post.url</A>
                <DT><A HREF="http://wordpress.org/support/topic/disable-automatic-p-and-br-tags-in-html-editor" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >WordPress ۠Support ۠Disable automatic p and br tags in HTML editor.url</A>
            </DL><p>
            <DT><A HREF="http://www.adaptivepath.com/ideas/essays/archives/001235.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >adaptive path ۠soft skills for hard conversations.url</A>
            <DT><A HREF="http://www.clementfaria.com/blog/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >cfWeblog - A Web Developer's Journal.url</A>
            <DT><A HREF="http://matthom.com/archive/2011/03/01/subversion-vs-git-brief-overview" ADD_DATE="1315444542" LAST_VISIT="1322361175" LAST_MODIFIED="1315444542" ICON_URI="http://matthom.com/favicon_m1.ico" >Matt Thommes - Subversion vs. Git brief overview.url</A>
            <DT><A HREF="http://theludditedeveloper.wordpress.com/2009/04/07/please-wait-while-the-installer-finishes-determining-your-disk-space-requirements/" ADD_DATE="1307824873" LAST_VISIT="1322361175" LAST_MODIFIED="1307824873" ICON_URI="http://1.gravatar.com/blavatar/f8ae9567027985672b43ffc46d3b9eeb?s=16" >Please wait while the installer finishes determining your disk space requirements !!! ˠThe Luddite Developer.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">COLDFUSION</H3>
        <DL><p>
            <DT><A HREF="http://www.careerbuilder.com/JobSeeker/Jobs/JobDetails.aspx?job_did=J3G0MX5W6RHLN6BY6FY&cbRecursionCnt=1&cbsid=8b67e15c1b6b45e597d477545df48e6c-329509739-ww-6&ns_siteid=ns_us_g_coldfusion_dot_net" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adecco - Java-Cold Fusion-DotNet Web Developer.url</A>
            <DT><A HREF="http://www.adobe.com/support/coldfusion/tutorial_index.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe - ColdFusion Support Center  Tutorial and Article Index.url</A>
            <DT><A HREF="http://livedocs.adobe.com/coldfusion/8/htmldocs/help.html?content=dotNet_04.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Adobe ColdFusion 8.url</A>
            <DT><A HREF="http://www.tomkitta.com/guides/cf_101.cfm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Basic ColdFusion - Tutorial.url</A>
            <DT><A HREF="http://www.cflib.org/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >CFLib.org ֠Welcome to CFLib.org.url</A>
            <DT><A HREF="http://www.anujgakhar.com/2008/03/12/coldfusion-8-net-and-excel-example/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Coldfusion 8, .NET and Excel Example  Anuj Gakhar's Blog.url</A>
            <DT><A HREF="http://127.0.0.1:8500/CFIDE/administrator/enter.cfm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >coldfusion Configuring Server.url</A>
            <DT><A HREF="http://www.learn-coldfusion-tutorial.com/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >ColdFusion Tutorial Home.url</A>
            <DT><A HREF="http://articles.sitepoint.com/article/cold-fusion-tutorial" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >ColdFusion Tutorial Part I.url</A>
            <DT><A HREF="http://www.indeed.com/job/Java-Cold-Fusion-Dotnet-Web-Developer-at-RCE-in-Kansas-City,-MO-6df2c940fa580b7d" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Java-Cold Fusion-DotNet Web Developer - RCE - Kansas City, MO  Indeed.com.url</A>
            <DT><A HREF="http://msdn.microsoft.com/en-us/library/aa479305.aspx" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Migrating from ColdFusion to ASP.NET.url</A>
            <DT><A HREF="http://www.coldfusionjedi.com/index.cfm/2007/11/13/ColdFusionDotNet-question-for-my-readers" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Raymond Camden's ColdFusion Blog ColdFusion-DotNet question for my readers.url</A>
            <DT><A HREF="http://www.bennadel.com/blog/1932-Using-NET-dotnet-Regular-Expressions-In-ColdFusion.htm" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Using .NET (dotnet) Regular Expressions In ColdFusion.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=DD78zUgdVzU&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - ADC Presents - Get Started with ColdFusion Builder.url</A>
            <DT><A HREF="http://www.youtube.com/user/AdobeADC#p/u/12/IkWkZGLm-jo" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Adobe Developer Connection.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=i0_KBElnEqo&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - ColdFusion - Basic Tutorial 101.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=Q9-Y_CUtyUI&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - ColdFusion Basic.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=4PMyND6Ty_A" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Video Tutorial Getting Started with ColdFusion 8.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=x8oFQlCoHg0&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Why ColdFusion.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">DATABASES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Database Design</H3>
            <DL><p>
                <DT><A HREF="http://articles.directorym.com/Database_Design-a800294.html#8001371" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Database Design - database, databases, database design, database development, database developm.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">MySQL</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Errors</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Can't Connect</H3>
                    <DL><p>
                        <DT><A HREF="http://dev.mysql.com/doc/refman/5.1/en/can-not-connect-to-server.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >MySQL  MySQL 5.1 Reference Manual  B.5.2.2 Can't connect to [local] MySQL server.url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307578529">TUTORIALS</H3>
                <DL><p>
                    <DT><A HREF="http://php-programming-tutorial.com/blog/" ADD_DATE="1307578530" LAST_VISIT="1322361175" LAST_MODIFIED="1307578530" >PHP-Programming-Tutorial.com Blog  PHP Programming Tutorials.url</A>
                </DL><p>
                <DT><A HREF="http://dev.mysql.com/doc/refman/5.1/en/can-not-connect-to-server.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >MySQL  MySQL 5.1 Reference Manual  B.5.2.2 Can't connect to [local] MySQL server.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">EMPLOYMENT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Freelancing</H3>
            <DL><p>
                <DT><A HREF="http://designm.ag/freelance/part-time-designer/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >15 Tips for Breaking in as a Part-Time Freelancer - Web Design Blog ֠DesignM.ag.url</A>
                <DT><A HREF="http://dustinbrewer.com/freelance-web-designers-toolbox-managing-your-business/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Freelance Web Designerӳ toolbox Managing your business  Dustin Brewer Web Design.url</A>
                <DT><A HREF="http://dustinbrewer.com/what-is-a-freelance-web-designer/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >What is a freelance web designer  Dustin Brewer Web Design.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">FLEX</H3>
        <DL><p>
            <DT><A HREF="http://www.youtube.com/watch?v=07ND5J0pi8U&feature=PlayList&p=C8D8292ABE8EE812&playnext_from=PL&playnext=1&index=109" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - ADC Presents - Blazing Fast Data Transfer in a Flex Application.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=IkWkZGLm-jo&eurl=http%3A%2F%2Fwww.youtube.com%2Fuser%2FAdobeADC%23p%2Fu%2F12%2FIkWkZGLm-jo&feature=player_profilepage" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - ADC Presents - Build your First Desktop Application with Flash Builder.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=vwHhhPnM4b4&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Why Adobe Flex.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=WkmH25kJ_M8&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >YouTube - Why Flex.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">GAME DEVELOPMENT</H3>
        <DL><p>
            <DT><A HREF="http://www.gamedev.net/reference/art/features/pixelart2/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >GameDev.net -- Creating Minimal Pixel Art with Photoshop (Part 2).url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">IDE's</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Dreamweaver</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Preview In Browser Not Working</H3>
                <DL><p>
                    <DT><A HREF="http://www.justskins.com/forums/could-not-connect-to-jrun-coldfusion-servers-on-hostlocalhost-82056.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Could not connect to JRun-Coldfusion Servers on hostlocalhost - Coldfusion Server Administratio.url</A>
                    <DT><A HREF="http://kb2.adobe.com/cps/349/3491671c.html" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dreamweaver 8 for Windows loses FTP login settings.url</A>
                    <DT><A HREF="http://www.vineyardesigns.com/resources/dreamweaver/test_upload.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dreamweaver CS3 Preview in Browser & File Upload- FTP.url</A>
                    <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US376&q=Dreamweaver+CS3+%22preview+in+browser%22+not+working%21&btnG=Search&aq=f&aqi=&aql=&oq=&gs_rfai=" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Dreamweaver CS3 preview in browser not working! - Google Search.url</A>
                    <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=dreamweaver+debug+in+browser+doesn%27t+work" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >dreamweaver debug in browser doesn't work - Google Search.url</A>
                    <DT><A HREF="http://groups.google.com/group/macromedia.dreamweaver/browse_thread/thread/8e368fb99178fd8a" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Preview Browser Not Working - macromedia.dreamweaver  Google Groups.url</A>
                    <DT><A HREF="http://webcache.googleusercontent.com/search?q=cache:BHXVMkYIU_MJ:www.seattlecfug.com/forum/code-help/2742+Firefox+can't+establish+a+connection+to+the+server+at+localhost:8500&cd=3&hl=en&ct=clnk&gl=us" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Seattle CFUG - ColdFusion Users Group  Forum.url</A>
                </DL><p>
            </DL><p>
            <DT><A HREF="http://www.eclipse.org/downloads/index-helios.php" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Eclipse Downloads.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1312542352">JAVASCRIPT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1312542362">Javascript vs Perl</H3>
            <DL><p>
                <DT><A HREF="http://interglacial.com/hoj/hoj.html" ADD_DATE="1312542363" LAST_VISIT="1322361175" LAST_MODIFIED="1312542363" ICON_URI="http://interglacial.com/favicon.ico" >Higher-Order JavaScript.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1313797936">Referencing & Browser Issues</H3>
            <DL><p>
                <DT><A HREF="http://www.howtocreate.co.uk/tutorials/javascript/referencing" ADD_DATE="1313797938" LAST_VISIT="1322361175" LAST_MODIFIED="1313797939" ICON_URI="http://www.howtocreate.co.uk/favicon.ico" >JavaScript tutorial - Referencing.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">LAW</H3>
        <DL><p>
            <DT><A HREF="http://www.progfree.org/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >League for Programming Freedom (LPF).url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">ORGANIZATIONS</H3>
        <DL><p>
            <DT><A HREF="http://www.hwg.org/" ADD_DATE="1298088102" LAST_VISIT="1322361175" LAST_MODIFIED="1298088102" >Website Design - HWG.ORG.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PERL</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1306888108">Applied Real World</H3>
            <DL><p>
                <DT><A HREF="http://www.cs.cf.ac.uk/Dave/PERL/node236.html#SECTION002220000000000000000" ADD_DATE="1306888110" LAST_VISIT="1322361175" LAST_MODIFIED="1306888110" ICON_URI="http://www.cs.cf.ac.uk/favicon.ico" >An Address Book Search Engine.url</A>
                <DT><A HREF="http://www.bioperl.org/wiki/Main_Page" ADD_DATE="1306888149" LAST_VISIT="1322361175" LAST_MODIFIED="1306888149" >BioPerl.url</A>
                <DT><A HREF="http://www.ibm.com/developerworks/linux/library/l-punix/index.html" ADD_DATE="1306888268" LAST_VISIT="1322361175" LAST_MODIFIED="1306888273" ICON_URI="http://www.ibm.com/favicon.ico" >Cultured Perl Automating UNIX system administration with Perl.url</A>
                <DT><A HREF="http://docstore.mik.ua/orelly/perl/sysadmin/" ADD_DATE="1306888192" LAST_VISIT="1322361175" LAST_MODIFIED="1306888192" ICON_URI="http://docstore.mik.ua/favicon.ico" >Perl for System Administration.url</A>
                <DT><A HREF="http://www.perlmol.org/pod/Chemistry/Tutorial.html" ADD_DATE="1306888170" LAST_VISIT="1322361175" LAST_MODIFIED="1306888170" ICON_URI="http://www.perlmol.org/favicon.ico" >PerlMol - ChemistryTutorial - PerlMol Quick Tutorial.url</A>
                <DT><A HREF="http://www.cs.cf.ac.uk/Dave/PERL/" ADD_DATE="1306888117" LAST_VISIT="1322361175" LAST_MODIFIED="1306888117" ICON_URI="http://www.cs.cf.ac.uk/favicon.ico" >Practical Perl Programming.url</A>
                <DT><A HREF="http://www.cs.cf.ac.uk/Dave/PERL/node241.html" ADD_DATE="1306888287" LAST_VISIT="1322361175" LAST_MODIFIED="1306888287" ICON_URI="http://www.cs.cf.ac.uk/favicon.ico" >Reading a Log File In Perl.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307829504">Built-In Functions & Operators</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307850422">local</H3>
                <DL><p>
                    <DT><A HREF="http://perldoc.perl.org/perlsub.html#When-to-Still-Use-local()" ADD_DATE="1307850426" LAST_VISIT="1322361175" LAST_MODIFIED="1307850426" >perlsub - perldoc.perl.org.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307846188">Shift Pop Push Unshift</H3>
                <DL><p>
                    <DT><A HREF="http://stackoverflow.com/questions/296964/what-does-shift-do-in-perl" ADD_DATE="1307846191" LAST_VISIT="1322361175" LAST_MODIFIED="1307846191" ICON_URI="http://cdn.sstatic.net/stackoverflow/img/favicon.ico" >builtin - What does shift() do in Perl - Stack Overflow.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307847834">Stat</H3>
                <DL><p>
                    <DT><A HREF="http://perldoc.perl.org/functions/stat.html" ADD_DATE="1307847835" LAST_VISIT="1322361175" LAST_MODIFIED="1307847835" >stat - perldoc.perl.org.url</A>
                </DL><p>
                <DT><A HREF="http://stackoverflow.com/questions/296964/what-does-shift-do-in-perl" ADD_DATE="1307829506" LAST_VISIT="1322361176" LAST_MODIFIED="1307829506" ICON_URI="http://cdn.sstatic.net/stackoverflow/img/favicon.ico" >builtin - What does shift() do in Perl - Stack Overflow.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307847219">Escape Characters</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307847237">Leaning Toothpick Syndrome (LTS)</H3>
                <DL><p>
                    <DT><A HREF="http://www.webmasterkb.com/Uwe/Forum.aspx/perl/14286/File-Find-problem-on-windows-apache-activePerl" ADD_DATE="1307847240" LAST_VISIT="1322361176" LAST_MODIFIED="1307847240" ICON_URI="http://www.webmasterkb.com/favicon.ico" >Find problem on windows+apache+activePerl.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">File Handling & IO</H3>
            <DL><p>
                <DT><A HREF="http://www.troubleshooters.com/codecorn/littperl/perlfile.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Perl File Input, Output and Sorting.url</A>
                <DT><A HREF="http://www.tutorialspoint.com/perl/perl_files.htm" ADD_DATE="1307666896" LAST_VISIT="1322361176" LAST_MODIFIED="1307666896" >PERL Files & I-O.url</A>
                <DT><A HREF="http://www.gossland.com/course/files/editing.html" ADD_DATE="1307849156" LAST_VISIT="1322361176" LAST_MODIFIED="1307849156" ICON_URI="http://www.gossland.com/favicon.ico" >Perl Tutorial Course for Windows.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Launch Windows Programs</H3>
            <DL><p>
                <DT><A HREF="http://mail.perl.org.il/pipermail/perl/2002-February/000068.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >[Perl] run a program in windows.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307579093">MODULES</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307579098">CPAN</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307579107">Zip Unzip & Compression</H3>
                    <DL><p>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307811956">WINDOWS & ACTIVEPERL</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307813719">Compress & Decompress</H3>
                    <DL><p>
                        <DT><H3 FOLDED ADD_DATE="1307813723">RAR</H3>
                        <DL><p>
                            <DT><A HREF="http://search.cpan.org/~nikosv/Archive-Unrar-2.8/lib/Archive/Unrar.pm" ADD_DATE="1307813725" LAST_VISIT="1322361176" LAST_MODIFIED="1307813725" ICON_URI="http://search.cpan.org/favicon.ico" >archiveUnrar - search.cpan.org.url</A>
                        </DL><p>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307825534">File & Directory & IO</H3>
                    <DL><p>
                        <DT><H3 FOLDED ADD_DATE="1307848034">File-Find</H3>
                        <DL><p>
                            <DT><A HREF="http://docs.activestate.com/activeperl/5.10/lib/File/Find.html" ADD_DATE="1307848046" LAST_VISIT="1322361176" LAST_MODIFIED="1307848046" >Find - Traverse a directory tree..url</A>
                            <DT><A HREF="http://www.webmasterkb.com/Uwe/Forum.aspx/perl/14286/File-Find-problem-on-windows-apache-activePerl" ADD_DATE="1307848037" LAST_VISIT="1322361176" LAST_MODIFIED="1307848037" ICON_URI="http://www.webmasterkb.com/favicon.ico" >Find problem on windows+apache+activePerl.url</A>
                            <DT><A HREF="http://www.unix.com/shell-programming-scripting/9730-how-find-1-day-old-file-windows-active-perl.html" ADD_DATE="1307848055" LAST_VISIT="1322361176" LAST_MODIFIED="1307848055" ICON_URI="http://www.unix.com/favicon.ico" >How to find 1 day old file on Windows for Active Perl - The UNIX and Linux Forums.url</A>
                        </DL><p>
                        <DT><H3 FOLDED ADD_DATE="1307825542">Recurse Directory</H3>
                        <DL><p>
                            <DT><A HREF="http://www.webmasterkb.com/Uwe/Forum.aspx/perl/14286/File-Find-problem-on-windows-apache-activePerl" ADD_DATE="1307848009" LAST_VISIT="1322361176" LAST_MODIFIED="1307848009" ICON_URI="http://www.webmasterkb.com/favicon.ico" >Find problem on windows+apache+activePerl.url</A>
                            <DT><A HREF="http://www.gossland.com/course/files/recursive.html" ADD_DATE="1307825545" LAST_VISIT="1322361176" LAST_MODIFIED="1307825545" ICON_URI="http://www.gossland.com/favicon.ico" >Perl Tutorial Course for Windows.url</A>
                        </DL><p>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307846078">Process Control</H3>
                    <DL><p>
                        <DT><A HREF="http://search.cpan.org/~jdb/Win32-Process-0.14/Process.pm" ADD_DATE="1307846080" LAST_VISIT="1322361176" LAST_MODIFIED="1307846081" ICON_URI="http://search.cpan.org/favicon.ico" >win32Process - search.cpan.org.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1307811969">Win32</H3>
                    <DL><p>
                        <DT><A HREF="http://docstore.mik.ua/orelly/perl/learn32/ch14_06.htm" ADD_DATE="1307846146" LAST_VISIT="1322361176" LAST_MODIFIED="1307846147" ICON_URI="http://docstore.mik.ua/favicon.ico" >Learning Perl on Win32 Systems - [Chapter 14] 14.6 Exercises.url</A>
                        <DT><A HREF="http://perl.active-venture.com/lib/Win32.html" ADD_DATE="1307811972" LAST_VISIT="1322361176" LAST_MODIFIED="1307811972" >Perl 5.8 Documentation - Win32 - Interfaces to some Win32 API Functions.url</A>
                    </DL><p>
                </DL><p>
                <DT><A HREF="http://docstore.mik.ua/orelly/perl4/porm/ch13_01.htm" ADD_DATE="1307849308" LAST_VISIT="1322361176" LAST_MODIFIED="1307849308" ICON_URI="http://docstore.mik.ua/favicon.ico" >Writing a Distribution (Learning Perl Objects, References & Modules).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Regular Expressions</H3>
            <DL><p>
                <DT><A HREF="http://docs.activestate.com/komodo/4.4/regex-intro.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >!!! BEST - Regular Expressions Primer (LOTS of examples!).url</A>
                <DT><A HREF="http://www.perlfect.com/articles/regextutor.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Perl Regex Interactive Tutorial.url</A>
                <DT><A HREF="http://www.somacon.com/p127.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Perl Regular Expressions by Example.url</A>
                <DT><A HREF="http://www.anaesthetist.com/mnm/perl/Findex.htm#regex.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Perl regular expressions for the common man.url</A>
                <DT><A HREF="http://www.regexbuddy.com/library.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Regex Library - Save Regular Expressions.url</A>
                <DT><A HREF="http://en.wikipedia.org/wiki/Regular_expression_examples" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Regular expression examples - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.cs.tut.fi/~jkorpela/perl/regexp.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Regular expressions in Perl - a summary with examples.url</A>
                <DT><A HREF="http://docs.activestate.com/komodo/4.4/regex-intro.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Regular Expressions Primer.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1307827229">Special variables</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1307828247">$INPLACE_EDIT ($^1)</H3>
                <DL><p>
                    <DT><A HREF="http://www.webbasedprogramming.com/Perl-Quick-Reference/ch2.htm" ADD_DATE="1307828251" LAST_VISIT="1322361176" LAST_MODIFIED="1307828251" >Perl Quick Reference.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1307849056">Default Variable ($_)</H3>
                <DL><p>
                    <DT><A HREF="http://www.gossland.com/course/intro/vars.html" ADD_DATE="1307849058" LAST_VISIT="1322361176" LAST_MODIFIED="1307849058" ICON_URI="http://www.gossland.com/favicon.ico" >Perl Tutorial Course for Windows.url</A>
                </DL><p>
                <DT><A HREF="http://affy.blogspot.com/p5be/ch12.htm" ADD_DATE="1307827230" LAST_VISIT="1322361176" LAST_MODIFIED="1307827230" ICON_URI="http://affy.blogspot.com/favicon.ico" >Perl 5 by Example Using Special Variables.url</A>
                <DT><A HREF="http://www.webbasedprogramming.com/Perl-Quick-Reference/ch2.htm" ADD_DATE="1307846202" LAST_VISIT="1322361176" LAST_MODIFIED="1307846202" >Perl Quick Reference.url</A>
                <DT><A HREF="http://www.perlmonks.org/?node_id=353259" ADD_DATE="1307829539" LAST_VISIT="1322361176" LAST_MODIFIED="1307829539" ICON_URI="http://www.perlmonks.org/favicon.ico" >Perl Special Variables Quick Reference.url</A>
                <DT><A HREF="http://perldoc.perl.org/perlvar.html" ADD_DATE="1307846209" LAST_VISIT="1322361176" LAST_MODIFIED="1307846209" >perlvar - perldoc.perl.org.url</A>
            </DL><p>
            <DT><A HREF="http://www.wiley.com/legacy/compbooks/stein/index.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Official Guide to Programming with CGI.pm.url</A>
            <DT><A HREF="http://www.rexswain.com/perl5.html#contents" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Rex Swain's HTMLified Perl 5 Reference Guide.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">PROGRAMMING SITES</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Tutorials</H3>
            <DL><p>
                <DT><A HREF="http://www.homeandlearn.co.uk/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Free Beginners Computer Tutorials and Lessons.url</A>
            </DL><p>
            <DT><A HREF="http://www.developmentnow.com/g/59_2004_10_0_0_279440/Cannot-access-localhost-under-Windows-XP-Service-Pack-2.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Cannot access localhost under Windows XP Service Pack 2 -- inetserver iis.url</A>
            <DT><A HREF="http://www.codinghorror.com/blog/2008/07/investing-in-a-quality-programming-chair.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Coding Horror Investing in a Quality Programming Chair.url</A>
            <DT><A HREF="http://skwo.wordpress.com/2008/10/25/mount-vdi-file/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Mount VDI file ˠLinux, Programming, Computers and Life.url</A>
            <DT><A HREF="http://en.wordpress.com/tag/programming/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Programming נBlogs, Pictures, and more on WordPress.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1307680562">PROGRAMMING SKILL SET</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Life:_A_User%27s_Manual" ADD_DATE="1307766012" LAST_VISIT="1322361176" LAST_MODIFIED="1307766012" ICON_URI="http://en.wikipedia.org/favicon.ico" >life A User's Manual - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Oulipo" ADD_DATE="1307766003" LAST_VISIT="1322361176" LAST_MODIFIED="1307766004" ICON_URI="http://en.wikipedia.org/favicon.ico" >Oulipo - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.ethicalhacker.net/content/view/82/2/" ADD_DATE="1307680565" LAST_VISIT="1322361176" LAST_MODIFIED="1307680565" ICON_URI="http://www.ethicalhacker.net/images/favicon.ico" >The Ethical Hacker Network - Programming Survival Skills.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">SOCIAL NETWORKS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Buttons & Graphics</H3>
            <DL><p>
                <DT><A HREF="http://caseyzemanonline.com/category/internet-marketing/social-media-strategies/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >http--caseyzemanonline.com-category-internet-marketing-social-media-strategies-.url</A>
            </DL><p>
            <DT><A HREF="http://www.clementfaria.com/blog/create-a-smart-facebook-like-button-using-php/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Create A ғmartҠFacebook Like Button Using php  cfWeblog - A Web Developer's Journal.url</A>
            <DT><A HREF="http://www.comanswer.com/question/posting-status-via-facebook-s-graph-api" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Posting status via Facebook's graph api - ComAnswer.com.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=WQ9jSwIIY5c&feature=related" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >YouTube - Creating A Facebook Landing Page With Video.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">VISUAL BASIC</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">VB</H3>
            <DL><p>
                <DT><A HREF="http://www.profsr.com/vb/vbless01.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Visual Basic 6 forms and properties.url</A>
                <DT><A HREF="http://www.vbexplorer.com/VBExplorer/vb_feature/may2000/may2000.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Visual Basic Explorer - Tutorials - File Operations in Visual Basic.url</A>
                <DT><A HREF="http://www.devdos.com/vb/lesson2.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Visual Basic Tutorial (Lesson 2).url</A>
                <DT><A HREF="http://www.vbtutor.net/vbtutor.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Visual Basic Tutorial - visual basic learning center.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">VB.NET</H3>
            <DL><p>
                <DT><A HREF="http://www.developer.com/net/vb/article.php/3448491" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Discovering Visual Basic .NET - Developer.com.url</A>
                <DT><A HREF="http://www.developer.com/net/vb/article.php/3453181" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Discovering Visual Basic .NET Using Functions and Arguments - Developer.com.url</A>
                <DT><A HREF="file:///L:/%5BPROGRAMMING%5D/_PROGRAMMING%20CATEGORIES%20HEIRARCHY/%5BWEB%20RESOURCES%5D/%5Dfiles/Tutorialized.com_VB_VisualBasicFileManipulation_111206_01.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Visual Basic File Manipulation Working With Files Tutorial.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">WEB DESIGN</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Adsense & Online Marketing</H3>
            <DL><p>
                <DT><A HREF="http://www.tipstechtricks.com/search/label/Adsense%20tips" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Tips Tech Tricks Adsense tips.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">ANALYTICS</H3>
            <DL><p>
                <DT><A HREF="http://matthewjamestaylor.com/blog/link-source-ordering-seo" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Link Source Ordering Focus link popularity onto key pages with SEO.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">ASCII Codes</H3>
            <DL><p>
                <DT><A HREF="http://www.asciitable.com/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Ascii Table - ASCII character codes and html, octal, hex and decimal chart conversion.url</A>
                <DT><A HREF="http://www.ascii.cl/htmlcodes.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >HTML Codes - Table of ascii characters and symbols.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">CSS</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Background Color</H3>
                <DL><p>
                    <DT><A HREF="http://www.w3schools.com/css/pr_background-color.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS background-color property.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Border</H3>
                <DL><p>
                    <DT><A HREF="http://www.w3schools.com/css/css_border.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Border.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Browser Compatibility</H3>
                <DL><p>
                    <DT><A HREF="http://centricle.com/ref/css/filters/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >centricle  css filters (css hacks).url</A>
                    <DT><A HREF="http://www.quirksmode.org/css/opacity.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS2 - opacity.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Bullets</H3>
                <DL><p>
                    <DT><A HREF="http://www.w3schools.com/CSS/pr_list-style-type.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS list-style-type property.url</A>
                    <DT><A HREF="http://www.pptools.com/ppt2html/FAQ00145.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS to control the bullet style in bulleted lists.url</A>
                    <DT><A HREF="http://www.w3schools.com/CSS/tryit.asp?filename=trycss_list-style-type_ex" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Tryit Editor v1.4.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Buttons, Navigation, & Menus</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298139020">Shiny Buttons</H3>
                    <DL><p>
                        <DT><A HREF="http://www.youtube.com/watch?v=XeVdXRaxtOA" ADD_DATE="1298139021" LAST_VISIT="1322361176" LAST_MODIFIED="1298139021" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Photoshop Ep.4 Make a Glint-Shine Effect!.url</A>
                    </DL><p>
                    <DT><A HREF="http://www.instantshift.com/2009/01/11/30-excellent-css-based-navigation-and-buttons-tutorial/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >30 Excellent CSS Based Navigation and Buttons Tutorial  Tutorials  instantShift.url</A>
                    <DT><A HREF="http://matthewjamestaylor.com/blog/beautiful-css-centered-menus-no-hacks-full-cross-browser-support" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Beautiful Horizontally Centered Menus-Tabs-List. No CSS hacks. Full cross-browser..url</A>
                    <DT><A HREF="http://www.webcredible.co.uk/user-friendly-resources/css/css-navigation-menu.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS navigation menu.url</A>
                    <DT><A HREF="http://www.finalwebsites.com/tutorials/css-navigation-bar.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS tutorial Create a dynamic horizontal navigation bar.url</A>
                    <DT><A HREF="http://websitetips.com/css/tutorials/menus/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >http--websitetips.com-css-tutorials-menus-.url</A>
                    <DT><A HREF="http://www.noupe.com/css/multilevel-drop-down-navigation-menus-examples-and-tutorials.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Multilevel Drop Down Navigation Menus Examples and Tutorials - Noupe.url</A>
                    <DT><A HREF="http://experiments.brandoncash.net/sexybuttons/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Sexy CSS buttons.url</A>
                    <DT><A HREF="http://www.stunicholls.com/menu/pro_dropdown_2.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >stu nicholls dot com  menu - Professional dropdown #2.url</A>
                    <DT><A HREF="http://www.learnwebdesignonline.com/css-tutorials/verticalmenu.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >tutorial Vertical Menu with Hover Effect using CSS.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Clear</H3>
                <DL><p>
                    <DT><A HREF="http://www.quirksmode.org/css/clearing.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS - Clearing floats.url</A>
                    <DT><A HREF="http://programming.top54u.com/Samples/CSS/Box-Properties/CSS-Clear-Both/Default.aspx" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Clear Both Style.url</A>
                    <DT><A HREF="http://www.w3schools.com/Css/pr_class_clear.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS clear property.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Effects & Special Tricks</H3>
                <DL><p>
                    <DT><A HREF="http://www.fred.net/dhark/demos/css/css_filter_examples.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Filter Examples.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Float</H3>
                <DL><p>
                    <DT><A HREF="http://www.positioniseverything.net/easyclearing.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Clearing a float container without source markup.url</A>
                    <DT><A HREF="http://programming.top54u.com/Samples/CSS/Box-Properties/CSS-Clear-Both/Default.aspx" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Clear Both Style.url</A>
                    <DT><A HREF="http://www.bigbaer.com/css_tutorials/css.float.html.tutorial.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Float Html Tutorial.url</A>
                    <DT><A HREF="http://css.maxdesign.com.au/floatutorial/introduction.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >floatutorial Float basics.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Fonts</H3>
                <DL><p>
                    <DT><A HREF="http://www.w3schools.com/css/css_font.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Font.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Margin Auto</H3>
                <DL><p>
                    <DT><A HREF="http://www.bluerobot.com/web/css/center1.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Centering Auto-width Margins.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Margin Bottom</H3>
                <DL><p>
                    <DT><A HREF="http://bytes.com/topic/html-css/answers/98531-bottom-padding-margin-ul" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >bottom padding or margin in ul - HTML - CSS answers.url</A>
                    <DT><A HREF="http://www.w3schools.com/Css/pr_margin-bottom.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS margin-bottom property.url</A>
                    <DT><A HREF="http://reference.sitepoint.com/css/margin-bottom" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >margin-bottom (CSS property).url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Multi Column Layout</H3>
                <DL><p>
                    <DT><A HREF="http://www.positioniseverything.net/guests/3colcomplex.html#" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >3 Column Complex Layout demo.url</A>
                    <DT><A HREF="http://www.w3.org/TR/css3-multicol/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Multi-column Layout Module.url</A>
                    <DT><A HREF="http://www.manisheriar.com/holygrail/index.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Three Column Liquid Layout by Mani Sheriar.url</A>
                    <DT><A HREF="http://css.maxdesign.com.au/floatutorial/tutorial0901.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >floatutorial Tutorial 9 - Step 1.url</A>
                    <DT><A HREF="http://glish.com/css/7.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >glish.com  CSS layout techniques  3 columns, the holy grail.url</A>
                    <DT><A HREF="http://matthewjamestaylor.com/blog/perfect-multi-column-liquid-layouts" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Perfect multi-column CSS liquid layouts - iPhone compatible.url</A>
                    <DT><A HREF="http://matthewjamestaylor.com/blog/perfect-3-column.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >The Perfect 3 Column Liquid Layout No CSS hacks. SEO friendly. iPhone compatible..url</A>
                    <DT><A HREF="http://css-discuss.incutio.com/wiki/Three_Column_Layouts" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Three Column Layouts - CSS Discuss.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Positioning</H3>
                <DL><p>
                    <DT><A HREF="http://www.brainjar.com/css/positioning/default3.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >brainjar.com CSS Positioning.url</A>
                    <DT><A HREF="http://www.barelyfitz.com/screencast/html-training/css/positioning/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Learn CSS Positioning in Ten Steps position static relative absolute float.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Reference</H3>
                <DL><p>
                    <DT><A HREF="http://javascriptkit.com/dhtmltutors/cssreference.shtml" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >[BEST!] Complete CSS Reference.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Tips, Tricks, and Traps</H3>
                <DL><p>
                    <DT><A HREF="http://www.positioniseverything.net/easyclearing.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Clearing a float container without source markup.url</A>
                    <DT><A HREF="http://www.quirksmode.org/css/clearing.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS - Clearing floats.url</A>
                    <DT><A HREF="http://www.ozzu.com/website-design-forum/how-disable-css-for-one-link-t1287.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >How to disable CSS for one link.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Word Wrap</H3>
                <DL><p>
                    <DT><A HREF="http://letmehelpyougeeks.blogspot.com/2009/05/using-word-wrap-css-property-in-ie.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Let me help you geeks Using the word-wrap css property in IE.url</A>
                </DL><p>
                <DT><A HREF="http://www.w3schools.com/css/css_dont.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >CSS Don't.url</A>
                <DT><A HREF="http://www.bigbaer.com/contents.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Table of Contents.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Hand Coding</H3>
            <DL><p>
                <DT><A HREF="http://designscraps.blogspot.com/2008/12/art-of-hand-coding.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Design Scraps The Art of Hand Coding.url</A>
                <DT><A HREF="http://www.sohtanaka.com/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >http--www.sohtanaka.com-.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">HTML (Not CSS)</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">AutoLoading Pages</H3>
                <DL><p>
                    <DT><A HREF="http://www.echoecho.com/htmlmetatags02.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Metatags  Autoload Pages - HTML Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Breadcrumbs</H3>
                <DL><p>
                    <DT><A HREF="http://www.ehow.com/way_5255707_html-breadcrumbs-tutorial.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >HTML Breadcrumbs Tutorial  eHow.com.url</A>
                    <DT><A HREF="http://www.webdesignpractices.com/navigation/breadcrumb.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Web Design Practices  Breadcrumb Navigation.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">HR</H3>
                <DL><p>
                    <DT><A HREF="http://www.pagetutor.com/html_tutor/lesson22.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >HTML Tutorial - Lesson 22.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Scripts</H3>
                <DL><p>
                    <DT><A HREF="http://www.w3.org/TR/REC-html40/interact/scripts.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Scripts in HTML documents.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">TABLE</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Colors</H3>
                    <DL><p>
                        <DT><A HREF="http://www.htmlgoodies.com/tutorials/colors/article.php/3478971/So-You-Want-Color-in-a-Table-Huh.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >So, You Want Color in a Table, Huh - www.htmlgoodies.com.url</A>
                    </DL><p>
                </DL><p>
                <DT><A HREF="http://www.pagetutor.com/html_tutor/lesson22.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >HTML Tutorial - Lesson 22.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Joomla</H3>
            <DL><p>
                <DT><A HREF="http://www.joomlashack.com/university/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Joomlashack University  Online Joomla Training  Video Tutorials.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">PHP</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Content Management</H3>
                <DL><p>
                    <DT><A HREF="http://www.intranetjournal.com/articles/200407/ij_07_06_04a.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Creating a PHP-Based Content Management System.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Forms</H3>
                <DL><p>
                    <DT><A HREF="http://www.webestilo.com/en/php/php09b.phtml" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Method GET y POST. PHP Tutorial. WebEstilo..url</A>
                    <DT><A HREF="http://www.w3schools.com/PHP/php_get.asp" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP $_GET Function.url</A>
                    <DT><A HREF="http://www.freewebmasterhelp.com/tutorials/php/6" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP Tutorial - Part 6.url</A>
                    <DT><A HREF="http://www.php-mysql-tutorial.com/wikis/php-tutorial/php-variables.aspx" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP Variables - PHP MySQL Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Help</H3>
                <DL><p>
                    <DT><A HREF="http://howto.50webs.net/tutorial.php?id=155" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >50Webs Tutorials ۠MySQL Fetch Array.url</A>
                    <DT><A HREF="http://www.webdevrefinery.com/forums/topic/4923-mysql-fetch-array/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >MySQL Fetch Array - webdevRefinery Forum.url</A>
                    <DT><A HREF="http://www.php-mysql-tutorial.com/wikis/mysql-tutorials/retrieve-data-from-a-mysql-database.aspx" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Retrieve Data From a MySQL Database - PHP MySQL Tutorial.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">MySQL</H3>
                <DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Database Design</H3>
                    <DL><p>
                        <DT><A HREF="http://www.webdevelopersnotes.com/tutorials/sql/mysql_guide_querying_mysql_tables.php3" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >mysql guide - mysql query - querying mysql database - mysql select command - extracting data fr.url</A>
                        <DT><A HREF="http://www.devshed.com/c/a/MySQL/MySQL-Query-Optimizations-and-Schema-Design/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >MySQL Query Optimizations and Schema Design.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Queries</H3>
                    <DL><p>
                        <DT><A HREF="http://www.webdevelopersnotes.com/tutorials/sql/mysql_guide_querying_mysql_tables.php3" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >mysql guide - mysql query - querying mysql database - mysql select command - extracting data fr.url</A>
                        <DT><A HREF="http://www.designplace.org/scripts.php?page=1&c_id=25" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Using PHP to search a MySQL database and return paged results.url</A>
                    </DL><p>
                    <DT><H3 FOLDED ADD_DATE="1298088102">Security</H3>
                    <DL><p>
                        <DT><A HREF="http://www.tizag.com/mysqlTutorial/mysql-php-sql-injection.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >MySQL Tutorial - SQL Injection.url</A>
                    </DL><p>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Navigation Menus</H3>
                <DL><p>
                    <DT><A HREF="http://www.finalwebsites.com/tutorials/dynamic-navigation-list.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP Menu Tutorial Create a dynamic navigation list.url</A>
                    <DT><A HREF="http://www.tutorialized.com/tutorials/PHP/Site-Navigation/1" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP Site Navigation Tutorials - Tutorialized.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Recursion</H3>
                <DL><p>
                    <DT><A HREF="http://www.codewalkers.com/c/a/Miscellaneous/Recursion-in-PHP/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Recursion in PHP.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088102">Web Templates</H3>
                <DL><p>
                    <DT><A HREF="http://www.tutorialized.com/view/tutorial/Simple-PHP-Website-Templates/42755" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >PHP Site Navigation Simple PHP Website Templates Tutorial.url</A>
                </DL><p>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Search Engine Optimization (SEO)</H3>
            <DL><p>
                <DT><A HREF="http://adsense.blogspot.com/2010/07/adsense-facts-fiction-part-iv-program.html" ADD_DATE="1304261575" LAST_VISIT="1322361176" LAST_MODIFIED="1304261575" ICON_URI="http://adsense.blogspot.com/favicon.ico" >AdSense Facts & Fiction Part IV Program policies - Inside AdSense.url</A>
                <DT><A HREF="http://adsense.blogspot.com/2008/03/another-look-at-optimizations.html" ADD_DATE="1304259146" LAST_VISIT="1322361176" LAST_MODIFIED="1304259146" ICON_URI="http://adsense.blogspot.com/favicon.ico" >Another look at optimizations - Inside AdSense.url</A>
                <DT><A HREF="http://www.bitdoze.com/advertising/adbrite-review/" ADD_DATE="1304261606" LAST_VISIT="1322361176" LAST_MODIFIED="1304261606" >Bit Doze ֠Adbrite Review.url</A>
                <DT><A HREF="http://www.google.com/support/forum/p/AdSense/thread?tid=490d11bebe96d68a&hl=en" ADD_DATE="1304260561" LAST_VISIT="1322361176" LAST_MODIFIED="1304260561" ICON_URI="http://www.google.com/favicon.ico" >Class action lawsuit against Google - AdSense Help.url</A>
                <DT><A HREF="http://seopen.com/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Free SEO Tools.url</A>
                <DT><A HREF="http://support.weebly.com/support/index.php?pg=kb.page&id=27" ADD_DATE="1304261623" LAST_VISIT="1322361176" LAST_MODIFIED="1304261624" ICON_URI="http://support.weebly.com/favicon.ico" >Google AdSense - Earn Money.url</A>
                <DT><A HREF="http://www.vaughns-1-pagers.com/internet/google-adsense-penalties.htm" ADD_DATE="1304258970" LAST_VISIT="1322361176" LAST_MODIFIED="1304258970" ICON_URI="http://www.vaughns-1-pagers.com/favicon.ico" >Google AdSense Penalties.url</A>
                <DT><A HREF="http://caseyzemanonline.com/2010/07/how-to-properly-tag-a-youtube-video/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >http--caseyzemanonline.com-2010-07-how-to-properly-tag-a-youtube-video-.url</A>
                <DT><A HREF="http://websitehelpers.com/seo/choosing-good-keywords.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >SEO 101 Choosing good keywords.url</A>
                <DT><A HREF="http://www.ajazi.com/seo-terms.cfm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >SEO Terms and Definitions.url</A>
                <DT><A HREF="http://adsenseaccountdisabled.org/should-i-appeal-part-2/" ADD_DATE="1304258977" LAST_VISIT="1322361176" LAST_MODIFIED="1304258977" ICON_URI="http://adsenseaccountdisabled.org/favicon.ico" >Should I appeal (part 2)  AdSense Account Disabled .org.url</A>
                <DT><A HREF="http://www.seoheap.com/?q=siteanalysis&s=kexaryzef.blog.hr" ADD_DATE="1299522998" LAST_VISIT="1322361176" LAST_MODIFIED="1299522998" ICON_URI="http://www.seoheap.com/favicon.ico" >Site Analysis, SEO Score and PageRank Leakage for kexaryzef.blog.hr.url</A>
                <DT><A HREF="http://youtube-trends.blogspot.com/" ADD_DATE="1301078265" LAST_VISIT="1322361176" LAST_MODIFIED="1301078265" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube Trends.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Splash Page Screen</H3>
            <DL><p>
                <DT><A HREF="http://help.ning.com/cgi-bin/ning.cfg/php/enduser/std_adp.php?p_faqid=3616" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Adding a Splash Page.url</A>
                <DT><A HREF="http://www.tutorialhero.com/tutorial-23-dark_splash_page-page-6.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Dark Splash Page - Photoshop tutorial.url</A>
                <DT><A HREF="http://www.webdesigndev.com/inspiration/20-crazy-but-creative-website-splash-page-examples" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >http--www.webdesigndev.com-inspiration-20-crazy-but-creative-website-splash-page-examples.url</A>
                <DT><A HREF="http://www.pixel2life.com/forums/lofiversion/index.php/t37272.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Pixel2Life Forum  Tutorial #3 - Splash Page.url</A>
                <DT><A HREF="http://website-in-a-weekend.net/extending-wordpress/thesis-theme-custom-splash-page/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Thesis Theme Custom Splash Page  Website In A Weekend.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=RfCvxsg5AvA" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >YouTube - How to Create a Simple Splash Page.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Wallpapers</H3>
            <DL><p>
                <DT><A HREF="http://www.hdwallpapers.in/countryside_splendor_france-wallpapers.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Countryside Splendor France Wallpapers  HD Desktop Wallpapers.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">XHTML</H3>
            <DL><p>
                <DT><A HREF="http://webdesign.about.com/od/htmltags/a/aabg092299a.htm" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Correct Usage of P and BR Tags - Using the P and BR Tags.url</A>
                <DT><A HREF="http://www.websitebabble.com/html-php-css-javascript-coding-programming-topics/9879-br-tag-xhtml.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >The BR tag and XHTML.url</A>
                <DT><A HREF="http://www.google.com/search?q=xhtml+br+tag&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >xhtml br tag - Google Search.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">WEB HOSTS</H3>
        <DL><p>
            <DT><A HREF="https://50webs.biz/members/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >50Webs Web Hosting.url</A>
            <DT><A HREF="http://superninjainterwebs.com/" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Small Business Website Hosting. Cheap Green Blog Hosting.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088102">WEBSITES TO MAKE MONEY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088102">Aggregators</H3>
            <DL><p>
                <DT><A HREF="http://tutorial-index.com/redirect/8776" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Adobe Photoshop tutorials - Blazing-Molten Text Effect.url</A>
                <DT><A HREF="http://www.free-fonts.com/font/brush.html" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >free brush fonts.url</A>
                <DT><A HREF="http://www.tutorialhero.com/tutorial-15710-smooth_molten_metal_text_effect.php" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088102" >Smooth-Molten Metal Text Effect - Photoshop tutorial.url</A>
            </DL><p>
            <DT><A HREF="file:///J:/%5BBKP%20-%202010.10.06/%5BSORT/FuckBookDating.com.mht" ADD_DATE="1298088102" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >FuckBook Dating - Adult Social Network That Gets You Laid for Free.url</A>
            <DT><A HREF="http://www.clementfaria.com/blog/making-money-online-with-cpalead/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Making Money Online With CPALead  cfWeblog - A Web Developer's Journal.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">WELL DESIGNED WEBSITES</H3>
        <DL><p>
            <DT><A HREF="http://www.keepandshare.com/htm/calendars/2011_calendars/free_2011_calendar.php" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >2011 Calendar Easy-to-Use Free 2011 Calendar.url</A>
            <DT><A HREF="http://www.rockshowusa.com/content/8-clever-ideas-custom-band-merch" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >8 Clever Ideas For Custom Band Merch  Rock Show USA.url</A>
            <DT><A HREF="http://www.crayonbeats.com/?page_id=4069" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >About ˠCrayonBeats.url</A>
            <DT><A HREF="http://www.argusapocraphex.com/homeenglish.php" ADD_DATE="1300728481" LAST_VISIT="1322361176" LAST_MODIFIED="1300728481" >Argus Apocraphex a 30 Seconds To Mars Fansite - features pictures, lyrics, videos.url</A>
            <DT><A HREF="http://augenspa.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >augenspa.com.url</A>
            <DT><A HREF="http://twistys.bentsblogs.com/2009/08/beautiful-twistys-babe-ashlynn-brooke-videos/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Beautiful Twistys Babe Ashlynn Brooke Videos  Inside Twistys.url</A>
            <DT><A HREF="http://fg2nmoneymaking.blogspot.com/2011/03/triond-payment-proof-and-review-video.html" ADD_DATE="1300819810" LAST_VISIT="1322361176" LAST_MODIFIED="1300819810" ICON_URI="http://fg2nmoneymaking.blogspot.com/favicon.ico" >Best of the Best Money Making Blog Triond Payment proof and review video.url</A>
            <DT><A HREF="http://www.goer.org/Journal/2008/07/decluttering_for_geeks_computer_components.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Decluttering for Geeks Computer Components - goer.org.url</A>
            <DT><A HREF="http://www.auctiva.com/?how=imgLnk1" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >eBay Auction Management, eBay Templates, eBay Tools, and Image Hosting.url</A>
            <DT><A HREF="http://www.eclipse.org/downloads/index-helios.php" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Eclipse Downloads.url</A>
            <DT><A HREF="http://susanireland.com/resume-examples/writer/editing/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Editing  Susan Ireland's Resume Site.url</A>
            <DT><A HREF="http://www.exploretalent.com/flashjoin/?kw=Got%2520Singing%2520Talent%2520?&gclid=CLDojsW0lacCFc9w5QodMk72dQ" ADD_DATE="1298159775" LAST_VISIT="1322361176" LAST_MODIFIED="1298159775" >ExploreTalent.com - Auditions and Casting for actors models, find casting calls, resources acting modeling.url</A>
            <DT><A HREF="http://betterfly.com/category/martial-arts-and-combat-sports?utm_source=facebookad&utm_medium=cpc&utm_campaign=martialarts112-18-10-22" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Find a Martial Arts and Combat Sports Betterist to help you learn, look & feel better  Betterfl.url</A>
            <DT><A HREF="http://firefoxlive.mozilla.org/?WT.mc_id=S1012_fx_live&WT.mc_ev=click" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >FirefoxLive.org.url</A>
            <DT><A HREF="http://www.gcflearnfree.org/computerbasics" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Free Computer Basics Tutorial.url</A>
            <DT><A HREF="file:///J:/%5BBKP%20-%202010.10.06/%5BSORT/FuckBookDating.com.mht" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >FuckBook Dating - Adult Social Network That Gets You Laid for Free.url</A>
            <DT><A HREF="http://www.genesis10.com/careers/index.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Genesis10.url</A>
            <DT><A HREF="https://w1.buysub.com/pubs/IM/GWO/account_summary.jsp?lsid=10811050249034822&vid=1&cds_mag_code=GWO" ADD_DATE="1300809715" LAST_VISIT="1322361176" LAST_MODIFIED="1300809715" >Guitar World Magazine Customer Service.url</A>
            <DT><A HREF="http://www.elance.com/p/blog/2011/04/helping-the-cause-your-earth-day-tips.html?rid=20H8J" ADD_DATE="1303416454" LAST_VISIT="1322361176" LAST_MODIFIED="1303416454" ICON_URI="http://www.elance.com/p/misc/favicon.ico" >Helping the Cause Your Earth Day Tips for Freelancers  Elance.url</A>
            <DT><A HREF="http://caseyzemanonline.com/2010/07/how-to-properly-tag-a-youtube-video/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--caseyzemanonline.com-2010-07-how-to-properly-tag-a-youtube-video-.url</A>
            <DT><A HREF="http://www.reverbnation.com/brownsugarcracker" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.reverbnation.com-brownsugarcracker.url</A>
            <DT><A HREF="http://www.sohtanaka.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.sohtanaka.com-.url</A>
            <DT><A HREF="https://www2.gotomeeting.com/island/downloadManual.tmpl?TargetBuild=457&MeetingID=761256691&StartMode=Join&FullDL=true&NoSL=true&cat=DLAppCommFailure" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >https--www2.gotomeeting.com-island-downloadManual.tmplTargetBuild=457&MeetingID=761256691&Start.url</A>
            <DT><A HREF="http://www.cybercoders.com/InterviewTips.aspx?ad=&p=" ADD_DATE="1303415770" LAST_VISIT="1322361176" LAST_MODIFIED="1303415770" ICON_URI="http://www.cybercoders.com/cc.ico" >Interview Tips  CyberCoders.com.url</A>
            <DT><A HREF="http://www.lkscareerconnections.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >LKS Career Connections Homepage - Professional Recruting, Human Resource Consulting, Job Candid.url</A>
            <DT><A HREF="http://www.domesticsale.com/Classifieds/search/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Mini dachshund.url</A>
            <DT><A HREF="http://www.dogster.com/dog-breeds/Miniature_Dachshund" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Miniature Dachshund Information, Pictures of Miniature Dachshunds  Dogster.url</A>
            <DT><A HREF="http://www.inside-business.com/Main/Archive/Musical_Chairs_11812.aspx" ADD_DATE="1303429570" LAST_VISIT="1322361176" LAST_MODIFIED="1303429570" ICON_URI="http://www.inside-business.com/favicon.ico" >Musical Chairs  Articles  Archive  Inside Business Magazine.url</A>
            <DT><A HREF="http://markriddix.com/category/online-writing-jobs/" ADD_DATE="1304257042" LAST_VISIT="1322361176" LAST_MODIFIED="1304257042" ICON_URI="http://markriddix.com/wp-content/themes/lexicon/images/favicon.ico" >Online Writing Jobs - Mark Riddix dot com.url</A>
            <DT><A HREF="http://wmcurtisszabo.wordpress.com/2010/11/17/proud-to-be-a-man/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Proud to be a Man ˠLife Examined.url</A>
            <DT><A HREF="http://www.rockbandaide.com/5468/rbn-artist-interview-loren-dircks-of-guitar-hero-gone-fame/" ADD_DATE="1298094937" LAST_VISIT="1322361176" LAST_MODIFIED="1298094937" ICON_URI="http://www.rockbandaide.com/favicon.ico" >RBN Artist Interview Loren Dircks of ԇuitar Hero GoneԠFame  RockBandAide.url</A>
            <DT><A HREF="http://www.studentmarket.com/Redmon-6116HPK-RDM1076.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Redmon The Original Bongo Bag Pop Up Hamper in Hot Pink - 6116HPK  StudentMarket.com, Inc..url</A>
            <DT><A HREF="http://rock108.com/page.php?page_id=40379" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >ROCK 108.url</A>
            <DT><A HREF="http://www.biblegateway.com/passage/?search=romans%201&version=KJV" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Romans 1 - PassageLookup - King James Version - BibleGateway.com.url</A>
            <DT><A HREF="http://www.readjunk.com/articles/sellers-cant-leave-negative-feedback-on-ebay-bullshit/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Sellers canӴ leave negative feedback on eBay! BULLSHIT!  ReadJunk.com.url</A>
            <DT><A HREF="http://afeatheradrift.wordpress.com/2009/05/21/short-takes-on-the-day-052109/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Short Takes on the Day, 05-21-09 ˠA Feather Adrift.url</A>
            <DT><A HREF="http://www.facebook.com/profile.php?id=569676986&ref=profile&quickling[version]=242329%3B0&ajaxpipe=1&__a=7" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Short Takes on the Day, 05-21-09 « A Feather Adrift.url</A>
            <DT><A HREF="http://www.staplesrewardscenter.com/SORC/Rewards/StaplesRewards/RewardsDashboard.aspx" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Staplesrewardscenter.comήurl</A>
            <DT><A HREF="http://www.theihs.org/koch-summer-fellow-program/state-policy-internships&utm_source=Facebook%20Ad&utm_medium=cpc&utm_content=FB%2BAd%20Iowa%20State%20Policy&utm_campaign=KSFP%2011" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >State Policy Internships  Institute For Humane Studies.url</A>
            <DT><A HREF="http://www.steveclayton.com/blog/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Steve Clayton USA Guitar Accessories, and Custom Printed Guitar Picks.url</A>
            <DT><A HREF="http://www.stopetaxes.com/amazon-argues-affiliate-nexus-tax-first-a3018" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Stop eTaxes.url</A>
            <DT><A HREF="http://www.westmusic.com/locations?utm_term=mainbanner&utm_source=MailingList&utm_medium=email&utm_campaign=RETAIL17+Event%3A+So+Long+Santa" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Stores  West Music.url</A>
            <DT><A HREF="http://blog.premiumusb.com/2010/03/problems-and-issues-with-usb-3-0-superspeed/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >SuperSpeed USB 3.0 - Problems & Issues with USB 3.0 SuperSpeed  Premium USB Blog.url</A>
            <DT><A HREF="http://www.artnudegalleries.com/beautyteennude/266/index.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Teen Nude Picture - Nude Teen Pics, Nude Teen Photos.url</A>
            <DT><A HREF="http://oregonstate.edu/terra/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Terra Magazine.url</A>
            <DT><A HREF="http://www.rockband.com/blog/when_everything_goes_wrong" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Gig from Hell What Happens When Everything Goes Wrong -- Blog -- Rock Bandήurl</A>
            <DT><A HREF="http://blog.adamnash.com/2008/01/26/the-secret-to-reformatting-a-western-digital-wd-1tb-my-book-external-hard-drive/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Secret to Reformatting a Western Digital WD 1TB My Book External Hard Drive ˠPsychohistory.url</A>
            <DT><A HREF="http://www.contacthelp.com/directory/Government/United+States+Departments/USPS?AID=5&ListingID=200" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >USPS customer service phone numbers and support.url</A>
            <DT><A HREF="http://www.contrapositivediary.com/?page_id=8" ADD_DATE="1298132325" LAST_VISIT="1322361176" LAST_MODIFIED="1298132325" ICON_URI="http://www.contrapositivediary.com/favicon.ico" >Who Am I ֠Jeff Duntemann's Contrapositive Diary.url</A>
            <DT><A HREF="http://hustlebear.com/2011/01/05/why-net-neutrality-regulation-is-the-path-to-ending-net-neutrality/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Why Net Neutrality Regulation is the Path to Ending Net Neutrality  Hustle Bear - A Blog for Ac.url</A>
            <DT><A HREF="http://croneandbearit.wordpress.com/2010/12/13/words-that-make-your-resume-suck/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Words That Make Your Resume Suck ˠCrone and Bear It.url</A>
            <DT><A HREF="http://www.30secondstomars.ca/30stm/info_tour.htm" ADD_DATE="1300730794" LAST_VISIT="1322361176" LAST_MODIFIED="1300730794" >www.30secondstomars.ca.url</A>
            <DT><A HREF="http://www.duntemann.com/assembly.html" ADD_DATE="1298129710" LAST_VISIT="1322361176" LAST_MODIFIED="1298129710" >x86 Assembly Language Books and Links.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=4DyNmblrG34&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - What is Flex.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">_WEB MANAGEMENT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">KAIO</H3>
            <DL><p>
                <DT><A HREF="http://kaiochurch.ning.com/group/WebManagementTeam/forum/topics/read-me-first" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >READ ME FIRST - Kaio Church - Our Little City.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298834867">_PUBLIC SPEAKING ORATORY & ARGUMENT</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1299564943">LOGICAL FALLACIES</H3>
        <DL><p>
            <DT><A HREF="http://www.answerbag.com/q_view/2402095" ADD_DATE="1299565552" LAST_VISIT="1322361176" LAST_MODIFIED="1299565552" >Is the statement You can't prove a negative, a negative statement  Answerbag.url</A>
            <DT><A HREF="http://www.neo-philosophy.com/LogicWeek7.html" ADD_DATE="1299564945" LAST_VISIT="1322361176" LAST_MODIFIED="1299564945" >More Fallacies.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">PERSUASIVE & POSITION SPEECH</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Rhetoric" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Rhetoric - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><A HREF="http://www.youtube.com/watch?v=kUGcmEUshCM&NR=1" ADD_DATE="1298835899" LAST_VISIT="1322361176" LAST_MODIFIED="1298835899" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Become a motivational speaker.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=haNyo5deYXE&NR=1" ADD_DATE="1298837458" LAST_VISIT="1322361176" LAST_MODIFIED="1298837458" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Humor How to Apologize Like a Tiger.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=k2rp-oBjJzg&feature=related" ADD_DATE="1298837203" LAST_VISIT="1322361176" LAST_MODIFIED="1298837203" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Learning From Obama's Effective Communication Skills.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=bt8YFCveNpY&feature=related" ADD_DATE="1298836557" LAST_VISIT="1322361176" LAST_MODIFIED="1298836557" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Presentation skills - How to improve your presentations.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=iFpOin0j90Q&feature=relmfu" ADD_DATE="1298835829" LAST_VISIT="1322361176" LAST_MODIFIED="1298835829" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Presentation Skills Tip Anyone can do this.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=HOSADvJnrG8&feature=relmfu" ADD_DATE="1298834871" LAST_VISIT="1322361176" LAST_MODIFIED="1298834871" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Public Speaking  Presentation Skills World Champion of Public Speaking Darren LaCroix.url</A>
        <DT><A HREF="http://www.youtube.com/watch?v=MeiBMkJjXVM&feature=related" ADD_DATE="1298836833" LAST_VISIT="1322361176" LAST_MODIFIED="1298836833" ICON_URI="http://s.ytimg.com/yt/favicon-vflZlzSbU.ico" >YouTube - Six Rules of Effective Communication.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_QUOTES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">MOVIE SPEECHES</H3>
        <DL><p>
            <DT><A HREF="http://listverse.com/2008/02/22/top-10-great-movie-speeches/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Top 10 Great Movie Speeches - Top 10 Lists  Listverse.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">WAR</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Shakespeare</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1298088103">[St. Crispen's Day Speech]</H3>
                <DL><p>
                    <DT><A HREF="http://www.chronique.com/Library/Knights/crispen.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Shakespeare's Saint Crispen's Day Speech.url</A>
                </DL><p>
            </DL><p>
        </DL><p>
        <DT><A HREF="http://www.wisdomquotes.com/cat_happiness.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Happiness Quotes  Happiness Quotations  Happiness Sayings  Wisdom Quotes.url</A>
        <DT><A HREF="http://www.just-quotes.com/common_latin_mottos.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Latin Mottos, Latin Motto Translations, Latin Mottos with English Translations.url</A>
        <DT><A HREF="http://www.wisdomquotes.com/cat_peace.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Peace Quotes  Peace Quotations  Peace Sayings  Wisdom Quotes.url</A>
        <DT><A HREF="http://www.inspirational-quotations.com/peace-quotes.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Peace Quotes.url</A>
        <DT><A HREF="http://freedomkeys.com/quotes.htm" ADD_DATE="1299298446" LAST_VISIT="1322361176" LAST_MODIFIED="1299298446" >Quotations, Quotations, Quotations.url</A>
        <DT><A HREF="http://www.pithypedia.com/?author=George+Orwell" ADD_DATE="1299298627" LAST_VISIT="1322361176" LAST_MODIFIED="1299298627" ICON_URI="http://www.pithypedia.com/favicon.ico" >Quotes by George Orwell - Pithypedia.com.url</A>
        <DT><A HREF="http://themirroreffect.tumblr.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Mirror Effect.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_REAL ESTATE & LAND</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">PRIVATE ISLANDS</H3>
        <DL><p>
            <DT><A HREF="http://www.privateislandsonline.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Islands for Sale, Private Islands, Luxury Real Estate.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_RECREATION</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BY STATE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">OHIO</H3>
            <DL><p>
                <DT><A HREF="http://consumer.discoverohio.com/searchresults.aspx?category=&region=&metroarea=15&county=&city=&type=&p=2&hideFilters=&keyword=&IsGroup=" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Select a region - Discover Ohio.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CONVENTIONS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Anime Iowa</H3>
            <DL><p>
                <DT><A HREF="http://www.animeiowa.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >AnimeIowa.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">BotCon</H3>
            <DL><p>
                <DT><A HREF="http://www.bsckids.com/2010/05/transformers-fans-botcon-registration-to-get-your-disney-on/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Transformers Fans! BotCon registration to get your Disney On!.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Comicon</H3>
            <DL><p>
                <DT><A HREF="http://www.comic-con.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Welcome to Comic-Con International  Coming Up Next, SAN DIEGO 2010, July 22-25th!.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Consumer Electronics Show</H3>
            <DL><p>
                <DT><A HREF="http://www.cesweb.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >2010 International CES, January 7-10.url</A>
            </DL><p>
            <DT><A HREF="http://www.sjgames.com/con/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Gaming Conventions and Trade Show Schedule.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">FESTIVALS</H3>
        <DL><p>
            <DT><A HREF="http://www.hempstalk.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.hempstalk.org-.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">RENAISSANCE FAIRES</H3>
        <DL><p>
            <DT><A HREF="http://www.renfair.com/bristol/tickets/ticketprices.asp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Bristol Renaissance Faire - Illinois-Wisconsin Border.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">WATER FUN</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Floats & Boats</H3>
            <DL><p>
                <DT><A HREF="http://www.toysplash.com/Category/Home/InflatableBoats" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Inflatable Boats - Inflatable Pool Boats & Inflatable Boat Oars.url</A>
                <DT><A HREF="http://www.toysplash.com/productinfo.aspx?productid=151345&engine=googlebase&cvsfa=732&cvsfe=2&cvsfhu=313531333435" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Stowable Pool Cooler Float - Pool Floats & Floating Coolers ֠ToySplash Inflatable Coolers.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_REFERENCE</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">ETYMOLOGY & EPISTEMOLOGY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Names</H3>
            <DL><p>
                <DT><A HREF="http://www.philbrodieband.com/jokes-jokes_town_names.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Funny Town Names, Rude Town Names, Weird Place Names around the world!!!.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Niggardly</H3>
            <DL><p>
                <DT><A HREF="http://en.wikipedia.org/wiki/Controversies_about_the_word_%22niggardly%22" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Controversies about the word niggardly - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.straightdope.com/columns/read/1725/is-niggardly-a-racist-word" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Straight Dope Is niggardly a racist word.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1299525844">Symbolism</H3>
            <DL><p>
                <DT><A HREF="http://socyberty.com/religion/three-religious-symbols-whose-meanings-have-changed-with-time/" ADD_DATE="1299525847" LAST_VISIT="1322361176" LAST_MODIFIED="1299525847" ICON_URI="http://s3.amazonaws.com/readers/socyberty/favicon.ico" >Three Religious Symbols Whose Meanings Have Changed with Time  Socyberty.url</A>
            </DL><p>
        </DL><p>
        <DT><A HREF="http://www.wordnik.com/words/abideth" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >abideth definition and examples of abideth  Wordnik.url</A>
        <DT><A HREF="http://www.gutenberg.org/browse/authors/c#a1040" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Browse By Author C - Project Gutenberg.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_RELIGION & SUPERNATURAL</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BIBLICAL HISTORICITY</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Ark Of The Covenant</H3>
            <DL><p>
                <DT><A HREF="http://www.people.com/people/archive/article/0,,20080206,00.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Eric and Carol Meyers Didn't Dig the Ark in Raidersؔhey Found the Real Thing  People.com.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BIBLICAL MIRACLES</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Battle_of_Jericho" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Battle of Jericho - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.biblegateway.com/passage/?search=JOSH%2010&version=ESV" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >JOSH 10 - PassageLookup - English Standard Version - BibleGateway.com.url</A>
            <DT><A HREF="http://www.christiananswers.net/bible/josh10.html#12" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Joshua, Chapter 10 (King James Bible) - ChristianAnswersΠWebBibleٮurl</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=list+of+biblical+mir&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=list+of+biblical+miracles" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >list of biblical miracles - Google Search.url</A>
            <DT><A HREF="http://www.christiananswers.net/dictionary/miracle.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Miracles, including list of biblical miracles (WebBible٠Encyclopedia) - ChristianAnswers.Net.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BUDDHISM</H3>
        <DL><p>
            <DT><A HREF="http://www.buddhanet.net/e-learning/5minbud.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >A Basic Buddhism Guide 5 Minute Introduction.url</A>
            <DT><A HREF="http://webspace.ship.edu/cgboer/buddhaintro.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >An Introduction to Buddhism.url</A>
            <DT><A HREF="http://www.aboutbuddha.org/english/books-on-buddhism.htm/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Books on Buddhism & Meditation that guide and inspire us  About Buddha.url</A>
            <DT><A HREF="http://www.hinduwebsite.com/buddhism/buddhist_philosophy.asp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Buddha Dhamma - The Concepts and Philosophy of Buddhism.url</A>
            <DT><A HREF="http://www.google.com/search?q=buddhism&hl=en&safe=off&rlz=1T4HPIC_enUS349US376&prmd=nbi&tbs=tl:1&tbo=u&ei=U2kNTMLUOIPUnAeH-NGJAg&sa=X&oi=timeline_result&ct=title&resnum=14&ved=0CFoQ5wIwDQ" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >buddhism - Google Search.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Buddhism" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Buddhism - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.meditateiniowacity.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Buddhism and Meditation in Iowa.url</A>
            <DT><A HREF="http://www.goddessgift.net/page74.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Goddess Magnets - Chakra Magnets - Peace Magnets.url</A>
            <DT><A HREF="http://sacred-texts.com/bud/wov/wov31.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Buddha's Way of Virtue Notes.url</A>
            <DT><A HREF="http://www.religioustolerance.org/buddhism.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The religion of Buddhism.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CONJURING THE DEVIL DEMONS & SPIRITS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Lucian" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Lucian - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/The_Sorcerer%27s_Apprentice" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Sorcerer's Apprentice - Wikipedia, the free encyclopedia.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CRITICISM & PARODY OF RELIGION</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Antiquated and Cruel Punishment</H3>
            <DL><p>
                <DT><A HREF="http://www.snopes.com/politics/religion/drlaura.asp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >snopes.com Letter to Dr. Laura.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Jesus Junk</H3>
            <DL><p>
                <DT><A HREF="http://bloggingheads.tv/diavlogs/9963" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Bloggingheads.tv - Jesus Junk.url</A>
                <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=buy+jesus+junk" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >buy jesus junk - Google Search.url</A>
                <DT><A HREF="http://friendlyatheist.com/2009/12/26/jesus-junk-revisited/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Friendly Atheist by @hemantsblog ۠Jesus Junk, Revisited.url</A>
                <DT><A HREF="http://www.redheadedskeptic.com/2009/12/26/ibarf/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >iBarf - The Redheaded Skeptic.url</A>
                <DT><A HREF="http://sharperiron.org/2006/08/24/jesus-junk" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jesus Junk  SharperIron.url</A>
                <DT><A HREF="http://whsjr.soistmann.com/oped/2010/01/11/jesus-junk-i-dont-care-if-its-illegal/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jesus Junk ֠I donӴ care if itӳ illegal  well, if you ask me Ůurl</A>
                <DT><A HREF="http://www.internetmonk.com/archive/selling-jesus-by-the-pound" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Selling Jesus By The Pound  internetmonk.com.url</A>
                <DT><A HREF="http://controversy.wearscience.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Teach the Controversy - Intelligently designed t-shirts urging you to show both sides of every .url</A>
                <DT><A HREF="http://www.alittleleaven.com/jesus_junk/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Museum of Idolatry Je$u$ Junk.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=R4msmvgTojE&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Christian Merchandise.url</A>
                <DT><A HREF="http://www.youtube.com/watch?v=YfQC8K4fA10" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Jesus Junk.url</A>
            </DL><p>
            <DT><A HREF="http://skepacabra.wordpress.com/2009/04/page/2/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >April ˠ2009 ˠSkepacabra.url</A>
            <DT><A HREF="http://godlessradio.com/flyswatter/tag/knock-knock-whos-there/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Flyswatter Show ۠knock knock whoӳ there.url</A>
            <DT><A HREF="http://crooksandliars.com/nicole-belle/and-jesus-said-love-thy-neighbor-unl" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--crooksandliars.com-nicole-belle-and-jesus-said-love-thy-neighbor-unl.url</A>
            <DT><A HREF="http://hyperboleandahalf.blogspot.com/2010/01/how-to-stick-to-your-new-years.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Hyperbole and a Half How to Stick to Your New Year's Resolutions and Also Accomplish Lots of Ot.url</A>
            <DT><A HREF="http://www.riprense.com/Jesushchrist.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jesus H. Christ!.url</A>
            <DT><A HREF="http://www.alittleleaven.com/jesus_junk/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Museum of Idolatry Je$u$ Junk.url</A>
            <DT><A HREF="http://wakaaustingmot.wordpress.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >WAKA Austin GMOT.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=urlTBBKTO68&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - An Atheist Meets God.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=NdP6Om61r20&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Atheism short-movie.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=FN63ZTLdytk&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Atheist Myths Debunked.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=U04WZHkF0LQ&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Atheist vs. Christian - The worst of the worst.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=r92kkJT_eJs&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Atheist vs. Christian.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=pn2xATgzPqI&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Christian Vs Atheist 01.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=AIYf14Jcq-o&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - The Best Atheist Posters.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=8wON_v7_jyU&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Would you treat non-religious Americans equally.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">EXISTENCE OF GOD</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Campanella</H3>
            <DL><p>
                <DT><A HREF="http://books.google.com/books?lr=&cd=1&q=%22Atheism+Conquered%22" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atheism Conquered - My library - Google Books.url</A>
                <DT><A HREF="http://books.google.com/books?id=5KAUAAAAQAAJ&printsec=frontcover&dq=inauthor:%22Tommaso+Campanella%22&lr=&source=gbs_book_other_versions#v=onepage&q&f=false" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atheismus triumphatus seu contra ... - Google Books.url</A>
                <DT><A HREF="http://www.gutenberg.org/browse/authors/c#a1040" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Browse By Author C - Project Gutenberg.url</A>
                <DT><A HREF="http://www.newadvent.org/cathen/02040a.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >CATHOLIC ENCYCLOPEDIA Atheism.url</A>
                <DT><A HREF="http://www.newadvent.org/cathen/03221b.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >CATHOLIC ENCYCLOPEDIA Tommaso Campanella.url</A>
                <DT><A HREF="http://pictoumasons.org/library/Campanella,%20Tommaso%20~%20The%20City%20of%20the%20Sun%20%5Bpdf%5D.pdf" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--pictoumasons.org-library-Campanella,%20Tommaso%20~%20The%20City%20of%20the%20Sun%20%5Bpdf.url</A>
                <DT><A HREF="http://www.wattpad.com/92429-Robert-Greene-The-48-laws-of-power?p=212" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Robert Greene - The 48 laws of power - Page 212 - greene help improve laws power robert self - .url</A>
                <DT><A HREF="http://galileo.rice.edu/sci/campanella.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Galileo Project  Science  Tommaso Campanella.url</A>
                <DT><A HREF="http://www.radicalacademy.com/philcampanella.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Philosophy of Tommaso Campanella.url</A>
                <DT><A HREF="http://plato.stanford.edu/entries/campanella/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Tommaso Campanella (Stanford Encyclopedia of Philosophy).url</A>
                <DT><A HREF="http://ebooks.adelaide.edu.au/c/campanella/tommaso/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Tommaso Campanella, 1568-1639 free web books, online.url</A>
                <DT><A HREF="http://www.nndb.com/people/674/000029587/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Tommaso Campanella.url</A>
            </DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Appeal_to_authority" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Argument from authority - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Atheism#History" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atheism - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.csmonitor.com/2006/1121/p09s01-coop.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atheism, not religion, is the real force behind the mass murders of history - The Christian Sci.url</A>
            <DT><A HREF="http://richarddawkins.net/articles/694-atheist-apostle" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atheist Apostle - Christianity Today - Article - RichardDawkins.net.url</A>
            <DT><A HREF="http://asktheatheists.com/questions/92-catholic-miracles-lanciano" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Catholic Miracles Lanciano  Ask The Atheists.url</A>
            <DT><A HREF="http://atheism.about.com/library/FAQs/christian/blfaq_viol_inquisition.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Christianity and Violence Inquisition.url</A>
            <DT><A HREF="http://www.infidels.org/library/modern/testimonials/vuletic.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >From Believer to Atheist.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/History_of_atheism" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >History of atheism - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Jesus" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jesus - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.huffingtonpost.com/john-shore/i-a-rabid-anti-christian_b_551799.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >John Shore I, a Rabid Anti-Christian, Very Suddenly Convert.url</A>
            <DT><A HREF="http://www.google.com/search?hl=en&rlz=1T4HPIC_enUS349US376&q=monk+tortured+as+atheist&aq=f&aqi=&aql=&oq=&gs_rfai=" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >monk tortured as atheist - Google Search.url</A>
            <DT><A HREF="http://www.theatheistconservative.com/2010/04/25/calvin-a-chapter-in-the-terrible-history-of-christianity/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Atheist Conservative ۠Calvin a chapter in the terrible history of Christianity.url</A>
            <DT><A HREF="http://www.godlikeproductions.com/forum1/message868586/pg1" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Who created the creator.url</A>
            <DT><A HREF="http://atheism.about.com/od/christianityviolence/ig/Christian-Persecution-Witches/Witches-Satan-Court.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Witchcraft and the Inquisition Using the Inquisition to Suppress Dissent & Outsiders.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">EXISTENCE OF JESUS</H3>
        <DL><p>
            <DT><A HREF="http://en.wikipedia.org/wiki/Historical_Jesus" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Historical Jesus - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Historicity_of_Jesus" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Historicity of Jesus - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.unexplained-mysteries.com/forum/index.php?showtopic=85334" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jesus Died For OUR Sins - Unexplained Mysteries Discussion Forums.url</A>
            <DT><A HREF="http://www.light-of-life.com/eng/answer/a4360efm.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Light of Life Was Christ Really Crucified.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Lucian" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Lucian - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.unifreethought.com/search/label/Eyewitness%20Hypothesis%20Series" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >UNI Freethinkers and Inquirers Eyewitness Hypothesis Series.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=where+does+it+say+jesus+d&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=where+does+it+say+jesus+died+for+our+sins" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >where does it say jesus died for our sins - Google Search.url</A>
            <DT><A HREF="http://www.leaderu.com/isr/articles_resources/whydidjesusdie.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Why Did Jesus Die.url</A>
            <DT><A HREF="http://wiki.answers.com/Q/In_What_bible_verse_says_jesus_sacrificing_for_your_sin" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >WikiAnswers - In What bible verse says jesus sacrificing for your sin.url</A>
            <DT><A HREF="http://wiki.answers.com/Q/Was_Jesus_Crucified" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >WikiAnswers - Was Jesus Crucified.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">FABLES & PARABLES OF THE BIBLE</H3>
        <DL><p>
            <DT><A HREF="http://www.luisprada.com/Protected/fables_and_tales.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Fables and Tales.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">GIFTS</H3>
        <DL><p>
            <DT><A HREF="http://www.goddessgift.net/page74.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Goddess Magnets - Chakra Magnets - Peace Magnets.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">GREEK MYTHOLOGY</H3>
        <DL><p>
            <DT><A HREF="http://www.greekmyth.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >GreekMyth.org - Ancient Greek Mythology.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">HOLY BIBLE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Book - John</H3>
            <DL><p>
                <DT><A HREF="http://www.davidstuff.com/general/rockford.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Chester Sierra's speech to Angel Martin and Jim Rockford on.url</A>
                <DT><A HREF="http://vintage.aomin.org/John15.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--vintage.aomin.org-John15.html.url</A>
                <DT><A HREF="http://www.absoluteastronomy.com/topics/John_15" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >John 15 Facts, Discussion Forum, and Encyclopedia Article.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Homosexuality</H3>
            <DL><p>
                <DT><A HREF="http://www.religioustolerance.org/hom_bibh4.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Context and analysis of Leviticus 1822 and homosexuality; all views.url</A>
                <DT><A HREF="http://www.biblegateway.com/passage/?search=romans%201&version=KJV" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Romans 1 - PassageLookup - King James Version - BibleGateway.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Hypocricy & Contradictions</H3>
            <DL><p>
                <DT><A HREF="http://www.snopes.com/politics/religion/drlaura.asp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >snopes.com Letter to Dr. Laura.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Interpretation & Interpolation</H3>
            <DL><p>
                <DT><A HREF="http://en.wikipedia.org/wiki/Interpolation_(manuscripts)" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Interpolation (manuscripts) - Wikipedia, the free encyclopedia.url</A>
                <DT><A HREF="http://www.freebiblecommentary.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Welcome to FreeBibleCommentary.org!.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Ten Commandments</H3>
            <DL><p>
                <DT><A HREF="http://www.the-ten-commandments.org/the-ten-commandments.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Bible list of the Ten Commandments.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">JESUS' CRUCIFIXION</H3>
        <DL><p>
            <DT><A HREF="http://www.nairaland.com/nigeria/topic-339878.96.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Did Jesus Teach That Good Unbelievers Can Go To Heaven - Nairaland.url</A>
            <DT><A HREF="http://muslim-responses.com/Obeying_the_Law/Obeying_the_Law" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Obeying the Law.url</A>
            <DT><A HREF="http://www.articleslash.net/News-and-Society/Religion/410071__Why-Your-Sins-Are-NOT-Covered-Up-by-Jesus-Blood.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Why Your Sins Are NOT Covered Up by Jesus Blood, by Caleb Osborne, Religion on ArticleSlash.net.url</A>
            <DT><A HREF="http://wiki.answers.com/Q/Was_Jesus_Crucified" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >WikiAnswers - Was Jesus Crucified.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Monsters, Myth, and Fantasy</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">[Water]</H3>
            <DL><p>
                <DT><A HREF="http://www.mezzo-mondo.com/arts/mm/waterhouse/index.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >J W Waterhouse - Lady of Shalott, Hylas and the Nymphs, Miranda the tempest, Saint Cecilia, Fai.url</A>
                <DT><A HREF="http://www.mythicalrealm.com/creatures/mermaids_sirens.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Allure of Mermaids, Sirens and Water Nymphs - Mythical Creature Legends.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1299533362">Symbolism</H3>
        <DL><p>
            <DT><A HREF="http://socyberty.com/religion/three-religious-symbols-whose-meanings-have-changed-with-time/" ADD_DATE="1299533365" LAST_VISIT="1322361176" LAST_MODIFIED="1299533365" ICON_URI="http://s3.amazonaws.com/readers/socyberty/favicon.ico" >Three Religious Symbols Whose Meanings Have Changed with Time  Socyberty.url</A>
            <DT><A HREF="http://www.civilwarnews.com/archive/articles/edgerton.htm" ADD_DATE="1299533374" LAST_VISIT="1322361176" LAST_MODIFIED="1299533374" >When The Flag's Under Attack Look For H.K. Edgerton.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">WITCHCRAFT</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Building Altars</H3>
            <DL><p>
                <DT><A HREF="http://www.buildaltars.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Build Altars  art, magic, creativity, intuition, painting, moon tips, building altars, goddess,.url</A>
                <DT><A HREF="http://kristobaldude.wordpress.com/2010/06/04/how-to-build-a-pagan-or-wiccan-altar/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How To Build A Pagan or Wiccan Altar. ˠKristobaldudeӳ Blog.url</A>
                <DT><A HREF="http://www.centerforjoy.org/psAltar.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >how to build an altar, practical spirituality.url</A>
                <DT><A HREF="http://www.sacredsource.com/altars0401.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Sacred Source - Altar Photos.url</A>
            </DL><p>
            <DT><A HREF="http://www.nlm.nih.gov/hmd/pdf/witchcraft.pdf" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.nlm.nih.gov-hmd-pdf-witchcraft.pdf.url</A>
        </DL><p>
        <DT><A HREF="http://www.biblegateway.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >biblegateway.com A searchable online Bible in over 100 versions and 50 languages..url</A>
        <DT><A HREF="http://en.wikipedia.org/wiki/History_of_atheism" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >History of atheism - Wikipedia, the free encyclopedia.url</A>
        <DT><A HREF="http://www.theatheistconservative.com/2010/04/25/calvin-a-chapter-in-the-terrible-history-of-christianity/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Atheist Conservative ۠Calvin a chapter in the terrible history of Christianity.url</A>
        <DT><A HREF="http://www.truthbook.com/index.cfm?linkID=559" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >What Really Happened At The Last Supper The Passion of Jesus Christ in The Urantia Book.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_REMOTE CONTROLS & CODES</H3>
    <DL><p>
        <DT><A HREF="http://download.p4c.philips.com/files/s/sru3004wm_17/sru3004wm_17_dfu_aen.pdf" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--download.p4c.philips.com-files-s-sru3004wm_17-sru3004wm_17_dfu_aen.pdf.url</A>
        <DT><A HREF="http://www.hdtvsolutions.com/Polaroid-TLX-03210B.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Polaroid TLX-03210B (TLX03210B) LCD TV - Polaroid HDTV TVs, HDTV Monitors.url</A>
        <DT><A HREF="http://www.polaroid-tv.com/polaroid-lcd-tv/codes/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Polaroid tv codes.url</A>
        <DT><A HREF="http://www.remotecentral.com/cgi-bin/mboard/rc-one4all/thread.cgi?4784" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >RC Forums Polaroid TV Codes Emulate Which Other mfg (Page 1 of 4).url</A>
        <DT><A HREF="http://www.p4c.philips.com/cgi-bin/dcbint/cpindex.pl?ctn=SRU3004WM/17&slg=en&scy=US" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >SRU3004WM-17 Philips Universal remote control SRU3004WM Big button - Philips Support.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SCAMS FRAUDS & FAKES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">AUCTIONS</H3>
        <DL><p>
            <DT><A HREF="http://richinwriters.com/wavee-scam/comment-page-2/#comment-3414" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Wavee scam.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">TRAVEL</H3>
        <DL><p>
            <DT><A HREF="http://www.victimsofexpedia.com/EN/index.php" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >victims of EXPEDIA.url</A>
        </DL><p>
        <DT><A HREF="http://www.pissedconsumer.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Consumer Complaints, Reports, Scams and Service Reviews.url</A>
        <DT><A HREF="http://www.aarp.org/money/scams-fraud/info-11-2010/scam_alert_a_decade_of_deceit.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Scam Alert Decade of Deceit; Nigerian King E-mail, Letter, Tops Frauds - AARP Bulletin.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SCIENCE & EXPLORATION</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BLOGS & ONLINE MAGAZINES</H3>
        <DL><p>
            <DT><A HREF="http://oregonstate.edu/terra/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Terra Magazine.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">SPACE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Commercial Space Flight</H3>
            <DL><p>
                <DT><A HREF="http://www.networkworld.com/community/node/62103" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >SpaceX successfully takes rocket and expectations into orbit  NetworkWorld.com Community.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SEX & RELATIONSHIPS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Condoms</H3>
        <DL><p>
            <DT><A HREF="http://condommonologues.com/condom-size-chart/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >CONDOM SIZE CHART.url</A>
            <DT><A HREF="http://www.condomman.com/articles/condom-use/condom-storage-and-safety-from-heat/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Condom Storage and Safety from Heat  Articles about Condoms and Safe Sex Resources.url</A>
            <DT><A HREF="http://www.articlealley.com/article_472137_23.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Condom Storage and Safety from Heat.url</A>
            <DT><A HREF="http://ezinearticles.com/?Condom-Storage-Tips&id=3467077" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Condom Storage Tips.url</A>
            <DT><A HREF="http://condommonologues.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Condom Monologues.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=tips+for+condom+storage" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >tips for condom storage - Google Search.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">SEDUCTION & ATTRACTION</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1302184057">Pickups (Approach)</H3>
            <DL><p>
                <DT><H3 FOLDED ADD_DATE="1302184075">Checkout Line</H3>
                <DL><p>
                    <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=approaching+anywhere" ADD_DATE="1302184084" LAST_VISIT="1322361176" LAST_MODIFIED="1302184084" ICON_URI="http://www.google.com/favicon.ico" >approaching anywhere - Google Search.url</A>
                    <DT><A HREF="http://www.gorskys.com/articles/supermarket-true-love.html" ADD_DATE="1302184118" LAST_VISIT="1322361176" LAST_MODIFIED="1302184118" >GORSKYS.COMedy - How To Find True Love In The Supermarket.url</A>
                    <DT><A HREF="http://www.askmen.com/dating/player_150/197_love_games.html#" ADD_DATE="1302184174" LAST_VISIT="1322361176" LAST_MODIFIED="1302184174" ICON_URI="http://www.askmen.com/favicon.ico" >How to pick up at the grocery store - AskMen -.url</A>
                    <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4GGHP_enUS419US419&q=how+to+pick+up++in+the+supermarket" ADD_DATE="1302184181" LAST_VISIT="1322361176" LAST_MODIFIED="1302184181" ICON_URI="http://www.google.com/favicon.ico" >how to pick up in the supermarket - Google Search.url</A>
                    <DT><A HREF="http://www.ehow.com/how_6198468_pick-up-women-supermarket.html" ADD_DATE="1302184167" LAST_VISIT="1322361176" LAST_MODIFIED="1302184167" ICON_URI="http://www.ehow.com/favicon.ico" >How to Pick up Women at The Supermarket  eHow.com.url</A>
                    <DT><A HREF="http://howtopickupwomen.com/37/how-to-pick-up-women/how-to-pick-up-women-in-a-supermarket/" ADD_DATE="1302184126" LAST_VISIT="1322361176" LAST_MODIFIED="1302184126" ICON_URI="http://howtopickupwomen.com/favicon.ico" >How To Pick Up Women In A Supermarket  How To Pick Up Women.url</A>
                    <DT><A HREF="http://www.secretsinseduction.com/How-to-pick-up-a-girl/pick-up-women-at-the-supermarket-through-the-express-lane.html" ADD_DATE="1302184094" LAST_VISIT="1322361176" LAST_MODIFIED="1302184095" ICON_URI="http://www.secretsinseduction.com/templates/gk_pulse/favicon.ico" >Pick up Women at the Supermarket through the Express Lane  How to pick up a girl.url</A>
                    <DT><A HREF="http://www.pickup101.com/blog/pickup-lines-for-the-supermarket/" ADD_DATE="1302184109" LAST_VISIT="1322361176" LAST_MODIFIED="1302184109" >Pickup Lines for the Supermarket  PickUp 101.url</A>
                    <DT><A HREF="http://community.sparknotes.com/2011/03/24/supermarket-pick-up-lines" ADD_DATE="1302184103" LAST_VISIT="1322361176" LAST_MODIFIED="1302184103" >SparkLife ۠Supermarket Pick-Up Lines.url</A>
                    <DT><A HREF="http://www.thebachelorguy.com/how-to-pick-up-a-woman-in-the-supermarket.html" ADD_DATE="1302184139" LAST_VISIT="1322361176" LAST_MODIFIED="1302184139" ICON_URI="http://www.thebachelorguy.com/favicon.ico" >The Bachelor Guy ۠How To Pick Up a Woman in the Supermarket.url</A>
                    <DT><A HREF="http://www.askmen.com/dating/player/41_love_games.html#" ADD_DATE="1302184079" LAST_VISIT="1322361176" LAST_MODIFIED="1302184079" ICON_URI="http://www.askmen.com/favicon.ico" >The Player Approach Women Anywhere - AskMen - 򌴰͠񌀰̓ѥ%򌃐ݮurl</A>
                    <DT><A HREF="http://www.seductiontuition.com/sean-newman/supermarket-pickup-lines.html" ADD_DATE="1302184146" LAST_VISIT="1322361176" LAST_MODIFIED="1302184149" ICON_URI="http://www.seductiontuition.com/favicon.ico" >𠓵permarket Pick Up Lines 𠐕A Pick Up Artist Sean Newman - Seduction Settings, Day Game, PickUp 101, Pick Up 101.url</A>
                </DL><p>
                <DT><H3 FOLDED ADD_DATE="1303414594">I HAVE A BOYFRIEND</H3>
                <DL><p>
                    <DT><A HREF="http://www.fastseduction.com/guide/06_troubleshooting/the_boyfriend_problem/borefriend.shtml" ADD_DATE="1303414599" LAST_VISIT="1322361176" LAST_MODIFIED="1303414599" ICON_URI="http://www.fastseduction.com/favicon.ico" >If she says she has a boyfriend - Fast Seduction 101 Player Guide.url</A>
                    <DT><A HREF="http://www.direct-game.org/showthread.php?54-The-quot-Mode-One-quot-Experience-collection-thread" ADD_DATE="1303414613" LAST_VISIT="1322361176" LAST_MODIFIED="1303414613" ICON_URI="http://www.direct-game.org/favicon.ico" >The Mode One Experience collection thread.url</A>
                </DL><p>
            </DL><p>
            <DT><A HREF="http://www.cliffslist.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Cliff's List -- Private Seduction Letter.url</A>
            <DT><A HREF="http://www.videojug.com/interview/getting-men-to-approach-me-2" ADD_DATE="1303416061" LAST_VISIT="1322361176" LAST_MODIFIED="1303416061" ICON_URI="http://www.videojug.com/images/favicon.ico" >Getting Men To Approach Me (Flirting).url</A>
            <DT><A HREF="http://attractwomenanywhere.com/blog/2010/03/23/how-underground-advice-can-make-you-weird/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How Seduction-community advice screws your game.  Attract Women Now.url</A>
            <DT><A HREF="http://www.seductionroadmap.com/go/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jon Sinn  Seduction Road Map Secrets.url</A>
            <DT><A HREF="http://www.cliffslist.com/letter/sinn-pulls-a-hot-nerd" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >She Tells Me Not To Threaten Her With A Good Time  Cliff's List -- Private Seduction Letter.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SOCIAL NETWORKING</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">FACEBOOK</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Analytics</H3>
            <DL><p>
                <DT><A HREF="http://www.facebook.com/notes/webdigi-web-development/google-analytics-for-facebook-fan-pages/325063857203" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Google Analytics for Facebook Fan Pages (20).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">ASCII ART</H3>
            <DL><p>
                <DT><A HREF="http://www.facebookasciiart.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook ASCII Art.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Chat</H3>
            <DL><p>
                <DT><A HREF="http://www.hacktrix.com/how-to-save-facebook-chat-history-to-read-it-later" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to Save Facebook Chat History.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Emoticons</H3>
            <DL><p>
                <DT><A HREF="http://www.chatsmileysemoticons.com/facebook-shark-emoticon/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook shark emoticon  Chat emoticons and smileys for Facebook, GTalk, AIM, MSN....url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Eric&#39;s Groups</H3>
            <DL><p>
                <DT><A HREF="http://www.facebook.com/ae.php?i=AAAAAwAgACAAAAEz_YlrCwW6T_8bmZGeXKas209oyUNGNgJCyy2nf3jeIdLQmCxsKoCOykKQU2-sGvF5B4ZYl_tYFbOjUCDDTt_L_x3tiMAvBOYJc4Ab4COe9aQTRvnidYOkJslBeAJXMWfuNdtCLFmsP0oM2t1mcmy6DxfMoa6XN6yvIU_ukxNpKptgnnzb9ZXaNY-6zSgI7Y18QaumEJlhqEagttaHld" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook  Can Science and Religion Co-Exist.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Eric&#39;s Pages</H3>
            <DL><p>
                <DT><A HREF="http://hypermartialarts.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook  Nugget P.O.R.N. (Metal &amp; Hard Rock Cover Band - Waterloo, IA).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Eric's Groups</H3>
            <DL><p>
                <DT><A HREF="http://www.facebook.com/help/?page=826#!/group.php?gid=251568412305&ref=ts" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook  Can Science and Religion Co-Exist.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Eric's Pages</H3>
            <DL><p>
                <DT><A HREF="http://www.facebook.com/help/?page=826#!/pages/edit/?id=178304135237" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook  Nugget P.O.R.N. (Metal & Hard Rock Cover Band - Waterloo, IA).url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Errors</H3>
            <DL><p>
                <DT><A HREF="http://www.google.com/search?q=an+error+occurred+while+trying+to+add+the+application+to+your+profile&rls=com.microsoft:en-us&ie=UTF-8&oe=UTF-8&startIndex=&startPage=1" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >an error occurred while trying to add the application to your profile - Google Search.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Landing Page</H3>
            <DL><p>
                <DT><A HREF="http://socialmouths.com/blog/2010/10/27/build-your-facebook-landing-page/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How To Build Your Facebook Landing Page (If YouӲe Not A Programmer)  SocialMouths.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">NEWS</H3>
            <DL><p>
                <DT><A HREF="http://news.cnet.com/8301-13577_3-20026563-36.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Assessing the fate of the 'Facebook Way'  The Social - CNET News.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Symbols</H3>
            <DL><p>
                <DT><A HREF="http://facebook-symbols.com/all/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >All text symbols for Facebook _ (list) - facebook-symbols.url</A>
            </DL><p>
            <DT><A HREF="http://www.facebook.com/help/?page=826" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Facebook  Help Center - Groups.url</A>
            <DT><A HREF="http://www.facebook.com/profile.php?id=100001072022579&v=app_2513891999#!/posted.php?id=100001072022579&success" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Shit Eric Posted On Facebook.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">MYSPACE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Layouts</H3>
            <DL><p>
                <DT><A HREF="http://www.cleanupmyspace.com/download/Surfing-Myspace-Layouts" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Download - Surfing Myspace Layouts.url</A>
                <DT><A HREF="http://www.all4myspace.com/layouts-2.0/surfing-2-myspace-layouts-2.0" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Surfing MySpace Layouts 2.0, Profiles 2.0 and Backgrounds.url</A>
                <DT><A HREF="http://www.all4myspace.com/layouts-2.0/Surfing-~-Its-not-a-sport-Its-a-lifestyle-myspace-layouts-2.0" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Surfing ~ Its Not A Sport Its A Lifestyle MySpace Layouts 2.0, Profiles 2.0 and Backgrounds.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">SQABBLER</H3>
        <DL><p>
            <DT><A HREF="http://www.squabbler.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Squabbler.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">TWITTER</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Analytics & Stats</H3>
            <DL><p>
                <DT><A HREF="http://twittercounter.com/pages/you" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Check Your Twitter Stats - TwitterCounter.com.url</A>
            </DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Purpose</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/watch?v=ddO9idmax0o&feature=fvw" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Twitter in Plain English.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">YOUTUBE</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">RULES AND GUIDELINES</H3>
            <DL><p>
                <DT><A HREF="http://www.youtube.com/t/community_guidelines" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube Community Guidelines.url</A>
            </DL><p>
        </DL><p>
        <DT><A HREF="http://en.gravatar.com/emails/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Gravatar - Globally Recognized Avatars.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SOFTWARE DOWNLOAD SITES</H3>
    <DL><p>
        <DT><A HREF="http://www.filehippo.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >FileHippo.com - Download Free Software.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_STATIONERY & PRINTING</H3>
    <DL><p>
        <DT><A HREF="http://us.moo.com/en/products/business_cards.php?utm_source=facebook&utm_medium=ad&utm_term=Creative&utm_content=276768&utm_campaign=facebook_us_Creative" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >MOO Business Cards  Unique Custom Business Cards  moo.com USA.url</A>
        <DT><A HREF="http://www.vistaprint.com/vp/welcomeback.aspx?xnav=welcome&rd=3" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Vistaprint - Business Cards - Full Color Printing - Digital Printing Company  Vistaprint.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_STORAGE</H3>
    <DL><p>
        <DT><A HREF="http://www.organize.com/brand-iris.html?utm_source=adwords&utm_medium=cpc&utm_campaign=general&gclid=CKTwy63Rh6ICFVZL5wod_ivuUQ" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Complete product line of Iris storage boxes, shoes, sweater, underbed, stackable.url</A>
        <DT><A HREF="http://www.usplastic.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Home  Plastic Tanks  Plastic Buckets  Plastic Bottles  Labware  Plastic Tubing  PVC Pipe  U.S. .url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_SURFING & SKATEBOARDING</H3>
    <DL><p>
        <DT><A HREF="http://www.bungalowbeachdesigns.com/3suor.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >3 Surfboard Ornaments - Beach, Surf and Tropical Themed Ornaments.url</A>
        <DT><A HREF="http://www.endlesssummerlifestyles.com/index.php?l=product_detail&p=9" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Surf decor - tropical decor, beach decor, surf gifts and surfer gift ideas..url</A>
        <DT><A HREF="http://www.google.com/search?sourceid=navclient&aq=0&oq=surfboard+keyc&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=surfboard+keychains" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >surfboard keychains - Google Search.url</A>
        <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=surfboard+rearview+ornament" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >surfboard rearview ornament - Google Search.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TAXES</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298091480">FILING</H3>
        <DL><p>
            <DT><A HREF="http://www.freetaxusa.com/?gclid=CJSr6qrKkqcCFeR65QodYmE9dg" ADD_DATE="1298091482" LAST_VISIT="1322361176" LAST_MODIFIED="1298091482" ICON_URI="http://www.freetaxusa.com/favicon.ico" >FreeTaxUSAΠFREE Tax Filing, Online Return Preparation, E-file Income Taxes.url</A>
        </DL><p>
        <DT><A HREF="http://financiallyfit.yahoo.com/finance/article-108613-3892-3-paper-records-what-to-toss-what-to-keep?ywaad=ad0035#" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Yahoo! Finance - Paper Records_What to Toss, What to Keep (Taxes).url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TESTIMONIALS & RECOMMENDATIONS</H3>
    <DL><p>
        <DT><A HREF="http://forums.almaghrib.org/showthread.php?t=40324" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >AlMaghrib Forums - Valley of the Seekers 99 Names of Allah testimonials and ambiance.url</A>
        <DT><A HREF="http://www.bestpsychicmediums.com/Joanne-Testimonials.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Client Testimonials For Joanne Gerber, Psychic Medium, Spiritual Teacher.url</A>
        <DT><A HREF="http://www.coursework.info/content/testimonials/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Testimonials.url</A>
        <DT><A HREF="http://www.executivewriter.com:8080/testimonials.jsp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Executive Writer Client Testimonials Business Writing Workshop Seminar & Course.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TIME & DATE</H3>
    <DL><p>
        <DT><A HREF="http://wwp.greenwichmeantime.com/info/current-time.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Current Time (GMT).url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TRAVEL</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">BED & BREAKFASTS & INNS</H3>
        <DL><p>
            <DT><A HREF="http://www.atriumbb.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Atrium Bed & Breakfast - Eau Claire, Wisconsin.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">FLIGHTS</H3>
        <DL><p>
            <DT><A HREF="http://www.kayak.com/flights?tab=flights&oneway=n&cabin=e&travelers=1&depart_time=a&depart_date=08%2F10%2F2010&nearbyO=n&return_time=a&return_date=08%2F17%2F2010&nearbyD=n" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Cheap Flights - Deals on Airline Tickets - Airfare - Compare Hundreds of Travel Sites - KAYAK.url</A>
        </DL><p>
        <DT><A HREF="http://travel.yahoo.com/p-interests-34422227" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >10 Things Baggage Handlers Won't Say (2010).url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TROPICAL HOUSING</H3>
    <DL><p>
        <DT><A HREF="http://www.google.com/imgres?imgurl=http://anotherstayinparadise.com/images/DejaBlue/07.jpeg&imgrefurl=http://anotherstayinparadise.com/DejaBluePhotos.html&usg=__a5cD_MXZlNpSv-TXDGfq-2-s-0Y=&h=425&w=640&sz=65&hl=en&start=11&um=1&itbs=1&tbnid=BdUX3X9XeXEVLM:&t" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Google Image Result for http--anotherstayinparadise.com-images-DejaBlue-07.jpeg.url</A>
        <DT><A HREF="http://www.google.com/imgres?imgurl=http://www.southafricahotelsoffer.com/hotel/hotels/thonga_beach_lodge.jpg&imgrefurl=http://www.southafricahotelsoffer.com/hotel/name.php%3Fsymbol%3DT&usg=__u73wKVVIdxBzXRKEOLra18dw9pQ=&h=210&w=300&sz=21&hl=en&start=6&um=1&i" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Google Image Result for http--www.southafricahotelsoffer.com-hotel-hotels-thonga_beach_lodge.jp.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_TV</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">MAVERICK</H3>
        <DL><p>
            <DT><A HREF="http://www.great-quotes.com/cgi-bin/viewquotes.cgi?action=search&Movie=Bret+Maverick+(TV)" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Bret Maverick (TV) Quotes, Sayings and Quotations.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/List_of_Maverick_episodes" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >List of Maverick episodes - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.imdb.com/title/tt0050037/quotes" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Maverick (1957) - Memorable quotes.url</A>
            <DT><A HREF="http://dbellel.blogspot.com/2008/10/maverick-is-his-name.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >pseudo-intellectualism Maverick Is His Name.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">ROCKFORD FILES</H3>
        <DL><p>
            <DT><A HREF="http://www.davidstuff.com/general/rockford.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Chester Sierra's speech to Angel Martin and Jim Rockford on.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">WATCHING ONLINE</H3>
        <DL><p>
            <DT><A HREF="http://vod.fxnetworks.com/fod/play.php?sh=sunny" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >FX Networks - It's Always Sunny in Philadelphia - Full Episodes and Exclusive Video.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">XENA</H3>
        <DL><p>
            <DT><A HREF="http://stason.org/TULARC/tv/xena-warrior-princess/08-When-in-history-does-X-WP-take-place.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >08 When (in history) does XWP take place.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/136199_Eris#Name" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Eris (dwarf planet) - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.howarddavidjohnson.com/legendary-women.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.howarddavidjohnson.com-legendary-women.htm.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/List_of_women_warriors_in_folklore,_literature,_and_popular_culture" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >List of women warriors in folklore - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://whoosh.org/issue22/plunket1.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Martial Arts And Xena Warrior Princess Questions And Answers.url</A>
            <DT><A HREF="http://www.fancydress-costumes.co.uk/acatalog/info_R_15168.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Mens Fancy Dress Arabian Costumes R15168 Large Image.url</A>
            <DT><A HREF="http://www.facebook.com/home.php?#!/photo.php?pid=30531214&id=1176810064" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Miroir d&#39;Arc Archives Homepage.url</A>
            <DT><A HREF="http://miroirdarc.com/homepage/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Miroir d'Arc Archives Homepage.url</A>
            <DT><A HREF="http://www.reliks.com/merchant.ihtml?id=56&step=2" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Practice Swords - Tai Chi, Iaito, Kendo, Western Martial Arts and more.url</A>
            <DT><A HREF="http://www.a2armory.com/practice-swords.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Practice Swords Wooden Medieval and Samurai Styles.url</A>
            <DT><A HREF="http://www.search.com/reference/Xena" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Reference for Xena - Search.com.url</A>
            <DT><A HREF="http://www.facebook.com/photo.php?pid=30531210&id=1176810064&quickling[version]=242329%3B0&ajaxpipe=1&__a=28" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Bard&#39;s Reference Library.url</A>
            <DT><A HREF="http://lunacyreviews.com/reference.php" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Bard's Reference Library.url</A>
            <DT><A HREF="http://www.facebook.com/album.php?aid=2031922&id=1176810064&quickling[version]=242329%3B0&ajaxpipe=1&__a=30" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >What Are Little Girls&#39; (Swords) Made Of.url</A>
            <DT><A HREF="http://whoosh.org/issue27/plunket8.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >What Are Little Girls' (Swords) Made Of.url</A>
            <DT><A HREF="http://whoosh.org/epguide/epguide.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Whoosh! Episode Guide.url</A>
            <DT><A HREF="http://www.a2armory.com/romangladius.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Wooden Gladius Practice Sword.url</A>
            <DT><A HREF="http://www.reliks.com/merchant.ihtml?pid=2118" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Wooden Sword.url</A>
            <DT><A HREF="http://www.tvmerch.com/cgi-bin/shop/tvcart.cgi?ACTION=thispage&thispage=xena.htm&ORDER_ID=135989720" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >XENA MERCHANDISE.url</A>
            <DT><A HREF="http://xenapropweapons.blogspot.com/search?updated-min=2008-01-01T00%3A00%3A00-08%3A00&updated-max=2009-01-01T00%3A00%3A00-08%3A00&max-results=11" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Xena Props-Weapons (2008).url</A>
            <DT><A HREF="http://xenapropweapons.blogspot.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Xena Props-Weapons.url</A>
            <DT><A HREF="http://en.wikipedia.org/wiki/Xena_-_Warrior_Princess" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >xena Warrior Princess - Wikipedia, the free encyclopedia.url</A>
            <DT><A HREF="http://www.youtube.com/watch?v=RMf2eI2ZnAc&feature=related" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >YouTube - Celebrity Profile - Lucy Lawless 3.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_UNIQUE GIFTS</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Guitar Clothing</H3>
        <DL><p>
            <DT><A HREF="http://shop.cafepress.com/guitar?cmp=fb_guitar&utm_medium=display&utm_source=facebook" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Guitar Gifts, T-shirts, Stickers and more - CafePress.url</A>
            <DT><A HREF="http://www.wildaboutmusic.com/guitarnewbro.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Guitars.url</A>
            <DT><A HREF="http://www.teesforall.com/Jimi_Hendrix-m-67.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jimi Hendrix Licensed T shirts, Apparel & Merchandise Jimi Hendrix - TeesForAll.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Humorous Parody Cynical</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">Anti-Religious Pro-Science</H3>
            <DL><p>
                <DT><A HREF="http://controversy.wearscience.com/design/devil/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Devil Bones Tee from Teach the Controversy T-Shirts.url</A>
            </DL><p>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Jesus Junk</H3>
        <DL><p>
            <DT><A HREF="http://www.alittleleaven.com/jesus_junk/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >The Museum of Idolatry Je$u$ Junk.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Men</H3>
        <DL><p>
            <DT><A HREF="http://www.frontgate.com/jump.jsp?itemType=PRODUCT&itemID=25049&k=ZZ50985&mr:trackingCode=61C92101-DD3A-DF11-9DA0-002219319097&mr:referralID=NA" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Flat Tray Charging Station - Frontgate.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Parkour</H3>
        <DL><p>
            <DT><A HREF="http://shop.cafepress.com/parkour?cmp=fb_parkour&pid=6673149&utm_medium=display&utm_source=facebook&utm_campaign=fb_parkour" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Parkour Gifts, T-Shirts, Stickers, & More - CafePress.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Personalized Gifts</H3>
        <DL><p>
            <DT><A HREF="http://www.personalizedgiftexpress.com/personalized-charging-station.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Personalized Electronic Gadget Charging Station.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Political Gifts</H3>
        <DL><p>
            <DT><A HREF="http://mediamonarchy.blogspot.com/2010/01/poll-majority-would-give-up-liberty-to.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >media monarchy poll majority would give up liberty to be safe from terrorism.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Programmer Clothes</H3>
        <DL><p>
            <DT><A HREF="http://www.cafepress.com/+baby_logic_infant_creeper,43692999" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Baby Logic Infant Creeper - CafePress.url</A>
            <DT><A HREF="http://shop.cafepress.com/Computer-Programmer?cmp=fb_ComputerProgrammer&utm_medium=display&utm_source=facebook" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Computer Programmer Gifts, T-shirts, Stickers and more - CafePress.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Psychedelic & Hippie</H3>
        <DL><p>
            <DT><A HREF="http://www.allfungifts.com/index.php?page=shop.product_details&flypage=flypage-ask.tpl&product_id=3994&category_id=313&option=com_virtuemart&Itemid=7" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Jimi Hendrix Shower Curtain.url</A>
            <DT><A HREF="http://sunshinedaydream.biz/store/item/35sy7/Jimi_Hendrix_Stuff/Jimi_Hendrix_-_Shower_Curtain.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Sunshine Daydream Tie Dye Chicago Hippie Store Jimi Hendrix - Shower Curtain.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Punk Clothing</H3>
        <DL><p>
            <DT><A HREF="http://www.punk.com/men-s.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Men's Clothing, Pants, Shirts, Coats, T-shirts & Sweatshirts - Punk.com.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Religious</H3>
        <DL><p>
            <DT><A HREF="http://www.goddessgift.net/page74.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Goddess Magnets - Chakra Magnets - Peace Magnets.url</A>
            <DT><A HREF="http://controversy.wearscience.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Teach the Controversy - Intelligently designed t-shirts urging you to show both sides of every .url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Spooky</H3>
        <DL><p>
            <DT><A HREF="http://www.amazon.com/s/ref=bl_sr_home-garden?ie=UTF8&search-alias=toys-and-games&field-brandtextbin=FUN%20WORLD%20%28DIV.EASTER%20UTLD.%29" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >amazon.com FUN WORLD (DIV.EASTER UTLD.) Toys & Games.url</A>
            <DT><A HREF="http://www.amazon.com/FUN-WORLD-DIV-EASTER-UTLD-Pitcher/dp/B003RYCHAW/ref=sr_1_3?ie=UTF8&s=toys-and-games&qid=1280794428&sr=1-3" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >amazon.com Skull Pitcher Toys & Games.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Transformers Merch</H3>
        <DL><p>
            <DT><A HREF="http://www.80stees.com/products/80sTees-Exclusive-Artsy-Grimlock-T-shirt.asp?referer=Shoppingcom_TRAN101&" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Artsy Grimlock Transformers t-shirt.url</A>
            <DT><A HREF="http://www.urban-collector.com/tranb0004.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Transformers Grimlock mini bust at Urban Collector.url</A>
        </DL><p>
        <DT><A HREF="http://www.bigbadtoystore.com/bbts/default.aspx" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >BigBadToyStore.com - Toys, Action Figures, Vintage Toys, and Collectibles.url</A>
        <DT><A HREF="http://www.bustedtees.com/?utm_medium=CPA&utm_source=ShareASale" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >BustedTees - Funny T-Shirts - New T-Shirt designs every week - Crazy Tees Hilarious Cool Shirts.url</A>
        <DT><A HREF="http://store.theonion.com/category/barware-mugs,12/?utm_source=DH&utm_medium=HalfPg&utm_campaign=ROS" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Onion Store  Barware & Mugs.url</A>
        <DT><A HREF="http://www.perpetualkid.com/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Perpetual Kid- Unique Gifts to Entertain Your Inner Child.url</A>
        <DT><A HREF="http://www.ioffer.com/c/Clothing-Accessories-120000/reggae" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >reggae for sale.url</A>
        <DT><A HREF="http://www.tshirthell.com/hell.shtml" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >T-Shirt Hell t-shirts, shirts, funny t-shirts, funny shirts, baby shirts.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_VIDEO</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CONVERTERS</H3>
        <DL><p>
            <DT><H3 FOLDED ADD_DATE="1298088103">3GP</H3>
            <DL><p>
                <DT><A HREF="http://www.erightsoft.com/SupCk77.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >(FREE GREAT CONVERTER!!!) SUPER ɠ2010.url</A>
                <DT><A HREF="http://www.facebook.com/home.php?#!/photo.php?pid=30531230&id=1176810064" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >(FREE GREAT CONVERTER!!!) SUPER © 2010.url</A>
                <DT><A HREF="http://www.kickasstorrents.com/search/total-video-converter/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Download Total Video Converter Torrents - KickassTorrents.com.url</A>
                <DT><A HREF="http://phone.mobile9.com/a/?qid=4865" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >the best 3gp converter software  - mobile9.url</A>
                <DT><A HREF="http://www.gromkov.com/faq/faq2004-0067.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >What is 3GP  How to convert 3GP to AVI.url</A>
            </DL><p>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_VOLUNTEERISM</H3>
    <DL><p>
        <DT><A HREF="http://www.americorps.gov/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >AmeriCorps.url</A>
        <DT><A HREF="http://www.habitat.org/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Habitat for Humanity Int'l.url</A>
        <DT><A HREF="http://www.peacecorps.gov/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Peace Corps.url</A>
        <DT><A HREF="http://www.crossculturalsolutions.org/countries/latin-america/volunteer-costa-rica.aspx?siteID=Facebook_Costa_Rica" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Volunteer Abroad in Costa Rica with Cross-Cultural Solutions.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_WARRIOR WOMEN</H3>
    <DL><p>
        <DT><A HREF="http://www.howarddavidjohnson.com/legendary-women.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.howarddavidjohnson.com-legendary-women.htm.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_WEATHER</H3>
    <DL><p>
        <DT><A HREF="http://www.intellicast.com/Local/WxMap.aspx?location=USOH0245&weather=hdRadarSmoothPaletteA" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Intellicast - Weather Active Map.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_WINDOWS XP</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1302972127">ALT CHARACTERS</H3>
        <DL><p>
            <DT><A HREF="http://www.tedmontgomery.com/tutorial/altchrc.html" ADD_DATE="1302972129" LAST_VISIT="1322361176" LAST_MODIFIED="1302972129" >Special ALT Characters.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">AUTOMATIC UPDATES</H3>
        <DL><p>
            <DT><A HREF="http://news.cnet.com/8301-13554_3-9867426-33.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Using Process Explorer to tame svchost.exe - Advanced topics  Defensive Computing - CNET News.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CAN PING BUT CAN'T BROWSE</H3>
        <DL><p>
            <DT><A HREF="http://bwojcik.wordpress.com/2010/03/16/can-ping-but-cant-browse-a-reminder-to-think-the-problem-through-before-acting/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Can ping but canӴ browse ֠a reminder to think the problem through before acting ˠGeek Speaks.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1299080739">CANNOT FIND LOCAL PROFILE CORRUPT</H3>
        <DL><p>
            <DT><A HREF="http://support.microsoft.com/kb/947215" ADD_DATE="1299089157" LAST_VISIT="1322361176" LAST_MODIFIED="1299089157" ICON_URI="http://support.microsoft.com/favicon.ico" >MSKB - User profile cannot be loaded.url</A>
            <DT><A HREF="http://www.help2go.com/forum/computer-help/106184-user-profile-problem.html" ADD_DATE="1299122399" LAST_VISIT="1322361176" LAST_MODIFIED="1299122399" ICON_URI="http://www.help2go.com/favicon.ico" >User Profile problem.url</A>
            <DT><A HREF="http://www.computerhope.com/forum/index.php?topic=84202.0" ADD_DATE="1299080742" LAST_VISIT="1322361176" LAST_MODIFIED="1299080742" ICON_URI="http://www.computerhope.com/favicon.ico" >Windows cannot find local profile & is logging you on with temporary profile. - computer help forum.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">CHANGE LOCATION OF MY DOCUMENTS</H3>
        <DL><p>
            <DT><A HREF="http://support.microsoft.com/kb/310147" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to Change the Default Location of the My Documents Folder.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">COPY WHILE SUPRESSING MESSAGES</H3>
        <DL><p>
            <DT><A HREF="http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Microsoft Windows XP - Xcopy.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">DONT SEARCH ZIP FILES</H3>
        <DL><p>
            <DT><A HREF="http://windowsxp.mvps.org/nofindinsidezip.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Prevent Windows XP from searching inside ZIP and CAB files, without breaking Windows XP's nativ.url</A>
            <DT><A HREF="http://www.google.com/search?sourceid=navclient&ie=UTF-8&rlz=1T4HPIC_enUS349US376&q=%22search+everything+except+zip+files%22" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >search everything except zip files - Google Search.url</A>
            <DT><A HREF="http://www.pcmag.com/article2/0,2817,1573774,00.asp" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Stop Win XP from Searching Within ZIP Files  PCMag.com.url</A>
            <DT><A HREF="http://www.tweakxp.com/article37009.aspx" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >TweakXP.com - Disable Search from looking in zip (compressed) files.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">MOVING MULTIPLE FOLDERS FROM CMD</H3>
        <DL><p>
            <DT><A HREF="http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/xcopy.mspx?mfr=true" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Microsoft Windows XP - Xcopy.url</A>
            <DT><A HREF="http://forums.afterdawn.com/thread_view.cfm/746204" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Moving multiple folders with a batch file - AfterDawn Forums.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">OPEN FTP IN WINDOWS EXPLORER</H3>
        <DL><p>
            <DT><A HREF="http://forum.bitdefender.com/lofiversion/index.php/t18079.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >BitDefender Forum  Bd2010 Won't Allow Dreamweaver 8 To Connect.url</A>
            <DT><A HREF="http://social.answers.microsoft.com/Forums/en/InternetExplorer/thread/94751c73-ae3d-4f8c-b5af-b5e183ddb743" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Cannot open FTP site in Windows Explorer from Page Button on IE8 - OPEN FTP SITE IN WINDOWS EXP.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">PAGE & SWAP FILE OPTIMIZATION</H3>
        <DL><p>
            <DT><A HREF="http://www.petri.co.il/pagefile_optimization.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How can I optimize the Windows 2000-XP-2003 virtual memory (Pagefile).url</A>
            <DT><A HREF="http://support.microsoft.com/kb/308417" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to set performance options in Windows XP.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">PROCESSES</H3>
        <DL><p>
            <DT><A HREF="http://www.codinghorror.com/blog/2005/05/xp-automatic-update-nagging.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Coding Horror XP Automatic Update Nagging.url</A>
            <DT><A HREF="http://www.tunexp.com/tips/get_started/how_to_turn_off_automatic_updates/" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to Turn Off Automatic Updates - Windows XP Tips and Tweaks on Tune XP.url</A>
            <DT><A HREF="http://www.experts-exchange.com/Software/Internet_Email/Anti_Spyware/Q_22851213.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >service ##Id_String1.6844F930_1628_4223_B5CC_5BB94B879762##.url</A>
            <DT><A HREF="http://discussions.virtualdr.com/showthread.php?t=209273" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >[RESOLVED] Auto updates nag - Virtual Dr Forums-Computer Tech Support.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">SOMETHING EATING HARD DRIVE SPACE</H3>
        <DL><p>
            <DT><A HREF="http://www.computing.net/answers/security/depleting-hard-drive-space/796.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >depleting hard drive space.url</A>
            <DT><A HREF="http://forum.bitdefender.com/index.php?showtopic=10050&st=40" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Hard Drive Filling Up On It's Own... - BitDefender Forum.url</A>
            <DT><A HREF="http://www.computing.net/answers/security/hard-drive-space-disappearing-really-fast-es/27483.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Hard drive space disappearing really fast, es.url</A>
            <DT><A HREF="http://www.computing.net/answers/windows-xp/hard-drive-space-leaving-while-i-watch/184116.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Hard drive space leaving while I watch.url</A>
            <DT><A HREF="http://forums.techguy.org/windows-xp/862354-solved-missing-free-space-hard.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >solved Missing free space in Hard disk - Tech Support Guy Forums.url</A>
            <DT><A HREF="http://www.computing.net/answers/security/something-is-eating-up-drive-space/29395.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Something is eating up drive space.url</A>
            <DT><A HREF="http://www.experts-exchange.com/Software/Internet_Email/Anti-Virus/Symantec/Q_24990730.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Symantec Definitions Folder Eating My Hard Drive.url</A>
            <DT><A HREF="http://forums.techguy.org/virus-other-malware-removal/893220-virus-eating-my-disk-space.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >virus eating my disk space, yum yum - Tech Support Guy Forums.url</A>
            <DT><A HREF="http://www.google.com/search?q=what+is+eating+my+hard+drive+space+xp&hl=en&rls=com.microsoft%3Aen-us&num=10&lr=&ft=i&cr=&safe=images&tbs=,qdr:y" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >what is eating my hard drive space xp - Google Search.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">STREETS AND TRIPS INSTALL</H3>
        <DL><p>
            <DT><A HREF="http://support.microsoft.com/kb/913189" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to copy Streets and Trips or MapPoint to a network share so that users can install it over .url</A>
            <DT><A HREF="http://www.experts-exchange.com/Other/Miscellaneous/Q_20788235.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to Perform a Administrative Installation for Microsoft Streets and Trips 2004 Software _ st.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">TIME</H3>
        <DL><p>
            <DT><A HREF="http://www.computing.net/answers/hardware/changing-time-24hr-to-12-hr/51811.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >changing time 24hr to 12 hr.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">USB BOOT DISKS</H3>
        <DL><p>
            <DT><A HREF="http://files.extremeoverclocking.com/file.php?f=197" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >HP USB Disk Storage Format Tool - v2.1.8 Download - EXTREME Overclocking.url</A>
        </DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">VCD'S AND BLOATWARE</H3>
        <DL><p>
            <DT><A HREF="http://www.dedoimedo.com/computers/passport-vcd.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >How to remove hidden Virtual CD (VCD) partitions on your Western Digital external disks.url</A>
        </DL><p>
        <DT><A HREF="http://www.theinquirer.net/inquirer/news/1003949/microsoft-targets-windows-pirates-pop-ups" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Microsoft targets windows pirates with pop-ups- The Inquirer.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_WORDPRESS</H3>
    <DL><p>
        <DT><A HREF="http://codex.wordpress.org/Introduction_to_Blogging#Pingbacks" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Introduction to Blogging ˠWordPress Codex.url</A>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_WRITING & COMPOSITION</H3>
    <DL><p>
        <DT><H3 FOLDED ADD_DATE="1298088103">Citing Styles</H3>
        <DL><p>
            <DT><A HREF="http://www.yale.edu/bass/writing/sources/kinds/articles/magazine.html" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >http--www.yale.edu-bass-writing-sources-kinds-articles-magazine.html.url</A>
        </DL><p>
    </DL><p>
    <DT><H3 FOLDED ADD_DATE="1298088103">_[INFECTED SITES]_</H3>
    <DL><p>
        <DT><A HREF="http://www.urbanfonts.com/fonts/brush-fonts.htm" ADD_DATE="1298088103" LAST_VISIT="1322361176" LAST_MODIFIED="1298088103" >Brush Fonts  UrbanFonts.com.url</A>
    </DL><p>
    <DT><A HREF="http://omg.yahoo.com/blogs/a-line/sesame-street-pulls-controversial-katy-perry-duet/624?nc" ADD_DATE="1298088103" LAST_VISIT="1322361098" LAST_MODIFIED="1298088103" >&#39;Sesame Street&#39; Pulls Controversial Katy Perry Duet - A-Line_ the celebrity style blog .url</A>
    <DT><A HREF="http://www.inspirationbit.com/16-best-loved-font-bits-in-web-design/" ADD_DATE="1321752206" LAST_VISIT="1322361098" LAST_MODIFIED="1321752206" ICON_URI="http://www.inspirationbit.com/favicon.ico" >16 Best-Loved Font Bits In Web Design ֠Inspiration Bit.url</A>
    <DT><A HREF="http://www.makeuseof.com/tag/3-methods-host-wordpress-blog-images-external-server/" ADD_DATE="1321237978" LAST_VISIT="1322361098" LAST_MODIFIED="1321237978" >3 Methods To Host Your Wordpress Blog Images On An External Server.url</A>
    <DT><A HREF="http://aboutshiva.com/god_goddess_images.html" ADD_DATE="1320890948" LAST_VISIT="1322361098" LAST_MODIFIED="1320890948" ICON_URI="http://aboutshiva.com/favicon.ico" >AboutShiva.com - God-Goddess Images.url</A>
    <DT><A HREF="http://www.filamentgroup.com/lab/achieving_rounded_corners_in_internet_explorer_for_jquery_ui_with_dd_roundi/" ADD_DATE="1321754628" LAST_VISIT="1322361098" LAST_MODIFIED="1321754628" ICON_URI="http://www.filamentgroup.com/images/favicon2.ico" >Achieving Rounded Corners in Internet Explorer for jQuery UI with DD_roundies  Filament Group, Inc., Boston, MA.url</A>
    <DT><A HREF="http://www.amazon.com/s?ie=UTF8&field-is_prime_benefit=1&rh=n%3A2858778011&page=1" ADD_DATE="1320720239" LAST_VISIT="1322361098" LAST_MODIFIED="1320720239" ICON_URI="http://www.amazon.com/favicon.ico" >amazon.com Prime Eligible Amazon Instant Video.url</A>
    <DT><A HREF="http://www.amazon.com/Truth-Translation-Accuracy-Translations-Testament/dp/076182555X/ref=sr_1_fkmr1_1?ie=UTF8&qid=1285307712&sr=8-1-fkmr1" ADD_DATE="1298088103" LAST_VISIT="1322361098" LAST_MODIFIED="1298088103" >Amazon.com_ Truth in Translation_ Accuracy and Bias in English Translations of the New Testamen.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/amazon/" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Amazon.url</A>
    <DT><A HREF="http://wiki.answers.com/Q/What_is_the_most_accurate_Bible_translation" ADD_DATE="1298088103" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Answers.com - What is the most accurate Bible translation.url</A>
    <DT><A HREF="http://www.ask.com/?o=101483&amp;l=dis" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Ask.com.url</A>
    <DT><A HREF="http://www.avg.com/ww-en/opera" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >AVG.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/bigpoint/" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Bigpoint.url</A>
    <DT><A HREF="http://www.bing.com/?pc=OPER" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Bing.url</A>
    <DT><A HREF="http://www.css3.info/preview/rounded-border/" ADD_DATE="1321751035" LAST_VISIT="1322361098" LAST_MODIFIED="1321751035" ICON_URI="http://www.css3.info/favicon.ico" >border-radius create rounded corners with CSS! - CSS3 . Info.url</A>
    <DT><A HREF="http://buddhisttorrents.blogspot.com/view/flipcard#!/2011/04/masters-of-heaven-and-earth-secrets-of.html" ADD_DATE="1322282024" LAST_VISIT="1322361099" LAST_MODIFIED="1322282024" ICON_URI="http://buddhisttorrents.blogspot.com/favicon.ico" >Buddha Torrents.url</A>
    <DT><A HREF="http://books.google.com/books?id=vDQa0qCjBlkC&pg=SA2-PA4&lpg=SA2-PA4&dq=xhtml+design+for+unstyled+markup&source=bl&ots=o5Eyv4pjxI&sig=C5pcBwmOWS-V3WN56A8ySHAE9w0&hl=en&ei=-NO_TrGINMeeiALH4bWSAw&sa=X&oi=book_result&ct=result&resnum=4&ved=0CDUQ6AEwAw#v=onepage&" ADD_DATE="1321194533" LAST_VISIT="1322361098" LAST_MODIFIED="1321194533" ICON_URI="http://books.google.com/favicon.ico" >Bulletproof Web design improving ... - Dan Cederholm - Google Books.url</A>
    <DT><A HREF="http://computermonger.com/" ADD_DATE="1322321063" LAST_VISIT="1322361099" LAST_MODIFIED="1322321063" ICON_URI="http://computermonger.com/favicon.ico" >ComputerMonger - Hand-Picks the Best Computer Deals for You.url</A>
    <DT><A HREF="http://searchcitrus.com/citrus-county/index.php?/20091218966/News/Legal-News/Crystal-River-Grow-House-shut-down-by-CCSO.html" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Crystal River Grow House shut down by CCSO _ Legal News _ News.url</A>
    <DT><A HREF="http://www.impressivewebs.com/css-font-shorthand-property-cheat-sheet/" ADD_DATE="1321751723" LAST_VISIT="1322361098" LAST_MODIFIED="1321751723" >CSS Font Shorthand Property Cheat Sheet  Impressive Webs.url</A>
    <DT><A HREF="http://jonraasch.com/blog/css-rounded-corners-in-all-browsers" ADD_DATE="1321761290" LAST_VISIT="1322361098" LAST_MODIFIED="1321761290" ICON_URI="http://jonraasch.com/favicon.ico" >CSS Rounded Corners In All Browsers (With No Images)  Jon Raasch's Blog.url</A>
    <DT><A HREF="http://css3pie.com/" ADD_DATE="1321756701" LAST_VISIT="1322361098" LAST_MODIFIED="1321756701" ICON_URI="http://css3pie.com/wp/wp-content/themes/pie-wp-theme/img/favicon.ico" >CSS3 PIE CSS3 decorations for IE.url</A>
    <DT><A HREF="http://mycybermondaydeals.net/" ADD_DATE="1322320634" LAST_VISIT="1322361099" LAST_MODIFIED="1322320634" >Cyber Monday Deals 2011.url</A>
    <DT><A HREF="http://www.squidoo.com/cyber-monday-laptop-deals-2011" ADD_DATE="1322320941" LAST_VISIT="1322361099" LAST_MODIFIED="1322320941" ICON_URI="http://the.squidoocdn.com/images/favicon.ico" >Cyber Monday Laptop Deals 2011.url</A>
    <DT><A HREF="http://www.citruscountynetwork.com/citrus-county/index.php?/20090610477/News/Legal-News/Deputies-Close-another-Grow-House-in-Citrus-County.html?directory=224" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Deputies Close another Grow House in Citrus County _ Legal News _ News.url</A>
    <DT><A HREF="http://css-tricks.com/designing-for-wordpress-complete-series-downloads/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Designing for WordPress Complete Series & Downloads  CSS-Tricks.url</A>
    <DT><A HREF="http://health.howstuffworks.com/mental-health/human-nature/perception/flavor-tripping.htm" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Discovery Health &quot;How Flavor Tripping Works&quot;.url</A>
    <DT><A HREF="http://terpconnect.umd.edu/~nsw/ench250/dostutor.htm" ADD_DATE="1320531497" LAST_VISIT="1322361098" LAST_MODIFIED="1320531497" >DOS TUTORIAL  THE BASICS.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/download" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Download.com.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/ebay/" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >eBay.url</A>
    <DT><A HREF="http://justin.cursosd3.com/maps.html" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Eric Hepperle's First Ever Google Map (10-03-09).url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/fastmail" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >FastMail.url</A>
    <DT><A HREF="http://lifehacker.com/5568817/five-really-handy-google-command-line-tricks" ADD_DATE="1319533794" LAST_VISIT="1322361098" LAST_MODIFIED="1319533794" ICON_URI="http://lifehacker.com/assets/base/img/favicon/lifehacker.ico" >Five Really Handy Google Command Line Tricks.url</A>
    <DT><A HREF="http://thrivingkings.com/formly/?Name=ji&Email=ksdjfkj&Username=&Password=" ADD_DATE="1320721945" LAST_VISIT="1322361098" LAST_MODIFIED="1320721945" >Formly - The form glamorizer for jQuery.url</A>
    <DT><A HREF="http://www.gaiagarden.com/articles/healthnotes/hn_candida.php" ADD_DATE="1321497345" LAST_VISIT="1322361098" LAST_MODIFIED="1321497345" >Gaia Garden Herbal Dispensary - Candida, Jock Itch, TREATMENT.url</A>
    <DT><A HREF="https://addons.mozilla.org/en-US/firefox/bookmarks/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Get Bookmark Add-ons.url</A>
    <DT><A HREF="http://css3pie.com/documentation/getting-started/" ADD_DATE="1321757146" LAST_VISIT="1322361098" LAST_MODIFIED="1321757146" ICON_URI="http://css3pie.com/wp/wp-content/themes/pie-wp-theme/img/favicon.ico" >Getting Started ֠CSS3 PIE CSS3 decorations for IE.url</A>
    <DT><A HREF="http://ask-leo.com/how_do_i_fix_bad_sectors_on_a_flash_drive.html" ADD_DATE="1320889874" LAST_VISIT="1322361098" LAST_MODIFIED="1320889874" >How do I fix bad sectors on a flash drive.url</A>
    <DT><A HREF="http://www.tipsandtricks-hq.com/how-do-i-start-a-blog-and-make-money-online-483" ADD_DATE="1319883483" LAST_VISIT="1322361098" LAST_MODIFIED="1319883483" >How do I Start a Blog and Make Money Online  Tips and Tricks.url</A>
    <DT><A HREF="http://www.medicalmarijuanablog.com/card/marijuana-cards-by-state-003.html" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >How to get a Medical Marijuana Card_ State-by-State.url</A>
    <DT><A HREF="http://www.paulcostan.com/2011/06/how-to-manually-setup-dropbox-cdn-to-hosted-wordpress-site/" ADD_DATE="1321419740" LAST_VISIT="1322361098" LAST_MODIFIED="1321419740" >How to manually setup Dropbox CDN on your hosted Wordpress site  Paul Costan.url</A>
    <DT><A HREF="http://www.online-tech-tips.com/computer-tips/set-active-partition-vista-xp/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >How to set active partition in Vista and XP.url</A>
    <DT><A HREF="http://www.jamesewelch.com/2008/05/01/how-to-write-a-dos-batch-file-to-loop-through-files/" ADD_DATE="1320531541" LAST_VISIT="1322361098" LAST_MODIFIED="1320531541" >How to write a DOS batch file to loop through files ˠJim's Blog.url</A>
    <DT><A HREF="http://people.howstuffworks.com/safe-house.htm" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >HowStuffWorks &quot;How do you keep a safe house safe_&quot;.url</A>
    <DT><A HREF="http://www.regenerateyourlife.org/_ui/docs/ultimateshoppinglist.pdf" ADD_DATE="1303595439" LAST_VISIT="1322361098" LAST_MODIFIED="1303595439" >http--www.regenerateyourlife.org-_ui-docs-ultimateshoppinglist.pdf.url</A>
    <DT><A HREF="http://stackoverflow.com/questions/4757461/jquery-corner-transparent-background-in-ie" ADD_DATE="1321756687" LAST_VISIT="1322361098" LAST_MODIFIED="1321756687" ICON_URI="http://cdn.sstatic.net/stackoverflow/img/favicon.ico" >internet explorer 8 - Jquery.corner() transparent background in IE - Stack Overflow.url</A>
    <DT><A HREF="http://jquery.malsup.com/corner/" ADD_DATE="1321756567" LAST_VISIT="1322361098" LAST_MODIFIED="1321756567" ICON_URI="http://jquery.malsup.com/favicon.ico" >JQuery Corner Demo.url</A>
    <DT><A HREF="http://www.rawfoodtalk.com/showthread.php?37673-Juices-are-recommended-for-juice-fast-for-person-with-candida" ADD_DATE="1321497603" LAST_VISIT="1322361098" LAST_MODIFIED="1321497603" ICON_URI="http://www.rawfoodtalk.com/favicon.ico" >Juices are recommended for juice fast for person with candida.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/kayak" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Kayak.url</A>
    <DT><A HREF="http://www.katu.com/outdoors/featured/100301894.html" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Marijuana a growing problem in Oregon forests _ KATU.com - Portland News, Sports, Traffic Weath.url</A>
    <DT><A HREF="http://californiapotblog.com/tag/marijuana-law/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Marijuana Law _ California Pot _ Medical Marijuana.url</A>
    <DT><A HREF="http://www.allposters.com/?aid=1023741760&search=marijuana&DestType=5&Referrer=http%3A%2F%2Fwww%2Egoogle%2Ecom%2Fimages%3Fq%3Dweeds%26oe%3Dutf%2D8%26rls%3Dorg%2Emozilla%3Aen%2DUS%3Aofficial%26client%3Dfirefox%2Da%26um%3D1%26i&KWID=206476197&SEM=lang%3D1%26sea" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Marijuana Posters.url</A>
    <DT><A HREF="http://www.medicalmarijuanablog.com/marijuana-strains" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Marijuana Strains.url</A>
    <DT><A HREF="http://en.wikipedia.org/wiki/Medicinal_clay" ADD_DATE="1321496992" LAST_VISIT="1322361098" LAST_MODIFIED="1321496992" ICON_URI="http://en.wikipedia.org/favicon.ico" >Medicinal clay - Wikipedia, the free encyclopedia.url</A>
    <DT><A HREF="http://www.bestmmatorrents.com/browse" ADD_DATE="1322281267" LAST_VISIT="1322361098" LAST_MODIFIED="1322281267" ICON_URI="http://www.bestmmatorrents.com/favicon/bestmmatorrents.ico" >MMA Torrents.url</A>
    <DT><A HREF="http://newslink.org/rneradi.html#Iowa" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >NewsLink _ RADIO STATIONS _ U.S. _ NEWS _ TALK.url</A>
    <DT><A HREF="http://www.blogsouthwest.com/" ADD_DATE="1321762079" LAST_VISIT="1322361098" LAST_MODIFIED="1321762079" ICON_URI="http://www.blogsouthwest.com/sites/default/themes/swa/favicon.ico" >Nuts About Southwest.url</A>
    <DT><A HREF="http://www.opposingviews.com/i/oregon-needs-your-help-getting-medical-marijuana-initiative-on-ballot" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Opposing Views_ Oregon Needs Your Help Getting Medical Marijuana Initiative on Ballot.url</A>
    <DT><A HREF="http://blog.norml.org/2009/11/10/oregon-normls-groundbreaking-cannabis-cafe-opening-this-friday/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Oregon NORML’s groundbreaking Cannabis Café opening this Friday _ NORML Blog, Marijuana Law .url</A>
    <DT><A HREF="http://www.kyokushin4life.com/forums/showthread.php?t=8427" ADD_DATE="1322281382" LAST_VISIT="1322361099" LAST_MODIFIED="1322281382" ICON_URI="http://www.kyokushin4life.com/favicon.ico" >Oyama's Kyokushin Way - Kyokushin4life.url</A>
    <DT><A HREF="http://www.devshed.com/c/a/Apache/Installing-and-Configuring-Apache-2-on-a-Windows-XP-Machine/2/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Page 3 - Installing and Configuring Apache 2 on a Windows XP Machine.url</A>
    <DT><A HREF="http://affy.blogspot.com/p5be/ch09.htm" ADD_DATE="1320013106" LAST_VISIT="1322361098" LAST_MODIFIED="1320013106" ICON_URI="http://affy.blogspot.com/favicon.ico" >Perl 5 by Example Using Files - PERL FILE TESTS.url</A>
    <DT><A HREF="place:sort=14&type=6&maxResults=10&queryType=1" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Recent Tags.url</A>
    <DT><A HREF="place:folder=BOOKMARKS_MENU&folder=UNFILED_BOOKMARKS&folder=TOOLBAR&sort=12&excludeQueries=1&excludeItemIfParentHasAnnotation=livemark%2FfeedURI&maxResults=10&queryType=1" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Recently Bookmarked.url</A>
    <DT><A HREF="http://www.squidoo.com/recipe-card-tables" ADD_DATE="1321750818" LAST_VISIT="1322361098" LAST_MODIFIED="1321750818" ICON_URI="http://the.squidoocdn.com/images/favicon.ico" >Recipe Cards Using Tables.url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/reddit" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Reddit.url</A>
    <DT><A HREF="http://css-tricks.com/snippets/css/rounded-corners/" ADD_DATE="1321758421" LAST_VISIT="1322361098" LAST_MODIFIED="1321758421" ICON_URI="http://cdn.css-tricks.com/favicon.ico" >Rounded Corners  CSS-Tricks.url</A>
    <DT><A HREF="http://www.blueskyinterviews.co.uk/int_art22.htm" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Sample Job Interview Questions for Information Technology (IT) and ....url</A>
    <DT><A HREF="http://redir.opera.com/bookmarks/shopping" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Shopping.url</A>
    <DT><A HREF="http://www.mymoneyblog.com/side-jobs-to-make-extra-money-pizza-delivery-driver.html" ADD_DATE="1313436841" LAST_VISIT="1322361098" LAST_MODIFIED="1313436841" ICON_URI="http://www.mymoneyblog.com/favicon.ico" >Side Jobs To Make Extra Money Pizza Delivery Driver ۠My Money Blog.url</A>
    <DT><A HREF="http://www.google.com/support/forum/p/youtube/thread?tid=42305872db87117b&hl=en" ADD_DATE="1307330311" LAST_VISIT="1322361098" LAST_MODIFIED="1307330311" >SOLUTION - This account is already linked to a different Google username. - YouTube Help.url</A>
    <DT><A HREF="http://community.sprint.com/baw/message/323135?tstart=0" ADD_DATE="1312992879" LAST_VISIT="1322361098" LAST_MODIFIED="1312992879" ICON_URI="http://community.sprint.com/favicon.ico" >Sprint Community HELP!.url</A>
    <DT><A HREF="http://www.gro4me.com/ed_rosenthal.htm" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Stoney Girl Gardens.url</A>
    <DT><A HREF="http://intranet.hp.com/Sites/MOST/Pages/Support%20Home.aspx#cellsupport" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Support for broken cell phones.url</A>
    <DT><A HREF="http://forum.davidicke.com/showthread.php?t=92761" ADD_DATE="1322283127" LAST_VISIT="1322361099" LAST_MODIFIED="1322283127" ICON_URI="http://forum.davidicke.com/favicon.ico" >Survival-Wild-food Torrents - David Icke's Official Forums.url</A>
    <DT><A HREF="http://criminal-defense-attorney-tampa.blogspot.com/2010/01/deputy-extorted-marijuana-grower.html" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Tampa Criminal Attorney Lawyer_ Florida Deputy Extorts Money from Marijuana Grow House Operator.url</A>
    <DT><A HREF="http://www.everywaytomakemoney.com/pizza-delivery-jobs.html" ADD_DATE="1313436850" LAST_VISIT="1322361098" LAST_MODIFIED="1313436851" ICON_URI="http://www.everywaytomakemoney.com/favicon.ico" >The Benefits of Pizza Delivery Jobs.url</A>
    <DT><A HREF="http://www.komando.com/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >The Kim Komando Show - Free Tips, Downloads, Reviews, Software and Advice for Your Digital Life.url</A>
    <DT><A HREF="http://www.tayloredmktg.com/rgb/" ADD_DATE="1321758476" LAST_VISIT="1322361098" LAST_MODIFIED="1321758476" >The Other RGB Color Chart.url</A>
    <DT><A HREF="http://www.kwwl.com/Global/story.asp?S=13161119" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Top 8 ways to get your resume thrown out - KWWL.com - News &amp; Weather for Waterloo, Dubuque,.url</A>
    <DT><A HREF="https://supportportal3.deere.com/CAisd/pdmweb.exe" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Unicenter Service Desk - CA CMDB (I-Portal Replacement).url</A>
    <DT><A HREF="http://www.amazon.com/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >UNIFI Amazon Link.url</A>
    <DT><A HREF="http://www.hamra.net/fun/bcc.htm" ADD_DATE="1317860519" LAST_VISIT="1322361098" LAST_MODIFIED="1317860519" ICON_URI="http://www.hamra.net/favicon.ico" >Use BCC.url</A>
    <DT><A HREF="http://www.irnovo.com/2011/05/make-dropbox-serve-as-free-cdn-for.html" ADD_DATE="1321417678" LAST_VISIT="1322361098" LAST_MODIFIED="1321417678" ICON_URI="http://www.irnovo.com/favicon.ico" >Use Dropbox as a Free CDN for Wordpress Blog. - irnovo - Latest Personal Technology around you!.url</A>
    <DT><A HREF="http://www.pascosheriff.com/websmart/pasco/static/viceandnarcotics.htm" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Vice Raid - Marijuana.url</A>
    <DT><A HREF="http://www.search-marketing.info/newsletter/articles/registration-hosting.htm" ADD_DATE="1320935217" LAST_VISIT="1322361098" LAST_MODIFIED="1320935217" ICON_URI="http://www.search-marketing.info/favicon.ico" >Web Hosting VS Domain Registration.url</A>
    <DT><A HREF="http://mundy.org/xp/" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Webifying XP.url</A>
    <DT><A HREF="http://weed.mattters.com/2010/6/22/legal-marijuana-closer-to-a-vote-in-detroit" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Weed Mattters - Jun 22 2010 - Legal Marijuana Closer To A Vote In Detroit.url</A>
    <DT><A HREF="http://pollinator.com/identify/whatsbuzzin.htm" ADD_DATE="1312535017" LAST_VISIT="1322361098" LAST_MODIFIED="1312535017" ICON_URI="http://pollinator.com/favicon.ico" >What's Buzzin' in My Garden - Wasps, Hornets, Bees - NO FEAR.url</A>
    <DT><A HREF="http://www.answerbag.com/q_view/25814" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Which Bible is the most accurate translation of the original text_ _ Answerbag.url</A>
    <DT><A HREF="http://en.wikipedia.org/wiki/Main_Page" ADD_DATE="1307330294" LAST_VISIT="1322361098" LAST_MODIFIED="1307330294" >Wikipedia.url</A>
    <DT><A HREF="http://www.witchesmoon.net/?gclid=COq66b6e-5oCFSQeDQodD3gbfA" ADD_DATE="1298088104" LAST_VISIT="1322361098" LAST_MODIFIED="1298088104" >Witches Moon- Purveyor of fine Books of Shadows.url</A>
    <DT><A HREF="http://support.microsoft.com/kb/920074" ADD_DATE="1319531968" LAST_VISIT="1322361098" LAST_MODIFIED="1319531968" ICON_URI="http://support.microsoft.com/favicon.ico" >You cannot start the Windows Firewall service in Windows XP SP2.url</A>
</DL><p>

        </div>
        
    </body>
</html>




*/





























