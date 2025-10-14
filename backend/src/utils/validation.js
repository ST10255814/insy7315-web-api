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

// Enhanced profanity filter list
const profanityList = [
    // Common profanity
    'fuck', 'fck', 'fuk', 'feck', 'phuck', 'fucc', 'fuckin', 'fucking',
    'shit', 'sht', 'shyt', 'shite', 'crap', 'poop',
    'damn', 'damm', 'dammit', 'damnit',
    'bitch', 'btch', 'bych', 'biatch', 'beotch',
    'ass', 'arse', 'butt', 'butthole', 'asshole', 'arsehole',
    'hell', 'heck', 'piss', 'pissed', 'pissing',
    'bastard', 'bstrd', 'basterd',
    
    // Sexual content - explicit
    'whore', 'slut', 'slutty', 'hoe', 'hooker', 'prostitute',
    'sex', 'sexy', 'porn', 'porno', 'pornography', 'xxx',
    'nude', 'naked', 'strip', 'stripper',
    'penis', 'cock', 'dick', 'prick', 'schlong', 'wang',
    'vagina', 'pussy', 'cunt', 'twat', 'snatch',
    'boobs', 'tits', 'titties', 'breasts', 'nipples',
    'anal', 'anus', 'buttocks', 'orgasm', 'climax',
    'masturbate', 'jerkoff', 'handjob', 'blowjob',
    'suck', 'sucking', 'lick', 'licking',
    
    // Hate speech and discriminatory terms
    'nazi', 'hitler', 'fascist', 'racist', 'racism',
    'nigger', 'nigga', 'negro', 'coon',
    'faggot', 'fag', 'homo', 'queer', 'dyke',
    'terrorist', 'jihad', 'taliban',
    'retard', 'retarded', 'spastic', 'autistic',
    
    // Violence and threats
    'kill', 'murder', 'die', 'death', 'dead', 'suicide',
    'rape', 'raping', 'molest', 'abuse', 'beat',
    'violence', 'violent', 'weapon', 'gun', 'knife',
    'bomb', 'explosive', 'terror', 'attack',
    'hate', 'hatred', 'enemy',
    
    // Drugs and substances
    'weed', 'marijuana', 'cannabis', 'pot', 'dope',
    'cocaine', 'coke', 'crack', 'heroin', 'meth',
    'drugs', 'dealer', 'addict', 'junkie',
    'ecstasy', 'lsd', 'acid', 'molly',
    
    // Insults and derogatory terms
    'stupid', 'idiot', 'moron', 'dumb', 'dumbass',
    'loser', 'failure', 'worthless', 'pathetic',
    'ugly', 'fat', 'skinny', 'freak',
    
    // Leetspeak and symbol variations
    'f*ck', 'f**k', 'f***', 'fvck', 'phuk',
    'sh*t', 'sh!t', 'sht', 'shyt',
    'b*tch', 'b!tch', 'bytch',
    'a$$', 'a**', '4ss', '455',
    'h3ll', 'h311', 'h@te', 'h4te',
    'k1ll', 'k!ll', 'ki11',
    'd1e', 'd!e', 'di3',
    's3x', 's@x', 'se><',
    'p0rn', 'p@rn', 'pr0n',
    'd1ck', 'd!ck', 'dik', 'dck',
    'c0ck', 'c@ck', 'cok',
    'pu$$y', 'pus5y', 'p*ssy',
    
    // Admin/system impersonation
    'admin', 'administrator', 'root', 'system', 'mod', 'moderator',
    'support', 'staff', 'employee', 'manager', 'owner', 'founder'
];

// Enhanced character substitution mappings for leetspeak detection
const leetspeakMap = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
    '8': 'b',
    '@': 'a',
    '$': 's',
    '!': 'i',
    '+': 't',
    '<': 'c',
    '>': 'c',
    '|': 'l',
    '()': 'o',
    '[]': 'o'
};

