const {animals} = require('./data/animals.json');
const express = require('express');
const { query } = require('express');
const PORT = process.env.PORT|| 3001;
const app = express();
//parse incoming string or data arr
app.use(express.urlencoded({extended: true}));
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

app.post('./api/animals', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});