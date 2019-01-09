import { Component, OnInit } from "@angular/core";
import { Recipe } from "../recipe";
import { RecipeService } from "../recipe.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap, filter, map } from "rxjs/operators";
import { Observable, pipe } from "rxjs";
@Component({
  selector: "app-list-recipes",
  templateUrl: "./list-recipes.component.html",
  styleUrls: ["./list-recipes.component.css"]
})
export class ListRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.selectRecipes().subscribe(selected => {
      this.recipes = selected;
      console.log(selected);
    });
  }
  selectRecipes(): Observable<Recipe[]> {
    let allRecipes = this.recipeService.getRecipes();
    let categoryCode: string;
    let searchValue: string;

    let selected = this.route.paramMap.pipe(
      switchMap(params => {
        let selected = allRecipes;
        if (params.has("category"))
          selected = selected.pipe(
            map(recipes =>
              recipes.filter(
                recipe => recipe.category.code === params.get("category")
              )
            )
          );
        if (params.has("contains"))
          selected = selected.pipe(
            map(recipes =>
              recipes.filter(recipe =>
                recipe.name
                  .toUpperCase()
                  .includes(params.get("contains").toUpperCase())
              )
            )
          );
        return selected;
      })
    );
    return selected;
  }
}
