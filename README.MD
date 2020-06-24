GET: my_ip:1205/temp/list -> for listing the current database of temperature

---

POST: my_ip:1205/temp/push -> for posting temperature data, REMEMBER to use JSON in the body

example:
{
"cpu": 12,
"gpu": 12
}

AND add the token u got from log in to the header field of Authorization

---

POST: my_ip:1205/user/signup -> for signing up with username and password. REMEMBER to use JSON in the body //

example:
{
"username": "Mikey",
"password": "12345"
}

---

POST: my_ip:1205/user/signin -> for signing in with the existing username and password, REMEMBER to use JSON in the body //

example:
{
"username": "Mikey",
"password": "12345"
}

---

all the dependencies shoudl be in the bundle, but for specific versions, see package.json
