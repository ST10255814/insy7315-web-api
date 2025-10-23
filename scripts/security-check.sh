#!/bin/bash

# 🔒 Comprehensive Security Check Script
# Enhanced security scanning for Node.js applications
# Compatible with GitHub Actions workflow

set -e

echo "🔒 ===== COMPREHENSIVE SECURITY ASSESSMENT ===== 🔒"
echo ""

# Color codes for enhanced output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Security counters
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0
WARNINGS=0

# Function to increment issue counters
increment_critical() { CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1)); }
increment_high() { HIGH_ISSUES=$((HIGH_ISSUES + 1)); }
increment_medium() { MEDIUM_ISSUES=$((MEDIUM_ISSUES + 1)); }
increment_low() { LOW_ISSUES=$((LOW_ISSUES + 1)); }
increment_warnings() { WARNINGS=$((WARNINGS + 1)); }

# Print section headers
print_section() {
    echo ""
    echo -e "${CYAN}🔍 ===== $1 =====${NC}"
    echo ""
}

print_subsection() {
    echo -e "${BLUE}📋 $1${NC}"
}

# 1. 🌐 Environment and Configuration Security
check_environment_security() {
    print_section "ENVIRONMENT & CONFIGURATION SECURITY"
    
    print_subsection "Environment Variables Check"
    
    # Check for .env file
    if [ -f ".env" ]; then
        if [ -r ".env" ]; then
            echo -e "${GREEN}✅ .env file exists and is readable${NC}"
            
            # Check for weak secrets in .env
            if grep -q -E "secret.*=.*(123|password|test|dev)" .env 2>/dev/null; then
                echo -e "${RED}🚨 CRITICAL: Weak secrets detected in .env file${NC}"
                increment_critical
            fi
            
            # Check for missing critical environment variables
            REQUIRED_VARS=("JWT_SECRET" "MONGODB_URI" "ARCJET_KEY" "NODE_ENV")
            for var in "${REQUIRED_VARS[@]}"; do
                if ! grep -q "^$var=" .env 2>/dev/null; then
                    echo -e "${YELLOW}⚠️ WARNING: Missing environment variable: $var${NC}"
                    increment_warnings
                fi
            done
            
            # Check for exposed database credentials
            if grep -E "(mongodb://.*:.*@|postgres://.*:.*@)" .env >/dev/null 2>&1; then
                echo -e "${YELLOW}⚠️ WARNING: Database credentials in .env (ensure .env is in .gitignore)${NC}"
                increment_medium
            fi
        else
            echo -e "${RED}🚨 CRITICAL: .env file exists but is not readable${NC}"
            increment_critical
        fi
    else
        echo -e "${YELLOW}⚠️ WARNING: No .env file found${NC}"
        increment_warnings
    fi
    
    # Check .gitignore
    print_subsection "Git Security Check"
    if [ -f ".gitignore" ]; then
        if grep -q "\.env" .gitignore; then
            echo -e "${GREEN}✅ .env files are ignored by git${NC}"
        else
            echo -e "${RED}🚨 CRITICAL: .env not in .gitignore - secrets may be exposed${NC}"
            increment_critical
        fi
        
        if grep -q "node_modules" .gitignore; then
            echo -e "${GREEN}✅ node_modules properly ignored${NC}"
        else
            echo -e "${YELLOW}⚠️ WARNING: node_modules not in .gitignore${NC}"
            increment_low
        fi
    else
        echo -e "${YELLOW}⚠️ WARNING: No .gitignore file found${NC}"
        increment_medium
    fi
}

