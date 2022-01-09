import { RootStore } from "../store/store";

export function cleanObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function fetcher(url: string, options?: RequestInit) {
    return fetch(url, options).then(e => e.json());
}

export function getState(): RootStore | undefined {
    try {
        return JSON.parse(localStorage.getItem('store') ?? "");
    } catch(e) {
        return undefined;
    }
}

export function saveState(state: RootStore) {
    localStorage.setItem('store', JSON.stringify(state));
}