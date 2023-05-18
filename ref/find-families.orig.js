/*
File Name: find-families.js

Programming:  Eric Hepperle
Date Created: 2022-12-11
Version:      0.0.1

App Type:     Algo Demo

Purpose: Given a list of full names of people, determine possible family members.
Group results by last name.

--- --- ---
TIME COMPLEXITY:


*/

// Import the Node file system 'fs' module
const fs = require('fs')

// Define a visual horizonal rule (bar) to use in console:
//   ******************************
const bar = '\n' + '*'.repeat(30)



/**
 * Main: The main function; controller.
 */
function main() {

  console.log(bar)

  // DEFINE people file path
  const DOCS_PATH = '../../' + 'data-docs/'
  const peopleFile = DOCS_PATH + 'people2.txt'
  
  // SLURP DATA FILE INTO ARRAY
  const fullNames = filenameToLines(peopleFile)
  // console.log({ fullNames })
  
  // BUILD NAMES DICT: Determines surname and groups full names by surname
  const surnamesDict = buildNamesDict(fullNames)
  
  // HOW TO OPTIONALLY ADD EXTRA NAMES the fullNames array
  //  external to slurping the file. This appends more names to the array:
  surnamesDict["Gillian"].push("Michael J. Gillian", "Janet Gillian", "Ann Gillian")

  // DISPLAY the surnames dict as table
  console.log(`\nTABLE OF FULL NAMES ORGANIZED BY SURNAME\n`)
  console.table(surnamesDict)

  // DEFINE what you want to search for in surnamesDict. Can be any case
  //  (upper, lower, mixed) search string (needle) is converted
  //  for comparison in the code.
  let needle = 'ABEL'

  // let matchedNames = searchStrInDict(needle, surnamesDict)

  
  // Strings to search
  testValues = [
    'ard', 'ik', 'ZELL', 'ZEL', 'ey', 'AbeL', 'Avel'
  ]

  // DISPLAY RESULTS with various search strings
  testHarness(testValues, surnamesDict)

} // END main

main()



/// HELPER FUNCTIONS ///


/**
 * Split text file into array of lines.
 * 
 * @arg: {string} filename
 * @return: {array} lines
 */
 function filenameToLines(filename) {

  const buffer = fs.readFileSync(filename)
  const fileStr = buffer.toString()
  const lines = fileStr.split('\n') // make array

  return lines

}

/**
 * Build a dictionary / hashmap organized by surnames.
 * 
 * CAVEAT: Doesn't account for or handle surnames with spaces like 'La Pierre'.
 *  
 * @param {array} fullNamesArray 
 * @returns {object} dict 
 */
function buildNamesDict(fullNamesArray) {

  const dict = {}

  // BUILD NAMES DICTIONARY
  for (let i = 0; i < fullNamesArray.length; i++) {

    let name = fullNamesArray[i]
    let tmpArr = name.split(' ')

    // Last element of temp array is surname
    let surname = tmpArr[tmpArr.length - 1]

    // ADD NAME TO DICT
    if (!(surname in dict)) {
      dict[surname] = []
    }
    dict[surname].push(name)

  }

  return dict

}

/**
 * Given a search string and a hashmap / dictionary of names grouped by surname,
 *  returns full names containing that search string.
 * 
 * @param {string} needle 
 * @param {object} dict 
 * @returns {array} matches
 */
function searchStrInDict(needle, dict) {

  const matches = []

  for (const [surname, namesGroup] of Object.entries(dict)) {

    let lowerSurname = surname.toLowerCase()
    let lowerNeedle = needle.toLowerCase()
  
    // ADD surname to matches if key contains needle
    if (lowerSurname.includes(lowerNeedle)) {
      console.log(`Matched: ${surname}`)
      console.log([surname, family])
    }
  
    // ADD names in names group that contain needle
    namesGroup.forEach(name => {

      let lowerName = name.toLowerCase()
      
      if (lowerName.includes(lowerNeedle)) {
        console.log(name, `matched needle`, needle)
        matches.push(name)
  
      }
  
    }) // END namesGroup
  
  
  }

  return matches

}


function testHarness(searchStrings, dict) {

  for (let i=0; i < searchStrings.length; i++ ) {

    let matchedNames = searchStrInDict(searchStrings[i], dict)
 
    // DISPLAY RESULTS
    console.log(`\nmatchedNames:`, matchedNames, `\n`)
    // console.table(dict)
  
    console.log(bar)

  }

}


/*
ALGORITHM

SLURPT names file into array (fullNames)

DEFINE GLOBAL hashmap (surnamesDict)

LOOP through fullnames

  STORE current name (name)

  // GET SURNAME FROM NAME
  SPLIT name at spaces into array (tmpArr)
  STORE last element of tmpArr (surname)

  // HANDLE SURNAME
  CHECK IF SURNAME is KEY in surnamesDict, IF NO

    ADD surname as key to surnamesDict
    INITIALIZE value to empty array
  
  ELSE

    PUSH current name onto surnamesDict.surname

  END


END

RETURN surnamesDict

*/