# 2. 📦 Advanced Dependency Security
check_dependency_security() {
    print_section "DEPENDENCY SECURITY ANALYSIS"
    
    print_subsection "Package Vulnerability Scan"
    
    # Enhanced vulnerable package patterns
    CRITICAL_VULNERABILITIES=(
        "lodash@[^4\.17\.21]"
        "axios@0\.21\.0"
        "axios@0\.21\.1"
        "node-forge@[^1\.0\.0]"
        "trim@0\.0\.1"
        "trim-newlines@[^4\.0\.0]"
        "glob-parent@[^5\.1\.2]"
        "normalize-url@[^4\.5\.1]"
        "nth-check@[^2\.0\.1]"
        "minimist@[^1\.2\.6]"
        "yargs-parser@[^20\.2\.9]"
        "express@[^4\.18\.0]"
        "jsonwebtoken@[^8\.5\.1]"
        "bcrypt@[^5\.0\.0]"
        "validator@[^13\.7\.0]"
    )
    
    VULNERABILITY_FOUND=false
    for pattern in "${CRITICAL_VULNERABILITIES[@]}"; do
        if npm list --depth=0 2>/dev/null | grep -E "$pattern" >/dev/null 2>&1; then
            echo -e "${RED}🚨 CRITICAL: Vulnerable package found: $pattern${NC}"
            increment_critical
            VULNERABILITY_FOUND=true
        fi
    done
    
    if [ "$VULNERABILITY_FOUND" = false ]; then
        echo -e "${GREEN}✅ No known critical vulnerabilities in direct dependencies${NC}"
    fi
    
    print_subsection "Deprecated Package Check"
    DEPRECATED=$(npm ls --depth=0 2>&1 | grep -i "deprecated" || true)
    if [ -n "$DEPRECATED" ]; then
        echo -e "${YELLOW}⚠️ WARNING: Found deprecated packages:${NC}"
        echo "$DEPRECATED" | head -5
        increment_medium
    else
        echo -e "${GREEN}✅ No deprecated packages found${NC}"
    fi
    
    print_subsection "License Compliance Check"
    # Check for problematic licenses
    if command -v jq >/dev/null 2>&1; then
        npm list --depth=0 --json 2>/dev/null | jq -r '.dependencies | to_entries[] | select(.value.license) | "\(.key): \(.value.license)"' | while read line; do
            if echo "$line" | grep -E "(GPL-2\.0|GPL-3\.0|AGPL|LGPL)" >/dev/null; then
                echo -e "${YELLOW}⚠️ WARNING: Copyleft license detected: $line${NC}"
                increment_low
            fi
        done
    fi
    
    print_subsection "Dependency Tree Analysis"
    TOTAL_DEPS=$(npm list --depth=0 --parseable 2>/dev/null | wc -l)
    echo "📊 Total direct dependencies: $TOTAL_DEPS"
    
    if [ $TOTAL_DEPS -gt 50 ]; then
        echo -e "${YELLOW}⚠️ WARNING: Large number of dependencies ($TOTAL_DEPS) - consider audit${NC}"
        increment_low
    fi
}

