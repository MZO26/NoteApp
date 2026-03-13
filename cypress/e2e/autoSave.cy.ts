describe("autoSave (created notes and todo's only)", () => {
  it("should auto save when writing in note title as well as note textarea", () => {
    cy.createNote(
      "This title should be autosaved",
      "This content should also be autosaved",
    );
    cy.get(".item-container .noteItem").eq(0).click();
    cy.get(".modal").should("have.class", "show");
    cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
    cy.get(".overlay").should("have.class", "show");
    cy.get("textarea.title").should("be.visible");
    cy.get("textarea.title").should(
      "have.value",
      "This title should be autosaved",
    );
    cy.get("textarea.title").clear().type("This title was autosaved");
    cy.wait(500); //wait for debounced save to complete
    cy.get("textarea.note").should(
      "have.value",
      "This content should also be autosaved",
    );
    cy.get("textarea.note").clear().type("Yes this content got autosaved too");
    cy.wait(500); //wait for debounced save to complete
    cy.get("textarea.title").should("have.value", "This title was autosaved");
    cy.get("textarea.note").should(
      "have.value",
      "Yes this content got autosaved too",
    );
  });

  it("should auto save when writing in todo title as well as adding tasks", () => {
    cy.createTodo("This should be autosaved", [
      { content: "Task 1", completed: false },
      { content: "Task 2", completed: false },
    ]);
    cy.get(".item-container .toDoItem").eq(0).click();
    cy.get(".modal").should("have.class", "show");
    cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
    cy.get(".overlay").should("have.class", "show");
    cy.get("textarea.todo-title").should("be.visible");
    cy.get("textarea.todo-title").should(
      "have.value",
      "This should be autosaved",
    );
    cy.get("textarea.todo-title").clear().type("Yes it got autosaved");
    cy.wait(600); //wait for debounced save to complete
    cy.get(".todo-input").type("Task 3");
    cy.get(".todo-btn").click();
    cy.wait(600); //wait for debounced save to complete
    cy.get(".todo-input").type("Task 4");
    cy.get(".todo-btn").click();
    cy.wait(600); //wait for debounced save to complete
    cy.get("textarea.todo-title").should("have.value", "Yes it got autosaved");
    cy.get(".task-list li").should("have.length", 4);
    cy.get(".task-list li span").eq(0).should("contain.text", "Task 1");
    cy.get(".task-list li span").eq(1).should("contain.text", "Task 2");
    cy.get(".task-list li span").eq(2).should("contain.text", "Task 3");
    cy.get(".task-list li span").eq(3).should("contain.text", "Task 4");
  });

  it("should auto save completed tasks in todo's", () => {
    cy.createTodo("Test ToDo", [
      { content: "Task 1 that should not be completed", completed: false },
      { content: "Task 2 that should be completed", completed: true },
    ]);
    cy.get(".item-container .toDoItem").eq(0).click();
    cy.get(".modal").should("have.class", "show");
    cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
    cy.get(".overlay").should("have.class", "show");
    cy.get(".todo-input").should("be.visible");
    cy.get(".todo-input").type("Task 3 that should be completed");
    cy.get(".todo-btn").click();
    cy.get(".task-checkbox").eq(2).check();
    cy.wait(600); //wait for debounced save to complete
    cy.get(".todo-input").type("Task 4 that should be completed");
    cy.get(".todo-btn").click();
    cy.get(".task-checkbox").eq(3).check();
    cy.wait(600); //wait for debounced save to complete
    cy.get(".todo-input").type("Task 5 that should not be completed");
    cy.get(".todo-btn").click();
    cy.wait(600); //wait for debounced save to complete
    cy.get(".task-list li").should("have.length", 5);
    cy.get(".task-list li span")
      .eq(0)
      .should("contain.text", "Task 1 that should not be completed");
    cy.get(".task-list li")
      .eq(0)
      .find(".task-checkbox")
      .should("not.be.checked");
    cy.get(".task-list li span")
      .eq(1)
      .should("contain.text", "Task 2 that should be completed");
    cy.get(".task-list li").eq(1).find(".task-checkbox").should("be.checked");
    cy.get(".task-list li span")
      .eq(2)
      .should("contain.text", "Task 3 that should be completed");
    cy.get(".task-list li").eq(2).find(".task-checkbox").should("be.checked");
    cy.get(".task-list li span")
      .eq(3)
      .should("contain.text", "Task 4 that should be completed");
    cy.get(".task-list li").eq(3).find(".task-checkbox").should("be.checked");
    cy.get(".task-list li span")
      .eq(4)
      .should("contain.text", "Task 5 that should not be completed");
    cy.get(".task-list li")
      .eq(4)
      .find(".task-checkbox")
      .should("not.be.checked");
  });
});
