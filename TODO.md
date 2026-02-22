# Bluepost — Path to Production

## Functional Testing
- [ ] Test Compose Post: text-only post appears on Bluesky + Mastodon
- [ ] Test Compose Post: post with URL → Bluesky shows link card, Mastodon has URL in text
- [ ] Test Compose Post: post with image → image appears on all platforms
- [ ] Test Compose Post: Bluesky-only posting (no Mastodon accounts)
- [ ] Test Compose Post: 300-grapheme enforcement (emoji, CJK, etc.)
- [ ] Test Browse Posts: lists recent posts, excludes reposts/replies/@-mentions
- [ ] Test Browse Posts: blog tag appears for automated posts (URL filter preference)
- [ ] Test Browse Posts: repost to single Mastodon account, verify green tag
- [ ] Test Browse Posts: repost to all Mastodon accounts
- [ ] Test Browse Posts: media reposting (images download from Bluesky, upload to Mastodon)
- [ ] Test Manage Accounts: add Mastodon account with valid credentials
- [ ] Test Manage Accounts: reject invalid Mastodon credentials
- [ ] Test Manage Accounts: remove account
- [ ] Test edge case: expired/invalid Bluesky app password shows clear error
- [ ] Test Dry Run: verify no API calls are made

## Code Quality
- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] `npm test` passes (25 tests)
- [ ] Review error handling — are all failure modes surfaced clearly?
- [ ] Consider session caching for Bluesky agent (currently logs in every operation)

## Store Submission Requirements
- [ ] Design proper extension icon (512x512 PNG, works in light + dark themes)
- [ ] Take screenshots (2000x1250 PNG, light mode, 3-6 images) in `metadata/` dir
- [ ] Write CHANGELOG.md
- [ ] Decide: keep or remove Dry Run preference before submission
- [ ] Decide: keep or remove Automated Post URL Filter preference (niche feature)
- [ ] Fork `raycast/extensions` repo
- [ ] Add extension as subdirectory under `extensions/bluepost/`
- [ ] Open PR following contribution guidelines

## Future Enhancements (post-launch)
- [ ] Bluesky session persistence (avoid login on every operation)
- [ ] Alt text support for images in Compose Post
- [ ] Thread/reply support
- [ ] Mastodon visibility setting (public/unlisted/private)
- [ ] Link card preview fetching (title + description for Bluesky embeds)
