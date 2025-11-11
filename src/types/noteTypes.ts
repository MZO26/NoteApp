type NoteObject = {
  id: number;
  type: string;
  category: string;
  data: Array<string>;
  title: string;
  formattedDate: string;
};

type NoteItem = HTMLDivElement & {
  _listener?: ((event: Event) => void) | null;
};

export type { NoteItem, NoteObject };
