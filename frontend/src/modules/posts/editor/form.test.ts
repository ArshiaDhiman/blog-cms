import { describe, expect, it } from "vitest";
import type { ContentDoc } from "@/types/content";
import { EMPTY_FORM, formAfterSave, type EditorForm } from "./form";

function paragraph(text: string): ContentDoc {
  return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] };
}

const sent: EditorForm = { ...EMPTY_FORM, title: "Hello", slug: "hello", content: paragraph("First draft") };

describe("formAfterSave", () => {
  it("matches what was saved when nothing changed during the save", () => {
    // The editor compares the form with the saved snapshot to decide if it's dirty.
    expect(formAfterSave(sent, sent, "hello")).toEqual({ ...sent, slug: "hello" });
  });

  it("keeps the body typed while the save was in flight", () => {
    const current = { ...sent, content: paragraph("First draft, and more typed while saving") };
    expect(formAfterSave(current, sent, "hello").content).toEqual(current.content);
  });

  it("keeps a title typed while the save was in flight", () => {
    const current = { ...sent, title: "Hello again" };
    expect(formAfterSave(current, sent, "hello").title).toBe("Hello again");
  });

  it("takes the slug the server filled in", () => {
    const untitled = { ...sent, slug: "" };
    expect(formAfterSave(untitled, untitled, "draft-abc123").slug).toBe("draft-abc123");
  });

  it("keeps a slug that changed on screen during the save", () => {
    const current = { ...sent, slug: "hello-world" };
    expect(formAfterSave(current, sent, "hello").slug).toBe("hello-world");
  });
});
