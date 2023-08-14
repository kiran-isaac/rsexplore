import { ItemInDir } from "../../Dir";

export enum SortMode {
    Size,
    Name,
}

export function sort(mode: SortMode, ascending: boolean, files: ItemInDir[]) : ItemInDir[] {
    if (mode == SortMode.Size) {
        files.sort((a, b) => {
            if (ascending) {
                return a.size - b.size;
            } else {
                return b.size - a.size;
            }
        });
    } else if (mode == SortMode.Name) {
        files.sort((a, b) => {
            if (ascending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
    } else {
        throw new Error("Unknown sort mode");
    }
    return files;
}