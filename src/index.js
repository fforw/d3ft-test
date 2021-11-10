import Color from "./Color";


const flextree = require('d3-flextree').flextree;
const layout = flextree({
    nodeSize: node => ([ node.data.size[0] + 10, node.data.size[1] + 40]),
    spacing: 10
});

import domready from "domready"
// noinspection ES6UnusedImports
import STYLE from "./style.css"
import AABB from "./AABB";

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

let ctx, canvas, counter = 0;


function newNode()
{
    return {
        id: "n-" + counter++,
        color: Color.fromHSL(Math.random()/6 - 1/12, 0.5, 0.7).toRGBHex(),
        size: [
            0 | (30 + (Math.random() * 90)),
            0 | (30  + Math.random() * 200)
        ],
        children: []
    }
}

function randomData()
{
    const root = newNode();

    const linear = [root];

    const num = 10 + Math.random() * 20;

    for (let i=0; i < num; i++)
    {
        const choice = linear[0 | Math.random() * linear.length]
        const node = newNode();
        choice.children.push(node)
        linear.push(node)

    }
    return root;
}


domready(
    () => {
        const tree = layout.hierarchy(randomData());
        layout(tree);

        const aabb = new AABB();

        tree.each(node => {

            aabb.add(node.x,node.y)

            const { size } = node.data;
            aabb.add(node.x + size[0], node.y + size[1])

        });

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const { width : w, height : h } = aabb;

        const width = h + 20;
        const height = w + 20;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0,0, width, height);

        //console.log("NODE", tree.extents, aabb)

        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2

        const getRotatedX = node => 10 - aabb.minY + node.y;
        const getRotatedY = node => 10 + aabb.maxX - node.x - node.data.size[0];

        tree.each(node => {


            const { size, color, id } = node.data;

            ctx.fillStyle = color;

            //ctx.fillRect(width/2 + node.y, height/2 - node.x - size[0], size[1], size[0])

            const x = getRotatedX(node);
            const y = getRotatedY(node);

            ctx.fillRect(x, y,  size[1], size[0])
            ctx.fillStyle = "#000"
            ctx.fillText(id, x + 10, y + 20)

            const portX = x;
            const portY = y + size[0]/2;

            const { parent, children } = node;
            if (parent)
            {
                const parentX = getRotatedX(parent) + parent.data.size[1];
                const parentY = getRotatedY(parent);

                ctx.beginPath();
                ctx.moveTo(portX, portY)
                ctx.lineTo( parent.children.length > 1 ? (portX + parentX)/2 : parentX, portY )
                ctx.stroke()
            }

            if (children && children.length > 1)
            {
                const first = children[0];
                const last = children[children.length - 1];
                const firstX = getRotatedX(first);
                const firstY = getRotatedY(first) + first.data.size[0]/2;
                const lastY = getRotatedY(last) + last.data.size[0]/2;

                const portX = x  + node.data.size[1];

                const midX = (portX + firstX)/2;

                ctx.beginPath();
                ctx.moveTo(midX, firstY)
                ctx.lineTo(midX, lastY)

                ctx.moveTo(portX, portY)
                ctx.lineTo(midX, portY)
                ctx.stroke()
            }

        });

    }
);
