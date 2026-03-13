import todos from "../fixtures/toDoData.json";

describe("Todos", () => {
  it("should create multiple todo items", () => {
    todos.forEach((todo) => {
      cy.createTodo(todo.title, todo.tasks);
    });
    todos.forEach((todo) => {
      cy.get(".item-container").should("contain", todo.title);
    });
  });

  it("should delete all todo items", () => {
    todos.forEach((todo) => {
      cy.createTodo(todo.title, todo.tasks);
    });
    todos.forEach((todo) => {
      cy.get(".item-container").should("contain", todo.title);
    });
    cy.get(".toDoItem .deleteNoteItem-btn").each(() => {
      cy.get(".toDoItem .deleteNoteItem-btn").first().click();
    });
    cy.get(".item-container").should("be.empty");
  });

  it("should mark a task as completed", () => {
    todos.forEach((todo) => {
      cy.createTodo(todo.title, todo.tasks);
    });
    cy.get(".item-container").should("exist");
    cy.get(".toDoItem").first().click();
    cy.get(".task-checkbox").first().click();
    cy.get(".task-list li span").first().should("have.class", "task-completed");
    cy.get(".add-btn").click();
  });

  it("should persist todo items after reload", () => {
    todos.forEach((todo) => {
      cy.createTodo(todo.title, todo.tasks);
    });
    cy.reload();
    cy.get(".item-container").should("exist");
    todos.forEach((todo) => {
      cy.get(".item-container").should("contain", todo.title);
    });
  });

  it.only("should edit todo items", () => {
    todos.forEach((todo) => {
      cy.createTodo(todo.title, todo.tasks);
    });
    cy.get(".item-container").should("exist");
    todos.forEach((todo) => {
      cy.get(".item-container").should("contain", todo.title);
    });
    todos.forEach((todo, index) => {
      cy.updateTodo(index, `Updated ${todo.title} 1 time`, [
        { content: "Updated Task 1", completed: true },
      ]);
      cy.updateTodo(index, `Updated ${todo.title} 2 times`, [
        { content: "Updated Task 2", completed: true },
      ]);
      cy.updateTodo(index, `Updated ${todo.title} 3 times`, [
        { content: "Updated Task 3", completed: true },
      ]);
    });

    todos.forEach((todo) => {
      cy.get(".item-container").should(
        "contain",
        `Updated ${todo.title} 3 times`,
      );
    });
  });
});
