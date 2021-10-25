"use strict"

const images = {
    1: "./img/1-image.png",
    2: "./img/2-image.png",
    3: "./img/3-image.png"
}

const IdGenerator = () => { //function generates unique 9 lenght id for each pizza
    let key = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 9; i++) {
        key += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return key;
}

const formatter = new Intl.NumberFormat('en-US', { //formating numbers into curency
    style: 'currency',
    currency: 'EUR',
});

const AddPizza = () => { //add pizza to local storage    
    let pizzaName = document.getElementById("name").value;
    let pizzaPrice = document.getElementById("price").value;
    let pizzaHeat = document.getElementById("heat").value;
    let pizzaToppings = document.getElementById("toppings").value;
    let pizzaPhoto = document.getElementById("photo").value;
    const RandomId = IdGenerator();

    if (localStorage.length > 0) { //checking if name is unique
        let toppings = pizzaToppings.split(",");
        let count = 0;
        toppings.forEach((element) => {
            if (element !== "") {
                count++;
            }
        });
        if (count < 2) {
            window.alert("Add at least 2 toppings, seperated by comma!");
            return;
        }
    }
    if (pizzaToppings.split(',').length < 2) { //checking if pizza has more than 1 topping
        window.alert("Add at least 2 toppings, seperated by comma!")
        return;
    }

    localStorage.setItem(RandomId, JSON.stringify({
        name: pizzaName,
        price: pizzaPrice,
        heat: pizzaHeat,
        toppings: pizzaToppings,
        photo: pizzaPhoto,
        id: RandomId
    }));

    ShowAllPizza(DefaultSort());
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("heat").value = "";
    document.getElementById("toppings").value = "";
    document.getElementById("photo").value = "";
    document.getElementById("priceSortBtn").style.backgroundColor = '';
    document.getElementById("nameSortBtn").style.backgroundColor = '';
    document.getElementById("heatSortBtn").style.backgroundColor = '';

}

const DeletePizza = (i) => { //pizza delete function
    let proceed = confirm("Are you sure you want to delete this pizza?");
    let pizzaId = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
    if (proceed) {
        localStorage.removeItem(pizzaId);
    }
    ShowAllPizza(DefaultSort());
    document.getElementById("priceSortBtn").style.backgroundColor = '';
    document.getElementById("nameSortBtn").style.backgroundColor = '';
    document.getElementById("heatSortBtn").style.backgroundColor = '';
    return;
}

const EditPizza = (editID) => { //edit pizza function
    document.getElementById("editForm").style.display = 'flex';
    document.getElementById("nameEdit").value = JSON.parse(localStorage.getItem(localStorage.key(editID))).name;
    document.getElementById("priceEdit").value = JSON.parse(localStorage.getItem(localStorage.key(editID))).price;
    document.getElementById("heatEdit").value = JSON.parse(localStorage.getItem(localStorage.key(editID))).heat;
    document.getElementById("toppingsEdit").value = JSON.parse(localStorage.getItem(localStorage.key(editID))).toppings;
    document.getElementById("photoEdit").value = JSON.parse(localStorage.getItem(localStorage.key(editID))).photo;
    document.getElementById("editForm").onsubmit = function () {

        if (localStorage.length > 0) { //checking if name is unique
            for (let i = 0; i < localStorage.length; i++) {
                if (document.getElementById("nameEdit").value === JSON.parse(localStorage.getItem(localStorage.key(i))).name && document.getElementById("nameEdit").value !== JSON.parse(localStorage.getItem(localStorage.key(editID))).name) {
                    window.alert("Pizza name already exists!")
                    return;
                }
            }
        }

        if (document.getElementById("toppingsEdit").value.split(',').length < 2) { //checking if pizza has more than 1 topping
            window.alert("Add at least 2 toppings, seperated by comma!")
            return;
        }

        let editableID = JSON.parse(localStorage.getItem(localStorage.key(editID))).id;
        localStorage.setItem(editableID, JSON.stringify({
            name: document.getElementById("nameEdit").value,
            price: document.getElementById("priceEdit").value,
            heat: document.getElementById("heatEdit").value,
            toppings: document.getElementById("toppingsEdit").value,
            photo: document.getElementById("photoEdit").value,
            id: editableID
        }));
        ShowAllPizza(DefaultSort());
        document.getElementById("priceSortBtn").style.backgroundColor = '';
        document.getElementById("nameSortBtn").style.backgroundColor = '';
        document.getElementById("heatSortBtn").style.backgroundColor = '';
        document.getElementById("editForm").style.display = 'none';
    }
}

