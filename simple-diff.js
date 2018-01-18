
var SimpleDiffJs = {}

/**
 * 
 */
SimpleDiffJs.simpleDiff = simpleDiff;

/**
 * Function that compare two objects and overload the first with 
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
        console.log("SimpleDiff: Cant diff objects 'cause one or both objects are null/undefined");
        return null;
    }
    var listNewPropertyNames = Object.keys(newObject);
    listNewPropertyNames.map(function(property){
        var result;
        if(oldObject.hasOwnProperty(property)){
            if(typeof newObject[property] === "object"){
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