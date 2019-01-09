import { Component, NgZone } from "@angular/core";
import { Category } from "./category";
import { Router } from "@angular/router";
import { OneDBService } from "./one-db.service";
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  searchValue = "";
  dataSourceInitalizes: boolean = false;

  constructor(
    private router: Router,
    private oneDBService: OneDBService,
    public zone: NgZone
  ) {
    oneDBService.addListener({
      appStarted: () => zone.run(() => (this.dataSourceInitalizes = true))
    });
  }
  searchButtonClicked() {
    this.router.navigate(["/recipes", { contains: this.searchValue }]);
    this.searchValue = "";
  }
  shoppingListClicked() {
    this.router.navigate(["/shoppinglist"]);
  }

  newRecipe() {
    this.router.navigate(["/recipe/new"]);
  }

  newIngredient() {
    this.router.navigate(["/ingredient/new"]);
  }
}
