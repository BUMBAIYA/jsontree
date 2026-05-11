import { getCollapsedGraphState } from "@/core/graph/getCollapsedGraphState";
import {
  GraphWorkerRequest,
  GraphWorkerResponse,
} from "@/core/graph/workerTypes";
import { parser } from "@/core/json/jsonParser";

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 16);
  });

const postWorkerMessage = (message: GraphWorkerResponse) => {
  self.postMessage(message);
};

self.addEventListener("message", (event: MessageEvent<GraphWorkerRequest>) => {
  const request = event.data;

  if (request.type !== "BUILD_GRAPH") return;

  const { jobId, json, chunkSize, autoCollapseThreshold } = request;

  void (async () => {
    try {
      const { nodes, edges } = parser(json);
      const largeGraphMode = nodes.length > autoCollapseThreshold;
      const collapsedStates = largeGraphMode
        ? getCollapsedGraphState(nodes, edges)
        : {
            collapsedParents: [],
            collapsedNodes: [],
            collapsedEdges: [],
            graphCollapsed: false,
          };

      postWorkerMessage({
        type: "GRAPH_START",
        jobId,
        totalNodes: nodes.length,
        totalEdges: edges.length,
        largeGraphMode,
        ...collapsedStates,
      });

      const maxLength = Math.max(nodes.length, edges.length);
      if (maxLength === 0) {
        postWorkerMessage({
          type: "GRAPH_CHUNK",
          jobId,
          nodes: [],
          edges: [],
          loadedNodes: 0,
          loadedEdges: 0,
          done: true,
        });
        return;
      }

      for (let start = 0; start < maxLength; start += chunkSize) {
        const end = start + chunkSize;
        const done = end >= maxLength;

        postWorkerMessage({
          type: "GRAPH_CHUNK",
          jobId,
          nodes: nodes.slice(start, end),
          edges: edges.slice(start, end),
          loadedNodes: Math.min(end, nodes.length),
          loadedEdges: Math.min(end, edges.length),
          done,
        });

        if (!done) {
          await waitForNextFrame();
        }
      }
    } catch (error: any) {
      postWorkerMessage({
        type: "GRAPH_ERROR",
        jobId,
        message: error?.message || "Failed to build graph",
      });
    }
  })();
});
