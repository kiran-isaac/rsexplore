import { useState } from "react";
import { ItemInDir } from "../../Dir";
import { SortMode, sort } from "./sort";

interface SortButtonProps {
    dir: ItemInDir[];
    setDir: (newDir: ItemInDir[]) => void;
    sortType: SortMode;
}

export const SortButton: React.FC<SortButtonProps> = ({ dir, setDir, sortType }) => {
    enum SortButtonStateOptions {
        None,
        Ascending, 
        Descending
    }

    function GetButtonChar() {
        switch (currentState) {
            case SortButtonStateOptions.None:
                return "-";
            case SortButtonStateOptions.Ascending:
                return "▲";
            case SortButtonStateOptions.Descending:
                return "▼";
        }
    }
    
    const [currentState, setCurrentState] = useState<SortButtonStateOptions>(0);
    
    const SortButtonPress = () => {
        switch (currentState) {
            case SortButtonStateOptions.None:
                setCurrentState(SortButtonStateOptions.Ascending);
                break;
            case SortButtonStateOptions.Ascending:
                setCurrentState(SortButtonStateOptions.Descending);
                break;
            case SortButtonStateOptions.Descending:
                setCurrentState(SortButtonStateOptions.Ascending);
                break;
        }

        setDir(sort(sortType, currentState == SortButtonStateOptions.Ascending, dir));
        console.log("sorting by : ", sortType);
        console.log(dir);
    };

    return <button onClick={SortButtonPress}>{GetButtonChar()}</button>;
}