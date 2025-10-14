//validation for inputs to protect against XSS and other attacks
//This class will make use of regex to validate inputs
//it will be used in the services before any database operations are performed

const sanitizer = require('sanitizer');

//regex patterns for validation
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; //comprehensive email regex
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //minimum 8 characters, at least one letter and one number
const usernamePattern = /^[a-zA-Z0-9_]{6,30}$/; //alphanumeric and underscores, 3-30 characters

//patterns to protect against NoSQL injection (excluding dot for emails)
const noSqlInjectionPattern = /[\$]/; // Only block $ symbol, allow dots for emails

//common patterns to protect against XSS
const xssPattern = /<script.*?>.*?<\/script.*?>/i;
const htmlTagPattern = /<\/?[^>]+(>|$)/g;
const jsEventPattern = /on\w+=".*?"/g;
const jsProtocolPattern = /javascript:/i;
const dataProtocolPattern = /data:text\/html/i;

// Profanity filter list
const profanityList = [
    // Common profanity
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'crap', 'piss',
    'bastard', 'whore', 'slut', 'fag', 'retard', 'stupid',
    'idiot', 'moron', 'dumb', 'hate', 'kill', 'die', 'death',
    // Inappropriate sexual content
    'sex', 'porn', 'xxx', 'nude', 'naked', 'penis', 'vagina',
    'boobs', 'tits', 'cock', 'dick', 'pussy', 'anal',
    // Hate speech and discriminatory terms
    'nazi', 'hitler', 'racist', 'nigger', 'faggot', 'terrorist',
    // Drug-related
    'weed', 'cocaine', 'heroin', 'meth', 'drugs', 'dealer',
    // Violence-related
    'murder', 'rape', 'abuse', 'violence', 'weapon', 'bomb',
    // Common variations and leetspeak
    'f*ck', 'sh*t', 'b*tch', 'a$$', 'h3ll', 'cr@p',
    '4ss', 'h4te', 'k1ll', 'd1e', 's3x', 'p0rn'
];

// Function to check if text contains profanity
function containsProfanity(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    const lowerText = text.toLowerCase();
    
    // Check against profanity list
    for (const word of profanityList) {
        if (lowerText.includes(word.toLowerCase())) {
            return true;
        }
    }
    
    return false;
}

//function to validate email against attacks and proper format
function validateEmail(email) {
    // First check basic format
    if (!emailPattern.test(email)) {
        return false;
    }
    
    // Check for XSS patterns (but not profanity in email addresses)
    if (xssPattern.test(email) || htmlTagPattern.test(email) || jsEventPattern.test(email) || jsProtocolPattern.test(email) || dataProtocolPattern.test(email)) {
        return false;
    }
    
    // Check for NoSQL injection (only $ symbol, not dots)
    if (noSqlInjectionPattern.test(email)) {
        return false;
    }
    
    // Only check profanity in the local part (before @), not the domain
    const localPart = email.split('@')[0];
    if (containsProfanity(localPart)) {
        return false;
    }
    
    return true;
}

//function to validate password
function validatePassword(password) {
    if (containsProfanity(password)) {
        return false;
    } else if (noSqlInjectionPattern.test(password) || xssPattern.test(password) || htmlTagPattern.test(password) || jsEventPattern.test(password) || jsProtocolPattern.test(password) || dataProtocolPattern.test(password)) {
        return false;
    }
    return passwordPattern.test(password);
}

//function to validate username
function validateUsername(username) {
    if(containsProfanity(username)){
        return false;
    }else if(noSqlInjectionPattern.test(username) || xssPattern.test(username) || htmlTagPattern.test(username) || jsEventPattern.test(username) || jsProtocolPattern.test(username) || dataProtocolPattern.test(username)) {
        return false;
    }
    return usernamePattern.test(username);
}

//function to validate fullname
function validateFullname(fullname) {
    if(containsProfanity(fullname)){
        return false;
    }else if(noSqlInjectionPattern.test(fullname) || xssPattern.test(fullname) || htmlTagPattern.test(fullname) || jsEventPattern.test(fullname) || jsProtocolPattern.test(fullname) || dataProtocolPattern.test(fullname)) {
        return false;
    }
    return true; //allow any characters in fullname as long as it passes the above checks
}

//function to sanitize input strings
function sanitizeInput(input) {
    return sanitizer.sanitize(input);
}

// Debug function to test email validation step by step
function debugEmailValidation(email) {
    console.log(`\n=== DEBUG EMAIL VALIDATION: ${email} ===`);
    
    const formatTest = emailPattern.test(email);
    console.log(`1. Format test: ${formatTest}`);
    
    const xssTest = !(xssPattern.test(email) || htmlTagPattern.test(email) || jsEventPattern.test(email) || jsProtocolPattern.test(email) || dataProtocolPattern.test(email));
    console.log(`2. XSS test passed: ${xssTest}`);
    
    const noSqlTest = !noSqlInjectionPattern.test(email);
    console.log(`3. NoSQL injection test passed: ${noSqlTest}`);
    
    const localPart = email.split('@')[0];
    const profanityTest = !containsProfanity(localPart);
    console.log(`4. Profanity test passed (local part: ${localPart}): ${profanityTest}`);
    
    const overall = validateEmail(email);
    console.log(`5. Overall result: ${overall}`);
    console.log(`=== END DEBUG ===\n`);
    
    return overall;
}

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullname,
    containsProfanity,
    sanitizeInput,
    debugEmailValidation
};
