export type Variant = {
  id: string;
  experiment_id: string;
  name: string;
  weight: string;
};

export type Assignment = {
  id: string;
  experiment_id: string;
  anonymous_id: string;
  variant_id: string;
  assigned_at: Date;
};