const ShowAllPizza = (SortedArray) => { //render all pizza menu from local storage
    let target = document.getElementById("root"); //div where pizza menu will be rendered
    let data = "";
    target.innerHTML = "";
    if (SortedArray.length > 0) {
        for (let i = 0; i < SortedArray.length; i++) {
            let heatNumber = SortedArray[i].heat;
            data += '<tr>';
            if (heatNumber == 3) {
                data += '<td>' + SortedArray[i].name + '<img class="hotIndicator" src="./img/hot.png" alt="chilli"><img class="hotIndicator" src="./img/hot.png" alt="chilli"><img class="hotIndicator" src="./img/hot.png" alt="chilli"></td>';
            } else if (heatNumber == 2) {
                data += '<td>' + SortedArray[i].name + '<img class="hotIndicator" src="./img/hot.png" alt="chilli"><img class="hotIndicator" src="./img/hot.png" alt="chilli"></td>';
            } else if (heatNumber == 1) {
                data += '<td>' + SortedArray[i].name + '<img class="hotIndicator" src="./img/hot.png" alt="chilli"></td>';
            } else {
                data += '<td>' + SortedArray[i].name + '</td>';
            }
            data += '<td>' + SortedArray[i].toppings + '</td>';
            data += '<td>' + formatter.format(SortedArray[i].price) + '</td>';
            data += '<td><img class="pizzaPhoto" src="' + images[SortedArray[i].photo] + '" alt="photo"></td>'
            data += '</tr>';
            data += '<button class="deleteBtn" type="button" onclick="DeletePizza(' + i + ');">Delete Pizza!</button>';
            data += '<button class="editBtn" type="button" onclick="EditPizza(' + i + ');">Edit Pizza!</button>';
        }
    }

    return target.innerHTML = data;
}

const SortByPrice = () => { //sorting by price
    const SortedArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        SortedArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    SortedArray.sort(sorter)

    function sorter(a, b) {
        if (a.price < b.price) {
            return -1;
        }
        if (a.price > b.price) {
            return 1;
        }
        return 0;
    }

    // console.log(SortedArray)

    document.getElementById("priceSortBtn").style.backgroundColor = 'lightgreen';
    document.getElementById("nameSortBtn").style.backgroundColor = '';
    document.getElementById("heatSortBtn").style.backgroundColor = '';


    ShowAllPizza(SortedArray);
}

const SortByHeat = () => { //sorting by heat
    const SortedArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        SortedArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    SortedArray.sort(sorter)

    function sorter(a, b) {
        if (a.heat > b.heat) {
            return -1;
        }
        if (a.heat < b.heat) {
            return 1;
        }
        return 0;
    }

    // console.log(SortedArray)

    document.getElementById("heatSortBtn").style.backgroundColor = 'lightgreen';
    document.getElementById("priceSortBtn").style.backgroundColor = '';
    document.getElementById("nameSortBtn").style.backgroundColor = '';


    ShowAllPizza(SortedArray);
}

const SortByName = () => { //sorting by name
    const SortedArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        SortedArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    SortedArray.sort(sorter)

    function sorter(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }

    // console.log(SortedArray)

    document.getElementById("nameSortBtn").style.backgroundColor = 'lightgreen';
    document.getElementById("priceSortBtn").style.backgroundColor = '';
    document.getElementById("heatSortBtn").style.backgroundColor = '';

    ShowAllPizza(SortedArray);
}

const DefaultSort = () => { //default sorting
    const SortedArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        SortedArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    return SortedArray;
}

ShowAllPizza(DefaultSort());
document.getElementById("priceSortBtn").style.backgroundColor = '';
document.getElementById("nameSortBtn").style.backgroundColor = '';
document.getElementById("heatSortBtn").style.backgroundColor = '';






