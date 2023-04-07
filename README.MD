##How to setup

1. Setup MySQL in your enviroment 
2. Fill  ```/app/config/db.config.js``` with your credentials
3. create a database named ```database_development_refam```
4. Run ```npm install``` from root path
5. Run with ```nodemon server.json``` from root path
6. Go to http://localhost:80 :) 


Puerto | DB PASS del enviroment
Cambio de puerto de DB  
Contraseñas robustas (Evita brute force)

*Encriptar DB 

Codigo ofuscado

SSL pinning (Evitar ;An in the middle con Sniff)
Firewall de app Web 
Proxy con blacklist 

Limitar métodos HTTP 
SSL HTTPS


#**DB**
```sequelize db:create```


#Standard Response REST
```
{
    "status": 0
    "code": 0
    "errorCode":  1 // it will be opt
    "message": "Content can not be empty!"
}
```

#EJS
```
<% 'Scriptlet' tag, for control-flow, no output
<%= Outputs the value into the template (HTML escaped)
<%- Outputs the unescaped value into the template
```

-----------


# Cientes AJAX

*_HEADERS_*

This headers apply for all endpoints 
```
x-access-token: x-access-token,
Content-Type: application/json
```
-----------

All responses Have tis structure   <br/>
0 ->  OK <br/>
!=0  -> Not OK    <br/>
 
```
{
    "status": 0,
    "code": 0,
    "errorCode":  1, // it will be opt
    "message": "Content can not be empty!",
    "hasResponseData": true,  // true or false 
    "responseData": {
                      "pageNumber": 1, 
                      "objectType": [{Object},
                                    {Object}]   
                    }
}

1. The field "status" sould always be validated if is !=0 the request callback sould be prepared to use the "errorCode" and "message" to show a error message for the client or handle the error.    
2   The "hasResponseData" field will indicates if tthe response data has comes with results, if it's false, the "responseData" shouldn't   be handled  and show a "No results" message for the client 
3. Thew field "responseData" will contain the array of Objects result
```

_The next in document only indicates the content of "responseData" for each endpoint_
# Users Pagination /refam/api/users/getPage
Request a users page number (Starting in 1)

```
POST 

{
    "reqPageNumber": 1,
    "numItemsPerPage": 12
}

1. reqPageNumber: The page number that wants to request 
2."numItemsPerPage"isa the number oof objects to request 
 
```

Response get user objects
```
{
    "status": 0,
    "code": 0,
    "errorCode": 0,
    "message": "",
    "hasResponseData": true,
    "responseData": {
        "numOfItems": 1,
        "currentPageNumber": 1,
        "isLastPage": true,
        "users": [
            {
                "id": 3,
                "grade": null,
                "speciality": null,
                "completeName": null,
                "status": 0,
                "enrollment": "122232",
                "email": "pie2o@maiell.com",
                "militarRegion": null,
                "militarZone": null,
                "militarUnity": null,
                "birthDate": null,
                "gender": null,
                "createdAt": "2020-08-13T06:05:23.000Z",
                "updatedAt": "2020-08-15T02:33:45.000Z"
            }
        ]
    }
}

1. 
2. if "totalPages" is useful to set total number of pages in client
3. if "isLastPage" is true the next page control should be disabled for the client (it could be done wit the totalPages)

```


# GET Pagination AND Data  /refam/api/users/getPaginationAndData

->>> Request a users page number (Starting in 1)
     
     ```
     GET 
     ```
    
 Respopnse 
 ```
  {
      "numItemsPerPage": 12,
      "totalPages": 1,
      "totalOfItems": 1,
      "dataFields": {
          "militarRegions": [
              "I R.M. CHIVATITO, CD. DE MÉX.",
              "II R.M. MEXICALI, B.C."
          ],
          "grades": [
              "GENERAL DE DIVISION",
              "GENERAL DE BRIGADA"
          ],
          "militarZones": [
              "1/a. Z.M. TACUBAYA, CD. DE MÉX.",
              "2/a. Z.M. TIJUANA, B.C."              
          ]
      }
  }
 ```



-----------
