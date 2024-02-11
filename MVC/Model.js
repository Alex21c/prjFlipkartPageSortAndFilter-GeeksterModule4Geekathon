'use strict';
class Model{  
  constructor(dbProducts){
    this.products = dbProducts;
    // console.log(this.products);
    // console.log('constructor model');
  }
  
  getProducts(){
    return this.products;
  }
}
