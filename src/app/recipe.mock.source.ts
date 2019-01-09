import { Category } from "./category";
import { Recipe } from "./recipe";
import { Ingredient } from "./ingredient";
import { IngredientTemplate } from "./ingredient.template";

export class RecipeMockSource {
  categories: Category[] = [
    { id: "1", name: "Főételek", code: "maindish" },
    { id: "2", name: "Rágcsák", code: "snacks" },
    { id: "3", name: "Muffinok", code: "cupcakes" },
    { id: "4", name: "Egyéb desszertek", code: "desserts" }
  ];
  recipes: Recipe[] = [
    {
      id: "1",
      name: "Mézeskalács",
      category: this.categories[3],
      contains: [
        new Ingredient("liszt", "kg", [{ id: "1", name: "kg", rate: 1 }])
      ],
      link: "http://mezeskalacs.info/recept/mezeskalacs-haziko/",
      experiences: ""
    }
  ];
  ingredientTemplates: IngredientTemplate[] = [
    new IngredientTemplate("liszt", "kg", [{ id: "2", name: "kg", rate: 1 }])
  ];

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }
  async getRecipes(): Promise<Recipe[]> {
    return this.recipes;
  }
  async getIngredientTemplates(): Promise<IngredientTemplate[]> {
    return this.ingredientTemplates;
  }

  addRecipe(recipe: Recipe): any {
    recipe.id = String(this.recipes.length + 1);
    this.recipes.push(recipe);
  }
}
