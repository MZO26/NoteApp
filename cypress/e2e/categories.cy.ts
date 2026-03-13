describe("Categories", () => {
  it("should create a new category", () => {
    cy.createCategory("Work");
    cy.get(".category-list .categoryItem")
      .should("contain.text", "Work")
      .and("contain.text", "Work");
  });

  it("should create multiple categories", () => {
    cy.createCategory("Work");
    cy.createCategory("Personal");
    cy.get(".category-list .categoryItem")
      .should("contain.text", "Work")
      .and("contain.text", "Personal");
    cy.get(".category-list .categoryItem").should("have.length", 3);
  });

  it("should not create a category with an empty name", () => {
    cy.get(".category-btn").should("be.visible").click();
    cy.get(".category-input").should("be.visible").type("{enter}");
    cy.get(".category-input").should("not.exist");
    cy.get(".category-btn").should("exist");
    cy.get(".category-list .categoryItem").should("have.length", 1);
  });

  it("should not create a category with a duplicate name", () => {
    cy.createCategory("Work");
    cy.get(".category-btn").should("be.visible").click();
    cy.get(".category-input").should("be.visible").type(`Work{enter}`);
    cy.get(".category-input").should("not.exist");
    cy.get(".category-btn").should("exist");
    cy.get(".category-list .categoryItem").should("have.length", 2);
  });

  it("should mark category as active when clicked", () => {
    cy.createCategory("Work");
    cy.createCategory("Personal");
    cy.contains(".category-list .categoryItem", "Work").click();
    cy.contains(".category-list .categoryItem", "Work").should(
      "have.class",
      "active",
    );
  });

  it("should change active Category when another category is clicked", () => {
    cy.createCategory("Work");
    cy.createCategory("Personal");
    cy.contains(".category-list .categoryItem", "Work").click();
    cy.contains(".category-list .categoryItem", "Personal").click();
    cy.contains(".category-list .categoryItem", "Personal")
      .closest(".categoryItem")
      .should("have.class", "active");
    cy.contains(".category-list .categoryItem", "Work")
      .closest(".categoryItem")
      .should("not.have.class", "active");
  });

  it("should only show notes from active Category", () => {
    cy.createCategory("Work");
    cy.createCategory("Personal");
    cy.createNote("Work Note", "Inhalt.", "Work");
    cy.createNote("Personal Note", "Inhalt.", "Personal");
    cy.contains(".category-list .categoryItem", "Work").click();
    cy.get(".item-container").should("contain.text", "Work Note");
    cy.get(".item-container").should("not.contain.text", "Personal Note");
    cy.contains(".category-list .categoryItem", "Personal").click();
    cy.get(".item-container").should("contain.text", "Personal Note");
    cy.get(".item-container").should("not.contain.text", "Work Note");
  });

  it("should keep the active category after page reload", () => {
    cy.createCategory("Work");
    cy.createCategory("Personal");
    cy.contains(".category-list .categoryItem", "Work").click();
    cy.reload();
    cy.contains(".category-list .categoryItem", "Work").should(
      "have.class",
      "active",
    );
  });

  it("should delete a category and move its items to default category", () => {
    cy.createCategory("Work");
    cy.createNote("Work Note", "Inhalt.", "Work");
    cy.createTodo(
      "Work Todo",
      [{ content: "Task 1", completed: false }],
      "Work",
    );
    cy.createTodo(
      "Random Todo",
      [{ content: "Task 1", completed: false }],
      "Without Category",
    );
    cy.createTodo(
      "Another random Todo",
      [{ content: "Task 1", completed: false }],
      "Without Category",
    );
    cy.contains(".category-list .categoryItem", "Work").click();
    cy.contains(".category-list .categoryItem.active", "Work")
      .should("have.class", "active")
      .find(".deleteCategoryItem-btn")
      .should("be.visible")
      .click();
    cy.contains(".category-list .categoryItem", "Without Category");
    cy.get(".category-list .categoryItem").should("have.length", 1);
    cy.get(".item-container").should("contain.text", "Work Note");
    cy.get(".item-container").should("contain.text", "Work Todo");
    cy.get(".item-container").should("contain.text", "Random Todo");
    cy.get(".item-container").should("contain.text", "Another random Todo");
  });

  it("should not delete the default category", () => {
    cy.contains(".category-list .categoryItem", "Without Category")
      .closest(".categoryItem")
      .find(".deleteCategoryItem-btn")
      .should("not.exist");
  });

  it("should set 'Without Category' as active when the active category is deleted", () => {
    cy.createCategory("Work");
    cy.contains(".category-list .categoryItem", "Work")
      .find(".deleteCategoryItem-btn")
      .should("be.visible")
      .click();
    cy.contains(".category-list .categoryItem", "Without Category").should(
      "have.class",
      "active",
    );
  });

  it("should update modal category-select when new category is created", () => {
    cy.createCategory("Work");
    cy.openModal();
    cy.get(".category-select").should("exist");
    cy.get(".category-select").should("contain.text", "Work");
  });

  it("should update modal category-select when category is deleted", () => {
    cy.createCategory("Work");
    cy.contains(".category-list .categoryItem", "Work")
      .find(".deleteCategoryItem-btn")
      .click();
    cy.openModal();
    cy.get(".category-select").should("exist");
    cy.get(".category-select").should("not.contain.text", "Work");
  });

  it("should collapse and expand category list when clicking toggle button", () => {
    cy.createCategory("Work");
    cy.get(".toggle-btn").click();
    cy.get(".category-list").should("have.class", "collapsed");
    cy.get(".toggle-btn").click();
    cy.get(".category-list").should("not.have.class", "collapsed");
  });
});
