
// Budget Controller
var budgetController = (function () { // iife - immediatly invoked function

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.floor((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItmes[type].forEach(function (current) {
            sum += current.value
        })
        /*****
         * 0
         * [200, 390, 500]
         * 0 + 200 and sum = 200
         * sum+390 = 590
         */
        data.total[type] = sum
    }
    var data = {
        allItmes: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            var newItem;
            // [1 2 3 4 5], next id = 6
            // [1 2 4, 6 8], next id = 9 not 6
            // so to do that we find the element and the length to get
            // the last element in the array and then get the id of it 
            // and then increment it to get the accurate id which is not redundent
            // goes through the array and finds the last element and gets it's id
            // and then that id + 1 is called the new id which is being assigned
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

        deleteItem: function (type, id) {
            // var id             // id = 3
            // id = data.allItmes[type][data.allItmes[type].length - 1].id + 1
            // ids = [1,2, 3, 4]
            // index of 4 is 3

            var index, ids
            ids = data.allItmes[type].map(function (current, index, array) {
                // map returns a brand new array
                return current.id
            })
            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItmes[type].splice(index, 1);
            }

        },

        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc')


            // calculate the budget

            data.budget = data.total.inc - data.total.exp


            // calculate the percentage of income that we spent 
            if (data.total.inc > 0) {
                data.percentage = Math.floor((data.total.exp / data.total.inc) * 100)
            } else {
                data.percentage = 0
            }
        },

        calculatePercentages: function () {

            data.allItmes.exp.forEach(function (current) {
                current.calcPercentage(data.total.inc)
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItmes.exp.map(function (current) {
                return current.getPercentage();
            })
            return allPercentages
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.total.inc,
                totalExpenses: data.total.exp,
                percentage: data.percentage

            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensesPercentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentage: '.item__percentage'
    }


    return {
        getInput: function () {
            // will be either inc or exp as the value is what we specified in html refer it
            // as we need 3 of them we return them as the objects 
            // so we can use the 3 of them easily
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItem: function (obj, type) {
            var html, newHTML, element;
            // create HTML  string with some placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace the placeholder with some actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)
            // Insert the HTML to the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)
        },

        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID)
            element.parentNode.removeChild(element);
        },

        clearFields: function () {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields)
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            })
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.expensesPercentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.expensesPercentageLabel).textContent = '---'
            }
        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercentage);
            // now returns node lists
            // each element in dom is called nodes
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%'
                } else {
                    current.textContent = '---'
                }
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
        });


        document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function () {

        // 1. calculate the budget

        budgetCtrl.calculateBudget();

        // 2. Return the budget

        var budget = budgetCtrl.getBudget();


        // 3. display the budget
        UICtrl.displayBudget(budget)

    }

    var updatePercentages = function () {

        // calculate perecentages
        budgetCtrl.calculatePercentages();

        // Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        console.log(percentages)

        // update the ui with the new percentage
        UICtrl.displayPercentages(percentages)

    }

    var ctrlAddItem = function () {

        var input, newItem
        // 1. get input data
        input = UICtrl.getInput()

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. add the new item to the user interface
            UICtrl.addListItem(newItem, input.type)

            // 4. clear the fields

            UIController.clearFields()


            // 5. calculate and update the budget

            updateBudget()

            // 6. calculate and update percentages

            updatePercentages()
        } else {
            alert('enter right data')
        }


    }

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        if (itemID) {

            splitID = itemID.split('-')
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1.delete the item from the datastructure
            budgetCtrl.deleteItem(type, ID)


            // 2. Delete the item from the user interface
            UICtrl.deleteListItem(itemID)

            // 3. update and show the new budget

            updateBudget();

            // 4. calculate and update the percentages

            updatePercentages()

        }
    }


    return {
        init: function () {
            console.log('application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    }


})(budgetController, UIController);

appController.init()





