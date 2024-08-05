
function checkUsername() {
    const userName = document.getElementById("username").value;
    
}
//setTimeout(checkPasswords, 300);
function checkPasswords() {

    const userPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById('repassword').value;
    const message1 = document.getElementById('message1');
    const message2 = document.getElementById('message2');

    console.log(userPassword.length)
    setTimeout(function() {
        if (userPassword.length < 8) {
            message1.style.color = 'red';
            message1.textContent = '密碼至少需8位數';
            message2.textContent = "";
        } else {
            message1.textContent = "";
            
                if (userPassword === confirmPassword) {
                    message2.style.color = 'green';
                    message2.textContent = '密碼相符';
                } else {
                    message2.style.color = 'red';
                    message2.textContent = '密碼不相符';
                }
            }
    },500)
    
    
}

function checkInput(event) {
    event.preventDefault();

    const userName = document.getElementById("username").value;
    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;
    const confirmPassword = document.getElementById('repassword').value;

    let emptyFields = [];

    if (!userName) {
        emptyFields.push("用戶名");
    }
    if (!userEmail) {
        emptyFields.push("電子郵件");
    }
    if (!userPassword) {
        emptyFields.push("密碼");
    }
    if (!confirmPassword) {
        emptyFields.push("確認密碼");
    }

    // 如果有空值欄位，顯示提示訊息
    if (emptyFields.length > 0) {
        alert("請填寫以下欄位: " + emptyFields.join(", "));
        return;
    } else {
        if (userPassword.length < 8) {
            alert("密碼至少需8位數");
        } else if (userPassword !== confirmPassword) {
            alert("請確認密碼是否一致");
        } else {
            document.getElementById("signupform").submit();
        }
        
    }
}