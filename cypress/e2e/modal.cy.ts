describe("Modal Functionality", () => {
  const taskData = [
    { content: "Task 1", completed: false },
    { content: "Task 2", completed: true },
  ];

  it("should open and close the modal", () => {
    cy.openModal();
    cy.get("textarea.title").should("be.visible").and("have.value", "");
    cy.get("textarea.note").should("be.visible").and("have.value", "");
    cy.closeModal();
  });

  it("should switchModalInterface when switch-btn is clicked (back to notes)", () => {
    cy.openModal();
    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");
    cy.switchModalInterface("toDo");
    cy.get("div.todo-container").should("exist");
    cy.switchModalInterface("note");
    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");
    cy.get("textarea.title").should("exist").should("be.visible");
    cy.get("textarea.note").should("exist").should("be.visible");
  });

  it("should create a note after switch of Overlay", () => {
    cy.openModal();
    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");
    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");
    cy.get("textarea.title").should("exist").should("be.visible");
    cy.get("textarea.note").should("be.visible");
    cy.get("textarea.title").type("Test Note");
    cy.get("textarea.note").type("This is a test note.");
    cy.get(".add-btn").click();
    cy.get(".modal").should("have.css", "opacity", "0").and("not.be.visible");
    cy.get(".overlay").should("not.have.class", "show");
    cy.wait(200); //wait for debounced save to complete
    cy.get(".item-container").should("contain.text", "Test Note");
  });

  it.only("should create a todo after switch of Overlay", () => {
    cy.openModal();
    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");
    cy.switchModalInterface("toDo");
    cy.get("textarea.todo-title").should("exist").should("be.visible");
    cy.get("div.todo-container").should("exist");

    taskData.forEach((task, index) => {
      cy.get(".todo-input").type(task.content);
      cy.get(".todo-btn").click();
      if (task.completed) {
        cy.get(".task-checkbox").eq(index).check();
      }
    });
    cy.get(".add-btn").click();
    cy.get(".modal").should("have.css", "opacity", "0").and("not.be.visible");
    cy.get(".overlay").should("not.have.class", "show");
    cy.wait(200); //wait for debounced save to complete
    cy.get(".item-container")
      .should("contain.text", "Task 1")
      .and("contain.text", "Task 2");
  });

  it("should delete content of modal when closed and reopened", () => {
    cy.openModal();
    cy.get("textarea.title").type("Test Note");
    cy.get("textarea.note").type("This is a test note.");
    cy.closeModal();
    cy.openModal();
    cy.get("textarea.title").should("have.value", "");
    cy.get("textarea.note").should("have.value", "");
  });

  it("should not persist content in modal when switching between note and todo", () => {
    cy.openModal();

    cy.get("textarea.title").type("Test Note");
    cy.get("textarea.note").type("This is a test note.");

    cy.switchModalInterface("toDo");
    cy.switchModalInterface("note");

    cy.get("textarea.title").should("have.value", "");
    cy.get("textarea.note").should("have.value", "");

    cy.switchModalInterface("toDo");
    cy.get("div.todo-container").should("exist");
    cy.get("textarea.todo-title").type("Test ToDo");

    taskData.forEach((task, index) => {
      cy.get(".todo-input").type(task.content);
      cy.get(".todo-btn").click();
      if (task.completed) {
        cy.get(".task-checkbox").eq(index).check();
      }
    });

    cy.switchModalInterface("note");
    cy.switchModalInterface("toDo");

    cy.get("textarea.todo-title").should("have.value", "");
    cy.get(".task-list")
      .should("not.contain.text", "Task 1")
      .and("not.contain.text", "Task 2");
  });

  it("should delete contents of note or toDo when delete-btn is clicked", () => {
    cy.openModal();
    cy.get("textarea.title").type("Test Note");
    cy.get("textarea.note").type("This is a test note.");
    cy.get(".delete-btn").click();
    cy.get("textarea.title").should("have.value", "");
    cy.get("textarea.note").should("have.value", "");
    cy.switchModalInterface("toDo");
    cy.get("textarea.todo-title").type("Test ToDo");
    taskData.forEach((task, index) => {
      cy.get(".todo-input").type(task.content);
      cy.get(".todo-btn").click();
      if (task.completed) {
        cy.get(".task-checkbox").eq(index).check();
      }
    });
    cy.get(".delete-btn").click();
    cy.get("textarea.todo-title").should("have.value", "");
    cy.get(".task-list")
      .should("not.contain.text", "Task 1")
      .and("not.contain.text", "Task 2");
  });
});
