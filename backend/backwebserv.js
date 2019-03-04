var cors = require("cors");

var express = require("express");

var path = require("path");

// var dataModel = require("./datamodel");

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var jwt = require("jsonwebtoken");

mongoose.Promise = global.Promise;

var instance = express();

// 3. configure all middlewares, call "use()" method on express instance
// 3.a static files
instance.use(
  express.static(path.join(__dirname, "./../node_modules/jquery/dist/"))
);

// 3b. define express-router, for segregating urls for html page web requests and rest api requests
var router = express.Router();
// 3c. add the router object in the express middleware
instance.use(router);

// 3d. configure the body-parser middleware
// 3d1. use url encoded as false to read data from http url as querystring/formmodel.
instance.use(bodyParser.urlencoded({ extended: false }));

// 3d2. Use the JSON parser for body-parser
instance.use(bodyParser.json());

// 4. create a web request handlers
// 4a. This will return the home.html from views folder

router.get("/home", function(req, resp) {
  resp.sendFile("home.html", {
    root: path.join(__dirname, "./../views")
  });
});

// 5. Model-Schema-Mapping with collection on Mongo DB and establishing collection with it

mongoose.connect("mongodb://localhost/PersonInformation", {
  useNewUrlParser: true
});

var dbconnect = mongoose.connection;

if (!dbconnect) {
  console.log("Connection failed");
  return;
}

// 5b. define schema (recommended to have same attributes as per the collection)
var userSchema = mongoose.Schema({
  UserName: String,
  Password: String,
  RoleId: String
});

var roleSchema = mongoose.Schema({
  RoleId: String,
  RoleName: String
});

// 5c. map the schema with the collection
//                                  name        schema      collection
var userModel = mongoose.model("PersonInformation", userSchema, "users");

var roleModel = mongoose.model("roles", roleSchema, "roles");

// For db connection
instance.use(cors());

/* JWT */
// The secret for JWT

var jwtSettings = {
  jwtSecret: "gghgslklkjsclkjlksjcnzc765knfgf"
};

// set the secret with express object
instance.set("jwtSecret", jwtSettings.jwtSecret);

// 7. authenticate user
/* JWT */

instance.post("/users/auth", function(request, response) {
  // parsing posted data to JSON
  var user = {
    UserName: request.body.UserName,
    Password: request.body.Password
  };
  console.log(user);
  console.log("In auth user" + JSON.stringify(user));

  userModel.findOne(user, function(err, usr) {
    // console.log(usr.UserName);
    if (err) {
      console.log("Error occured");
      throw err;
    }
    if (usr) {
      var uid = usr.UserId;
      console.log(usr.UserName);
      // console.log("in else if" + JSON.stringify(usr));
      console.log("" + usr.RoleId);
      var token = jwt.sign({ usr }, instance.get("jwtSecret"), {
        expiresIn: 3600
      });

      roleModel.findOne({ RoleId: usr.RoleId }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data) {
          var RoleName = data.RoleName;
          console.log("Role Name " + data.RoleName);
          response.send({
            authenticated: true,
            message: "Login Success",
            token: token,
            role: RoleName,
            uid: uid,
            uname: usr.UserName
          });
        } else {
          response.send({
            statusCode: 403,
            message: "Role Not found"
          });
        }
      });
    } else {
      response.send({
        statusCode: 403,
        message: "User Not found"
      });
    }
  });
});

var userSchema = mongoose.Schema({
  UserId: String,
  UserName: String,
  EmailAddress: String,
  Password: String,
  RoleId: String
});

