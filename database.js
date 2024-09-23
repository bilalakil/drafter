cards = [
    {
        id: "1",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "2",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "3",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "4",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "5",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "6",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "7",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "8",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "Deal 3 damage.\nDraw a card.",
    },
    {
        id: "9",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "9",
    },
    {
        id: "10",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "10",
    },
    {
        id: "11",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "11",
    },
    {
        id: "12",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "12",
    },
    {
        id: "13",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "13",
    },
    {
        id: "14",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "14",
    },
    {
        id: "15",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "15",
    },
    {
        id: "16",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "16",
    },
    {
        id: "17",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "17",
    },
    {
        id: "18",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "18",
    },
    {
        id: "19",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "19",
    },
    {
        id: "20",
        manaCost: 0,
        archetypes: [1, 2, 3],
        debugText: "20",
    },
];
cardIds = cards.map(card => card.id);
cardsById = cards.reduce(
    (dictionary, card) => {
        dictionary[card.id] = card;
        return dictionary;
    }, {}
);