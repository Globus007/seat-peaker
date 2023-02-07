import React, {useState} from "react";
import classes from "./Upload.module.css";

const Upload = () => {
    const [elements, setElements] = useState([]);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [selection, setSelection] = useState({top: 0, left: 0, width: 0, height: 0});
    const [activeSelection, setActiveSelection] = useState(false);

    const handleFileChange = (event) => {
        const svgFile = event.target.files[0];

        const reader = new FileReader();
        reader.readAsText(svgFile);

        reader.onloadend = function () {
            const result = String(reader.result);
            const arr = result.match(/<ellipse.+?\/>/gm);
            const newElements = arr.map((ellipse, index) => {
                return {
                    id: index,
                    cx: Number(ellipse.match(/cx="\d+"/gm)?.pop()?.match(/\d+/)),
                    cy: Number(ellipse.match(/cy="\d+"/gm)?.pop()?.match(/\d+/)),
                    rx: Number(ellipse.match(/rx="\d+"/gm)?.pop()?.match(/\d+/)),
                    ry: Number(ellipse.match(/ry="\d+"/gm)?.pop()?.match(/\d+/)),
                    fill: 'white',
                    stroke: 'black'
                };
            })
            setElements([...elements, ...newElements])
        }
    };

    const onMouseMoveHandler = event => {
        if(!activeSelection)  {
            return
        }

        const x = event.pageX;
        const y = event.pageY;

        const width = Math.abs(x - coords.x);
        const height = Math.abs(y - coords.y);
        const top = Math.min(coords.y, y);
        const left = Math.min(coords.x, x);

        setSelection({top, left, width, height})
    };

    const onMouseDownHandler = (event) => {
        const x = event.pageX;
        const y = event.pageY;
        const width = 0;
        const height = 0;

        setSelection({left: x, top: y, width, height});
        setCoords({x, y});
        setActiveSelection(true);
    }

    const clearSelection = () => {
        elements.forEach(el=> el.isActive = false);
        setElements([...elements]);
    }

    const onMouseUpHandler = (event) => {
        setActiveSelection(false)

        const endX = event.pageX
        const endY = event.pageY

        elements.forEach(el => {
            const xStart = Math.min(coords.x, endX);
            const xEnd = Math.max(coords.x, endX);
            const yStart = Math.min(coords.y, endY);
            const yEnd = Math.max(coords.y, endY);

            if (
                xStart - el.rx <= el.cx && el.cx <= xEnd + el.rx &&
                yStart - el.ry <= el.cy && el.cy <= yEnd + el.ry
            ) {
                el.isActive = !el.isActive;
            }
        })
        setElements([...elements]);
    }

    return (
        <div>
            <div onMouseUp={onMouseUpHandler}
                 onMouseMove={onMouseMoveHandler}
                 onMouseDown={onMouseDownHandler}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1" width="911px"
                    height="277px" viewBox="-0.5 -0.5 911 277">
                    {elements.map((el) =>
                        (<ellipse dataid={el.id} key={el.id} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry}
                                  fill={el.isActive ? 'red' : 'white'} stroke={el.stroke} cursor='pointer'/>))
                    }
                </svg>
                <div
                    style={
                        {
                            top: selection.top,
                            left: selection.left,
                            height: selection.height,
                            width: selection.width,
                        }}
                    className={[activeSelection ? classes.visible : '', classes.selection].join(' ')}
                ></div>

            </div>
            <input className={classes.myUpload} type="file" accept=".svg" onChange={handleFileChange}/>
            <button onClick={clearSelection}>Clear selection</button>
        </div>
    );
};
export default Upload;
