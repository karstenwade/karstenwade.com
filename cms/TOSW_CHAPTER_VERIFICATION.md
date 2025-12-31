# TOSW Chapter Content Type - Verification Checklist

## Created Files

All files have been created following the existing Strapi patterns:

### Content Type Structure
```
cms/src/api/tosw-chapter/
├── content-types/
│   └── tosw-chapter/
│       ├── schema.json         ✓ Created
│       └── lifecycles.ts       ✓ Created
├── controllers/
│   └── tosw-chapter.ts         ✓ Created
├── routes/
│   └── tosw-chapter.ts         ✓ Created
├── services/
│   └── tosw-chapter.ts         ✓ Created
└── README.md                   ✓ Created (documentation)
```

### Updated Files
```
cms/src/api/category/content-types/category/schema.json  ✓ Updated (added tosw_chapters relation)
cms/src/api/tag/content-types/tag/schema.json            ✓ Updated (added tosw_chapters relation)
```

## Schema Validation

- [x] JSON syntax validated
- [x] Schema follows Strapi v5 conventions
- [x] All required fields marked correctly
- [x] Relations properly configured (manyToOne, manyToMany)
- [x] Inverse relations added to category and tag schemas
- [x] Draft/publish enabled
- [x] Default values set appropriately

## Code Quality Checks

- [x] TypeScript files use proper imports from '@strapi/strapi'
- [x] Controllers use factories.createCoreController pattern
- [x] Services use factories.createCoreService pattern
- [x] Routes use factories.createCoreRouter pattern
- [x] Lifecycle hooks properly typed with interfaces
- [x] Follows existing code style from blog-post

## Next Steps: Manual Testing

Once Strapi is restarted, verify the following:

### 1. Strapi Admin UI
```bash
cd cms
npm run develop
```

Navigate to http://localhost:1337/admin and check:

- [ ] "TOSW Chapter" appears in Content Manager
- [ ] Can create a new TOSW chapter
- [ ] All fields appear correctly in the form
- [ ] Section and chapter order fields accept integers
- [ ] Source enumeration shows "github-tosw" and "manual" options
- [ ] Category relation works (can select a category)
- [ ] Tags relation works (can select multiple tags)
- [ ] Draft/publish toggle works

### 2. Lifecycle Hooks
Check console logs after:
- [ ] Creating a chapter (should log creation)
- [ ] Updating a chapter (should log update)
- [ ] Deleting a chapter (should log deletion)

### 3. API Endpoints
Test REST endpoints (use Strapi API documentation or Postman):

```bash
# List chapters
curl http://localhost:1337/api/tosw-chapters

# Get single chapter
curl http://localhost:1337/api/tosw-chapters/:id

# Create chapter (requires authentication)
curl -X POST http://localhost:1337/api/tosw-chapters \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {...}}'
```

### 4. Relation Testing
- [ ] Create a category and assign to chapter
- [ ] View category, verify chapter appears in reverse relation
- [ ] Create tags and assign to chapter
- [ ] View tag, verify chapter appears in reverse relation

### 5. Ordering and Filtering
- [ ] Create multiple chapters in different sections
- [ ] Sort by section_order and chapter_order
- [ ] Filter by section
- [ ] Filter by source (github-tosw vs manual)
- [ ] Filter by sync_locked status

## Integration Testing (Future)

When GitHub sync is implemented:

- [ ] Test syncing from theopensourceway/guidebook repository
- [ ] Verify github_sha updates correctly
- [ ] Test sync_locked prevents overwrites
- [ ] Verify ZeroDB sync works (when implemented)
- [ ] Test embeddings generation (when implemented)

## Known Limitations

1. **Lifecycle hooks are placeholders**: ZeroDB sync not yet implemented
2. **No GitHub sync script**: Needs to be created separately
3. **No automated tests**: Manual testing required for now
4. **No content validation**: Consider adding validation for GitHub paths

## Documentation

- [x] README.md created with comprehensive documentation
- [x] Schema fields documented
- [x] API endpoints documented
- [x] Usage examples provided
- [x] Future integration notes included

## Success Criteria

The TOSW Chapter content type is considered complete when:

- [x] All files created following existing patterns
- [x] Schema properly configured with relations
- [x] Category and tag inverse relations added
- [x] Lifecycle hooks in place (even if placeholder)
- [x] JSON files validated
- [x] TypeScript syntax correct
- [ ] Strapi successfully loads the content type (pending restart)
- [ ] Can CRUD chapters via Admin UI (pending testing)
- [ ] API endpoints work correctly (pending testing)

## Verification Commands

```bash
# Validate JSON schemas
node -e "JSON.parse(require('fs').readFileSync('cms/src/api/tosw-chapter/content-types/tosw-chapter/schema.json', 'utf8'))"

# Check file structure
tree -L 4 cms/src/api/tosw-chapter

# Start Strapi and check logs
cd cms && npm run develop

# Check for errors in Strapi startup logs
# Look for: "[api::tosw-chapter] Loading API"
```

## Rollback Plan

If issues arise, to rollback:

1. Remove directory: `rm -rf cms/src/api/tosw-chapter`
2. Revert category schema: `git checkout cms/src/api/category/content-types/category/schema.json`
3. Revert tag schema: `git checkout cms/src/api/tag/content-types/tag/schema.json`
4. Restart Strapi

## Additional Notes

- License field defaults to "CC BY-SA 4.0" per The Open Source Way guidebook
- Sync lock mechanism prevents accidental overwrites of manually edited content
- Section/chapter ordering supports flexible organization
- External URL field links back to original content on theopensourceway.org