// Function to normalize text by removing separators and converting leetspeak
function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    
    let normalized = text.toLowerCase();
    
    // Remove common separators and special characters
    normalized = normalized.replace(/[_\-\.~`!@#$%^&*()+=\[\]{}|\\:";'<>?,/\s]/g, '');
    
    // Convert leetspeak
    for (const [leet, normal] of Object.entries(leetspeakMap)) {
        const regex = new RegExp(leet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        normalized = normalized.replace(regex, normal);
    }
    
    // Remove repeated characters (like "heeelllloooo" -> "helo")
    normalized = normalized.replace(/(.)\1{2,}/g, '$1');
    
    return normalized;
}

// Enhanced function to check if text contains profanity
function containsProfanity(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    const lowerText = text.toLowerCase();
    const normalizedText = normalizeText(text);
    
    // Check against profanity list - both original and normalized text
    for (const word of profanityList) {
        const normalizedWord = normalizeText(word);
        
        // Check direct matches in original text
        if (lowerText.includes(word.toLowerCase())) {
            return true;
        }
        
        // Check matches in normalized text (catches leetspeak and separators)
        if (normalizedText.includes(normalizedWord)) {
            return true;
        }
        
        // Check for partial matches with word boundaries
        const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (wordRegex.test(lowerText)) {
            return true;
        }
        
        // Check normalized version with word boundaries
        const normalizedRegex = new RegExp(`\\b${normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (normalizedRegex.test(normalizedText)) {
            return true;
        }
    }
    
    // Additional pattern checks for common bypass attempts
    const bypassPatterns = [
        /i[\W_]*suck[\W_]*d[\W_]*[i1][\W_]*[ck]/i, // "I_Suck_D1ck" and variations
        /suck[\W_]*[md][\W_]*[yi1][\W_]*[ck]/i,    // "suck_my_dick" variations
        /f[\W_]*u[\W_]*c[\W_]*k[\W_]*y[\W_]*o[\W_]*u/i, // "f_u_c_k_y_o_u" variations
        /go[\W_]*to[\W_]*hell/i,                    // "go_to_hell" variations
        /kiss[\W_]*[md][\W_]*[yi1][\W_]*a[\W_]*[sz]/i, // "kiss_my_ass" variations
        /eat[\W_]*[sz][\W_]*h[\W_]*[i1][\W_]*t/i,   // "eat_shit" variations
    ];
    
    for (const pattern of bypassPatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }
    
    return false;
}

// More restrictive profanity check for email addresses - only blocks extremely explicit content
function containsExplicitProfanity(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    
    // Only the most explicit profanity that should never be in email addresses
    const explicitProfanityList = [
        'fuck', 'fck', 'fuk', 'phuck', 'fucc', 'fucking',
        'shit', 'shyt', 'shite',
        'bitch', 'btch', 'bych', 'biatch',
        'asshole', 'arsehole',
        'whore', 'slut', 'slutty', 'hoe',
        'porn', 'porno', 'pornography', 'xxx',
        'penis', 'cock', 'dick', 'prick',
        'vagina', 'pussy', 'cunt', 'twat',
        'boobs', 'tits', 'titties',
        'nigger', 'nigga', 'faggot', 'fag',
        'rape', 'raping', 'molest',
        'f*ck', 'f**k', 'f***', 'fvck', 'phuk',
        'sh*t', 'sh!t', 'b*tch', 'b!tch', 'bytch',
        'a$$hole', 'a**hole', 'pu$$y', 'pus5y', 'p*ssy',
        'd1ck', 'd!ck', 'dik', 'dck', 'c0ck', 'c@ck', 'cok'
    ];
    
    const lowerText = text.toLowerCase();
    
    // Check for explicit profanity without aggressive normalization
    for (const word of explicitProfanityList) {
        // Check direct matches
        if (lowerText.includes(word.toLowerCase())) {
            return true;
        }
        
        // Check for word boundaries to avoid false positives
        const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (wordRegex.test(lowerText)) {
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
    
    // Check for XSS patterns
    if (xssPattern.test(email) || htmlTagPattern.test(email) || jsEventPattern.test(email) || jsProtocolPattern.test(email) || dataProtocolPattern.test(email)) {
        return false;
    }
    
    // Check for NoSQL injection (only $ symbol, not dots)
    if (noSqlInjectionPattern.test(email)) {
        return false;
    }
    
    // For emails, only check for extremely explicit profanity, not common words
    // Split email to check only the local part (before @)
    const localPart = email.split('@')[0];
    if (containsExplicitProfanity(localPart)) {
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

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullname,
    containsProfanity,
    sanitizeInput,
};
