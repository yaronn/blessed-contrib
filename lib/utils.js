'use strict';
var x256 = require('x256');

/*
* Recursively merge properties of two objects
*/
function MergeRecursive(obj1, obj2) {
  if (obj1==null) {
    return obj2;
  }
  if (obj2==null) {
    return obj1;
  }

  for (var p in obj2) {
    try {
      // property in destination object set; update its value
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // property in destination object not set; create it and set its value
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}


function getTypeName(thing){
  if(thing===null)return '[object Null]'; // special case
  return Object.prototype.toString.call(thing);
}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ['', 'k', 'm', 'b','t'];
    var suffixNum = Math.floor( (''+value).length/3 );
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

function getColorCode(color) {
  if (Array.isArray(color) && color.length == 3) {
    return x256(color[0],color[1],color[2]);
  } else {
    return color;
  }
}

exports.MergeRecursive = MergeRecursive;
exports.getTypeName = getTypeName;
exports.abbreviateNumber = abbreviateNumber;
exports.getColorCode = getColorCode;

