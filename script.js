
// Budget Controller
var budgetController = (function () { // iife - immediatly invoked function

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItmes: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0,
        }
    }

    return {
        addItem: function (type, des, val) {
            var newItem;
            // [1 2 3 4 5], next id = 6
            // [1 2 4, 6 8], next id = 9 not 6
            // so to do that we find the element and the length to get
            // the last element in the array and then get the id of it 
            // and then increment it to get the accurate id which is not redundent
            if (data.allItmes[type].length > 0) {
                ID = data.allItmes[type][data.allItmes[type].length - 1].id + 1;
            } else {
                ID = 0
            }


            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            // push it into our data structure
            data.allItmes[type].push(newItem)

            // returning the new item
            return newItem;
        },
        testing: function () {
            console.log(data)
        }
    }

})()





// UI Controller
var UIController = (function () {
    // some code
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }


    return {
        getInput: function () {
            // will be either inc or exp as the value is what we specified in html refer it
            // as we need 3 of them we return them as the objects 
            // so we can use the 3 of them easily
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },

        addListItem: function (obj, type) {
            var html, newHTML, element;
            // create HTML  string with some placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace the placeholder with some actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)
            // Insert the HTML to the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
        },

        clearFields: function () {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)
            fieldsArray.forEach(function (current, index, array) {
                console.log(current, index, array)
            })
        },

        getDomStrings: function () {
            return DOMstrings
        }
    }

})()




// Global App Controller
var appController = (function (budgetCtrl, UICtrl) {



    var setupEventListeners = function () {
        var Dom = UICtrl.getDomStrings()

        document.querySelector(Dom.inputButton).addEventListener('click', ctrlAddItem)

        // event listener when you enter enter key
        document.addEventListener('keypress', function (event) {
            if (event.which === 13) {
                ctrlAddItem()
            }
        })
    }

    var updateBudget = function () {

        // 1. calculate the budget

        // 2. Return the budget

        // 3. display the budget

    }

    var ctrlAddItem = function () {

        var input, newItem
        // 1. get input data
        input = UICtrl.getInput()

        // 2. add the item to the budget controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. add the new item to the user interface
        UICtrl.addListItem(newItem, input.type)

        // 4. clear the fields

        var fieldsArray = UIController.clearFields()
        // console.log(fieldsArray)


        // 5. Display the budget on the UI


    }



    return {
        init: function () {
            console.log('application has started');
            setupEventListeners();
        }
    }


})(budgetController, UIController);

appController.init()





