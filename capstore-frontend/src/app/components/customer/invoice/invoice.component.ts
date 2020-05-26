import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UserService1Service } from 'src/app/services/user-service1.service';
//  import * as html2pdf from 'html2pdf.js' ;
import { Order } from 'src/app/models/Order';
import { Transaction } from 'src/app/models/transaction';
import { Product } from 'src/app/models/product';
import { Address } from 'src/app/models/address';
import { CustomerDetails } from 'src/app/models/customerDetails.model';
import { LoggingService } from 'src/app/models/loggingService';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  showInvoice:boolean=false;
  todaysDate = new Date();
  products:Product;
  transactionId:number;
  addresses:Address;
  customers:CustomerDetails;
  orders:Order;
  transactions:Transaction;
  constructor(private route:ActivatedRoute,private userService:UserService1Service,private router:Router, private logger: LoggingService) { 
    this.route.params.subscribe(params=>{
      this.transactionId=params['data']

  })

  }

  ngOnInit() {
    this.userService.getTransaction(this.transactionId).subscribe(data=>{this.handler(data);},
    err=>{
      console.log(err.stack);
    }
    )
    this.userService.getOrders(this.transactionId).subscribe(data=>{
      
      this.handler1(data);
      this.logger.logStatus(' Get all the orders for the transaction successfully');},
    err=>{
      console.log(err.stack);
    }
    )
    this.userService.getProduct(this.transactionId).subscribe(data=>{
     
      this.handler2(data);
      this.logger.logStatus(' Got all the products for the transaction successfully');},
    err=>{
      console.log(err.stack);
    }
    )
    this.userService.getAddress(this.transactionId).subscribe(data=>{
      this.logger.logStatus(' Got  the address details of the customer successfully');
      this.handler3(data);},
    err=>{
      console.log(err.stack);
    }
    )
    this.userService.getCustomer(this.transactionId).subscribe(data=>{
      this.logger.logStatus(' Got all the customer details successfully');
      this.handler4(data);},
    err=>{
      console.log(err.stack);
    }
    )

    setTimeout(() => {
      this.showInvoice=true;
    }, 3500);
  }
handler(data)
{
  this.transactions=data;

}
handler1(data)

{
this.orders=data;
}
handler2(data)
{
  this.products=data;
}
handler3(data)
{
  this.addresses=data;
}
handler4(data){
  this.customers=data;
}

}
