'use strict';
// import { gsap } from 'gsap';
class View{

  constructor(controller){
    this.controller =controller;
    this.products = this.controller.getProducts();
    // fetching DOM
      this.divWrapperProducts = document.querySelector('div#divWrapperProducts');
      this.spanShowing1ToNProductsLabel = document.querySelector('span#spanShowing1ToNProductsLabel');
      this.ulSortByNavBar = document.querySelector('ul#ulSortByNavBar');

    // attaching event listener
      this.ulSortByNavBar.addEventListener('click', (event)=>{
        if( event.target.nodeName.toLowerCase() === 'li'){

          if( event.target.getAttribute('name') === 'Popularity'){
            this.sortProductsByPopularity(this.products);
            this.underlineCurrentlyActiveSortByCategory('Popularity');
          }else if( event.target.getAttribute('name') === 'PriceLowToHigh'){
            this.sortProductsByPrice(this.products);            
            this.underlineCurrentlyActiveSortByCategory('PriceLowToHigh');
          }else if( event.target.getAttribute('name') === 'PriceHighToLow'){
            this.sortProductsByPrice(this.products, false);               
            this.underlineCurrentlyActiveSortByCategory('PriceHighToLow');         
          }else if( event.target.getAttribute('name') === 'NewestFirst'){
            this.generateProducts(this.products);
            this.underlineCurrentlyActiveSortByCategory('NewestFirst');
          }

        }
      });
      

    // updating total no of products span label
      this.updateSpanShowing1ToNProductsLabel();
    // generating products
      this.generateProducts(this.products);

    // Testing stuff
    this.underlineCurrentlyActiveSortByCategory();
    
  }

  underlineCurrentlyActiveSortByCategory(sortByCategoryName=false){
    if(!sortByCategoryName){
      return;
    }

    this.ulSortByNavBar.querySelectorAll('li').forEach((li)=>{
      li.className="";
      if(li.getAttribute('name') === sortByCategoryName){
        li.className = "text-[#2874f0] border-b-[.2rem] border-[#2874f0]";
      }
      // console.log(li, );
    });
  }
  sortProductsByPopularity(products){
    this.generateProducts([...products].sort((productA, productB)=>{
      return productB.popularity - productA.popularity;
    }))
  }

  sortProductsByPrice(products, lowToHigh=true){
    this.generateProducts([...products].sort((productA, productB)=>{
      if(lowToHigh){
        return productA.price - productB.price;
      }else{ // high to low
        return productB.price - productA.price;        
      }
    }))
  }


  updateSpanShowing1ToNProductsLabel(){
    // console.log('im inside view and products are: ', this.products)
    let totalNoOfProducts = this.products.length+1;
    this.spanShowing1ToNProductsLabel.innerHTML = `(Showing 1-${totalNoOfProducts} products of ${totalNoOfProducts} products)`;
  }
  generateProducts(products){
    // console.log(products);
    this.divWrapperProducts.innerHTML = "";
    setTimeout(()=>{
      products.forEach((product)=>{
        // console.log(product)
        this.divWrapperProducts.append(this.generateProductDiv(product));
      })
    }, 200);


  }
  
  generateProductDiv(product){

    let outputProductDiv = document.createElement('div');
  
    outputProductDiv.className="product shadow-md hover:shadow-2xl transition w-[22rem] p-[1rem] duration-200 rounded-md flex flex-col gap-[.5rem]";

    outputProductDiv.innerHTML= `
      <div class="relative  h-[15rem] w-[20rem] flex justify-center">
        <div class="absolute right-0 text-[1.3rem] transition-colors duration-200 hover:text-pink-600 text-[#c2c2c2] cursor-pointer z-50">
          <i class="fa-sharp fa-solid fa-heart"></i>
        </div>
        <div class="absolute w-[15rem] h-[15rem]">
          <img class="object-cover w-[100%] h-[100%]" src="${product.image}" alt="${product.title}">
        </div>
      </div>    
        <h2 class="text-[1.3rem] font-medium ">${product.title}</h2>
        <div class="flex flex-row gap-[.5rem] items-center">
          <div class="flex gap-[.5rem] text-zinc-50 bg-[#388e3c] p-[.5rem] pt-0 pb-0 rounded-md items-center justify-center">
            <span class="font-medium text-[1.2rem]">${product.rating}</span>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="text-[#878787] font-medium">(1)</span>
          <div class="h-[1.5rem]">
            <img class="object-cover w-[100%] h-[100%]" src="Images/Flipkart/flipkartAssured.png" alt="flipkartAssured">
          </div>          
        </div>
        <div class="flex gap-[.6rem]">
          <span class="font-bold text-[1.1rem]">${this.computeProductPrice(product)}</span>
          <span class="text-[#878787]  line-through text-[1.1rem]">₹₹₹</span>
          ${product.discountInPercentage?`<span class="text-[#388e3c] font-semibold">${product.discountInPercentage}% off</span>`:""}
          
        </div>
        <div class="flex flex-row gap-[.2rem] text-[.8rem]">
          ${product.deliveryIn1Day?"<span class=\"text-zinc-50 bg-purple-700 p-[.3rem] w-[6.5rem] rounded-sm text-center\">Delivery in 1 Day</span>":""}
          ${product.noCostEMI?"<span class=\"text-zinc-50 bg-green-700 p-[.3rem] w-[6rem] rounded-sm text-center\">No Cost EMI</span>":""}          
        </div>
      `;
      return outputProductDiv;
  }

  computeProductPrice(product){
    // image: "Images/mmtcGold.png",
    // title: "MMTC PAMP 999.9 Pure Gold (1Kg)",
    // rating: 3,
    // flipkartAssured: true,
    // price: 9000000,
    // specialPrice: 7000000,
    // deliveryIn1Day: true,
    // noCostEMI: true,
    // discountInPercentage: 22.22,
    // popularity: 70,

    // first check if there is special price, then return it
      if(product.specialPrice){
        return this.convertCurrencyIntoLakhsCrores(product.specialPrice);
      }else{
        return this.convertCurrencyIntoLakhsCrores(product.price);        
      }

  }

  
    
  convertCurrencyIntoLakhsCrores(currency){
    let formattedCurrency = '';
    if(currency >= 100000 && currency <= 9999999){
      formattedCurrency = currency/100000;
      formattedCurrency = `₹ ${formattedCurrency} ${formattedCurrency >1 ? 'Lakhs' : 'Lakh'}`;
    }else if(currency >= 10000000){
      formattedCurrency = currency/10000000;
      formattedCurrency = `₹ ${formattedCurrency} ${formattedCurrency >1 ? 'Crores' : 'Crore'}`;
    }
    return formattedCurrency;
  }
  
}  

