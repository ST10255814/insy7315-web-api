#!/bin/bash

# Alternative Security Check Script
# This script runs when npm audit is unavailable

echo "🔍 Running alternative security checks..."

# Check for known vulnerable package patterns
check_package_security() {
    echo "Checking for potentially vulnerable packages..."
    
    # Known problematic packages or versions
    VULNERABLE_PATTERNS=(
        "lodash@[^4]"
        "moment@"
        "request@"
        "node-sass@[^4]"
        "handlebars@[^4]"
        "serialize-javascript@[^3]"
        "minimist@[^1]"
        "yargs-parser@[^18]"
    )
    
    for pattern in "${VULNERABLE_PATTERNS[@]}"; do
        if npm list --depth=0 2>/dev/null | grep -E "$pattern" >/dev/null 2>&1; then
            echo "⚠️ WARNING: Found potentially vulnerable package matching: $pattern"
        fi
    done
}

# Check for deprecated packages
check_deprecated() {
    echo "Checking for deprecated packages..."
    DEPRECATED=$(npm ls --depth=0 2>&1 | grep -i "deprecated" || true)
    if [ -n "$DEPRECATED" ]; then
        echo "⚠️ WARNING: Found deprecated packages:"
        echo "$DEPRECATED"
    else
        echo "✅ No deprecated packages found"
    fi
}

# Check for packages with known security issues
check_critical_versions() {
    echo "Checking critical package versions..."
    
    # Express version check
    EXPRESS_VERSION=$(npm list express --depth=0 2>/dev/null | grep express@ | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "not-found")
    if [[ "$EXPRESS_VERSION" != "not-found" && "$EXPRESS_VERSION" < "4.17.1" ]]; then
        echo "⚠️ WARNING: Express version $EXPRESS_VERSION may have security issues. Consider updating to 4.17.1+"
    fi
    
    # JWT version check
    JWT_VERSION=$(npm list jsonwebtoken --depth=0 2>/dev/null | grep jsonwebtoken@ | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "not-found")
    if [[ "$JWT_VERSION" != "not-found" && "$JWT_VERSION" < "8.5.1" ]]; then
        echo "⚠️ WARNING: jsonwebtoken version $JWT_VERSION may have security issues. Consider updating to 8.5.1+"
    fi
}

# Run all checks
check_package_security
check_deprecated
check_critical_versions

echo "✅ Alternative security check completed"