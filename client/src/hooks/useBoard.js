import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchBoard,
  applyCommand,
  undoBoard,
  redoBoard,
} from "../api/boards";

export default function useBoard(boardId) {
  const [board, setBoard] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [isMutating, setIsMutating] = useState(false);
  const mutatingRef = useRef(false);
  const historyRef = useRef({ canUndo: false, canRedo: false });

  const applyResult = useCallback((data) => {
    setBoard(data.board);
    setCanUndo(Boolean(data.canUndo));
    setCanRedo(Boolean(data.canRedo));
    setActiveCount(data.activeCount ?? 0);
    historyRef.current = {
      canUndo: Boolean(data.canUndo),
      canRedo: Boolean(data.canRedo),
    };
  }, []);

  useEffect(() => {
    if (!boardId) return;

    let cancelled = false;
    setBoard(null);
    setCanUndo(false);
    setCanRedo(false);
    setActiveCount(0);
    historyRef.current = { canUndo: false, canRedo: false };

    async function load() {
      const data = await fetchBoard(boardId);
      if (!cancelled) applyResult(data);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [boardId, applyResult]);

  const runMutation = useCallback(
    async (fn) => {
      if (mutatingRef.current) return;
      mutatingRef.current = true;
      setIsMutating(true);
      try {
        const data = await fn();
        applyResult(data);
        return data;
      } finally {
        mutatingRef.current = false;
        setIsMutating(false);
      }
    },
    [applyResult]
  );

  const sendCommand = useCallback(
    (type, payload) => runMutation(() => applyCommand(boardId, type, payload)),
    [boardId, runMutation]
  );

  const undo = useCallback(() => {
    if (!historyRef.current.canUndo) return;
    return runMutation(() => undoBoard(boardId));
  }, [boardId, runMutation]);

  const redo = useCallback(() => {
    if (!historyRef.current.canRedo) return;
    return runMutation(() => redoBoard(boardId));
  }, [boardId, runMutation]);

  return {
    board,
    setBoard,
    canUndo,
    canRedo,
    activeCount,
    isMutating,
    sendCommand,
    undo,
    redo,
  };
}
