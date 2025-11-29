class Graph {
    private adj : number[][];
    public constructor(vertices:number) {
        this.adj = Array.from({ length: vertices }, () => []) as any;
    }

    // Function to add an edge between two vertices
    addEdge(u:number, v:number, w:number) {
        this.adj[u].push([v,w]);    // not functional, array is assumed to be 2D
        this.adj[v].push([u,w]);
    }

    displayAdjList() {
        for (let i = 0; i < this.adj.length; i++) {
            let line = i + ": ";
            for (let j of this.adj[i]) {
                line += `{${j[0]}, ${j[1]}} `;
            }
            console.log(line);
        }
    }
}

function main() {
    // Create a graph with 3 vertices and 3 edges
    let V = 3;
    let graph = new Graph(3);

    // Now add edges one by one
    graph.addEdge(1, 0, 4);
    graph.addEdge(1, 2, 3);
    graph.addEdge(2, 0, 1);

    console.log("Adjacency List Representation:");
    graph.displayAdjList();
}

main();
