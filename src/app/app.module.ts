import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DemoMaterialModule } from "./material-module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ListRecipesComponent } from "./list-recipes/list-recipes.component";
import { RecipeDetailsComponent } from "./recipe-details/recipe-details.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { NewRecipeComponent } from "./new-recipe/new-recipe.component";
import { OneDBLoginComponent } from "./one-dblogin/one-dblogin.component";
import { NewIngredientComponent } from "./new-ingredient/new-ingredient.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "recipes", component: ListRecipesComponent },
  { path: "recipe/new", component: NewRecipeComponent },
  { path: "recipe/:id/edit", component: NewRecipeComponent },
  { path: "recipe/:id", component: RecipeDetailsComponent },
  { path: "shoppinglist", component: ShoppingListComponent },
  { path: "ingredient/new", component: NewIngredientComponent },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListRecipesComponent,
    RecipeDetailsComponent,
    ShoppingListComponent,
    NewRecipeComponent,
    OneDBLoginComponent,
    NewIngredientComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    DemoMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
