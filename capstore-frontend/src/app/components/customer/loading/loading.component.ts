import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from 'src/app/models/loggingService';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  productId: number;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private logger : LoggingService) {
    this.route.params.subscribe(params => {
      this.logger.logStatus("Loading the product details of the product ");
      this.productId = params['prodId'];
    })
  }

  ngOnInit() {
    setTimeout(() => { this.router.navigate(["/Customer/productDetails/", this.productId]) }, 0);
  }

}
