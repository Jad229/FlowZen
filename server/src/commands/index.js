import addCard from './addCard.js';
import deleteCard from './deleteCard.js';
import moveCard from './moveCard.js';
import updateCard from './updateCard.js';
import renameColumn from './renameColumn.js';
import addColumn from './addColumn.js';
import moveColumn from './moveColumn.js';
import deleteColumn from './deleteColumn.js';

// Maps the command type strings to their handlers. Every
// inverse produced by a handler is itself a valid entry in this registry,
// which keeps undo/redo trivial (just execute the stored inverse command).
export const commandRegistry = {
  ADD_CARD: addCard,
  DELETE_CARD: deleteCard,
  MOVE_CARD: moveCard,
  UPDATE_CARD: updateCard,
  RENAME_COLUMN: renameColumn,
  ADD_COLUMN: addColumn,
  MOVE_COLUMN: moveColumn,
  DELETE_COLUMN: deleteColumn,
};
