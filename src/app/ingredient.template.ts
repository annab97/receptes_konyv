import { Ingredient } from "./ingredient";
import { Unit } from "./unit";

export class IngredientTemplate {
  id: string;
  name: string;
  defaultUnit: string;
  acceptedUnits: Unit[];

  constructor(
    name: string,
    defaulUnit: string,
    acceptedUnits: Unit[],
    id?: string
  ) {
    if (id) this.id = id;
    this.name = name;
    this.defaultUnit = defaulUnit;
    this.acceptedUnits = acceptedUnits;
  }

  acceptsUnit(unit: string): boolean {
    return (
      this.acceptedUnits.filter(accepted => accepted.name === unit).length > 0
    );
  }

  stringMatchesTemplate(text: string): boolean {
    if (text.match(/^(\d+[\.,\,]\d+)|^(\d+)/) === null) return false;
    const amount = text.match(/^(\d+[\.,\,]\d+)|^(\d+)/)[0];
    const unit = text.slice(amount.length, text.length).split(" ")[0];
    const name = text.slice(amount.length, text.length).split(" ")[1];
    if (name === undefined) {
      return false;
    }
    return name === this.name && this.acceptsUnit(unit);
  }
  getIngredient(amount: number, unit: string): Ingredient {
    const newIngredient: Ingredient = new Ingredient(
      this.name,
      this.defaultUnit,
      this.acceptedUnits
    );
    newIngredient.addAmount(Number(amount), unit);
    return newIngredient;
  }
}
