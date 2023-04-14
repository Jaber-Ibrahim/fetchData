let productsContainer = document.querySelector(".products");
let bulletsCont = document.querySelector(".bullets");
let myInput = document.querySelector("input[type=search]");
let searchIcon = document.querySelector(".fa-search");
let myLisToFilter = document.querySelectorAll(".category ul li");
let backButtonContainer = document.querySelector(".back-button");
let myPop = document.querySelector(".pop-box");

let myProducts = [];
let counter = 0;
let countEnd = counter + 10;

async function fetchData() {
  try {
    await fetch("https://dummyjson.com/products")
      .then((result) => result.json())
      .then((result) => {
        myProducts = result.products;

        showData(myProducts, counter, countEnd);

        showBullets(myProducts);

        myLisToFilter.forEach((li) => {
          li.addEventListener("click", () => {
            myLisToFilter.forEach((li) => {
              li.classList.remove("active");
            });
            let myBoxesfilter = [];
            myProducts.forEach((product) => {
              if (product.category.includes(li.dataset.cat)) {
                myBoxesfilter.push(product);
              } else if (li.dataset.cat === "all") {
                backButtonContainer.innerHTML = "";
                myBoxesfilter = myProducts;
              }
            });
            li.classList.add("active");
            if (myBoxesfilter.length > 10) {
              showData(myBoxesfilter, counter, countEnd);
            } else {
              showData(myBoxesfilter, 0, myBoxesfilter.length);
            }

            showBullets(myBoxesfilter);
          });
        });

        myInput.onkeyup = () => {
          searchData(myProducts);
        };

        searchIcon.onclick = () => {
          searchData(myProducts);
        };
      });
  } catch (error) {
    setTimeout(() => {
      alert(error);
    }, 5000);
  }
}

fetchData();

function showData(array, countStart, counterEnd) {
  productsContainer.innerHTML = null;

  if (array.length === 0) {
    productsContainer.innerHTML = `<p class="no-data">No Result....Click the back button to view more Products or Research</p>`;
  }
  for (let i = countStart; i < counterEnd; i++) {
    productsContainer.innerHTML += `
    <div class="box all ${array[i]["category"]}" id="${array[i]["id"]}">
                        <img src="${array[i]["thumbnail"]}" alt="${array[i]["category"]} photo" />
                        <div class="info">
                        <h2>${array[i]["title"]}</h2>
                        <h4>${array[i]["brand"]}</h4>
                        <p>${array[i]["description"]}</p>
                        <div class="cart">
                               <span>${array[0]["price"]} $</span>
                               <i class="fa-solid fa-cart-shopping fa-bounce"></i>
                             </div>
                         </div>
                       </div>
                       `;
  }

  document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", () => {
      showPopUp(myProducts, myProducts.length);
    });
  });
}

function showBullets(array) {
  bulletsCont.innerHTML = "";
  if (array.length > 10) {
    let numberOfbullets = Math.ceil(array.length / 10);
    for (let i = 0; i < numberOfbullets; i++) {
      if (i === 0) {
        bulletsCont.innerHTML += `<span  id="${i}" class="active">${
          i + 1
        }</span>`;
      } else {
        bulletsCont.innerHTML += `<span id="${i}">${i + 1}</span>`;
      }
    }
  }
  let myspans = document.querySelectorAll(".bullets span");

  myspans.forEach((element) => {
    element.addEventListener("click", function () {
      myspans.forEach((element) => {
        element.classList.remove("active");
      });

      counter = (this.innerHTML - 1) * 10;
      countEnd = counter + 10;

      showData(myProducts, counter, countEnd);

      this.classList.add("active");
    });
  });
}

function searchData(array) {
  let myfilteresProduct = [];
  if (this.event.key == "Enter" || this.event.target.onclick) {
    if (myInput.value == "") {
      return false;
    } else {
      for (let i = 0; i < array.length; i++) {
        if (
          array[i].title.toLowerCase().includes(myInput.value.toLowerCase()) ||
          array[i].brand.toLowerCase().includes(myInput.value.toLowerCase()) ||
          array[i].description
            .toLowerCase()
            .includes(myInput.value.toLowerCase()) ||
          array[i].category.toLowerCase().includes(myInput.value.toLowerCase())
        ) {
          myfilteresProduct.push(array[i]);
        }
      }
      showData(myfilteresProduct, 0, myfilteresProduct.length);
      showBullets(myfilteresProduct);

      myInput.value = "";
      backButtonContainer.innerHTML = `<span class="back">Back</span>`;
      document.querySelector(".back").addEventListener("click", () => {
        backButtonContainer.innerHTML = "";

        counter = 0;
        countEnd = counter + 10;
        showData(myProducts, counter, countEnd);
        showBullets(myProducts);
      });
      myLisToFilter.forEach((li) => {
        li.classList.remove("active");
        if (li.dataset.cat == "all") {
          li.classList.add("active");
        }
      });
    }
  }
}

function showPopUp(array, end) {
  myPop.innerHTML = null;

  for (let i = 0; i < end; i++) {
    if (this.event.target.id == array[i].id) {
      myPop.innerHTML += `
           <div class="pop">
         <div class="image-box">
           <img src="${array[i]["images"][0]}" alt="${array[i].category} photo">
           <img src="${array[i]["images"][1]}" alt="${array[i].category} photo">
           <img src="${array[i]["images"][2]}" alt="${array[i].category} photo">
           </div>
           <span class="my-btn">Back</span>
       </div>
           `;
    }
  }
  document.querySelector(".my-btn").addEventListener("click", () => {
    myPop.innerHTML = "";
  });
}
