'use strict';
class Controller{ 

  constructor(model){    
    this.model = model;
  


  }

  getProducts(){
    return this.model.getProducts();
  }

}