/* Post User data */
var userModel = mongoose.model("users", userSchema, "users");
instance.post("/users/create", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      var usr = {
        UserId: request.body.UserId,
        UserName: request.body.UserName,
        EmailAddress: request.body.EmailAddress,
        Password: request.body.Password,
        RoleId: request.body.RoleId
      };
      userModel.create(usr, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

/* Post Temp User data */
var tempUserModel = mongoose.model("users", userSchema, "tempUsers");
instance.post("/tempusers/create", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      var usr = {
        UserId: request.body.UserId,
        UserName: request.body.UserName,
        EmailAddress: request.body.EmailAddress,
        Password: request.body.Password,
        RoleId: request.body.RoleId
      };
      tempUserModel.create(usr, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

/* Delete from Temp User */
instance.delete("/api/tempuser/delete:UserId", function(request, response) {
  var UserId = { UserId: request.params.UserId };
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      tempUserModel.deleteOne(UserId, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

/* Get temp User data */
var userTempSchema = mongoose.Schema();

var userTempModel = mongoose.model("tempusers", userTempSchema, "tempUsers");

// verify the token and provide access
instance.get("/api/user", function(request, response) {
  //   read request headers header contains bearer<space><token>
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      userTempModel.find().exec(function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});
/* <----------------------------------------------->  */

/* For Get */
var personSchema = mongoose.Schema({});

var personModel = mongoose.model("person", personSchema, "person");

// verify the token and provide access
instance.get("/api/person", function(request, response) {
  //   read request headers header contains bearer<space><token>
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      personModel.find().exec(function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

//#region For finding specific personid that is linked with personupdatehome page
personFindOneSchema = mongoose.Schema({
  // PersonalUniqueId: ""
});
var personFindModel = mongoose.model(
  "personfind",
  personFindOneSchema,
  "person"
);

//#region Need to pass it as param since it shows CORS error if it is passed in body
instance.post("/api/person/findone:PersonalUniqueId", function(request, response) {
//#region

var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      request.decoded = decoded;
      // console.log("Req"+request.body.UserId)
      var per = {
        PersonalUniqueId: request.params.PersonalUniqueId
      };
      personFindModel
        .findOne({ PersonalUniqueId: per.PersonalUniqueId })
        .exec(function(err, res) {
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          response.send({ status: 200, data: res });
        });
    }
  });
});
//#region

//#region For finding specific personid in tempPerson to check whether it exists or not
personTempFindOneSchema = mongoose.Schema({
  PersonalUniqueId: String
});
var personTempFindModel = mongoose.model(
  "persontempfind",
  personTempFindOneSchema,
  "tempPerson"
);
instance.post("/api/tempperson/findone:PersonalUniqueId", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      request.decoded = decoded;
      var per = {
        PersonalUniqueId: request.params.PersonalUniqueId
      };
      console.log(per.PersonalUniqueId);
      personTempFindModel
        .findOne({ PersonalUniqueId: per.PersonalUniqueId })
        .exec(function(err, res) {
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          response.send({ status: 200, data: res });
        });
    }
  });
});
//#region

/* For POST OPERATION in temp Person */
var personPostSchema = mongoose.Schema({
  PersonalUniqueId: String,
  FirstName: String,
  MiddleName: String,
  LastName: String,
  Gender: String,
  DateOfBirth: String,
  Age: String,
  Flat: String,
  SocietyName: String,
  StreetName: String,
  City: String,
  State: String,
  PinCode: String,
  PhoneNo: String,
  MobileNo: String,
  PhysicalDisability: String,
  MaritalStatus: String,
  EducationStatus: String,
  BirthSign: String
});

var personPostModel = mongoose.model(
  "tempperson",
  personPostSchema,
  "tempPerson"
);

//#region Search for specific person

var personSearchModel = mongoose.model("searchperson", personSchema, "person");

instance.post("/api/search/person", function(request, response) {
  //   read request headers header contains bearer<space><token>
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      personSearchModel
        .findOne({ PersonalUniqueId: request.body.PersonalUniqueId })
        .exec(function(err, res) {
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          response.send({ status: 200, data: res });
        });
    }
  });
});

//#region

// verify the token and provide access
instance.post("/api/tempperson/create", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      var usr = {
        PersonalUniqueId: request.body.PersonalUniqueId,
        FirstName: request.body.FirstName,
        MiddleName: request.body.MiddleName,
        LastName: request.body.LastName,
        Gender: request.body.Gender,
        DateOfBirth: request.body.DateOfBirth,
        Age: request.body.Age,
        Flat: request.body.Flat,
        SocietyName: request.body.SocietyName,
        StreetName: request.body.StreetName,
        City: request.body.City,
        State: request.body.State,
        PinCode: request.body.PinCode,
        PhoneNo: request.body.PhoneNo,
        MobileNo: request.body.MobileNo,
        PhysicalDisability: request.body.PhysicalDisability,
        MaritalStatus: request.body.MaritalStatus,
        EducationStatus: request.body.EducationStatus,
        BirthSign: request.body.BirthSign
      };
      personPostModel.create(usr, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

/* Create PERSON Collection */
var createPersonModel = mongoose.model(
  "createPerson",
  personPostSchema,
  "person"
);

// verify the token and provide access
instance.post("/api/create/person", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      var person = {
        PersonalUniqueId: request.body.PersonalUniqueId,
        FirstName: request.body.FirstName,
        MiddleName: request.body.MiddleName,
        LastName: request.body.LastName,
        Gender: request.body.Gender,
        DateOfBirth: request.body.DateOfBirth,
        Age: request.body.Age,
        Flat: request.body.Flat,
        SocietyName: request.body.SocietyName,
        StreetName: request.body.StreetName,
        City: request.body.City,
        State: request.body.State,
        PinCode: request.body.PinCode,
        PhoneNo: request.body.PhoneNo,
        MobileNo: request.body.MobileNo,
        PhysicalDisability: request.body.PhysicalDisability,
        MaritalStatus: request.body.MaritalStatus,
        EducationStatus: request.body.EducationStatus,
        BirthSign: request.body.BirthSign
      };
      console.log(person);
      createPersonModel.create(person, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

//#region Create ustatus collection
var uStatusSchema = mongoose.Schema({
  UserName: "",
  flag: ""
});

var ustatusModel = mongoose.model("createUstatus", uStatusSchema, "ustatus");

instance.post("/api/ustatus/create:UserName", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      var ustatus = {
        UserName: request.params.UserName,
        flag: "0"
      };
      ustatusModel.create(ustatus, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});
//#region

//#region Get Ustatus single value
var ustatusModel = mongoose.model("getUstatus", uStatusSchema, "ustatus");
instance.post("/api/get/ustatus", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      var ustatus = {
        UserName: request.body.UserName
      };
      ustatusModel
        .findOne({ UserName: ustatus.UserName })
        .exec(function(err, res) {
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          console.log(res);
          response.send({ status: 200, data: res });
        });
    }
  });
});
//#region

//#region For deleting old entry from person collection if new person update request is initiated
var deletePersonModel = mongoose.model(
  "persondelete",
  personPostSchema,
  "person"
);

instance.delete("/api/person/delete:PersonalUniqueId", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      deletePersonModel.deleteOne(
        { PersonalUniqueId: request.params.PersonalUniqueId },
        function(err, res) {
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          response.send({ status: 200, data: res });
        }
      );
    }
  });
});
//#region

