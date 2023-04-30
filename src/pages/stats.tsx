import {Header} from "@/components/Header";
import {Box} from "@chakra-ui/react";
import cytoscape from 'cytoscape'
import {useEffect, useRef} from "react";
import {prisma} from "@/lib/prisma";
import {Node} from "@prisma/client";

export default function Home({elements}: any) {
    const graphRef = useRef(null);

    const drawGraph = () => {
        const cy = cytoscape({
            container: graphRef.current,
            elements: elements,
            style: [{
                selector: '.hasLabel',
                css: {
                    'label': (ele: any) => {
                        if(ele.isNode()) return ele.data('id');
                    }
                }
            }
            ],
        });
        cy.elements().toggleClass('hasLabel');
    }

    useEffect(() => {
        drawGraph();
    }, [])

    return (
        <>
            <Header/>
            <Box ref={graphRef} style={{width: '100%', height: '80vh'}} id="cy" color="black">
            </Box>

        </>
    )
}

export async function getServerSideProps() {
    const nodes = await prisma.node.findMany();
    const elements = [];
    nodes.forEach((node: Node) => {
       elements.push({
           data: {
               id: node.name,
           }
       });
    });
    const edges = await prisma.edge.findMany({});
    for (const edge of edges) {
        const toNode = await prisma.node.findUnique({
            where: {
                id: edge.toNodeId,
            }
        });
        const fromNode = await prisma.node.findUnique({
            where: {
                id: edge.fromNodeId,
            }
        });
        if (toNode === null || fromNode === null) continue;
        elements.push({
            data: {
                id: 'edge' + edge.id,
                source: fromNode.name,
                target: toNode.name,
            }
        })
    }
    return {
        props: {
            elements
        }
    };
}