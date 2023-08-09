import { ReactElement } from "react";
import "./styles/bar.scss";


type Path = string[];

interface BarProps {
    cwd: Path;
    setCwd: React.Dispatch<React.SetStateAction<Path>>;
}

function goBack(cwd: Path, setCwd: React.Dispatch<React.SetStateAction<Path>>) {
    // copy the array and remove the last element
    let split = [...cwd];
    split.pop();
    
    console.log("switching to : ", split);

    setCwd(split);
}

const BackButton: React.FC<BarProps> = ({ cwd, setCwd }) => {
    return cwd.length >= 2 ? <h2 className="clickable" id="back" onClick = {() => goBack(cwd, setCwd)}>&#8647;</h2> : <h2 id="back">&#8647;</h2>; 
}

const SelectorBar : React.FC<BarProps> = ({ cwd, setCwd }) => {
    let options : ReactElement[] = []

    for (let i = 0; i < cwd.length; i++) {
        let optionsLocal = cwd.slice(0, i+1);
        options.push(<div key={i}><li key={i} onClick={() => {console.log("GOTO: ", [...optionsLocal]); setCwd([...optionsLocal])}}>{cwd[i]}</li>|</div>)
    }

    return <div id="CWDUL"><ul>
        {options}
    </ul></div>
}

export const Bar: React.FC<BarProps> = ({ cwd, setCwd }) => {
    return (
        <div id="bar">
            <h1>RS Explore</h1>
            <BackButton cwd={cwd} setCwd={setCwd} />
            <SelectorBar cwd={cwd} setCwd={setCwd} />
            <div id="key">
                <h4>Name</h4>
                <h4>Size</h4>
            </div>
            <hr></hr>
        </div>
    );
}
