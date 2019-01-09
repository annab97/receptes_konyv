import { Component, OnInit } from "@angular/core";
import { Ingredient } from "../ingredient";
import { Recipe } from "../recipe";
import { ShoppingListService } from "../shopping-list.service";
@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.scss"]
})
export class ShoppingListComponent implements OnInit {
  list: Ingredient[] = [];
  recipes: { recipe: Recipe; times: number }[] = [];
  constructor(private shoppingService: ShoppingListService) {}

  ngOnInit() {
    this.updateList();
  }

  updateList() {
    this.shoppingService.init().then(() => {
      this.list = this.shoppingService.getList();
      this.recipes = this.shoppingService.getRecipes();
    });
  }

  downArrowClicked(recipe: { recipe: Recipe; times: number }) {
    this.shoppingService.removeRecipe(recipe.recipe);
    this.updateList();
  }

  upArrowClicked(recipe: { recipe: Recipe; times: number }) {
    this.shoppingService.addRecipe(recipe.recipe);
    this.updateList();
  }
  clearList() {
    this.shoppingService.clearList();
    this.updateList();
  }

  listIsEmpty(): boolean {
    return this.recipes.length === 0;
  }
  print() {
    window.print();
  }
}
