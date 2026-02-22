import { describe, it, expect } from "vitest";
import { isAutomatedPost } from "./bluesky";

describe("isAutomatedPost", () => {
  const prefix = "https://meltforce.org/blog/";

  it("returns false when no prefix configured", () => {
    const embed = {
      external: { uri: "https://meltforce.org/blog/i-know-kung-fu/" },
    };
    expect(isAutomatedPost(embed, undefined, undefined)).toBe(false);
    expect(isAutomatedPost(embed, undefined, "")).toBe(false);
  });

  it("matches view embed with exact prefix", () => {
    const embed = {
      $type: "app.bsky.embed.external#view",
      external: {
        uri: "https://meltforce.org/blog/i-know-kung-fu/",
        title: "",
        description: "",
      },
    };
    expect(isAutomatedPost(embed, undefined, prefix)).toBe(true);
  });

  it("matches view embed without trailing slash on prefix", () => {
    const embed = {
      $type: "app.bsky.embed.external#view",
      external: {
        uri: "https://meltforce.org/blog/mbomail/",
        title: "",
        description: "",
      },
    };
    expect(
      isAutomatedPost(embed, undefined, "https://meltforce.org/blog"),
    ).toBe(true);
  });

  it("matches view embed without trailing slash on uri", () => {
    const embed = {
      external: { uri: "https://meltforce.org/blog/some-post" },
    };
    expect(
      isAutomatedPost(embed, undefined, "https://meltforce.org/blog/"),
    ).toBe(true);
  });

  it("does not match unrelated URL", () => {
    const embed = {
      external: { uri: "https://example.com/something" },
    };
    expect(isAutomatedPost(embed, undefined, prefix)).toBe(false);
  });

  it("falls back to record embed when view embed has no external", () => {
    const viewEmbed = {
      $type: "app.bsky.embed.images#view",
      images: [],
    };
    const recordEmbed = {
      $type: "app.bsky.embed.external",
      external: {
        uri: "https://meltforce.org/blog/test-post/",
        title: "",
        description: "",
      },
    };
    expect(isAutomatedPost(viewEmbed, recordEmbed, prefix)).toBe(true);
  });

  it("handles null/undefined embeds", () => {
    expect(isAutomatedPost(null, null, prefix)).toBe(false);
    expect(isAutomatedPost(undefined, undefined, prefix)).toBe(false);
  });

  it("handles embed with no external property", () => {
    const embed = { $type: "app.bsky.embed.images#view", images: [] };
    expect(isAutomatedPost(embed, undefined, prefix)).toBe(false);
  });

  it("is case-sensitive on URL", () => {
    const embed = {
      external: { uri: "https://Meltforce.org/blog/post/" },
    };
    expect(isAutomatedPost(embed, undefined, prefix)).toBe(false);
  });

  it("matches facet link when no embed present", () => {
    const facets = [
      {
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: "https://meltforce.org/blog/mbomail-v1/",
          },
        ],
        index: { byteStart: 0, byteEnd: 10 },
      },
    ];
    expect(isAutomatedPost(undefined, undefined, prefix, facets)).toBe(true);
  });

  it("does not match facet link with unrelated URL", () => {
    const facets = [
      {
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: "https://example.com/other",
          },
        ],
        index: { byteStart: 0, byteEnd: 10 },
      },
    ];
    expect(isAutomatedPost(undefined, undefined, prefix, facets)).toBe(false);
  });

  it("matches facet link among multiple facets", () => {
    const facets = [
      {
        features: [
          { $type: "app.bsky.richtext.facet#link", uri: "https://mailbox.org" },
        ],
        index: { byteStart: 0, byteEnd: 10 },
      },
      {
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: "https://meltforce.org/blog/i-know-kung-fu/",
          },
        ],
        index: { byteStart: 20, byteEnd: 30 },
      },
      {
        features: [{ $type: "app.bsky.richtext.facet#tag", tag: "vibecoding" }],
        index: { byteStart: 40, byteEnd: 50 },
      },
    ];
    expect(isAutomatedPost(undefined, undefined, prefix, facets)).toBe(true);
  });

  it("ignores non-link facets", () => {
    const facets = [
      {
        features: [{ $type: "app.bsky.richtext.facet#tag", tag: "blog" }],
        index: { byteStart: 0, byteEnd: 5 },
      },
    ];
    expect(isAutomatedPost(undefined, undefined, prefix, facets)).toBe(false);
  });
});
