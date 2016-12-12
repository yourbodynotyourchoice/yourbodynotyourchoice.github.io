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
var color
var descrip
var year = 2013
var Grades = ['A', 'B', 'C', 'D', 'F']
var Prohibited = ['Viability', '3rd Trimester', '24 Weeks', '22 Weeks', '20 Weeks', '12 Weeks']
var Mandated = ['No', 'Yes']
var Waiting = ['None', '18 Hours', '24 Hours', '48 Hours', '72 Hours']
var Parental = ['None', 'Notice', 'Consent']
var Ultra = ['None', 'Must be infomed', 'Must be offered', 'Must be performed']

export function makeColorScale (view) {
  if (view === 'overview') {
    return buildColorScale(grades, view)
  } else if (view === 'prohibit') {
    return buildColorScale(mandated, view)
  } else if (view === 'consoluing') {
    return buildColorScale(parent, view)
  } else if (view === 'waiting') {
    return buildColorScale(prohibit, view)
  } else if (view === 'parent') {
    return buildColorScale(ultra, view)
  } else if (view === 'ultra') {
    return buildColorScale(waiting, view)
  } else if (view === 'crisis') {
    return [[1, '#ccc']]
  }
}

function buildColorScale (data, view) {
  newIndex = []
  emptyIndex = []

  for (var i = 49; i >= 0; i--) {
    if (view === 'overview') {
      index = data[stateCode[i]]
    } else {
      index = data[stateCode[i]][year]
    }
    if (index === 0) {
      color = '#fbe6c5'
    } else if (index === 1) {
      color = '#ee8a82'
    } else if (index === 2) {
      color = '#ee8a82'
    } else if (index === 3) {
      color = '#c8586c'
    } else if (index === 4) {
      color = '#70284a'
    }
    emptyIndex.push(color)
  }

  for (var j = emptyIndex.length - 1; j >= 0; j--) {
    newIndex[j] = [stateCode[j], emptyIndex[j]]
  }

  return newIndex
}

export function makeDescriptions (view) {
  if (view === 'overview') {
    return getDescription(grades, view, Grades)
  } else if (view === 'prohibit') {
    return getDescription(prohibit, view, Prohibited)
  } else if (view === 'consoluing') {
    return getDescription(mandated, view, Mandated)
  } else if (view === 'waiting') {
    return getDescription(waiting, view, Waiting)
  } else if (view === 'parent') {
    return getDescription(parent, view, Parental)
  } else if (view === 'ultra') {
    return getDescription(ultra, view, Ultra)
  }
}

function getDescription (data, view, wordBank) {
  newIndex = {}
  emptyIndex = []
  stateCodeClone = stateCode

  for (var i = 49; i >= 0; i--) {
    if (view === 'overview') {
      index = data[stateCode[i]]
    } else {
      index = data[stateCode[i]][year]
    }
    descrip = wordBank[index]

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
  } else if (view === 'consoluing') {
    return Mandated
  } else if (view === 'waiting') {
    return Waiting
  } else if (view === 'parent') {
    return Parental
  } else if (view === 'ultra') {
    return Ultra
  }
}
