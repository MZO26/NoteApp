import { v4 } from "uuid";
import { removeValue, StorageKeys } from "../utils/storageService.js";

vi.mock("uuid", () => {
  return {
    v4: vi.fn(() => "fake-test-uuid-1234"),
  };
});

const nextFrame = async () => {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await Promise.resolve();
};

describe("showModal-btn (addNewNote)", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <input class="search-input" />
      <button class="dark-mode-btn"></button>
      <button class="toggle-btn"></button>
      <button class="showModal-btn"></button>
      <input type="checkbox" class="switch-checkbox" />
      <label class="switch"></label>
      <div class="overlay"></div>
      <div class="modal">
        <h2 class="modal-heading"></h2>
        <p class="modal-note"></p>
        <textarea class="title"></textarea>
        <textarea class="note"></textarea>
        <select class="category-select"></select>
      </div>
      <button class="closeModal-btn"></button>
      <button class="add-btn"></button>
      <button class="delete-btn"></button>
    `;
    vi.resetModules();
    await import("../handlers/modalHandlers.js");
    await import("../handlers/documentHandlers.js");
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    removeValue(StorageKeys.TEMP_NOTE);
    removeValue(StorageKeys.TEMP_TODO);
  });

  it("opens modal -> classList 'show')", async () => {
    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(document.querySelector(".overlay")!.classList).toContain("show");
    expect(document.querySelector(".modal")!.classList).toContain("show");
  });

  it("sets switch-checkbox to false (Note mode)", { repeats: 4 }, async () => {
    const switchBtn =
      document.querySelector<HTMLInputElement>(".switch-checkbox")!;
    switchBtn.checked = true;

    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(switchBtn.checked).toBe(false);
  });

  it("sets modal-heading to 'New note'", async () => {
    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(document.querySelector(".modal-heading")!.textContent).toBe(
      "New note",
    );
  });

  it("sets modal-note to 'Add note'", async () => {
    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(document.querySelector(".modal-note")!.textContent).toBe("Add note");
  });

  it("renders Note-UI: .title and .note are in the DOM", async () => {
    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(document.querySelector(".title")).not.toBeNull();
    expect(document.querySelector(".note")).not.toBeNull();
  });

  it("sets modalState to 'note' in localStorage", async () => {
    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    const raw = localStorage.getItem("modalState");
    expect(JSON.parse(raw!).interface).toBe("note");
  });

  it("removes savedItemId from sessionStorage (clearSavedItemId)", async () => {
    sessionStorage.setItem("savedItemId", v4());

    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(sessionStorage.getItem("savedItemId")).toBeNull();
  });

  it("makes switchLabel visible", async () => {
    const switchLabel = document.querySelector<HTMLLabelElement>(".switch")!;
    switchLabel.classList.add("hidden");

    document.querySelector<HTMLButtonElement>(".showModal-btn")!.click();
    await nextFrame();

    expect(switchLabel.classList).not.toContain("hidden");
  });
});
