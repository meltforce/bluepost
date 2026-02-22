export function getPreferenceValues() {
  return {};
}

export const LocalStorage = {
  getItem: async () => undefined,
  setItem: async () => undefined,
  removeItem: async () => undefined,
  allItems: async () => ({}),
  clear: async () => undefined,
};

export async function showToast() {}

export const Toast = {
  Style: { Success: "success", Failure: "failure", Animated: "animated" },
};
