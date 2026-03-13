import notes from "../fixtures/noteData.json";

describe("Notes", () => {
  it("should create multiple note items", () => {
    notes.forEach((note) => {
      cy.createNote(note, "This is a test note.");
    });
    notes.forEach((note) => {
      cy.get(".item-container").should("contain", note);
    });
  });

  it("should delete all note items", () => {
    notes.forEach((title) => {
      cy.createNote(title, "This note will be deleted.");
    });
    notes.forEach((note) => {
      cy.get(".item-container").should("contain", note);
    });
    cy.get(".noteItem .deleteNoteItem-btn").each(() => {
      cy.get(".noteItem .deleteNoteItem-btn").first().click();
    });
    cy.get(".item-container").should("be.empty");
  });

  it("should persist note items after reload", () => {
    notes.forEach((title) => {
      cy.createNote(title, "This note should persist after reload.");
    });
    cy.reload();
    cy.get(".item-container").should("exist");
    notes.forEach((note) => {
      cy.get(".item-container").should("contain", note);
    });
  });

  it.only("should edit and update note items", () => {
    notes.forEach((title) => {
      cy.createNote(title, "This note will be edited.");
    });
    cy.get(".item-container").should("exist");
    notes.forEach((note) => {
      cy.get(".item-container").should("contain", note);
    });
    notes.forEach((_, index) => {
      cy.updateNote(
        index,
        `Updated Title ${index + 1}`,
        "This note has been updated.",
      );
      cy.get(".item-container").should("contain", `Updated Title ${index + 1}`);
      cy.get(".item-container").should("not.contain", "Original Title");
    });
  });
});
