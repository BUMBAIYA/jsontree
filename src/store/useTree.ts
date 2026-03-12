import { create } from "zustand";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { getChildrenEdges } from "@/core/graph/getChildrenEdges";
import { getCollapsedGraphState } from "@/core/graph/getCollapsedGraphState";
import { getOutgoers } from "@/core/graph/getOutgoers";
import {
  GraphWorkerRequest,
  GraphWorkerResponse,
} from "@/core/graph/workerTypes";
import { parser } from "@/core/json/jsonParser";
import { useJson } from "@/store/useJson";
import { EdgeData, NodeData } from "@/core/type";

const AUTO_COLLAPSE_NODE_THRESHOLD = 450;
const GRAPH_WORKER_CHUNK_SIZE = 240;

let graphWorker: Worker | null = null;
let currentJobId = 0;

const resetGraphWorker = () => {
  if (graphWorker) {
    graphWorker.terminate();
    graphWorker = null;
  }
};

const getGraphWorker = (restart = false) => {
  if (typeof window === "undefined") return null;
  if (restart) resetGraphWorker();
  if (!graphWorker) {
    graphWorker = new Worker(
      new URL("../workers/graph.worker.ts", import.meta.url),
    );
  }
  return graphWorker;
};

const initialStates = {
  zoomPanPinch: null as ReactZoomPanPinchRef | null,
  direction: "RIGHT" as CanvasDirection,
  loading: true,
  loadedNodes: 0,
  totalNodes: 0,
  loadedEdges: 0,
  totalEdges: 0,
  graphCollapsed: false,
  largeGraphMode: false,
  foldNodes: false,
  fullscreen: false,
  nodes: [] as NodeData[],
  edges: [] as EdgeData[],
  collapsedNodes: [] as string[],
  collapsedEdges: [] as string[],
  collapsedParents: [] as string[],
  selectedNode: {} as NodeData,
  path: "",
  hoveredNodeId: null as string | null,
};

export type Graph = typeof initialStates;

