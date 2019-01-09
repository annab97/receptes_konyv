export class Unit {
  id: string;
  name: string;
  rate: number;
  constructor(name: string, rate: number, id?: string) {
    if (id) this.id = id;
    this.name = name;
    this.rate = rate;
  }
}
