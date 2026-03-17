// import type { ItemArray } from "../../types/storageTypes.js";
// import type { Note } from "../../utils/classes.js";
// import { showToast } from "../../utils/events.js";
// import { createNewNote } from "../../utils/models.js";
// import { getNoteFormData } from "./noteUtils.js";

// const handleNoteSave = (
//   savedItemId: string | null,
//   itemArr: ItemArray,
//   selectedCategory: string,
// ): void => {
//   const formData = getNoteFormData();
//   if (!formData) return;
//   if (savedItemId === null) {
//     const newNote = createNewNote(
//       "note",
//       selectedCategory,
//       formData.titleValue,
//       formData.noteDataToArr,
//     );
//     renderItem(newNote);
//     showToast("New note was created");
//   } else {
//     updateExistingNote(savedItemId, itemArr, selectedCategory, formData);
//   }
//   setActiveCategory(selectedCategory);
//   removeValue(StorageKeys.TEMP_NOTE);
//   setTimeout(() => {
//     reloadCategoryList();
//   }, 0);
// };

// const updateExistingNote = (
//   savedItemId: string,
//   itemArr: ItemArray,
//   selectedCategory: string,
//   formData: ReturnType<typeof getNoteFormData>,
// ) => {
//   console.log("selectedCategory in updateExistingNote:", selectedCategory);
//   if (!formData) return;
//   const savedItem: Note | undefined = itemArr.find(
//     (item) => item.id === savedItemId,
//   );
//   if (savedItem && savedItem.type === "note") {
//     const updatedItem = {
//       ...savedItem,
//       title: formData.titleValue,
//       data: formData.noteDataToArr,
//       category: selectedCategory,
//     };
//     syncItemState(savedItemId, updatedItem);
//     showToast("Note was saved");
//   }
// };

// export { handleNoteSave };
