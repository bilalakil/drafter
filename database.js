cards = [
    {
        id: "Lightning Bolt",
        manaCost: 1,
        archetypes: [1, 2, 3],
        tags: ["build-around"],
        debugText: "Deal 3 Damage",
    },
    {
        id: "2",
        manaCost: 0,
        archetypes: [2, 3, 4],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "3",
        manaCost: 0,
        archetypes: [3, 4, 5],
        tags: [],
        debugText: "",
    },
    {
        id: "4",
        manaCost: 0,
        archetypes: [4, 5, 6],
        tags: ["build-around"],
        debugText: "",
    },
    {
        id: "5",
        manaCost: 0,
        archetypes: [5, 6, 7],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "6",
        manaCost: 0,
        archetypes: [6, 7, 8],
        tags: [],
        debugText: "",
    },
    {
        id: "7",
        manaCost: 0,
        archetypes: [7, 8, 9],
        tags: ["build-around"],
        debugText: "",
    },
    {
        id: "8",
        manaCost: 0,
        archetypes: [8, 9, 10],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "9",
        manaCost: 0,
        archetypes: [9, 10, 11],
        tags: [],
        debugText: "",
    },
    {
        id: "10",
        manaCost: 0,
        archetypes: [10, 11, 12],
        tags: ["build-around"],
        debugText: "",
    },
    {
        id: "11",
        manaCost: 0,
        archetypes: [11, 12, 13],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "12",
        manaCost: 0,
        archetypes: [12, 13, 14],
        tags: [],
        debugText: "",
    },
    {
        id: "13",
        manaCost: 0,
        archetypes: [13, 14, 15],
        tags: ["build-around"],
        debugText: "",
    },
    {
        id: "14",
        manaCost: 0,
        archetypes: [14, 15, 16],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "15",
        manaCost: 0,
        archetypes: [15, 16, 17],
        tags: [],
        debugText: "",
    },
    {
        id: "16",
        manaCost: 0,
        archetypes: [16, 17, 18],
        tags: [],
        debugText: "",
    },
    {
        id: "17",
        manaCost: 0,
        archetypes: [17, 18, 19],
        tags: ["good"],
        debugText: "",
    },
    {
        id: "18",
        manaCost: 0,
        archetypes: [18, 19, 20],
        tags: [],
        debugText: "",
    },
    {
        id: "19",
        manaCost: 0,
        archetypes: [19, 20, 1],
        tags: [],
        debugText: "",
    },
    {
        id: "20",
        manaCost: 0,
        archetypes: [20, 1, 2],
        tags: ["good"],
        debugText: "",
    },
];
cardIds = cards.map(card => card.id);
cardsById = cards.reduce(
    (dictionary, card) => {
        dictionary[card.id] = card;
        return dictionary;
    }, {}
);