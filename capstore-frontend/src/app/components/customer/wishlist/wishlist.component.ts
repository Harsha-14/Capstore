import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { RaavanTeamService } from 'src/app/services/raavan-team.service';
import { LoggingService } from 'src/app/models/loggingService';
import { Cart } from 'src/app/models/cart.model';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor(public router:Router,public service:RaavanTeamService, private logger : LoggingService) { }
  products:Product[];
  statusMsg:string=""
  product:Product
  carts:Cart[]
  cart:Cart
  username:String="harsha";
  ngOnInit() {
      this.getWishlists();
      this.getCartProducts();
  }
  getWishlists() {
    this.service.getAllWishlists(this.username).subscribe(data => {
      this.products = data;
      this.logger.logStatus("got all the wishlists")
    },
      err => {
        console.log(err.stack);
      });
  }

  removeFromWishlist(productId:number){
    this.service.removeWishlist(this.username,productId).subscribe(data=>{
      this.getWishlists()
      this.statusMsg="\u2713 Item "+productId+" removed from wishlist succesfully!!"
      this.logger.logStatus("Item removed from wishlist");
      setTimeout(() => {
        this.statusMsg=""
      }, 3000);
    // alert("removed")
    },
    err=>{

    console.log(err.stack);
    });
  }
  addToCart(id:number){
    this.service.getProductDetails(id).subscribe(data => {
      this.product = data;
      this.cart = new Cart();
      this.cart.setQuantity();
      this.cart.setProduct(this.product);
      this.service.addProductToCart(this.cart, "harsha").subscribe(data => {
        this.logger.logStatus("Product is added to your cart successfully");
        if (data) {
          this.removeFromWishlist(id)
          setTimeout(() => {
            this.statusMsg = "\u2713 Product is added to your cart successfully.."
          }, 500);
          setTimeout(() => {
            this.statusMsg = ""
          }, 3000);
        }
      },
        err => {
          console.log(err.stack);
        })

    },
      err => {
        console.log(err.error)
      })

  }

  deleteAll(){
    if(this.products.length != 0)
    {
    if(confirm("Are you Sure You Want to Delete All Wishlists?")){
    this.service.deleteAllWishlists(this.username).subscribe(data=>{
      this.getWishlists()
      alert("All Wishlists Deleted Successfully")
      this.logger.logStatus("Wishlists deleted successfully");
    },
    err=>{
      console.log(err.stack)
    });    
    }
  }
  else{
    alert(`No items in WishList`);
  }
  }
  getProduct(id:number){
    this.router.navigate(['/Customer/productDetails',id]);
  }
  getCartProducts() {
    this.service.getCustomerCart("harsha").subscribe(data => {
      this.logger.logStatus("Received cart products");
      this.carts=data;
    },
      err => {
        console.log(err.stack)
      });
  }
}