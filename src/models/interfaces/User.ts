import { Plant } from "./PlantInterface";

export interface User {
  id?: string;
  email: string;
  password: string;
  role: string;
  plants?: Plant[];
}
