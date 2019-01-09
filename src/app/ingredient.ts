import { Unit } from "./unit";

export class Ingredient {
  id: string;
  name: string;
  amount: number;
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
    this.amount = 0;
  }

  acceptsUnit(unit: string): boolean {
    return (
      this.acceptedUnits.filter(accepted => accepted.name === unit).length > 0
    );
  }

  addAmount(amount: number, unit: string) {
    if (!this.acceptsUnit(unit)) throw new Error("Unit not excepted!");
    const rate = this.acceptedUnits.filter(
      accepted => accepted.name === unit
    )[0].rate;
    this.amount += amount * rate;
  }
  decreaseAmount(amount: number, unit: string) {
    this.addAmount(-1 * amount, unit);
  }
  toString() {
    return `${this.amount}${this.defaultUnit} ${this.name}`;
  }
}
