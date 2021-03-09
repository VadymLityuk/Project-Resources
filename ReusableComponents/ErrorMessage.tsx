import React from 'react';
import { isNullOrUndefined } from 'components/HelperMethods/ReusableComponents';
import Moment from 'moment';
import { StringTranslator, translateString } from './ReusableComponents';

interface Props {
    value: number | string | any;
    name?: string;
    message?: string;
    max?: number;
    line?: number;
}

export const ErrorMessage = (props: Props) => {
    let message = !isNullOrUndefined(props.message) ? props.message : translateString('Required Field');

    if(props.name === "quality") {
        if(props.value < 0 || props.value > 100){
        return (
            <div className="invalid-percentage">
            <StringTranslator>Number must be between 0 and 100</StringTranslator>
        </div>)
        }
    }

    if (props.name == "product") {
        if (props.line && props.line < 0) {
            return (
                <div className="invalid-feedback d-block">
                    <StringTranslator>Please select a Line</StringTranslator>
                </div>)
        }

        if (Object.keys(props.value).length < 0) {
            return (
                <div className="invalid-feedback d-block">
                    <StringTranslator>Required Field</StringTranslator>
                </div>)
        }
    }
    if (props.name == "partialDuration") {
        if (props.max) {
            if (props.value > props.max || props.value < 0) {
                return (
                    <div className="invalid-feedback d-block">
                        <StringTranslator>Limit Exceeded</StringTranslator>
                    </div>)
            }
        }
    }
    if (props.name == "Already Exists") {
        return (
            <div className="invalid-feedback d-block">
                <StringTranslator>Already Exists</StringTranslator>
            </div>)
    }
    if (props.name == "Invalid Email") {
        return (
            <div className="invalid-feedback d-block">
                <StringTranslator>Invalid Email</StringTranslator>
            </div>)
    }
    if (props.name == "Invalid Tech Initials") {
        return (
            <div className="invalid-feedback d-block">
                <StringTranslator>Invalid Tech Initials</StringTranslator>
            </div>)
    }
    if (props.name == "multi-select") {
        // console.log(props.value)
        if (props.value.length === 0) {
            return (
                <div className="invalid-feedback d-block">
                    {message}
                </div>)
        }
    }
    if (props.value < 0 || props.value === "" || props.value === null || props.value === true) {
        // console.log(props.value);
        return (
            <div className="invalid-feedback d-block">
                {message}
            </div>)
    }
    return null;
}

export const validateForm = (fields) => {
    let errors = {};
    let isFormValid: boolean = true;
    for (let [fieldName, value] of Object.entries(fields)) {
        let val: any = value;
        if ((val == "" || val < 0 || val === null) && (fieldName != 'changeoverType')) {
            // console.log(fieldName, value);
            errors[`${fieldName}Error`] = translateString("Required Field");
            isFormValid = false;
        }
        else if ((val === "" || val <= -1 || val === null) && (fieldName == 'changeoverType')) {
             //console.log(val);
            errors[`${fieldName}Error`] = translateString("Required Field");
            isFormValid = false;
        }
        else if ((fieldName == "comments") && (val.length < 5)) {
            errors[`${fieldName}Error`] = "Comments must be atleast 5 Characters";
            isFormValid = false;
        }
        switch (fieldName) {
            case 'Date':
                if (value instanceof Moment) {
                    if (Moment(value).isValid() === false) {
                        // console.log(fieldName, value);
                        errors[`${fieldName}Error`] = "Invalid Date";
                        isFormValid = false;
                    }
                }
                break;
            case 'selectedProduct':
            case 'selectedOperator':
            case 'selectedLine':
                if (!isNullOrUndefined(val)) {
                    if (Object.keys(val).length === 0) {
                        // console.log(fieldName, value);
                        errors[`${fieldName}Error`] = translateString("Required Field");
                        isFormValid = false;
                    }
                }
                break;
            case 'lineStatus':
                if (val.length === 0) {
                    // console.log(fieldName, value);
                    errors[`${fieldName}Error`] = translateString("Required Field");
                    isFormValid = false;
                }
                break;
            default:
                break;
        }

    }
    return { errors, isFormValid };
}