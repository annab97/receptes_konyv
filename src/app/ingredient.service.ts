import { Injectable } from "@angular/core";
import { OneDBService } from "./one-db.service";
import { IngredientTemplate } from "./ingredient.template";

@Injectable({
  providedIn: "root"
})
export class IngredientService {
  ingredientSource = new OneDBService();
  constructor() {}
  async isIngredientStringValid(text: string): Promise<boolean> {
    let found = (await this.ingredientSource.getIngredientTemplates()).filter(
      template => template.stringMatchesTemplate(text)
    );
    return found.length > 0;
  }
  getIngredientFromString = async (text: string) => {
    let found = (await this.ingredientSource.getIngredientTemplates()).filter(
      template => template.stringMatchesTemplate(text)
    );
    const amount = text.match(/^(\d+[\.,\,]\d+)|^(\d+)/)[0];
    const unit = text.slice(amount.length, text.length).split(" ")[0];
    const name = text.slice(amount.length, text.length).split(" ")[1];
    return found[0].getIngredient(Number(amount), unit);
  };

  async newIngredientTemplate(ingredient: IngredientTemplate) {
    await this.ingredientSource.newIngredient(ingredient);
  }
}
