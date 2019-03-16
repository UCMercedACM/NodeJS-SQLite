const express = require('express');
const app = express();
const path = require ("path");
const axios = require("axios");

//MORE THINGS
app.use(express.static(__dirname + '/'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);

//IMPORT DATABASE STUFF
var sqlite3 = require('sqlite3').verbose();
var db  = new sqlite3.Database("test.db");

//HOME
app.get("/", (req, res) =>{
    res.render("home.html");
})

// ><%= ANIMALDATA[i].name %>
//HEDGEHOG
app.get("/heg", (req, res) =>{
    var animalData = [];
    db.each("SELECT name, sciName, facts FROM ANIMAL", function (err, row){
        var obj = {NAME: row.name, SCINAME: row.sciName, FACTS: row.facts};
        animalData.push(obj);
    });

    setTimeout(()=>{
        res.render("animal.html", {ANIMALDATA: animalData});
    }, 1000);
        
})

//POKEMON
app.get("/pokemon", (req, res) =>{
    res.render("pokemon.html");
})

//CREATE TABLE
app.get("/createTable", (req,res) =>{
    var query = "CREATE TABLE IF NOT EXISTS ANIMAL(\
        name varchar(60),\
        sciName varchar(60),\
        facts varchar(800));";
    db.run(query);
})

//INSERT DATA
app.get("/createAnimal" , (req, res) =>{
    var query = "INSERT INTO ANIMAL (name, sciName, facts) VALUES ('hedgehog', 'something', 'A hedgehog is any of the spiny mammals of the subfamily Erinaceinae, in the eulipotyphlan family Erinaceidae. There are seventeen species of hedgehog in five genera found through parts of Europe, Asia, and Africa, and in New Zealand by introduction. There are no hedgehogs native to Australia and no living species native to the Americas (the extinct genus Amphechinus was once present in North America).')"
    db.run(query);
    res.send("CREATED ANIMAL SUCESSFULLY");
});

//DELETE
app.get("/delete", (req, res) =>{
    var query = "DELETE FROM ANIMAL WHERE name = 'hedgehog'";
    db.run(query);
    res.send("KILLED ANIMALS");
});

//FETCH DATA
app.get("/fetchEverything", (req, res) =>{
    var animalData = [];
    db.each("SELECT name, sciName, facts FROM ANIMAL", function (err, row){
        var obj = {NAME: row.name, SCINAME: row.sciName, FACTS: row.facts};
        animalData.push(obj);
    });



});

//POKEMON API
app.get("/pokemon/:pokemon", (req, res1) =>{
    axios.get("https://pokeapi.co/api/v2/pokemon/" + req.params.pokemon + '/')
    .then(res =>{
        //DISPLAY ON PAGE
        var parse = JSON.parse(res.data);
        
        res1.send(res.data);
    })
    

});

//PORT
app.listen(3000, ()=> console.log("RUNNING APP ON 3000"));