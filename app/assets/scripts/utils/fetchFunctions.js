import grades from '../../data/grades.json'
import mandated from '../../data/mandated.json'
import parent from '../../data/parent.json'
import prohibit from '../../data/prohibit.json'
import ultra from '../../data/ultra.json'
import waiting from '../../data/waiting.json'

// Making the color array:

// output:
const stateCode = [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56]
var stateCodeClone
var newIndex = {}
var index
var emptyIndex = []
var colorArray = []
var color
var Grades = ['A', 'B', 'C', 'D', 'F']
var Prohibited = ['Viability', '3rd Trimester', '24 Weeks', '22 Weeks', '20 Weeks', '12 Weeks']
var Mandated = ['Not Required', 'Required']
var Waiting = ['None', '18 Hours', '24 Hours', '48 Hours', '72 Hours']
var Parental = ['None', 'Notice', 'Consent']
var Ultra = ['None', 'Must be infomed', 'Must be offered', 'Must be performed']
var legGrades = ['Report Card: ']
var legProhibited = ['Prohibited at ']
var legMandated = ['No mandated counseling', 'Pre-abortion counseling mandated by law']
var legWaiting = ['No waiting period', 'Waiting Period of ', 'Waiting Period of ', 'Waiting Period of ', 'Waiting Period of ']
var legParent = ['No law requiring parental consent for minors', 'Minor must notify parents about an abortion', 'Minor\'s parents must give consent before an abortion can be performed']
var legUltra = ['Ultrasound not required for an abortion', 'Women seeking abortions must be informed of ultrasounds', 'Ultrasound must be offered', 'Ultrasound must be performed']
var color0 = '#fbe6c5'
var color1 = '#f5ba98'
var color2 = '#ee8a82'
var color3 = '#dc7176'
var color4 = '#c8586c'
var color5 = '#9c3f5d'

export function makeColorScale (view, year) {
  if (view === 'overview') {
    return buildColorScale(grades, view, 5, year)
  } else if (view === 'prohibit') {
    return buildColorScale(prohibit, view, 6, year)
  } else if (view === 'counseling') {
    return buildColorScale(mandated, view, 2, year)
  } else if (view === 'waiting') {
    return buildColorScale(waiting, view, 5, year)
  } else if (view === 'parent') {
    return buildColorScale(parent, view, 3, year)
  } else if (view === 'ultra') {
    return buildColorScale(ultra, view, 4, year)
  } else if (view === 'crisis') {
    return [[1, '#ccc']]
  }
}

function buildColorScale (data, view, length, year) {
  newIndex = []
  emptyIndex = []
  colorArray = matchupColors(length)

  for (var i = 49; i >= 0; i--) {
    if (view === 'overview') {
      index = data[stateCode[i]]
    } else {
      index = data[stateCode[i]][year]
    }
    for (var j = length - 1; j >= 0; j--) {
      if (index === j) {
        color = colorArray[j]
      }
    }
    emptyIndex.push(color)
  }

  for (var k = emptyIndex.length - 1; k >= 0; k--) {
    newIndex[k] = [stateCode[k], emptyIndex[k]]
  }

  return newIndex
}

export function makeDescriptions (view, year) {
  if (view === 'overview') {
    return getDescription(grades, view, Grades, year)
  } else if (view === 'prohibit') {
    return getDescription(prohibit, view, Prohibited, year)
  } else if (view === 'counseling') {
    return getDescription(mandated, view, Mandated, year)
  } else if (view === 'waiting') {
    return getDescription(waiting, view, Waiting, year)
  } else if (view === 'parent') {
    return getDescription(parent, view, Parental, year)
  } else if (view === 'ultra') {
    return getDescription(ultra, view, Ultra, year)
  }
}

function getDescription (data, view, wordBank, year) {
  newIndex = {}
  emptyIndex = []
  stateCodeClone = stateCode

  for (var i = 49; i >= 0; i--) {
    var descrip
    if (view === 'overview') {
      index = data[stateCode[i]]
      descrip = legGrades + Grades[index]
    } else {
      index = data[stateCode[i]][year]
      if (view === 'prohibit') {
        descrip = legProhibited + Prohibited[index]
      } else if (view === 'counseling') {
        descrip = legMandated[index]
      } else if (view === 'waiting') {
        if (index === 0) {
          descrip = legWaiting[index]
        } else {
          descrip = legWaiting[index] + Waiting[index]
        }
      } else if (view === 'parent') {
        descrip = legParent[index]
      } else if (view === 'ultra') {
        descrip = legUltra[index]
      }
    }
    emptyIndex.push(descrip)
  }

  stateCodeClone.forEach(function (value, index) {
    newIndex[value] = emptyIndex[index]
  })
  return newIndex
}

export function getFetcher (view) {
  if (view === 'overview') {
    return Grades
  } else if (view === 'prohibit') {
    return Prohibited
  } else if (view === 'counseling') {
    return Mandated
  } else if (view === 'waiting') {
    return Waiting
  } else if (view === 'parent') {
    return Parental
  } else if (view === 'ultra') {
    return Ultra
  }
}

export function fetchColors (view) {
  if (view === 'overview') {
    return ['0', '1', '2', '3', '4']
  } else if (view === 'prohibit') {
    return ['0', '1', '2', '3', '4', '5']
  } else if (view === 'counseling') {
    return ['0', '3']
  } else if (view === 'waiting') {
    return ['0', '1', '2', '3', '5']
  } else if (view === 'parent') {
    return ['0', '1', '3']
  } else if (view === 'ultra') {
    return ['0', '1', '2', '4']
  } else if (view === 'crisis') {
    return [[1, '#ccc']]
  }
}

function matchupColors (length) {
  if (length === 2) {
    return [color0, color3]
  } else if (length === 3) {
    return [color0, color1, color3]
  } else if (length === 4) {
    return [color0, color1, color2, color4]
  } else if (length === 5) {
    return [color0, color1, color2, color3, color4]
  } else if (length === 6) {
    return [color0, color1, color2, color3, color4, color5]
  }
}
