/*
* Recursively merge properties of two objects 
*/
function MergeRecursive(obj1, obj2) {

  if (obj1==null) return obj2
  if (obj2==null) return obj1

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}


function getTypeName(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
}

exports.MergeRecursive = MergeRecursive
exports.getTypeName = getTypeName