interface GraphActions {
  setGraph: (json?: string, options?: Partial<Graph>) => void;
  setLoading: (loading: boolean) => void;
  setDirection: (direction: CanvasDirection) => void;
  setZoomPanPinch: (ref: ReactZoomPanPinchRef) => void;
  setSelectedNode: (nodeData: NodeData) => void;
  setHoveredNodeId: (nodeId: string | null) => void;
  expandNodes: (nodeId: string) => void;
  expandGraph: () => void;
  collapseNodes: (nodeId: string) => void;
  collapseGraph: () => void;
  toggleFold: (value: boolean) => void;
  toggleFullscreen: (value: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  centerOnNode: (nodeId: string) => void;
  clearGraph: () => void;
}

export const useTree = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  clearGraph: () => {
    resetGraphWorker();
    set({
      nodes: [],
      edges: [],
      collapsedParents: [],
      collapsedNodes: [],
      collapsedEdges: [],
      graphCollapsed: false,
      largeGraphMode: false,
      loadedNodes: 0,
      totalNodes: 0,
      loadedEdges: 0,
      totalEdges: 0,
      loading: false,
    });
  },
  setSelectedNode: (nodeData) => set({ selectedNode: nodeData }),
  setHoveredNodeId: (nodeId) => set({ hoveredNodeId: nodeId }),
  setGraph: (data, options) => {
    const graphContent = data ?? useJson.getState().json;
    set({
      nodes: [],
      edges: [],
      collapsedParents: [],
      collapsedNodes: [],
      collapsedEdges: [],
      graphCollapsed: false,
      largeGraphMode: false,
      loadedNodes: 0,
      totalNodes: 0,
      loadedEdges: 0,
      totalEdges: 0,
      loading: true,
      hoveredNodeId: null,
      ...options,
    });

    const worker = getGraphWorker(true);
    if (!worker) {
      const { nodes, edges } = parser(graphContent);
      const shouldAutoCollapse = nodes.length > AUTO_COLLAPSE_NODE_THRESHOLD;
      const collapsedStates = shouldAutoCollapse
        ? getCollapsedGraphState(nodes, edges)
        : {
            collapsedParents: [],
            collapsedNodes: [],
            collapsedEdges: [],
            graphCollapsed: false,
          };

      set({
        nodes,
        edges,
        ...collapsedStates,
        largeGraphMode: shouldAutoCollapse,
        loadedNodes: nodes.length,
        totalNodes: nodes.length,
        loadedEdges: edges.length,
        totalEdges: edges.length,
        loading: false,
      });
      return;
    }

    currentJobId += 1;
    const jobId = currentJobId;

    const onMessage = (event: MessageEvent<GraphWorkerResponse>) => {
      const message = event.data;
      if (message.jobId !== jobId) return;

      if (message.type === "GRAPH_START") {
        set({
          largeGraphMode: message.largeGraphMode,
          collapsedParents: message.collapsedParents,
          collapsedNodes: message.collapsedNodes,
          collapsedEdges: message.collapsedEdges,
          graphCollapsed: message.graphCollapsed,
          totalNodes: message.totalNodes,
          totalEdges: message.totalEdges,
          loadedNodes: 0,
          loadedEdges: 0,
          loading: true,
        });
        return;
      }

      if (message.type === "GRAPH_CHUNK") {
        set((state) => ({
          nodes: state.nodes.concat(message.nodes),
          edges: state.edges.concat(message.edges),
          loadedNodes: message.loadedNodes,
          loadedEdges: message.loadedEdges,
          loading: !message.done,
        }));

        if (message.done) {
          worker.removeEventListener("message", onMessage);
        }
        return;
      }

      if (message.type === "GRAPH_ERROR") {
        set({
          loading: false,
        });
        worker.removeEventListener("message", onMessage);
      }
    };

    worker.addEventListener("message", onMessage);
    const payload: GraphWorkerRequest = {
      type: "BUILD_GRAPH",
      jobId,
      json: graphContent,
      chunkSize: GRAPH_WORKER_CHUNK_SIZE,
      autoCollapseThreshold: AUTO_COLLAPSE_NODE_THRESHOLD,
    };
    worker.postMessage(payload);
  },
  setDirection: (direction = "RIGHT") => {
    set({ direction });
    setTimeout(() => get().centerView(), 200);
  },
  setLoading: (loading) => set({ loading }),
  expandNodes: (nodeId) => {
    const [childrenNodes, matchingNodes] = getOutgoers(
      nodeId,
      get().nodes,
      get().edges,
      get().collapsedParents,
    );
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    let nodesConnectedToParent = childrenEdges.reduce(
      (nodes: string[], edge) => {
        edge.from && !nodes.includes(edge.from) && nodes.push(edge.from);
        edge.to && !nodes.includes(edge.to) && nodes.push(edge.to);
        return nodes;
      },
      [],
    );
    const matchingNodesConnectedToParent = matchingNodes.filter((node) =>
      nodesConnectedToParent.includes(node),
    );
    const nodeIds = childrenNodes
      .map((node) => node.id)
      .concat(matchingNodesConnectedToParent);
    const edgeIds = childrenEdges.map((edge) => edge.id);

    const collapsedParents = get().collapsedParents.filter(
      (cp) => cp !== nodeId,
    );
    const collapsedNodes = get().collapsedNodes.filter(
      (nodeId) => !nodeIds.includes(nodeId),
    );
    const collapsedEdges = get().collapsedEdges.filter(
      (edgeId) => !edgeIds.includes(edgeId),
    );

    set({
      collapsedParents,
      collapsedNodes,
      collapsedEdges,
      graphCollapsed: !!collapsedNodes.length,
    });
  },
  collapseNodes: (nodeId) => {
    const [childrenNodes] = getOutgoers(nodeId, get().nodes, get().edges);
    const childrenEdges = getChildrenEdges(childrenNodes, get().edges);

    const nodeIds = childrenNodes.map((node) => node.id);
    const edgeIds = childrenEdges.map((edge) => edge.id);

    set({
      collapsedParents: get().collapsedParents.concat(nodeId),
      collapsedNodes: get().collapsedNodes.concat(nodeIds),
      collapsedEdges: get().collapsedEdges.concat(edgeIds),
      graphCollapsed: !!get().collapsedNodes.concat(nodeIds).length,
    });
  },
  collapseGraph: () => {
    const collapsedStates = getCollapsedGraphState(get().nodes, get().edges);
    set(collapsedStates);
  },
  expandGraph: () => {
    set({
      collapsedNodes: [],
      collapsedEdges: [],
      collapsedParents: [],
      graphCollapsed: false,
    });
  },
  zoomIn: () => {
    const zoomPanPinch = get().zoomPanPinch;
    zoomPanPinch?.setTransform(
      zoomPanPinch?.state.positionX,
      zoomPanPinch?.state.positionY,
      zoomPanPinch?.state.scale + 0.4,
    );
  },
  zoomOut: () => {
    const zoomPanPinch = get().zoomPanPinch;
    zoomPanPinch?.setTransform(
      zoomPanPinch?.state.positionX,
      zoomPanPinch?.state.positionY,
      zoomPanPinch?.state.scale - 0.4,
    );
  },
  centerView: () => {
    const zoomPanPinch = get().zoomPanPinch;
    const canvas = document.querySelector(".jsontree-canvas") as HTMLElement;
    if (zoomPanPinch && canvas) zoomPanPinch.zoomToElement(canvas);
  },
  centerOnNode: (nodeId) => {
    const zoomPanPinch = get().zoomPanPinch;
    const el = document.querySelector(
      `[data-node-id="${nodeId}"]`,
    ) as HTMLElement;
    if (zoomPanPinch && el) zoomPanPinch.zoomToElement(el);
    const node = get().nodes.find((n) => n.id === nodeId);
    if (node) get().setSelectedNode(node);
  },
  toggleFold: (foldNodes) => {
    set({ foldNodes });
    get().setGraph();
  },
  toggleFullscreen: (fullscreen) => set({ fullscreen }),
  setZoomPanPinch: (zoomPanPinch) => set({ zoomPanPinch }),
}));
