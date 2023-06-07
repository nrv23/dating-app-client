export const save = (key: string, data: string) => localStorage.setItem(key,data);
export const get = (key: string) => localStorage.getItem(key) || '';
export const remove = (key: string) =>  localStorage.removeItem(key);
