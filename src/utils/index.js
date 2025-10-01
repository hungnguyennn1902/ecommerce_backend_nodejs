'use strict'

const _ = require('lodash');

const getInfoData = ({ object = {}, fields =[] }) => {
    return _.pick(object, fields);
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
}

const getUnSelectData = (unselect = []) => {
    return Object.fromEntries(unselect.map((field) => [field, 0]));
}

const removeUndefinedObject = (obj = {}) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
        }
    })
    return obj
}

const updateNestedObjectParser = (obj = {}) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach((k) => {
                result[`${key}.${k}`] = response[k];
            })
        }else{
            result[key] = obj[key];
        }
    })
    return result;
}


module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
    
}