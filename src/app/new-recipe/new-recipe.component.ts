import { Component, OnInit, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { Recipe } from "../recipe";
import { Ingredient } from "../ingredient";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeService } from "../recipe.service";
import { Category } from "../category";
import { IngredientService } from "../ingredient.service";

export function linkValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
      control.value
    );
    return !valid ? { valid: { value: control.value } } : null;
  };
}

@Component({
  selector: "app-new-recipe",
  templateUrl: "./new-recipe.component.html",
  styleUrls: ["./new-recipe.component.scss"]
})
export class NewRecipeComponent implements OnInit {
  recipe: Recipe = new Recipe();
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  isAdd: boolean = true;
  newRecipeForm = new FormGroup({
    name: new FormControl(this.recipe.name, Validators.required),
    link: new FormControl(this.recipe.link, linkValidator()),
    category: new FormControl(this.recipe.category, Validators.required),
    ingredients: new FormArray([]),
    newingredient: new FormControl(""),
    experiences: new FormControl(this.recipe.experiences)
  });

  AsyncIngredientValidator = () => {
    return async (
      control: AbstractControl
    ): Promise<{ [key: string]: any } | null> => {
      const valid = await this.ingredientService.isIngredientStringValid(
        control.value
      );
      console.log("Async validation result: " + valid);
      return !valid ? { ingredientNotExists: { value: control.value } } : null;
    };
  };

  IngredientFormatValidator = () => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^(\d+[\.,\,]\d+)([^\ ,\n]+ [^\ ,\n]+)|^(\d+)([^\ ,\.,\n]+ [^,\ ,\n]+)/.test(
        control.value
      );
      console.log("Sync validation result: " + valid);
      return !valid ? { invalidFormat: { value: control.value } } : null;
    };
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.route.url.subscribe(data => (this.isAdd = data[1].path === "new"));
    if (!this.isAdd) {
      const id = this.route.snapshot.paramMap.get("id");
      this.recipeService.getRecipe(id).subscribe(recipe => {
        this.recipe = recipe;
        this.newRecipeForm.get("name").setValue(this.recipe.name);
        this.newRecipeForm.get("link").setValue(this.recipe.link);
        this.newRecipeForm.get("experiences").setValue(this.recipe.experiences);
        this.newRecipeForm.get("category").setValue(this.recipe.category.id);
        for (const ingredient of this.recipe.contains) {
          (this.newRecipeForm.get("ingredients") as FormArray).push(
            new FormControl(
              (ingredient as Ingredient).toString(),
              this.IngredientFormatValidator(),
              this.AsyncIngredientValidator()
            )
          );
          this.ingredients.push(ingredient);
        }
      });
    }
    this.recipeService
      .getCategories()
      .subscribe(data => (this.categories = data));
  }

  onSubmit() {
    this.recipe.name = (this.newRecipeForm.get("name") as FormControl).value;
    this.recipe.link = (this.newRecipeForm.get("link") as FormControl).value;
    const categoryId = (this.newRecipeForm.get("category") as FormControl)
      .value;
    this.recipe.category = this.categories.filter(
      category => category.id === categoryId
    )[0];
    this.recipe.experiences = (this.newRecipeForm.get(
      "experiences"
    ) as FormControl).value;
    this.recipe.contains = this.ingredients;
    if (this.isAdd) {
      this.recipeService
        .addRecipe(this.recipe)
        .subscribe(() => this.leavePage());
    } else {
      this.recipeService
        .modifyRecipe(this.recipe)
        .subscribe(() => this.leavePage());
    }
  }

  leavePage() {
    if (this.isAdd) {
      this.router.navigate(["/home"]);
    } else {
      this.router.navigate([`/recipe/${this.recipe.id}`]);
    }
  }

  isIngredientValidFormat(index: number): boolean {
    return !(this.newRecipeForm.get("ingredients") as FormArray)
      .at(index)
      .hasError("invalidFormat");
  }
  isIngredientExists(index: number): boolean {
    return !(this.newRecipeForm.get("ingredients") as FormArray)
      .at(index)
      .hasError("ingredientNotExists");
  }

  newIngredient() {
    const value = this.newRecipeForm.get("newingredient").value;
    this.ingredientService.isIngredientStringValid(value).then(isValid => {
      if (isValid) {
        this.ingredientService
          .getIngredientFromString(value)
          .then(ingredient => this.ingredients.push(ingredient));
        (this.newRecipeForm.get("ingredients") as FormArray).push(
          new FormControl(
            value,
            this.IngredientFormatValidator(),
            this.AsyncIngredientValidator()
          )
        );
        this.newRecipeForm.get("newingredient").setValue("");
      }
    });
  }

  onIngredientChange(index: number) {
    const value = (this.newRecipeForm.get("ingredients") as FormArray).at(index)
      .value;

    if (this.ingredientService.isIngredientStringValid(value)) {
      this.ingredientService
        .getIngredientFromString(value)
        .then(ingredient => (this.ingredients[index] = ingredient));
    }
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    (this.newRecipeForm.get("ingredients") as FormArray).removeAt(index);
  }
}
