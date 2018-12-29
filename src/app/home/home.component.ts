import { Component, OnInit } from "@angular/core";
import { Category } from "../category";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [
    { name: "Főételek", href: "maindish" },
    { name: "Rágcsák", href: "snacks" },
    { name: "Muffinok", href: "cupcakes" },
    { name: "Egyéb desszertek", href: "desserts" }
  ];

  onCategoryClick(category: Category) {
    category.name = "clicked";
  }
  constructor() {}

  ngOnInit() {}
}
