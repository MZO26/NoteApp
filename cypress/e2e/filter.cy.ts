describe("Filter", () => {
  it("should filter items based on search input and show dropdown", () => {
    cy.createNote("First Note", "This is the first note.");
    cy.createNote("Second Note", "This is the second note.");
    cy.createNote("Third Note", "This is the third note.");
    cy.get(".search-input").should("exist");
    cy.get(".search-input").type("second");
    cy.wait(250); //wait for debounced filter to apply
    cy.get(".dropdown")
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Second Note");
    cy.get(".item-container").should("contain.text", "Second Note");

    cy.get(".item-container .active")
      .should("exist")
      .and("contain.text", "Second Note");
    cy.get(".search-input").clear();
    cy.wait(250); //wait for debounced filter to reset
    cy.get(".dropdown").should("not.be.visible");
    cy.createTodo("Grocery List", [
      { content: "Buy milk", completed: false },
      { content: "Buy bread", completed: false },
    ]);
    cy.get(".search-input").should("exist");
    cy.get(".search-input").type("list");
    cy.wait(250); //wait for debounced filter to apply
    cy.get(".dropdown")
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Grocery List");
    cy.get(".item-container").should("contain.text", "Grocery List");
    cy.get(".item-container .active")
      .should("exist")
      .and("contain.text", "Grocery List");
    cy.get(
      ".item-container .noteItem.active, .item-container .toDoItem.active",
    ).should("have.length", 1);
    cy.get(".search-input").clear();
    cy.wait(250); //wait for debounced filter to reset
    cy.get(".dropdown").should("not.be.visible");
  });

  it("should show 'No matching title found' in dropdown when no matches are found", () => {
    cy.createNote("First Note", "This is the first note.");
    cy.createNote("Second Note", "This is the second note.");
    cy.createTodo("Grocery List", [
      { content: "Buy milk", completed: false },
      { content: "Buy bread", completed: false },
    ]);
    cy.get(".search-input").should("exist");
    cy.get(".search-input").type("nonexistent");
    cy.wait(250); //wait for debounced filter to apply
    cy.get(".dropdown")
      .should("be.visible")
      .and("contain.text", "No matching title found");
  });

  it("should not show dropdown when search input is empty", () => {
    cy.createNote("First Note", "This is the first note.");
    cy.get(".search-input").should("exist");
    cy.get(".search-input").type("first");
    cy.wait(250);
    cy.get(".dropdown").should("be.visible");
    cy.get(".search-input").clear();
    cy.wait(250);
    cy.get(".dropdown").should("not.be.visible");
  });

  it("should show 'No matching title found' when searching for a deleted note", () => {
    cy.createNote("Deleted Note", "Content.");
    cy.get(".item-container .noteItem")
      .contains("Deleted Note")
      .closest(".noteItem")
      .find("button")
      .click();
    cy.get(".search-input").should("exist");
    cy.get(".search-input").type("Deleted Note");
    cy.get(".dropdown")
      .should("be.visible")
      .and("contain.text", "No matching title found");
  });
});
