import { Injectable } from "@angular/core";
import { Ingredient } from "./ingredient";
import { Recipe } from "./recipe";
import { RecipeService } from "./recipe.service";

function clone<T>(instance: T): T {
  const copy = new (instance.constructor as { new (): T })();
  Object.assign(copy, instance);
  return copy;
}

@Injectable({
  providedIn: "root"
})
export class ShoppingListService {
  recipes: { recipe: Recipe; times: number }[] = [];
  constructor(private recipeService: RecipeService) {}

  async init() {
    await this.loadRecipes();
  }

  addRecipe(recipe: Recipe) {
    let found = this.recipes.filter(r => r.recipe.id === recipe.id);
    if (found.length > 0) found[0].times++;
    else this.recipes.push({ recipe: recipe, times: 1 });
    this.updateLocalStorage();
  }
  removeRecipe(recipe: Recipe) {
    let found = this.recipes.filter(r => r.recipe.id === recipe.id);
    if (found.length > 0) {
      if (found[0].times > 1) found[0].times--;
      else {
        const index = this.recipes.indexOf(found[0]);
        this.recipes.splice(index, 1);
      }
    } else throw new Error("Recipe not found");
    this.updateLocalStorage();
  }
  clearList(): any {
    this.recipes = [];
    this.updateLocalStorage();
  }
  getRecipes(): { recipe: Recipe; times: number }[] {
    return this.recipes;
  }
  getList(): Ingredient[] {
    const ingredients: Ingredient[] = [];
    this.recipes.forEach(recipe =>
      recipe.recipe.contains.forEach(ingredient => {
        const found = ingredients.filter(i => i.name === ingredient.name);
        if (found.length > 0)
          found[0].addAmount(
            ingredient.amount * recipe.times,
            ingredient.defaultUnit
          );
        else {
          const newingredient = clone(ingredient);
          newingredient.amount = ingredient.amount * recipe.times;
          ingredients.push(newingredient);
        }
      })
    );
    return ingredients;
  }

  getTimesOfRecipe(recipe: Recipe): number {
    const found = this.recipes.filter(r => r.recipe.id === recipe.id);
    return found[0].times;
  }

  hasRecipe(recipe: Recipe): boolean {
    const found = this.recipes.filter(r => r.recipe.id === recipe.id);
    return found.length > 0;
  }
  updateLocalStorage() {
    localStorage.setItem("shoppinglist", this.stringifyList());
  }
  async loadRecipes() {
    this.recipes = [];
    const storage: { id: string; times: number }[] = JSON.parse(
      localStorage.getItem("shoppinglist")
    );
    if (!storage) return;
    for (const storageItem of storage) {
      await this.recipeService
        .getRecipe(storageItem.id)
        .forEach(recipe =>
          this.recipes.push({ recipe: recipe, times: storageItem.times })
        );
    }
  }
  stringifyList(): string {
    return JSON.stringify(
      this.recipes.map(recipe => ({
        id: recipe.recipe.id,
        times: recipe.times
      }))
    );
  }
}
