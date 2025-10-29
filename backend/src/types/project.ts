export interface Project {
  id?: number;
  name: string;
  description: string;
  image_urls: string[];
  created_at?: Date;
  updated_at?: Date;
}
