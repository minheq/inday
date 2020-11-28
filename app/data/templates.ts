export type TemplateID = string;

export interface Template {
  id: TemplateID;
  name: string;
  description: string;
  spaceID: string;
  createdAt: Date;
  updatedAt: Date;
}
