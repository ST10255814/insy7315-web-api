//validation for inputs to protect against XSS and other attacks
//This class will make use of regex to validate inputs
//it will be used in the services before any database operations are performed

const sanitizere = require('sanitizer');

//regex patterns for validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //minimum 8 characters, at least one letter and one number

//patterns to protect against NoSQL injection
const noSqlInjectionPattern = /[$.]/;

//common patterns to protect against XSS
const xssPattern = /<script.*?>.*?<\/script.*?>/i;
const htmlTagPattern = /<\/?[^>]+(>|$)/g;
const jsEventPattern = /on\w+=".*?"/g;
const jsProtocolPattern = /javascript:/i;
const dataProtocolPattern = /data:text\/html/i;

//function to validate email against attacks and proper format
function validateEmail(email) {
    if (noSqlInjectionPattern.test(email) || xssPattern.test(email) || htmlTagPattern.test(email) || jsEventPattern.test(email) || jsProtocolPattern.test(email) || dataProtocolPattern.test(email)) {
        return false;
    }
    return emailPattern.test(email);
}

//function to validate password
function validatePassword(password) {
    if (noSqlInjectionPattern.test(password) || xssPattern.test(password) || htmlTagPattern.test(password) || jsEventPattern.test(password) || jsProtocolPattern.test(password) || dataProtocolPattern.test(password)) {
        return false;
    }
    return passwordPattern.test(password);
}

//function to sanitize input strings
function sanitizeInput(input) {
    return sanitizere.sanitize(input);
}
module.exports = {
    validateEmail,
    validatePassword,
    sanitizeInput
 };
