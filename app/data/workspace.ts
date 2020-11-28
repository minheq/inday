export type WorkspaceID = string;
// export type WorkspaceID = `wrk${string}`;

export interface Workspace {
  id: WorkspaceID;
  name: string;
  ownerID: string;
}
