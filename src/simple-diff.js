
/** @global */
var SimpleDiffJs = {}
SimpleDiffJs.simpleDiff = simpleDiff;

/**
 * @function simpleDiff
 * 
 * Function that compare two objects and overload the first with properties called "[property]_changed";
 * @param {object} newObject - The new version of the object that will be compared, this object will be overloaded with
 * dynamic properties called "[originalPropertyName]_changed" with the result.
 * @param {object} oldObject - The old version of the object that will be compared.
 * @param {boolean} strict - This argument define what kind of comparison will used, strict compare or type-converting compare
 * if don't informed, by default, the kind of compare will be strinct.
 */
function simpleDiff(newObject, oldObject, strict){
    strict === false ? simpleDiffObjects(newObject, oldObject, typeConvertingCompare) : simpleDiffObjects(newObject, oldObject, strictCompare);
}

function strictCompare(newProperty, oldProperty){
    return newProperty === oldProperty;
}

function typeConvertingCompare(newProperty, oldProperty){
    return newProperty == oldProperty;
}

function isNullUndefined(newObject, oldObject){
    return (newObject === null || newObject === undefined) || (oldObject === null || oldObject === undefined)
}

/**
 * For Arrays the type of compare will make no difference, 'cause the array will be serialized to be compared,
 * note that an array only will be the same if both objects are exactly equals.
 */
function serializeAndCompareArray(newArray, oldArray){
    return JSON.stringify(newArray) === JSON.stringify(oldArray);
}

function checkRemovedProperties(listNewPropertyNames, newObject, oldObject){
    if(typeof oldObject === "object"){
        var listOldPropertyNames = Object.keys(oldObject);
        listOldPropertyNames.map(function(property){
            if(listNewPropertyNames.indexOf(property) < 0){
                newObject[property+'_changed'] = "removed";
            }
        });
    }
}

function checkIfObjectWasChanged(newObject){
    var listNewPropertyNames = Object.keys(newObject);
    var changed = 'notChanged';
    listNewPropertyNames.map(function(property){
        if(property.indexOf("_changed") != -1){
            if(newObject[property] !== "notChanged"){
                changed = "changed";
            }
        }
    });
    return changed;
}

function simpleDiffObjects(newObject, oldObject, compareFunction) {
    if(isNullUndefined(newObject, oldObject)){
        return null;
    }
    var listNewPropertyNames = Object.keys(newObject);
    listNewPropertyNames.map(function(property){
        var result;
        if(oldObject.hasOwnProperty(property)){
            if(typeof newObject[property] === "object" && newObject[property] !== null){
                if(!Array.isArray(newObject[property])){
                    result = simpleDiffObjects(newObject[property], oldObject[property], compareFunction);
                } else {
                    result = serializeAndCompareArray(newObject[property], oldObject[property]) ? "notChanged" : "changed";
                }
            } else {
                result = compareFunction(newObject[property], oldObject[property]) ? "notChanged" : "changed"; 
            }
        } else {
            result = "added";
        }
        newObject[property+'_changed'] = result;
    });
    checkRemovedProperties(listNewPropertyNames, newObject, oldObject);
    return checkIfObjectWasChanged(newObject);
}