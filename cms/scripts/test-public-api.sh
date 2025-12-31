#!/bin/bash
#
# Test Strapi Public API Access
#
# This script tests that public read permissions are correctly configured
# by making API requests to all content type endpoints.
#

STRAPI_URL="http://localhost:1337"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  Strapi Public API Access Test                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Strapi is running
echo "🔍 Checking if Strapi is running..."
if curl -s -f "${STRAPI_URL}/_health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Strapi is running${NC}"
else
    echo -e "${RED}❌ Strapi is not running at ${STRAPI_URL}${NC}"
    echo "   Start Strapi with: cd cms && npm run develop"
    exit 1
fi

echo ""
echo "📝 Testing API endpoints..."
echo ""

# Content types to test
CONTENT_TYPES=(
    "blog-posts"
    "papers"
    "writings"
    "tosw-chapters"
    "tutorials"
    "events"
    "authors"
    "categories"
    "tags"
)

SUCCESS=0
FAILED=0

for type in "${CONTENT_TYPES[@]}"; do
    echo -n "Testing /api/${type}... "

    # Make the request and capture status code
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/api/${type}")

    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Success (200)${NC}"
        ((SUCCESS++))
    elif [ "$STATUS" = "403" ]; then
        echo -e "${RED}❌ Forbidden (403) - Public permissions not configured${NC}"
        ((FAILED++))
    elif [ "$STATUS" = "404" ]; then
        echo -e "${YELLOW}⚠ Not Found (404) - Content type may not exist${NC}"
        ((FAILED++))
    else
        echo -e "${RED}❌ Error (${STATUS})${NC}"
        ((FAILED++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo -e "  ${GREEN}✅ Successful: ${SUCCESS}${NC}"
echo -e "  ${RED}❌ Failed: ${FAILED}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -gt 0 ]; then
    echo ""
    echo "Some endpoints failed. To fix:"
    echo "  1. Run: cd cms && node scripts/configure-public-permissions-v2.js"
    echo "  2. Or manually configure in Strapi Admin:"
    echo "     http://localhost:1337/admin/settings/users-permissions/roles"
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Public API is properly configured.${NC}"
    exit 0
fi