/* For delete from temp person */
var tempPersonModel = mongoose.model(
  "temppersondelete",
  personPostSchema,
  "tempPerson"
);

instance.delete("/api/tempperson/delete:PersonalUniqueId", function(
  request,
  response
) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      // console.log(prd);
      tempPersonModel.deleteOne(
        { PersonalUniqueId: request.params.PersonalUniqueId },
        function(err, res) {
          // console.log(PersonalUniqueId);
          if (err) {
            response.statusCode = 500;
            response.send({ status: response.statusCode, error: err });
          }
          response.send({ status: 200, data: res });
        }
      );
    }
  });
});

/* For Getting temporary person data */
var getPersonSchema = mongoose.Schema({});

var getTempPersonModel = mongoose.model(
  "tmpperson",
  getPersonSchema,
  "tempPerson"
);

// verify the token and provide access
instance.get("/api/temporaryperson", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      console.log("In auth success");
      // Decode the request

      request.decoded = decoded;
      getTempPersonModel.find().exec(function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});

var ustatusFlagToOneSchema = {
  UserName: "",
  flag: ""
};

var ustatusFlagToOneModel = mongoose.model(
  "ustatusflagone",
  ustatusFlagToOneSchema,
  "ustatus"
);

//#region Update ustatus and set flag to 1
instance.put("/api/update/ustatus:UserName", function(request, response) {
  var tokenReceived = request.headers.authorization.split(" ")[1];
  jwt.verify(tokenReceived, instance.get("jwtSecret"), function(err, decoded) {
    console.log("in verify");
    if (err) {
      console.log("In auth error");
      response.send({ success: false, message: "Token verification failed" });
    } else {
      request.decoded = decoded;
      var usr = {
        flag: "1"
      };
      var condition = {
        UserName: request.params.UserName
      };
      console.log("This     ", condition);
      ustatusFlagToOneModel.updateOne(condition, usr, function(err, res) {
        if (err) {
          response.statusCode = 500;
          response.send({ status: response.statusCode, error: err });
        }
        response.send({ status: 200, data: res });
      });
    }
  });
});
//#region

instance.listen(4070, function() {
  console.log("listening on port 4070");
});
