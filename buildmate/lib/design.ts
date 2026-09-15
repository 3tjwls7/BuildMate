export type Requirement = {
  id: string;
  title: string;
  description: string;
  recommended: boolean;
  options: string[];
};
export type Analysis = {
  featureName: string;
  categories: { name: string; requirements: Requirement[] }[];
};
export type Selected = { id: string; title: string; choice?: string };
export type ApiEndpoint = {
  method: string;
  path: string;
  title: string;
  authentication: string;
  authorization: string;
  validation: string[];
  request: string;
  response: string;
  errors: { status: number; code: string; description: string }[];
};
export type ApiSpec = {
  title: string;
  summary: string;
  endpoints: ApiEndpoint[];
};
export type Draft = {
  feature: string;
  analysis: Analysis;
  selected: Selected[];
  spec?: ApiSpec;
};
export const draftKey = "buildmate-draft";
