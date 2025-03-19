import { create } from "zustand";

const useChatBarFocusStore = create((set) => ({
  chatBarFocus: false,
  actions: {
    focus: () => set({ chatBarFocus: true }),
    blur: () => set({ chatBarFocus: false }),
  },
}));

export const useChatBarFocus = () =>
  useChatBarFocusStore((state) => state.chatBarFocus);

// 🎉 one selector for all our actions
export const useChatBarFocusActions = () =>
  useChatBarFocusStore((state) => state.actions);
