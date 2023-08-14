import { ReactElement } from "react";
import "./styles/bar.scss";
import { ItemInDir } from "./Dir";
import { SortMode } from "./Bar/sort/sort";
import { SortButton } from "./Bar/sort/SortButton";

type Path = string[];

const BackButton: React.FC<{
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
}> = ({ cwd, setCwd }) => {
    function goBack(cwd: Path, setCwd: React.Dispatch<React.SetStateAction<Path>>) {
        // copy the array and remove the last element
        let split = [...cwd];
        split.pop();
        
        console.log("switching to : ", split);
    
        setCwd(split);
    }

    return cwd.length >= 2 ? <h2 className="clickable" id="back" onClick = {() => goBack(cwd, setCwd)}>&#8647;</h2> : <h2 id="back">&#8647;</h2>; 
}

const SelectorBar : React.FC<{
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
}> = ({ cwd, setCwd }) => {
    let options : ReactElement[] = []

    for (let i = 0; i < cwd.length; i++) {
        let optionsLocal = cwd.slice(0, i+1);
        options.push(<div key={i}><li key={i} onClick={() => {console.log("GOTO: ", [...optionsLocal]); setCwd([...optionsLocal])}}>{cwd[i]}</li>|</div>)
    }

    return <div id="CWDUL"><ul>
        {options}
    </ul></div>
}

export const Bar: React.FC<{
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
    dir: ItemInDir[];
    setDir: (newDir: ItemInDir[]) => void;
}> = ({ cwd, setCwd, dir, setDir }) => {
    return (
        <div id="bar">
            <h1>RS Explore</h1>
            <BackButton cwd={cwd} setCwd={setCwd} />
            <SelectorBar cwd={cwd} setCwd={setCwd} />
            <div id="key">
                <div><p>Name</p><SortButton dir={dir} setDir={setDir} sortType={SortMode.Name}/></div>
                <div><p>Size</p><SortButton dir={dir} setDir={setDir} sortType={SortMode.Size}/></div>
            </div>
            <hr></hr>
        </div>
    );
}
