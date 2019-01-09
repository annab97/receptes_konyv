import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl
} from "@angular/forms";
import { Unit } from "../unit";
import { IngredientService } from "../ingredient.service";
import { IngredientTemplate } from "../ingredient.template";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-ingredient",
  templateUrl: "./new-ingredient.component.html",
  styleUrls: ["./new-ingredient.component.scss"]
})
export class NewIngredientComponent implements OnInit {
  isAdd: boolean = true;
  acceptedUnits: Unit[] = [];
  newIngredientForm = new FormGroup({
    name: new FormControl("", Validators.required),
    defaultUnit: new FormControl("", Validators.required),
    acceptedUnits: new FormArray([])
  });

  UnitUniqueValidator = () => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let valid =
        this.acceptedUnits.filter(unit => unit.name === control.value).length <=
        1;
      valid =
        valid &&
        control.value != this.newIngredientForm.get("defaultUnit").value;
      return !valid ? { multitiple: { value: control.value } } : null;
    };
  };

  constructor(
    private router: Router,
    private ingredientService: IngredientService
  ) {}

  ngOnInit() {}

  isUnitNameGiven(index: number) {
    return !(this.newIngredientForm.get("acceptedUnits") as FormArray)
      .at(index)
      .get("name")
      .hasError("required");
  }

  isUnitNameUnique(index: number) {
    return !(this.newIngredientForm.get("acceptedUnits") as FormArray)
      .at(index)
      .get("name")
      .hasError("multitiple");
  }

  isUnitRateValid(index: number) {
    return (this.newIngredientForm.get("acceptedUnits") as FormArray)
      .at(index)
      .get("rate").valid;
  }

  onUnitNameChange(index: number) {
    const array = this.newIngredientForm.get("acceptedUnits") as FormArray;
    const value = array.at(index).get("name").value;
    this.acceptedUnits[index].name = value;
    array.controls.forEach(control =>
      control.get("name").updateValueAndValidity()
    );
  }

  onUnitRateChange(index: number) {
    const value = (this.newIngredientForm.get("acceptedUnits") as FormArray)
      .at(index)
      .get("rate").value;
    this.acceptedUnits[index].rate = value;
  }

  deleteUnit(index: number) {
    this.acceptedUnits.splice(index, 1);
    (this.newIngredientForm.get("acceptedUnits") as FormArray).removeAt(index);
  }

  newUnit() {
    this.acceptedUnits.push(new Unit("", 1));
    (this.newIngredientForm.get("acceptedUnits") as FormArray).push(
      new FormGroup({
        name: new FormControl("", [
          Validators.required,
          this.UnitUniqueValidator()
        ]),
        rate: new FormControl("", Validators.required)
      })
    );
  }

  onSubmit() {
    const name = this.newIngredientForm.controls.name.value;
    const defaultUnit = this.newIngredientForm.controls.defaultUnit.value;
    const it: IngredientTemplate = new IngredientTemplate(
      name,
      defaultUnit,
      this.acceptedUnits
    );

    if (this.isAdd) {
      this.ingredientService
        .newIngredientTemplate(it)
        .then(() => this.router.navigate(["/home"]));
    }
  }
}
