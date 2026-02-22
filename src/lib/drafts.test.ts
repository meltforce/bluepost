import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { LocalStorage } from "@raycast/api";
import { getDrafts, saveDraft, updateDraft, removeDraft } from "./drafts";

beforeEach(async () => {
  await LocalStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getDrafts", () => {
  it("returns empty array when no drafts saved", async () => {
    expect(await getDrafts()).toEqual([]);
  });

  it("returns saved drafts", async () => {
    const draft = await saveDraft({ text: "hello", url: "", images: [] });
    const drafts = await getDrafts();
    expect(drafts).toHaveLength(1);
    expect(drafts[0].id).toBe(draft.id);
  });
});

describe("saveDraft", () => {
  it("creates a draft with all fields", async () => {
    const draft = await saveDraft({
      text: "post text",
      url: "https://example.com",
      images: ["/tmp/a.png"],
    });
    expect(draft.id).toBeTruthy();
    expect(draft.text).toBe("post text");
    expect(draft.url).toBe("https://example.com");
    expect(draft.images).toEqual(["/tmp/a.png"]);
    expect(draft.createdAt).toBeTruthy();
    expect(draft.updatedAt).toBe(draft.createdAt);
  });

  it("appends to existing drafts", async () => {
    await saveDraft({ text: "first", url: "", images: [] });
    await saveDraft({ text: "second", url: "", images: [] });
    const drafts = await getDrafts();
    expect(drafts).toHaveLength(2);
    expect(drafts[0].text).toBe("first");
    expect(drafts[1].text).toBe("second");
  });
});

describe("updateDraft", () => {
  it("updates text and url of existing draft", async () => {
    const draft = await saveDraft({ text: "old", url: "", images: [] });
    vi.advanceTimersByTime(1000);
    await updateDraft(draft.id, {
      text: "new",
      url: "https://new.com",
      images: ["/tmp/b.png"],
    });
    const drafts = await getDrafts();
    expect(drafts[0].text).toBe("new");
    expect(drafts[0].url).toBe("https://new.com");
    expect(drafts[0].images).toEqual(["/tmp/b.png"]);
    expect(drafts[0].createdAt).toBe(draft.createdAt);
    expect(drafts[0].updatedAt).not.toBe(draft.updatedAt);
  });

  it("is a no-op for unknown id", async () => {
    await saveDraft({ text: "keep", url: "", images: [] });
    await updateDraft("nonexistent", { text: "x", url: "", images: [] });
    const drafts = await getDrafts();
    expect(drafts).toHaveLength(1);
    expect(drafts[0].text).toBe("keep");
  });
});

describe("removeDraft", () => {
  it("removes a draft by id", async () => {
    const d1 = await saveDraft({ text: "one", url: "", images: [] });
    await saveDraft({ text: "two", url: "", images: [] });
    await removeDraft(d1.id);
    const drafts = await getDrafts();
    expect(drafts).toHaveLength(1);
    expect(drafts[0].text).toBe("two");
  });

  it("is a no-op for unknown id", async () => {
    await saveDraft({ text: "keep", url: "", images: [] });
    await removeDraft("nonexistent");
    const drafts = await getDrafts();
    expect(drafts).toHaveLength(1);
  });
});