# 3. 🔍 Advanced Code Security Analysis
check_code_security() {
    print_section "CODE SECURITY ANALYSIS"
    
    print_subsection "Secret Detection in Code"
    
    # Advanced secret patterns
    SECRET_PATTERNS=(
        # API Keys
        "sk-[a-zA-Z0-9]{48}"                    # OpenAI API keys
        "ghp_[a-zA-Z0-9]{36}"                   # GitHub personal access tokens
        "gho_[a-zA-Z0-9]{36}"                   # GitHub OAuth tokens
        "AIza[0-9A-Za-z\\-_]{35}"               # Google API keys
        # AWS
        "AKIA[0-9A-Z]{16}"                      # AWS Access Key ID
        "aws_secret_access_key.*[=:].*[A-Za-z0-9/+=]{40}"
        # Database URLs with credentials
        "mongodb://[^:]+:[^@]+@[^/]+"
        "postgres://[^:]+:[^@]+@[^/]+"
        "mysql://[^:]+:[^@]+@[^/]+"
        # JWT secrets
        "jwt.*secret.*[=:].*[A-Za-z0-9]{16,}"
        # Private keys
        "-----BEGIN PRIVATE KEY-----"
        "-----BEGIN RSA PRIVATE KEY-----"
        # Generic patterns
        "password.*[=:].*['\"][^'\"]{8,}['\"]"
        "secret.*[=:].*['\"][^'\"]{8,}['\"]"
        "api[_-]?key.*[=:].*['\"][^'\"]{8,}['\"]"
    )
    
    SECRET_FOUND=false
    for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -r -E "$pattern" --include="*.js" --include="*.json" --include="*.md" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | head -1; then
            echo -e "${RED}🚨 CRITICAL: Secret pattern detected${NC}"
            SECRET_FOUND=true
            increment_critical
        fi
    done
    
    if [ "$SECRET_FOUND" = false ]; then
        echo -e "${GREEN}✅ No secret patterns detected in code${NC}"
    fi
    
    print_subsection "Dangerous Code Patterns"
    
    DANGEROUS_PATTERNS=(
        "eval\("
        "Function\("
        "setInterval.*eval"
        "setTimeout.*eval"
        "innerHTML.*\+"
        "document\.write"
        "exec\("
        "spawn\("
        "child_process\.exec"
        "\$\{.*req\."
        "JSON\.parse.*req\."
    )
    
    DANGEROUS_FOUND=false
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        MATCHES=$(grep -r -E "$pattern" --include="*.js" --exclude-dir=node_modules --exclude-dir=tests backend/src/ 2>/dev/null || true)
        if [ -n "$MATCHES" ]; then
            echo -e "${RED}🚨 DANGEROUS PATTERN: $pattern${NC}"
            echo "$MATCHES" | head -2
            increment_high
            DANGEROUS_FOUND=true
        fi
    done
    
    if [ "$DANGEROUS_FOUND" = false ]; then
        echo -e "${GREEN}✅ No dangerous code patterns detected${NC}"
    fi
    
    print_subsection "Cryptographic Security Check"
    
    # Check for weak crypto
    WEAK_CRYPTO=(
        "md5\("
        "sha1\("
        "Math\.random\(\)"
        "crypto\.pseudoRandomBytes"
        "cipher.*'des'"
        "cipher.*'rc4'"
    )
    
    WEAK_CRYPTO_FOUND=false
    for pattern in "${WEAK_CRYPTO[@]}"; do
        if grep -r -E "$pattern" --include="*.js" backend/src/ 2>/dev/null; then
            echo -e "${RED}🚨 WEAK CRYPTOGRAPHY: $pattern${NC}"
            increment_high
            WEAK_CRYPTO_FOUND=true
        fi
    done
    
    if [ "$WEAK_CRYPTO_FOUND" = false ]; then
        echo -e "${GREEN}✅ No weak cryptographic patterns detected${NC}"
    fi
    
    # Check for proper password hashing
    if grep -r -E "(bcrypt|scrypt|argon2)" backend/src/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Strong password hashing library detected${NC}"
    else
        echo -e "${YELLOW}⚠️ WARNING: No strong password hashing library detected${NC}"
        increment_medium
    fi
}

# 4. 🌐 Network and Infrastructure Security
check_network_security() {
    print_section "NETWORK & INFRASTRUCTURE SECURITY"
    
    print_subsection "CORS Configuration Analysis"
    
    if grep -r "cors" backend/src/ >/dev/null 2>&1; then
        if grep -r "origin.*\*" backend/src/ >/dev/null 2>&1; then
            echo -e "${RED}🚨 CRITICAL: Wildcard CORS origin detected${NC}"
            increment_critical
        else
            echo -e "${GREEN}✅ CORS configuration appears secure${NC}"
        fi
        
        if grep -r "credentials.*true" backend/src/ | grep -v "origin" >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️ WARNING: CORS credentials enabled - ensure origin is restricted${NC}"
            increment_medium
        fi
    else
        echo -e "${YELLOW}⚠️ WARNING: No CORS configuration detected${NC}"
        increment_low
    fi
    
    print_subsection "Security Headers Check"
    
    SECURITY_HEADERS=(
        "helmet"
        "x-frame-options"
        "x-content-type-options"
        "x-xss-protection"
        "strict-transport-security"
        "content-security-policy"
    )
    
    HEADERS_FOUND=0
    for header in "${SECURITY_HEADERS[@]}"; do
        if grep -r -i "$header" backend/src/ >/dev/null 2>&1; then
            ((HEADERS_FOUND++))
        fi
    done
    
    if [ $HEADERS_FOUND -ge 3 ]; then
        echo -e "${GREEN}✅ Security headers middleware detected ($HEADERS_FOUND/6)${NC}"
    elif [ $HEADERS_FOUND -ge 1 ]; then
        echo -e "${YELLOW}⚠️ WARNING: Partial security headers implementation ($HEADERS_FOUND/6)${NC}"
        increment_medium
    else
        echo -e "${RED}🚨 CRITICAL: No security headers detected${NC}"
        increment_critical
    fi
    
    print_subsection "HTTPS Enforcement Check"
    
    if grep -r -E "(https.*only|secure.*true)" backend/src/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTPS enforcement detected${NC}"
    else
        if grep -r -E "http://" backend/src/ | grep -v "localhost\|127.0.0.1" >/dev/null 2>&1; then
            echo -e "${YELLOW}⚠️ WARNING: HTTP URLs detected (use HTTPS in production)${NC}"
            increment_medium
        else
            echo -e "${YELLOW}⚠️ INFO: No explicit HTTPS enforcement detected${NC}"
            increment_low
        fi
    fi
}

