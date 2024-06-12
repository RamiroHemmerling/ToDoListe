function userNameInput () {
    var firstName = document.getElementById('searchbar').value;
    var result = document.getElementById('result');
  
    result.textContent = 'Your name is: ' + firstName + ' and your 3 month goal is ' + threeMonthGoal;
         //alert(nameField);
     }
  
  submitButton.addEventListener('click', userNameInput, false);
  