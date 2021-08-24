const fs = require('fs');
const {
    filterByQuery,
    findById,
    validateZookeeper,
    createNewZookeeper,
} = require("../lib/zookeepers.js");
const { zookeepers }  = require("../data/zookeepers.json");
jest.mock('fs');


test("creates zookeeper object", () => {
    const zookeeper = createNewZookeeper(
        {name: "Darlene", id: "jhgdja3ng2"},
        zookeepers
    );
    expect(zookeeper.name).toBe("Darlene");
    expect(zookeeper.id).toBe("jhgdja3ng2");
});

test("filters by query", () =>{
    const startingZookeepers = [
          {
            "id": "666",
            "name": "JoeFromFamilyGuy",
            "age": 19,
            "favoriteAnimal": "legs"
          },
          {
            "name": "Lester",
            "age": 64,
            "favoriteAnimal": "himself",
            "id": "69"
          },
    ];
    
    const updatedZookeepers = filterByQuery({age: 19}, startingZookeepers);

    expect(updatedZookeepers.length).toEqual(1);
});

test("finds by id", () => {

    const startingZookeepers = [
        {
          "id": "666",
          "name": "JoeFromFamilyGuy",
          "age": 19,
          "favoriteAnimal": "legs"
        },
        {
          "name": "Lester",
          "age": 64,
          "favoriteAnimal": "himself",
          "id": "69"
        },
  ];
    const result = findById("69", startingZookeepers);

    expect(result.name).toBe("Lester");
});

test("validates age", () => {
    const zookeeper = {
      id: "2",
      name: "Raksha",
      age: 31,
      favoriteAnimal: "penguin",
    };
  
    const invalidZookeeper = {
      id: "3",
      name: "Isabella",
      age: "67",
      favoriteAnimal: "bear",
    };
  
    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);
  
    expect(result).toBe(true);
    expect(result2).toBe(false);
  });