# 5. 🛡️ OWASP Top 10 Security Check
check_owasp_top10() {
    print_section "OWASP TOP 10 SECURITY VERIFICATION"
    
    print_subsection "A01: Broken Access Control"
    if grep -r "req\.user" backend/src/ | grep -v -E "(if.*req\.user|!req\.user|req\.user\.)" | head -3 >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ WARNING: Potential access control issues - verify authorization checks${NC}"
        increment_medium
    else
        echo -e "${GREEN}✅ Access control patterns appear secure${NC}"
    fi
    
    print_subsection "A02: Cryptographic Failures"
    # Already covered in crypto check above
    echo -e "${GREEN}✅ Cryptographic implementation checked above${NC}"
    
    print_subsection "A03: Injection"
    INJECTION_PATTERNS=(
        "\$where"
        "\$ne.*\$"
        "\$in.*\$"
        "eval.*\$"
        "new Function.*req\."
        "JSON\.parse.*req\."
    )
    
    INJECTION_FOUND=false
    for pattern in "${INJECTION_PATTERNS[@]}"; do
        if grep -r -E "$pattern" backend/src/ 2>/dev/null; then
            echo -e "${RED}🚨 POTENTIAL INJECTION: $pattern${NC}"
            increment_high
            INJECTION_FOUND=true
        fi
    done
    
    if [ "$INJECTION_FOUND" = false ]; then
        echo -e "${GREEN}✅ No obvious injection vulnerabilities detected${NC}"
    fi
    
    print_subsection "A04: Insecure Design"
    echo -e "${BLUE}ℹ️ Manual review required for insecure design patterns${NC}"
    
    print_subsection "A05: Security Misconfiguration"
    # Check for debug/development settings
    if grep -r -E "(debug.*true|NODE_ENV.*development)" backend/src/ >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ WARNING: Development settings detected in code${NC}"
        increment_low
    else
        echo -e "${GREEN}✅ No obvious security misconfigurations${NC}"
    fi
    
    print_subsection "A06: Vulnerable and Outdated Components"
    echo -e "${GREEN}✅ Component vulnerability check completed above${NC}"
    
    print_subsection "A07: Identification and Authentication Failures"
    if grep -r -E "(password.*plain|password.*text)" backend/src/ >/dev/null 2>&1; then
        echo -e "${RED}🚨 CRITICAL: Plain text password handling detected${NC}"
        increment_critical
    else
        echo -e "${GREEN}✅ No plain text password handling detected${NC}"
    fi
    
    print_subsection "A08: Software and Data Integrity Failures"
    echo -e "${BLUE}ℹ️ Manual review required for integrity failures${NC}"
    
    print_subsection "A09: Security Logging and Monitoring Failures"
    if grep -r -E "(log|audit|monitor)" backend/src/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Logging mechanisms detected${NC}"
    else
        echo -e "${YELLOW}⚠️ WARNING: Limited logging detected${NC}"
        increment_low
    fi
    
    print_subsection "A10: Server-Side Request Forgery (SSRF)"
    if grep -r -E "(fetch|axios|request).*req\." backend/src/ 2>/dev/null; then
        echo -e "${YELLOW}⚠️ WARNING: Potential SSRF - verify URL validation${NC}"
        increment_medium
    else
        echo -e "${GREEN}✅ No obvious SSRF patterns detected${NC}"
    fi
}

