import { Component, OnInit, Input } from '@angular/core';
// import { product, Address, Coupon } from 'src/assets/model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { RaavanTeamService } from 'src/app/services/raavan-team.service';
import { CartService } from 'src/app/services/cart.service';
import { Coupon, product, Customer } from 'src/assets/model';
import { Address } from 'src/app/models/address';
import { CustomerDetails } from 'src/app/models/customerDetails.model';
import { WalletService } from 'src/app/services/wallet.service';
import { LoggingService } from 'src/app/models/loggingService';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  addressForm: FormGroup;
  quantity: number;
  orderAmount: number;
  coupons?: Coupon[];
  couponAmount: number;
  finalPrice: number;
  appliedCoupon: boolean = false;
  addNewAddress: boolean = false;
  errorMessage: string = '';
  productsList: Product[]
  productId: number = -1;
  addressList: Address[]
  selectedAddress: number = -1;
  pr: product;
  showAddressForm: boolean = false;
  submitted: boolean = false;
  selectedCoupon: String;
  cquantities = [4, 5, 6]
  statusMsg: string = ""
  invalidCoupon: string = ""
  productIdArrayForOrder: number[];
  productQuantityArrayForOrder: number[];
  totalAmount: number;
  insufficientBalance: boolean = false;
  customer: CustomerDetails;
  balance: number;
  depositeForm: FormGroup;
  cardForm: FormGroup;

  constructor(private service: RaavanTeamService, private logger : LoggingService, private cartService: CartService, private walletService: WalletService, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    
    this.route.params.subscribe(params => {
      
      this.productId = params['id'];
      this.quantity = params['quantity'];
      this.orderAmount = params['amount'];
      this.finalPrice = params['amount'];
    })
  }

  ngOnInit() {
    this.service.getCustomer("harsha").subscribe(data => this.customer = data)
    if (this.productId != 0) {
      this.service.getProductDetails(this.productId).subscribe(data => {
        this.logger.logStatus("Got the product details");
        this.pr = data
      },
        err => {
          console.log(err.error)
        });
    }
    if (this.productId == 0) {

      this.productIdArrayForOrder = this.cartService.getProductIds();
      this.productQuantityArrayForOrder = this.cartService.getProductQuantity();
      this.totalAmount = this.cartService.totalAmount;
      this.logger.logStatus("Got all the products from cart to place order");
      this.service.getCartOrders(this.productIdArrayForOrder, this.productQuantityArrayForOrder).subscribe(
        data => {
          this.productsList = data;
          for (let i in this.productsList) {
            this.productsList[i].quantity = this.productQuantityArrayForOrder[i];
          }
        },
        err => { }
      )
    }
    this.addressForm = this.formBuilder.group({
      addressLineOne: ['', Validators.required],
      addressLineTwo: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      landmark: ['', Validators.required]
    })


    this.depositeForm = this.formBuilder.group({
      addThrough: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"), Validators.min(1)]]
    });
    this.depositeForm.controls.amount.setValue(this.balance);

    this.cardForm = this.formBuilder.group({
      CardNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{16}$")]],
      Pin: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{4}$")]],
      HolderName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      Cvv: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{3}$")]],
      Month: ['', Validators.required],
      Year: ['', Validators.required]
    });

    this.selectAddress();
    this.getCoupons();
  }

  newAddress() {
    this.showAddressForm = true;
    this.selectedAddress=-1;
  }

  selectAddress() {
    this.service.getAddressByName("harsha").subscribe(data => {
      this.addressList = data;
      this.logger.logStatus("Collected the address for delivery successfully");
    });
  }

  addAddress() {
    this.submitted = true;
    if (this.addressForm.invalid) {
      return;
    }
    else {
      this.showAddressForm = false;
      this.service.addNewAddress(this.addressForm.value, "harsha").subscribe(data => {
        this.statusMsg = "Address added successfully!! Please find it in the list !!"
        this.logger.logStatus("Added new address successfully");
        setTimeout(() => {
          this.statusMsg = "";
        }, 3000);

        this.selectAddress()
      },
        err => {
          console.log(err.error)
        });
    }
  }


  getCoupons() {
 
    if (this.productId != 0) {

      this.service.getAllCouponsById(this.productId).subscribe(data => {
        this.logger.logStatus("Got the coupons applicable for product successfully");
        this.hr(data);
      }

      )
    }
    if (this.productId == 0) {
      this.service.getCoupons(this.productIdArrayForOrder).subscribe(data => {
        this.logger.logStatus("Got the coupons applicable for product successfully");
        this.hr(data);

      })
    }
  }
  hr(data) {
    this.coupons = data;
  }



  deposit() {
    this.router.navigate(['']);
  }

  pickCoupon() {
    this.service.validateCoupon(this.selectedCoupon, this.orderAmount).subscribe(data => {
      if (data == 0) {
        this.invalidCoupon = "Invalid Coupon";
        this.logger.logStatus("Selected an invalid coupon");
        setTimeout(() => {
          this.invalidCoupon = ""
        }, 3000);
      }
      else {

        this.route.params.subscribe(params => {
          this.orderAmount = params['amount'];
        })

        this.appliedCoupon = true;
        this.couponAmount = data;
        this.finalPrice = this.orderAmount - this.couponAmount;
      }
    },
      err => {
     
        this.route.params.subscribe(params => {
          this.orderAmount = params['amount'];
        })
        this.appliedCoupon = false;
        alert(err.error.errorMessage);


      });
  }




  placeOrder() {
    if (this.selectedAddress != -1) {
      if (this.customer.balance < (this.orderAmount) || this.customer.balance < this.totalAmount) {
        this.insufficientBalance = true;
      }
      else {
        if (this.productId != 0) {
          this.productIdArrayForOrder =[this.productId]
          this.productQuantityArrayForOrder = [this.quantity]
        }
      }
      this.service.placeOrder("harsha", this.productIdArrayForOrder, this.productQuantityArrayForOrder, this.orderAmount, this.selectedAddress).subscribe(data => {
        if (data != 0) {
          this.logger.logStatus("placed order successfully");
          this.router.navigate(['/Customer/invoice/', data]);
        }
      },
        err => {
          console.log(err.error)
        });
    }
    else {
      this.errorMessage = "Please select an address!"
    }
  }

  addMoneyInWallet() {
    this.balance = parseFloat(this.depositeForm.controls.amount.value);
    console.log(this.balance);
    this.walletService.addMoneyToWallet("harsha", this.balance).subscribe(data => {
      console.log(data);
      if (data) {
        alert("money is successfully added in your wallet.....");
        this.insufficientBalance=false;
        this.customer.balance+=this.balance
      }
    }, err => {
      console.log("err");
      console.log(err.stack);
    })
    this.cardForm.reset();
    this.depositeForm.reset();
  }

  close(){
    this.insufficientBalance=false;
    this.logger.logStatus("Insufficient Balance");
  }


}
