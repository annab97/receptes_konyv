export class Category {
  id: string;
  name: string;
  code: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.code = name;
  }
}
