import { describe, it, expect } from "vitest";
import { htmlToText } from "./html-to-text";

describe("htmlToText", () => {
  it("strips HTML tags", () => {
    expect(htmlToText("<p>Hello <b>world</b></p>")).toBe("Hello world");
  });

  it("converts br to newline", () => {
    expect(htmlToText("line1<br>line2<br/>line3")).toBe("line1\nline2\nline3");
  });

  it("converts closing p to double newline", () => {
    expect(htmlToText("<p>one</p><p>two</p>")).toBe("one\n\ntwo");
  });

  it("decodes HTML entities", () => {
    expect(htmlToText("&amp; &lt; &gt; &quot; &#39;")).toBe("& < > \" '");
  });

  it("decodes numeric entities", () => {
    expect(htmlToText("&#169;")).toBe("©");
  });

  it("decodes hex entities", () => {
    expect(htmlToText("&#x41;")).toBe("A");
  });

  it("collapses multiple blank lines", () => {
    expect(htmlToText("a\n\n\n\n\nb")).toBe("a\n\nb");
  });

  it("handles empty string", () => {
    expect(htmlToText("")).toBe("");
  });
});
