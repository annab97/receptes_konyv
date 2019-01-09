import { Component, OnInit } from "@angular/core";
import { RecipeService } from "../recipe.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Recipe } from "../recipe";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-recipe-details",
  templateUrl: "./recipe-details.component.html",
  styleUrls: ["./recipe-details.component.scss"]
})
export class RecipeDetailsComponent implements OnInit {
  recipe = new Recipe();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService
  ) {}

  ngOnInit(): void {
    this.getRecipe();
  }

  getRecipe(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.recipeService.getRecipe(id).subscribe(recipe => {
      this.recipe = recipe;
      console.log(recipe);
    });
  }

  editRecipe(): void {
    this.router.navigate([`/recipe/${this.recipe.id}/edit`]);
  }

  addToListClicked(): void {
    this.shoppingListService.addRecipe(this.recipe);
  }

  inShoppingList(): boolean {
    return this.shoppingListService.hasRecipe(this.recipe);
  }

  timesInShoppingList(): number {
    return this.shoppingListService.getTimesOfRecipe(this.recipe);
  }

  downArrowClicked() {
    this.shoppingListService.removeRecipe(this.recipe);
  }

  upArrowClicked() {
    this.shoppingListService.addRecipe(this.recipe);
  }
}
