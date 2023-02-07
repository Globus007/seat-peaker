import React, {useState} from "react";
import classes from "./Upload.module.css";

const Upload = () => {
    const [elements, setElements] = useState([]);
    const [coords, setCoords] = useState({x:0, y:0});
    const blockElement = document.getElementById('blockElement');

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
        const x = event.pageX;
        const y = event.pageY;
        setCoords({x,y});

        console.log(blockElement);
        // blockElement.style.top = `${y}px`;
        // blockElement.style.left = `${x}px`;

        blockElement.style.display = 'block';
    }
    const mouseUp = (event) => {
        const endX = event.pageX
        const endY = event.pageY
        // console.log(coords)
        // console.log({endX,endY});
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

        blockElement.style.display = 'none';
    }

    const mouseMoveInner = event => {
        mouseMove({
            pageX: event.pageX,
            pageY: event.pageY
        })
    };

    const mouseUpInner = event => {
        blockElement.style.display = 'none';
    }

    const mouseMove = event => {
        const x = event.pageX;
        const y = event.pageY;
        const width = Math.abs(x - coords.x);
        const height = Math.abs(y - coords.y);

        
        blockElement.style.top = `${Math.min(coords.y, y)}px`;
        blockElement.style.left = `${Math.min(coords.x, x)}px`;
        blockElement.style.height = `${height}px`;
        blockElement.style.width = `${width}px`;
        console.log(`h: ${height}; w: ${width}`);
    };

    return (
        <div>
            <div id="blockElement" className={classes.testP} onMouseMove={mouseMoveInner} onMouseUp={mouseUpInner}></div>
            <svg onClick={svgClick} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} xmlns="http://www.w3.org/2000/svg" version="1.1" width="911px"
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
