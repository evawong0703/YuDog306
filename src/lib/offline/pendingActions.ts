import type { Item } from "@/types/item";
import { createItem, updateItem, deleteItem } from "@/lib/supabase/pantry";

export type PendingAction =
  | {
      id: string;
      type: "create";
      item: Item;
      createdAt: string;
    }
  | {
      id: string;
      type: "update";
      item: Item;
      createdAt: string;
    }
  | {
      id: string;
      type: "delete";
      itemId: string;
      createdAt: string;
    };

const PENDING_ACTIONS_KEY = "shiba-pantry-pending-actions";

export function getPendingActions(): PendingAction[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      localStorage.getItem(PENDING_ACTIONS_KEY) ?? "[]"
    ) as PendingAction[];
  } catch {
    return [];
  }
}

export function getPendingActionCount() {
  return getPendingActions().length;
}

function savePendingActions(actions: PendingAction[]) {
  localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(actions));
}

function getActionItemId(action: PendingAction) {
  return action.type === "delete" ? action.itemId : action.item.id;
}

export function addPendingAction(action: PendingAction) {
  const actions = getPendingActions();
  const itemId = getActionItemId(action);

  const existingCreate = actions.find(
    (a) => a.type === "create" && getActionItemId(a) === itemId
  );

  if (action.type === "update") {
    if (existingCreate && existingCreate.type === "create") {
      const next = actions
        .filter((a) => !(getActionItemId(a) === itemId && a.type !== "create"))
        .map((a) =>
          a.type === "create" && getActionItemId(a) === itemId
            ? { ...a, item: action.item }
            : a
        );

      savePendingActions(next);
      return;
    }

    const next = actions.filter(
      (a) => !(getActionItemId(a) === itemId && a.type === "update")
    );

    savePendingActions([...next, action]);
    return;
  }

  if (action.type === "delete") {
    if (existingCreate) {
      const next = actions.filter((a) => getActionItemId(a) !== itemId);
      savePendingActions(next);
      return;
    }

    const next = actions.filter((a) => getActionItemId(a) !== itemId);
    savePendingActions([...next, action]);
    return;
  }

  if (action.type === "create") {
    const next = actions.filter((a) => getActionItemId(a) !== itemId);
    savePendingActions([...next, action]);
  }
}

export async function syncPendingActions() {
  const actions = getPendingActions();

  for (const action of actions) {
    if (action.type === "create") {
      await createItem(action.item);
    }

    if (action.type === "update") {
      await updateItem(action.item);
    }

    if (action.type === "delete") {
      await deleteItem(action.itemId);
    }

    const remaining = getPendingActions().filter((a) => a.id !== action.id);
    savePendingActions(remaining);
  }
}