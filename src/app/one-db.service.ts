import { Injectable } from "@angular/core";
import { Client } from "onedb-client";
import { Category } from "./category";
import { Recipe } from "./recipe";
import { IngredientTemplate } from "./ingredient.template";
import { Ingredient } from "./ingredient";
import { Unit } from "./unit";
import { plainToClass } from "class-transformer";

@Injectable({
  providedIn: "root"
})
export class OneDBService {
  private units: Unit[];
  private ingredients: Ingredient[];
  private listeners = [];
  private categories: Category[];
  private recipes: Recipe[];
  private ingredientTemplates: IngredientTemplate[];
  private SESSION_KEY = "session";
  private previousSession = JSON.parse(
    localStorage.getItem(this.SESSION_KEY) || "null"
  );
  private onedb = new Client({
    hosts: this.previousSession,
    scope: [
      "receptes_konyv:read",
      "receptes_konyv:create",
      "receptes_konyv:write"
    ],
    onLogin: instance => {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.onedb.hosts));
      if (instance === this.onedb.hosts.primary) {
        if (instance.user) {
          // User is logging in
          this.startApp();
        } else {
          // User is logging out
          this.endApp();
        }
      }
    }
  });
  constructor() {}
  getOneDB(): Client {
    console.log(this.onedb);
    return this.onedb;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }
  startApp() {
    console.log("Logged in");
    //this.loadPageData();
    this.listeners.forEach(listener => listener.appStarted());
  }
  endApp() {
    console.log("Logged out");
  }

  private async loadEntities(table: string, type): Promise<any[]> {
    try {
      /*var query = {
      "info.created_by": this.onedb.hosts.primary.user.$.id,
      limit: 1,
      sort: "info.created:descending"
    };*/
      const response = await this.onedb.list("receptes_konyv", table, {});
      console.log(response);
      response.items.forEach(
        responseItem => (responseItem.id = responseItem.$.id)
      );
      const withType = response.items.map(responseItem =>
        plainToClass(type, responseItem)
      );
      return withType;
    } catch (e) {
      console.log(e);
    }
  }

  private async loadEntity(table: string, type, id: string): Promise<any> {
    try {
      const response = await this.onedb.get("receptes_konyv", table, id);
      console.log(response);
      response.id = id;
      const withType = plainToClass(type, response);
      return withType;
    } catch (e) {
      console.log(e);
    }
  }
  private async loadPageData() {
    await this.loadCategories();
    await this.loadIngredientTemplates();
    await this.loadRecipes();
  }

  private resolveReference(type: string, id: string) {
    let list = [];
    switch (type) {
      case "unit":
        list = this.units;
        break;
      case "ingredient":
        list = this.ingredients;
        break;
      case "category":
        list = this.categories;
        break;
    }
    const found = list.filter(item => item.$.id === id);
    if (found.length <= 0) {
      throw new Error(`Cannot resolve reference with id: ${id}`);
    }
    return found[0];
  }

  private resolveReferences(dbitem) {
    for (const property in dbitem) {
      if (typeof dbitem[property] === "string") continue;
      else if (dbitem[property]["$ref"]) {
        const value: string = dbitem[property]["$ref"];
        const type = value.split("/")[3];
        const id = value.split("/")[4];
        dbitem[property] = this.resolveReference(type, id);
      } else this.resolveReferences(dbitem[property]);
    }
  }

  private async loadUnits() {
    this.units = await this.loadEntities("unit", Unit);
  }
  private async loadIngredients() {
    await this.loadUnits();
    this.ingredients = await this.loadEntities("ingredient", Ingredient);
    this.resolveReferences(this.ingredients);
  }

  private async loadCategories() {
    this.categories = await this.loadEntities("category", Category);
  }
  private async loadIngredientTemplates() {
    await this.loadUnits();
    this.ingredientTemplates = await this.loadEntities(
      "ingredientTemplate",
      IngredientTemplate
    );
    this.resolveReferences(this.ingredientTemplates);
  }

  private async loadRecipes() {
    await this.loadCategories();
    await this.loadIngredients();
    this.recipes = await this.loadEntities("recipe", Recipe);
    this.resolveReferences(this.recipes);
  }

  async getCategories(): Promise<Category[]> {
    if (this.categories) return this.categories;
    await this.loadCategories();
    return this.categories;
  }

  async getRecipe(id: string): Promise<Recipe> {
    await this.loadUnits();
    const recipe = await this.loadEntity("recipe", Recipe, id);
    recipe.category.id = recipe.category.$.id;
    recipe.category = plainToClass(Category, recipe.category);
    recipe.contains = recipe.contains.map(ingredient =>
      plainToClass(Ingredient, ingredient)
    );
    this.resolveReferences(recipe);
    return recipe;
  }
  async getRecipes(): Promise<Recipe[]> {
    if (this.recipes) return this.recipes;
    await this.loadRecipes();
    return this.recipes;
  }
  async getIngredientTemplates(): Promise<IngredientTemplate[]> {
    if (this.ingredientTemplates) return this.ingredientTemplates;
    await this.loadIngredientTemplates();
    return this.ingredientTemplates;
  }

  async addRecipe(recipe: Recipe) {
    delete recipe.id;
    delete recipe.category.id;
    recipe.contains.forEach(ingredient => {
      delete ingredient.id;
      ingredient.acceptedUnits.forEach(unit => delete unit.id);
    });
    console.log(recipe);
    await this.onedb.create("receptes_konyv", "recipe", recipe);
  }

  async modifyRecipe(recipe: Recipe) {
    const recipeany = recipe as any;
    const id = recipeany.id;
    delete recipeany.id;
    recipeany.category.$.id = recipeany.category.id;
    delete recipeany.category.id;
    recipeany.contains.forEach(ingredient => {
      if (ingredient.$) ingredient.$.id = ingredient.id;
      delete ingredient.id;
      ingredient.acceptedUnits.forEach(unit => {
        unit.$.id = unit.id;
        delete unit.id;
      });
    });
    console.log(recipe);
    await this.onedb.update("receptes_konyv", "recipe", id, recipe);
    recipe.id = id;
    await this.loadCategories();
    await this.loadIngredients();
  }

  async newIngredient(ingredient: IngredientTemplate): Promise<any> {
    delete ingredient.id;
    ingredient.acceptedUnits.forEach(unit => {
      delete unit.id;
    });
    await this.onedb.create("receptes_konyv", "ingredientTemplate", ingredient);
  }
}
