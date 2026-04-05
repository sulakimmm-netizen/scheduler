"use client";

import { useOptimistic, useTransition } from "react";

export function useOptimisticToggle(
  initialState: boolean,
  action: (currentState: boolean) => Promise<void>
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useOptimistic(initialState);

  function toggle() {
    startTransition(async () => {
      setOptimisticState(!optimisticState);
      await action(optimisticState);
    });
  }

  return { checked: optimisticState, toggle, isPending };
}
