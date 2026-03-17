/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

//200ms after save to wait for debounce to complete

Cypress.Commands.add("createCategory", (name: string) => {
  cy.get(".category-btn").should("be.visible").click();
  cy.get(".category-input").should("exist");
  cy.get(".category-input").should("be.visible").type(`${name}{enter}`);
  cy.get(".category-input").should("not.exist");
  cy.get(".category-btn").should("exist");
  cy.get(".category-btn").should("exist");
  cy.get(".category-list").should("contain.text", name);
});

Cypress.Commands.add("selectCategory", (name: string) => {
  cy.get("select.category-select").should("be.visible").select(name);
});

Cypress.Commands.add(
  "createNote",
  (title: string, content: string, category?: string) => {
    cy.openModal();
    cy.get("textarea.title").type(title);
    cy.get("textarea.note").type(content);
    if (category) {
      cy.selectCategory(category);
    }
    cy.get(".add-btn").click();
    cy.waitForModalToClose();
    cy.wait(200);
  },
);

Cypress.Commands.add(
  "updateNote",
  (index: number, title: string, content: string, category?: string) => {
    cy.get(".item-container .noteItem").eq(index).click();
    cy.get(".modal").should("have.class", "show");
    cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
    cy.get(".overlay").should("have.class", "show");
    cy.get("textarea.title").clear().type(title);
    cy.get("textarea.note").clear().type(content);
    if (category) {
      cy.selectCategory(category);
    }
    cy.get(".add-btn").click();
    cy.waitForModalToClose();
    cy.wait(200);
  },
);

Cypress.Commands.add(
  "createTodo",
  (
    title: string,
    tasks: { content: string; completed: boolean }[],
    category?: string,
  ) => {
    cy.openModal();
    cy.get(".switch-btn").click();
    cy.get(".overlay").should("have.class", "show");
    cy.get("textarea.todo-title").type(title);
    tasks.forEach((task, index) => {
      cy.get(".todo-input").type(task.content);
      cy.get(".todo-btn").click();
      if (task.completed) {
        cy.get(".task-checkbox").eq(index).check();
      }
    });
    if (category) {
      cy.selectCategory(category);
    }
    cy.get(".add-btn").click();
    cy.waitForModalToClose();
    cy.wait(200);
  },
);

Cypress.Commands.add(
  "updateTodo",
  (
    index: number,
    title: string,
    tasks: { content: string; completed: boolean }[],
    category?: string,
  ) => {
    cy.get(".item-container .toDoItem").eq(index).click();
    cy.get(".modal").should("have.class", "show");
    cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
    cy.get(".overlay").should("have.class", "show");
    cy.get("textarea.todo-title").clear().type(title!);
    tasks.forEach((task) => {
      cy.get(".todo-input").type(task.content);
      cy.get(".todo-btn").click();
      if (task.completed) {
        cy.get(".task-checkbox").last().check();
      }
    });
    if (category) {
      cy.selectCategory(category);
    }
    cy.get(".add-btn").click();
    cy.waitForModalToClose();
    cy.wait(200);
  },
);

Cypress.Commands.add("openModal", () => {
  cy.get(".overlay").should("not.have.class", "show");
  cy.get(".modal").should("not.have.class", "show");
  cy.get(".showModal-btn").click();
  cy.get(".modal").should("have.class", "show");
  cy.get(".modal").should("have.css", "opacity", "1").and("be.visible");
  cy.get(".overlay").should("have.class", "show");
});

Cypress.Commands.add("closeModal", () => {
  cy.get(".overlay").should("have.class", "show");
  cy.get(".modal").should("have.class", "show");
  cy.get(".closeModal-btn").click();
  cy.waitForModalToClose();
});

Cypress.Commands.add("waitForModalToClose", () => {
  cy.get(".modal").should("not.have.class", "show");
  cy.get(".modal").should("have.css", "opacity", "0").and("not.be.visible");
  cy.get(".overlay").should("not.have.class", "show");
});

Cypress.Commands.add("switchModalInterface", (mode: "note" | "toDo") => {
  const expectedTitleSelector =
    mode === "note" ? "textarea.title" : "textarea.todo-title";
  cy.get(".switch-btn").click();
  cy.get(expectedTitleSelector).should("exist");
});

declare namespace Cypress {
  interface Chainable {
    createNote(
      title: string,
      content: string,
      category?: string,
      index?: number,
    ): Chainable<void>;
    updateNote(
      index: number,
      title: string,
      content: string,
      category?: string,
    ): Chainable<void>;
    createTodo(
      title: string,
      tasks: { content: string; completed: boolean }[],
      category?: string,
      index?: number,
    ): Chainable<void>;
    updateTodo(
      index: number,
      title: string,
      tasks: { content: string; completed: boolean }[],
      category?: string,
    ): Chainable<void>;
    switchModalInterface(mode: "note" | "toDo"): Chainable<void>;
    openModal(): Chainable<void>;
    closeModal(): Chainable<void>;
    waitForModalToClose(): Chainable<void>;
    createCategory(name: string): Chainable<void>;
    selectCategory(name: string): Chainable<void>;
  }
}
