# crosspost — Raycast Extension

## Context

The existing CLI tool (`/Users/linus/projects/meltforce-org/tools/repost.ts`) cross-posts Mastodon toots to other platforms, but it's cumbersome. Bluesky's 300-char limit is the most restrictive, so it should be the leading platform — compose within that limit, then post everywhere. A Raycast extension provides a comfortable UI for both composing new posts and browsing/reposting existing ones.

**Standalone repo** at `/Users/linus/projects/crosspost` (publishable to Raycast Store).

## Commands

### 1. Compose Post
- Form with a TextArea (300 grapheme limit, live counter in title: `Post (42/300)`)
- Optional URL field — attached as external embed (link card) on Bluesky, appended to status text on Mastodon
- Optional image attachments via FilePicker
- Publishes to all 3 platforms simultaneously: Bluesky, mastodon.social, theforkiverse.com
- Confirmation via `confirmAlert()` before posting
- Animated toast showing per-platform success/failure

**URL handling:**
- Bluesky: URL goes into `embed.external` (link card) — does NOT count toward 300 grapheme limit
- Mastodon: URL appended to status text — Mastodon auto-generates link cards from URLs in text (500 char limit, plenty of room)
- `RichText.detectFacets()` handles any inline URLs in the text body as clickable facets on Bluesky

### 2. Browse Posts
- List of recent Bluesky posts (last 20)
- Each item shows: text preview, timestamp, media count, repost status tags (green tags for platforms already posted to)
- Actions per post:
  - **Repost to All Mastodon** (Enter) — reposts to mastodon.social + theforkiverse.com
  - **Repost to mastodon.social** (Cmd+M)
  - **Repost to Forkiverse** (Cmd+F)
  - **Open in Browser** (Cmd+O)
  - **Copy Text** (Cmd+C)
  - **Refresh** (Cmd+R)
- Repost history tracked in Raycast LocalStorage (post URI → platforms posted to)

## File Structure

```
crosspost/
  package.json          # Raycast manifest, deps, preferences
  tsconfig.json
  .eslintrc.json
  .gitignore
  assets/
    command-icon.png
  src/
    compose-post.tsx     # Compose command
    browse-posts.tsx     # Browse command
    lib/
      credentials.ts     # 1Password CLI integration (op read)
      mastodon.ts        # Adapted from tools/lib/mastodon.ts
      bluesky.ts         # Adapted from tools/lib/bluesky.ts
      html-to-text.ts    # Copied from tools/lib/html-to-text.ts
      posting.ts         # Shared post/repost logic
      storage.ts         # LocalStorage for repost tracking
```

## Credentials

Raycast preferences with `op://` references as defaults, resolved via `op read` at runtime. The `op` CLI path is tried in order: `/opt/homebrew/bin/op`, `/usr/local/bin/op`, `op`.

| Preference | Type | Default |
|---|---|---|
| mastodonSocialToken | password | `op://Homelab Admin/Mastodon mastodon.social/credential` |
| forkiverseToken | password | `op://Homelab Admin/Mastodon theforkiverse.com/credential` |
| bskyIdentifier | textfield | `op://Homelab Admin/Bluesky/username` |
| bskyPassword | password | `op://Homelab Admin/Bluesky/credential` |

`credentials.ts` exports a `resolveCredential(value: string): Promise<string>` function — if the value starts with `op://`, shell out to `op read`; otherwise return it as-is.

## Key Adaptations from Existing Code

Source files are in `/Users/linus/projects/meltforce-org/tools/`:

- `tools/lib/mastodon.ts` → `src/lib/mastodon.ts` (createClient, postStatus, uploadMedia, getStatuses, lookupSelf)
- `tools/lib/bluesky.ts` → `src/lib/bluesky.ts` (login, createPost, getAgent — already supports `url`, `title`, `description` params and `images`)
- `tools/lib/html-to-text.ts` → `src/lib/html-to-text.ts` (verbatim copy)
- `tools/repost.ts` → `src/lib/posting.ts` (downloadBlob helper for reposting media)

## Implementation Steps

1. **Scaffold project** — `git init`, `package.json` (Raycast manifest with commands + preferences), `tsconfig.json`, `.eslintrc.json`, `.gitignore`
2. **Copy/adapt lib files** — mastodon.ts, bluesky.ts, html-to-text.ts from `tools/lib/`
3. **credentials.ts** — `resolveCredential()` with op CLI path fallback
4. **storage.ts** — LocalStorage wrapper for repost tracking (get/set/check per post URI)
5. **posting.ts** — `postToAll(text, url?, images?)` and `repostToMastodon(post, targets)` orchestrators
6. **compose-post.tsx** — Form with controlled TextArea + grapheme counter, optional URL TextField, optional FilePicker, confirmAlert, per-platform toast
7. **browse-posts.tsx** — List fetching recent Bluesky posts, showing repost status tags, action panel with repost/open/copy actions
8. **Asset** — Generate a simple command icon PNG

## Dependencies

- `@raycast/api` ^1.83.2
- `@raycast/utils` (for useForm, useCachedPromise if needed)
- `masto` ^7.0.0
- `@atproto/api` ^0.13.0

## Verification

1. `npm run dev` — launch in Raycast dev mode
2. Test Compose: write a short post with a URL, confirm, verify it appears on all 3 platforms with link card
3. Test Compose: post without URL, verify plain text on all platforms
4. Test Browse: list loads recent Bluesky posts, repost one to Mastodon, verify green tags update
5. Test edge cases: 300-char limit enforcement, image attachments, credential errors