# 6. 📊 Generate Security Score and Report
generate_security_report() {
    print_section "SECURITY ASSESSMENT SUMMARY"
    
    TOTAL_ISSUES=$((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES + LOW_ISSUES))
    
    echo -e "${WHITE}📊 SECURITY SCORECARD${NC}"
    echo "===================="
    echo -e "${RED}🚨 Critical Issues: $CRITICAL_ISSUES${NC}"
    echo -e "${RED}🔥 High Issues: $HIGH_ISSUES${NC}"
    echo -e "${YELLOW}⚠️ Medium Issues: $MEDIUM_ISSUES${NC}"
    echo -e "${BLUE}ℹ️ Low Issues: $LOW_ISSUES${NC}"
    echo -e "${CYAN}📋 Warnings: $WARNINGS${NC}"
    echo ""
    echo "Total Issues: $TOTAL_ISSUES"
    
    # Calculate security score (100 - penalty points)
    PENALTY_POINTS=$((CRITICAL_ISSUES * 20 + HIGH_ISSUES * 10 + MEDIUM_ISSUES * 5 + LOW_ISSUES * 2))
    SECURITY_SCORE=$((100 - PENALTY_POINTS))
    if [ $SECURITY_SCORE -lt 0 ]; then
        SECURITY_SCORE=0
    fi
    
    echo ""
    if [ $SECURITY_SCORE -ge 90 ]; then
        echo -e "${GREEN}🏆 SECURITY SCORE: $SECURITY_SCORE/100 - EXCELLENT${NC}"
    elif [ $SECURITY_SCORE -ge 75 ]; then
        echo -e "${YELLOW}🥉 SECURITY SCORE: $SECURITY_SCORE/100 - GOOD${NC}"
    elif [ $SECURITY_SCORE -ge 50 ]; then
        echo -e "${YELLOW}⚠️ SECURITY SCORE: $SECURITY_SCORE/100 - NEEDS IMPROVEMENT${NC}"
    else
        echo -e "${RED}🚨 SECURITY SCORE: $SECURITY_SCORE/100 - CRITICAL ATTENTION REQUIRED${NC}"
    fi
    
    echo ""
    echo -e "${PURPLE}🎯 RECOMMENDATIONS${NC}"
    echo "=================="
    
    if [ $CRITICAL_ISSUES -gt 0 ]; then
        echo "🚨 IMMEDIATE: Address $CRITICAL_ISSUES critical security issues"
    fi
    
    if [ $HIGH_ISSUES -gt 0 ]; then
        echo "🔥 HIGH PRIORITY: Fix $HIGH_ISSUES high severity issues"
    fi
    
    if [ $MEDIUM_ISSUES -gt 0 ]; then
        echo "⚠️ MEDIUM PRIORITY: Review $MEDIUM_ISSUES medium severity issues"
    fi
    
    if [ $TOTAL_ISSUES -eq 0 ]; then
        echo "✅ Excellent! Continue regular security monitoring"
        echo "✅ Consider implementing additional security measures"
        echo "✅ Schedule regular security audits"
    fi
    
    echo ""
    echo -e "${CYAN}📋 NEXT STEPS${NC}"
    echo "============="
    echo "1. Address critical and high severity issues immediately"
    echo "2. Review and fix medium severity issues"
    echo "3. Consider implementing additional security controls"
    echo "4. Set up continuous security monitoring"
    echo "5. Schedule regular security assessments"
    
    # Exit with error code if critical or high issues found
    if [ $CRITICAL_ISSUES -gt 0 ] || [ $HIGH_ISSUES -gt 0 ]; then
        echo ""
        echo -e "${RED}❌ SECURITY CHECK FAILED: Critical or high issues found${NC}"
        return 1
    elif [ $TOTAL_ISSUES -gt 10 ]; then
        echo ""
        echo -e "${YELLOW}⚠️ SECURITY CHECK WARNING: Many issues found ($TOTAL_ISSUES)${NC}"
        return 1
    else
        echo ""
        echo -e "${GREEN}✅ SECURITY CHECK PASSED${NC}"
        return 0
    fi
}

# Main execution
main() {
    echo -e "${PURPLE}🔒 Starting Comprehensive Security Assessment...${NC}"
    echo "Timestamp: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo ""
    
    check_environment_security
    check_dependency_security
    check_code_security
    check_network_security
    check_owasp_top10
    
    echo ""
    echo -e "${CYAN}🏁 ASSESSMENT COMPLETE${NC}"
    echo ""
    
    generate_security_report
}

# Execute main function
main