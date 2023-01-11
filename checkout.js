if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('removebutton')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}


function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}
let nameArr = []

function addToCartClicked(event) {
    event.preventDefault();
    var button = event.target
    var shopItem = button.parentElement.parentElement
    title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
    nameArr.push(title)
    console.log(nameArr);
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartItems = document.getElementsByClassName('cart-items')[0]
    cartItemNames = cartItems.getElementsByClassName('carttitle')

    for (var i = 0; i < cartItemNames.length; i++) {

        if (cartItemNames[i].innerText == title) {
            alert('use the input in cart to add multiple items of this type')
            return
        }
    }
    cartRowContents = 
    `<div class="cart-item cart-column">
            <img class="cartimage" src="${imageSrc}" width="100" height="100">
            <span class="carttitle">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="removebutton" type="button">Remove</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    console.log(title);
    cartRow.getElementsByClassName('removebutton')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    salesTax = 0;
    var subTotal = 0;
    total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
         quantity = quantityElement.value
        total = total + (price * quantity)
    }
    salesTax = total * .06
    let n = salesTax.toFixed(2);
    document.getElementsByClassName('sales-tax-price')[0].innerText = '$' + n
    fullTotal = total  + salesTax
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + fullTotal;
    subTotal = total - (total * 0.06)
    j = subTotal.toFixed(2);
    document.getElementsByClassName('subtotal-total-price')[0].innerText = '$' + total;
}

let cashCard = document.getElementById('cashOrCard');
let ifCash = document.getElementById('ifCash');
let ifCard = document.getElementById('ifCard');
let cashSel = document.getElementById('cash');
let cardSel = document.getElementById('card');
let cashPaid = document.getElementById('cashAmt');
let changeDiv = document.getElementById('change');

let recDiv = document.getElementById('rec');
let recItems = document.getElementById('recItems')
let recSub = document.getElementById('recSub')
let recTax = document.getElementById('recTax')
let recTot = document.getElementById('recTot')

ifCash.style.display = "none";
ifCard.style.display = "none";
recDiv.style.display = "none";
function cashOrCardSel(){
    if (cashSel.checked){
        ifCash.style.display = "flex";
        ifCard.style.display = "none";
        document.addEventListener('submit', e =>{
            e.preventDefault()
            if(cashPaid.value < fullTotal){
                alert("Pay up! This aint free!")
                return false;
            }
            let change = cashPaid.value - fullTotal;
            changeDiv.innerText = `Change: $${change.toFixed(2)}`
            showRec()            
            recItems.innerHTML = `Items purchased: ${nameArr}  `
            recSub.innerHTML = `Subtotal: $${j}`
            recTax.innerHTML = `Tax $${salesTax.toFixed(2)}`
            recTot.innerHTML = `Total: $${fullTotal.toFixed(2)}`
            let recPaid = document.createElement('p')
            recPaid.innerText = `Amount Paid: $${cashPaid.value}`
            recDiv.appendChild(recPaid)
            let recChange = document.createElement('p')
            recChange.innerHTML = `Change Tendered: $${change.toFixed(2)}`
            recDiv.appendChild(recChange)

        })
    }
    else if (cardSel.checked){
        recItems.innerHTML = `Items purchased: ${nameArr}  `
        let cardNum = document.getElementById('cardNum');
        let cardCvv = document.getElementById('cvv');
        let cardAmt = document.getElementById('cardAmt');
        cardAmt.innerHTML = `Amount to Charge: $${fullTotal.toFixed(2)} `
        ifCard.style.display = "block";
        ifCash.style.display = "none";
        document.addEventListener('submit', e=>{
            e.preventDefault()
            var q = new Date();
            var date = new Date(q.getFullYear(),q.getMonth(),q.getDate());
            var mydate = new Date(document.getElementById('exp').value);
            console.log(cardNum.value);
            console.log(cardCvv.value);
            console.log(mydate);
            if(cardNum.value.length < 16){
                alert('Please enter a valid card number')
                return false;
            }
            else if(date > mydate){
                alert('Card has expired. Please check the expiration or used another card!')
                return false;
            }
            else if(cardCvv.value.length < 3){
                alert('Please enter a valid CVV')
                return false;
            }
            showRec()            
            recItems.innerHTML = `Items purchased: ${nameArr}  `
            recSub.innerHTML = `Subtotal: $${j}`
            recTax.innerHTML = `Tax $${salesTax.toFixed(2)}`
            recTot.innerHTML = `Total: $${fullTotal.toFixed(2)}`
            let cardNot = document.createElement('p')
            let num = cardNum.value
            let lastFour = num.slice(-4)
            cardNot.innerHTML = `Paid using card ${lastFour}`
            recDiv.appendChild(cardNot)
        })
    }
}
cashCard.addEventListener('click', cashOrCardSel)

let homeBut = document.getElementById('nikeItems');
let cartBut = document.getElementById('nikeCart');
cartBut.style.display = "none"
function showCart(){
    homeBut.style.display = "none"
    cartBut.style.display = "block"
    recDiv.style.display = "none";
}
function showHome(){
    homeBut.style.display = "block"
    cartBut.style.display = "none"
    recDiv.style.display = "none";
}
function showRec(){
    homeBut.style.display = "none"
    cartBut.style.display = "none"
    recDiv.style.display = "block"
}