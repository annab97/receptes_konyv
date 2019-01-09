import { Injectable } from "@angular/core";
import { Recipe } from "./recipe";
import { Ingredient } from "./ingredient";
import { Observable, of, from, fromEventPattern } from "rxjs";
import { Category } from "./category";
import { IngredientTemplate } from "./ingredient.template";
import { RecipeMockSource } from "./recipe.mock.source";
import { OneDBService } from "./one-db.service";
@Injectable({
  providedIn: "root"
})
export class RecipeService {
  recipeSource = new OneDBService();

  private async filterRecipe(id: string): Promise<Recipe> {
    return (await this.recipeSource.getRecipes()).find(
      recipe => recipe.id === id
    );
  }

  constructor() {}

  getRecipe(id: string): Observable<Recipe> {
    //return from(this.filterRecipe(id));
    return from(this.recipeSource.getRecipe(id));
  }

  getRecipes(): Observable<Recipe[]> {
    return from(this.recipeSource.getRecipes());
  }

  getCategories(): Observable<Category[]> {
    return from(this.recipeSource.getCategories());
  }

  addRecipe(recipe: Recipe): Observable<any> {
    return from(this.recipeSource.addRecipe(recipe));
  }

  modifyRecipe(recipe: Recipe): Observable<any> {
    return from(this.recipeSource.modifyRecipe(recipe));
  }
}
