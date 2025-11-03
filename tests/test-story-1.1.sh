#!/bin/bash
# TDD Test Suite for Story 1.1: Initialize React project structure
# Test-Driven Development: RED → GREEN → REFACTOR
# Author: Claude Code
# Date: 2025-11-02

set -e

PROJECT_ROOT="/home/quaid/Documents/Projects/karstenwade.com/src/karstenwade.com"
cd "$PROJECT_ROOT"

# Color output for test results
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test result tracking
test_result() {
    local test_name="$1"
    local expected_result="$2"
    local actual_result="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ "$expected_result" == "$actual_result" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name (expected: $expected_result, got: $actual_result)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "========================================"
echo "Story 1.1 TDD Test Suite"
echo "========================================"
echo ""

# ===========================================
# Test Group 1: Package Configuration
# ===========================================
echo "Test Group 1: Package Configuration"
echo "----------------------------------------"

# Test 1.1: package.json exists
if [ -f "$PROJECT_ROOT/package.json" ]; then
    test_result "package.json exists" "PASS" "PASS"
else
    test_result "package.json exists" "PASS" "FAIL"
fi

# Test 1.2: package.json contains React dependency
if [ -f "$PROJECT_ROOT/package.json" ]; then
    if grep -q '"react"' "$PROJECT_ROOT/package.json"; then
        test_result "package.json contains React dependency" "PASS" "PASS"
    else
        test_result "package.json contains React dependency" "PASS" "FAIL"
    fi
else
    test_result "package.json contains React dependency" "PASS" "FAIL"
fi

# Test 1.3: package.json contains required scripts
if [ -f "$PROJECT_ROOT/package.json" ]; then
    has_dev_script=$(grep -q '"dev"' "$PROJECT_ROOT/package.json" && echo "yes" || echo "no")
    has_build_script=$(grep -q '"build"' "$PROJECT_ROOT/package.json" && echo "yes" || echo "no")
    has_test_script=$(grep -q '"test"' "$PROJECT_ROOT/package.json" && echo "yes" || echo "no")

    if [ "$has_dev_script" == "yes" ] && [ "$has_build_script" == "yes" ] && [ "$has_test_script" == "yes" ]; then
        test_result "package.json contains dev/build/test scripts" "PASS" "PASS"
    else
        test_result "package.json contains dev/build/test scripts" "PASS" "FAIL"
    fi
else
    test_result "package.json contains dev/build/test scripts" "PASS" "FAIL"
fi

echo ""

# ===========================================
# Test Group 2: Build Configuration
# ===========================================
echo "Test Group 2: Build Configuration"
echo "----------------------------------------"

# Test 2.1: Vite config exists
if [ -f "$PROJECT_ROOT/vite.config.ts" ] || [ -f "$PROJECT_ROOT/vite.config.js" ]; then
    test_result "Vite configuration file exists" "PASS" "PASS"
else
    test_result "Vite configuration file exists" "PASS" "FAIL"
fi

# Test 2.2: TypeScript config exists
if [ -f "$PROJECT_ROOT/tsconfig.json" ]; then
    test_result "TypeScript configuration exists" "PASS" "PASS"
else
    test_result "TypeScript configuration exists" "PASS" "FAIL"
fi

echo ""

# ===========================================
# Test Group 3: Folder Structure
# ===========================================
echo "Test Group 3: Required Folder Structure"
echo "----------------------------------------"

# Required directories
REQUIRED_DIRS=(
    "src"
    "src/components"
    "src/pages"
    "src/styles"
    "public"
    "content"
    "content/poetry"
    "content/fiction"
    "content/cv"
    "content/theories"
    "content/open-papers"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        test_result "Directory exists: $dir" "PASS" "PASS"
    else
        test_result "Directory exists: $dir" "PASS" "FAIL"
    fi
done

echo ""

# ===========================================
# Test Group 4: Build Output
# ===========================================
echo "Test Group 4: Build Output Validation"
echo "----------------------------------------"

# Test 4.1: Build directory does NOT exist yet (RED phase)
# After GREEN phase, this should exist
if [ -d "$PROJECT_ROOT/dist" ] || [ -d "$PROJECT_ROOT/build" ]; then
    test_result "Build output directory exists" "PASS" "PASS"
else
    test_result "Build output directory exists" "PASS" "FAIL"
fi

# Test 4.2: node_modules exists (dependencies installed)
if [ -d "$PROJECT_ROOT/node_modules" ]; then
    test_result "node_modules directory exists" "PASS" "PASS"
else
    test_result "node_modules directory exists" "PASS" "FAIL"
fi

echo ""

# ===========================================
# Test Group 5: Entry Point Files
# ===========================================
echo "Test Group 5: Entry Point Files"
echo "----------------------------------------"

# Test 5.1: index.html exists
if [ -f "$PROJECT_ROOT/index.html" ]; then
    test_result "index.html exists" "PASS" "PASS"
else
    test_result "index.html exists" "PASS" "FAIL"
fi

# Test 5.2: Main App component exists
if [ -f "$PROJECT_ROOT/src/App.tsx" ] || [ -f "$PROJECT_ROOT/src/App.jsx" ]; then
    test_result "Main App component exists" "PASS" "PASS"
else
    test_result "Main App component exists" "PASS" "FAIL"
fi

# Test 5.3: Main entry point exists
if [ -f "$PROJECT_ROOT/src/main.tsx" ] || [ -f "$PROJECT_ROOT/src/main.jsx" ]; then
    test_result "Main entry point exists" "PASS" "PASS"
else
    test_result "Main entry point exists" "PASS" "FAIL"
fi

echo ""

# ===========================================
# Test Group 6: Static Site Generation Config
# ===========================================
echo "Test Group 6: Static Site Generation"
echo "----------------------------------------"

# Test 6.1: Check if build can be executed (after GREEN phase)
if [ -f "$PROJECT_ROOT/package.json" ] && [ -f "$PROJECT_ROOT/vite.config.ts" ] || [ -f "$PROJECT_ROOT/vite.config.js" ]; then
    test_result "Build configuration is complete" "PASS" "PASS"
else
    test_result "Build configuration is complete" "PASS" "FAIL"
fi

# Test 6.2: GitHub Pages compatibility (base path config)
if [ -f "$PROJECT_ROOT/vite.config.ts" ]; then
    if grep -q "base:" "$PROJECT_ROOT/vite.config.ts"; then
        test_result "Vite config contains base path for GitHub Pages" "PASS" "PASS"
    else
        test_result "Vite config contains base path for GitHub Pages" "PASS" "FAIL"
    fi
elif [ -f "$PROJECT_ROOT/vite.config.js" ]; then
    if grep -q "base:" "$PROJECT_ROOT/vite.config.js"; then
        test_result "Vite config contains base path for GitHub Pages" "PASS" "PASS"
    else
        test_result "Vite config contains base path for GitHub Pages" "PASS" "FAIL"
    fi
else
    test_result "Vite config contains base path for GitHub Pages" "PASS" "FAIL"
fi

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests PASSED! Story 1.1 is complete.${NC}"
    exit 0
else
    echo -e "${RED}✗ $FAILED_TESTS test(s) FAILED. Continue with implementation.${NC}"
    exit 1
fi
