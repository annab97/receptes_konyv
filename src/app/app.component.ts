import { Component } from "@angular/core";
import { Category } from "./category";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  searchValue = "";
}
