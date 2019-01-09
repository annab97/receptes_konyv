import { Component, OnInit } from "@angular/core";
import { OneDBService } from "../one-db.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-one-dblogin",
  templateUrl: "./one-dblogin.component.html",
  styleUrls: ["./one-dblogin.component.css"]
})
export class OneDBLoginComponent implements OnInit {
  oneDBLogin;
  constructor(
    private oneDBService: OneDBService,
    private sanitizer: DomSanitizer
  ) {
    const oneDB = oneDBService.getOneDB();
    this.oneDBLogin = sanitizer.bypassSecurityTrustHtml(
      oneDB.loginForm("simple")
    );
  }

  ngOnInit() {}
}
