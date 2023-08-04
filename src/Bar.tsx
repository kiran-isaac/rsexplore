import "./styles/Bar.scss";

interface BarProps {
    cwd: string;
    setCwd: React.Dispatch<React.SetStateAction<string>>;
}

function removeLastDir(cwd: string): string {
    let split = cwd.split("\\");
    split.pop();
    return split.join("\\");
}

export const Bar: React.FC<BarProps> = ({ cwd, setCwd }) => {
    return (
        <div id="bar">
            <img className="clickable" id="back" src="src\assets\back.png" onClick={() => setCwd(cwd + "\\..")}></img>
        </div>
    );
}
