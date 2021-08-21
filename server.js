const { animals } = require('./data/animals.json');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { query } = require('express');
const PORT = process.env.PORT|| 3001;
const app = express();
//parse incoming string or data arr
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json());

function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if(query.personalityTraits){
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal =>  animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(species => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    //console.log(body);
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if(!animal.species || animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || animal.diet !== 'string'){
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    //set id based on next index
    //console.log(req.body);
    req.body.id = animals.length.toString();
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});