the url to access the api is:

my_ip_addr:3000/user/list -> for listing the current database
my_ip_addr:3000/user/push -> for posting the data
-> please occupy the body with cpu and gpu tempretures
-> on Postman, instead of Json Raw, select "x-www-form-urlencoded", otherwise it will not work.

all the dependencies shoudl be in the bundle, but for specific versions, see package.json
