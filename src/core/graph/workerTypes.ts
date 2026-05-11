import { EdgeData, NodeData } from "@/core/type";

export type BuildGraphRequest = {
  type: "BUILD_GRAPH";
  jobId: number;
  json: string;
  chunkSize: number;
  autoCollapseThreshold: number;
};

export type GraphWorkerStartMessage = {
  type: "GRAPH_START";
  jobId: number;
  totalNodes: number;
  totalEdges: number;
  largeGraphMode: boolean;
  collapsedParents: string[];
  collapsedNodes: string[];
  collapsedEdges: string[];
  graphCollapsed: boolean;
};

export type GraphWorkerChunkMessage = {
  type: "GRAPH_CHUNK";
  jobId: number;
  nodes: NodeData[];
  edges: EdgeData[];
  loadedNodes: number;
  loadedEdges: number;
  done: boolean;
};

export type GraphWorkerErrorMessage = {
  type: "GRAPH_ERROR";
  jobId: number;
  message: string;
};

export type GraphWorkerRequest = BuildGraphRequest;
export type GraphWorkerResponse =
  | GraphWorkerStartMessage
  | GraphWorkerChunkMessage
  | GraphWorkerErrorMessage;
