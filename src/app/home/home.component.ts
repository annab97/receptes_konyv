import { Component, OnInit } from "@angular/core";
import { Category } from "../category";
import { Router } from "@angular/router";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  onCategoryClick(category: Category) {
    this.router.navigate(["/recipes", { category: category.code }]);
  }
  constructor(private router: Router, private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeService
      .getCategories()
      .subscribe(categories => (this.categories = categories));
  }
}
