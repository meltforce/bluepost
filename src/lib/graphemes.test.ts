import { describe, it, expect } from "vitest";
import { countGraphemes, truncateGraphemes } from "./graphemes";

describe("countGraphemes", () => {
  it("counts ASCII characters", () => {
    expect(countGraphemes("hello")).toBe(5);
  });

  it("counts empty string", () => {
    expect(countGraphemes("")).toBe(0);
  });

  it("counts emoji as single graphemes", () => {
    expect(countGraphemes("👍")).toBe(1);
    expect(countGraphemes("👨‍👩‍👧‍👦")).toBe(1); // family emoji is one grapheme
  });

  it("counts mixed content", () => {
    expect(countGraphemes("Hi 👋🏽")).toBe(4); // H, i, space, wave
  });

  it("counts flag emoji as one grapheme", () => {
    expect(countGraphemes("🇩🇪")).toBe(1);
  });
});

describe("truncateGraphemes", () => {
  it("does not truncate short text", () => {
    expect(truncateGraphemes("hello", 300)).toBe("hello");
  });

  it("truncates at limit with ellipsis", () => {
    const text = "a".repeat(305);
    const result = truncateGraphemes(text, 300);
    expect(countGraphemes(result)).toBe(300); // 299 chars + ellipsis
    expect(result.endsWith("…")).toBe(true);
  });

  it("truncates emoji correctly", () => {
    const text = "👍".repeat(10);
    const result = truncateGraphemes(text, 5);
    expect(countGraphemes(result)).toBe(5); // 4 thumbs + ellipsis
  });
});
