function abc(){
    document.getElementById('empid-error').innerText = ""
    document.getElementById('empname-error').innerText = ""
    document.getElementById('age-error').innerText = ""
    document.getElementById('gender-error').innerText = ""
    document.getElementById('designation-error').innerText = ""
    document.getElementById('salary-error').innerText = ""
    document.getElementById('email-error').innerText = ""
    document.getElementById('contact-error').innerText = ""
    document.getElementById('joiningDate-error').innerText = ""
    document.getElementById('location-error').innerText = ""

    let empid = document.getElementById('empid').value;
    let empname = document.getElementById('empname').value;
    let age = document.getElementById('age').value;
    let gender = document.querySelector('input[type="radio"]:checked');
    let designation = document.getElementById('designation').value;
    let salary = document.getElementById('salary').value;
    let email = document.getElementById('email').value;
    let contact = document.getElementById('contact').value;
    let doj = document.getElementById('joiningDate').value;
    let location = document.getElementById("location").value;

    if(!empid){
        document.getElementById('empid-error').innerText = "empid is required."
    }else if(empid.length<5){
        document.getElementById('empid-error').innerText = "EmployeeID should be at least 5 characters long."
    }
    
    if(!empname){
        document.getElementById('empname-error').innerText = "empname is required."
    }
    if(!age){
        document.getElementById('age-error').innerText = "age is required."
    } else if(isNaN(age)){
        document.getElementById('age-error').innerText = "Age should be a number"
    }else if(age<1){
        document.getElementById('age-error').innerText = "Age should not be less than or equal to zero. "
    }
    if(!gender){
        document.getElementById('gender-error').innerText = "Please select your Gender"
    }
    if(!designation){
        document.getElementById('designation-error').innerText = "designation is required."
    }
    if(!salary){
        document.getElementById('salary-error').innerText = "salary is required."
    } else if(isNaN(salary) || salary <= 0){
        document.getElementById('salary-error').innerText = "Salary Shoud be in Number and more than Zero"
    }
    if(!email){
        document.getElementById('email-error').innerText = "email is required."
    }
    if(!contact){
        document.getElementById('contact-error').innerText = "contact is required."
    }else if(isNaN(contact)){
        document.getElementById('contact-error').innerText = "contact shoud be number."
    }
    if(!doj){
        document.getElementById('joiningDate-error').innerText = "joiningDate is required."
    }
    if(!location){
        document.getElementById('location-error').innerText = "location is required."
        }
    }
