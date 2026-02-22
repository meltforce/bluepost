export function getPreferenceValues() {
  return {};
}

const store = new Map<string, string>();

export const LocalStorage = {
  getItem: async <T = string>(key: string): Promise<T | undefined> =>
    store.get(key) as T | undefined,
  setItem: async (_key: string, _value: string): Promise<void> => {
    store.set(_key, _value);
  },
  removeItem: async (key: string): Promise<void> => {
    store.delete(key);
  },
  allItems: async (): Promise<Record<string, string>> =>
    Object.fromEntries(store),
  clear: async (): Promise<void> => {
    store.clear();
  },
};

export async function showToast() {}

export const Toast = {
  Style: { Success: "success", Failure: "failure", Animated: "animated" },
};
