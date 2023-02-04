import React, {useState} from "react";
import classes from "./Upload.module.css";

const Upload = () => {
    const [elements, setElements] = useState([]);
    const [coords, setCoords] = useState({x:0, y:0});

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

    const svgClick = (event) => {
        const element = event.target
        if(element.nodeName !== 'ellipse') {
            return;
        }
        const id = element.attributes['dataid'].value;
        elements[id].isActive = !elements[id].isActive;
        setElements([...elements])
    }
    const mouseDown = (event) => {
        const x = event.pageX
        const y = event.pageY
        setCoords({x,y})
    }
    const mouseUp = (event) => {
        const endX = event.pageX
        const endY = event.pageY
        console.log(coords)
        console.log({endX,endY});
        elements.forEach(el => {
            const xStart = coords.x < endX ? coords.x : endX;
            const xEnd = coords.x >= endX ? coords.x : endX;
            const yStart = coords.y < endY ? coords.y : endY;
            const yEnd = coords.y >= endY ? coords.y : endY;

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
            <svg onClick={svgClick} onMouseDown={mouseDown} onMouseUp={mouseUp} xmlns="http://www.w3.org/2000/svg" version="1.1" width="911px"
                 height="277px" viewBox="-0.5 -0.5 911 277">
                {elements.map((el) =>
                    (<ellipse dataid={el.id} key={el.id} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} fill={el.isActive ? 'red': 'white'} stroke={el.stroke} cursor='pointer'/>))
                }
            </svg>
            <input className={classes.myUpload} type="file" accept=".svg" onChange={handleFileChange} />
        </div>
    );
};
export default Upload;
