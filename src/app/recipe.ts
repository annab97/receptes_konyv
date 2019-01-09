import { Category } from "./category";
import { Ingredient } from "./ingredient";

export class Recipe {
  id: string;
  name: string;
  category: Category;
  contains: Ingredient[] = [];
  link: string;
  experiences: string;
  constructor() {
    this.name = "";
    this.link = "";
    this.experiences = "";
  }
}
