import {Header} from "@/components/Header";
import {Box, Button, HStack, Select, Text, VStack} from "@chakra-ui/react";
import cytoscape from 'cytoscape'
import {useCallback, useEffect, useRef, useState} from "react";
import {prisma} from "@/lib/prisma";
import {Node} from "@prisma/client";
import {useRouter} from "next/router";

export default function Home({elements, nodes}: any) {
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
            }],
        });
        cy.elements().toggleClass('hasLabel');
        const layout = cy.layout({
            'name': 'circle',
        });
        layout.run();
    }

    useEffect(() => {
        drawGraph();
    }, [elements]);

    const router = useRouter();

    const [currentNode, setCurrentNode] = useState<any>(null);


    const onView = useCallback(async () => {
        await router.push('/stats/' + currentNode.id);
    }, [router, currentNode]);

    const onSelect = useCallback((evt: any) => {
        console.log(evt);
        setCurrentNode(JSON.parse(evt.target.value));
    }, [setCurrentNode])

    return (
        <>
            <Header/>
            <VStack pt="10px">
                <Text>Now you see full graph. If you want to see graph for special vertex choose it here. Graph will be drawn with depth 2.</Text>
                <Select placeholder='Select node' onChange={onSelect} >
                    {
                    nodes.map((node: any, i : number) => {
                        return <option value={JSON.stringify(node)} key={i}>{node.name}</option>
                    })
                    }
                </Select>
                <Button onClick={onView}>View new graph</Button>
            </VStack>
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
            elements, nodes
        }
    };
}