import React, {useState} from "react";
import classes from "./Upload.module.css";

const Upload = () => {
    const [elements, setElements] = useState([]);

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
        elements[id].fill = 'red';
        setElements([...elements])
    }

    return (
        <div>
            <svg onClick={svgClick} xmlns="http://www.w3.org/2000/svg" version="1.1" width="911px"
                 height="277px" viewBox="-0.5 -0.5 911 277">
                {elements.map((el) =>
                    (<ellipse dataid={el.id} key={el.id} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} fill={el.fill} stroke={el.stroke} cursor='pointer'/>))
                }
            </svg>
            <input className={classes.myUpload} type="file" accept=".svg" onChange={handleFileChange} />
        </div>
    );
};
export default Upload;
