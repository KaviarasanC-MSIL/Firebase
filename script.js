
const firebaseConfig = {
    apiKey: "AIzaSyCv9bRtDQaLxoLZ31GxFhv1Z_y6-Irjh1A",
    authDomain: "loginform-2e1ef.firebaseapp.com",
    databaseURL: "https://loginform-2e1ef-default-rtdb.firebaseio.com",
    projectId: "loginform-2e1ef",
    storageBucket: "loginform-2e1ef.appspot.com",
    messagingSenderId: "814063567087",
    appId: "1:814063567087:web:765542fa586dec53921b1a",
    measurementId: "G-JMZ5HJC7C4"
  };
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = app.database();

document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loader = document.getElementById('loader');

  function showLoader() {
      loader.style.display = 'block';
      setTimeout(() => {
          hideLoader();
      }, 2000);
  }

  function hideLoader() {
      loader.style.display = 'none';
  }

  function clearFormInputs(form) {
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
  }

  let userData = JSON.parse(localStorage.getItem('loginData')) || [];

  signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }

      const existingUser = userData.find(user => user.username === username);
      if (existingUser) {
          alert("Username already exists! Please choose another username.");
          return;
      }
      const newUser = {
        username: username,
        email: email,
        password: password,
        status: 'inactive',
        generalknowledge1: {
            score: 0
        },
        generalknowledge2: {
            score: 0
        }
    };

    userData.push(newUser);
 var text = btoa(password);
            console.log( atob(text));
    localStorage.setItem('loginData', JSON.stringify(userData));
      auth.createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            var user = userCredential.user;
            var database_ref = database.ref();
            var user_data = {
                username: username,
                email: email,
                password: btoa(password),
                status: 'inactive',
                generalknowledge1: {
                    score: 0
                },
                generalknowledge2: {
                    score: 0
                },
                created_at: Date.now()
            }
           
            database_ref.child('users/' + user.uid).set(user_data);
            alert('User Created!!')
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });

      clearFormInputs(signupForm);
  });

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const loginUsername = loginForm.querySelector('input[type="text"]').value;
      const loginPassword = loginForm.querySelector('input[type="password"]').value;

      showLoader();

      const user = userData.find(user => user.username === loginUsername && user.password === loginPassword);
      if (user) {
          user.status = 'active';
          localStorage.setItem('loginData', JSON.stringify(userData));
          auth.signInWithEmailAndPassword(user.email, user.password)
          .then(function() {
            var user = auth.currentUser
            var database_ref = database.ref()
            var user_data = {
              last_login : Date.now()
            }
           
            database_ref.child('users/' + user.uid).update(user_data)
            alert('User Logged In!!')
        
          })
          .catch(function(error) {
            var error_code = error.code
            var error_message = error.message
        
            alert(error_message)
          })
          setTimeout(() => {
              clearFormInputs(loginForm);
              hideLoader();
           //   window.location.href = 'homepage.html';
          }, 2000);
          return;
      }

      setTimeout(() => {
          alert("Login failed. Please check your username and password.");
          clearFormInputs(loginForm);
          hideLoader();
      }, 2000);
  });

});
