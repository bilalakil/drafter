const setupElement = document.getElementsByClassName("setup")[0];
const draftElement = document.getElementsByClassName("draft")[0];

let state = {
    mode: "specifyFormat",
};

/* =====================================================
 * HELPERS
 * =====================================================
 */

// Fisher-Yates (aka Knuth) Shuffle
// https://stackoverflow.com/a/46161940/1406230
const getShuffledArray = array => {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i !== -1; --i) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[rand]] = [newArray[rand], newArray[i]];
    }
    return newArray;
};

const formatString = (template, substitutions) => {
    let result = template;
    for (const key in substitutions) result = result.replace(
        new RegExp("\\{" + key + "\\}", "g"), substitutions[key]
    );
    return result;
};

const createElement = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}

/* =====================================================
 * SETUP
 * =====================================================
 */

const startDraftButton = document.getElementById("setup__format__submit");
const numberOfRoundsInput = document.getElementById("setup__format__number-of-rounds");
const cardsPerPackInput = document.getElementById("setup__format__cards-per-pack");
const totalSeatsInput = document.getElementById("setup__format__total-seats");
const setupFormatStatus = document.getElementById("setup__format__status");

startDraftButton.addEventListener("click", () => {
    const numberOfRounds = Number(numberOfRoundsInput.value);
    const cardsPerPack = Number(cardsPerPackInput.value);
    const totalSeats = Number(totalSeatsInput.value);
    const cardsRequired = numberOfRounds * cardsPerPack * totalSeats;
    if (cardsRequired > cards.length) {
        setupFormatStatus.innerText = `Error: You requested ${cardsRequired} cards but there are only ${cards.length} available.`;
        return;
    }
    
    setupFormatStatus.innerText = "";
    useNewState(createNewDraftState(numberOfRounds, cardsPerPack, totalSeats));
});

const refreshFormatDisplay = () => {
    setupElement.classList.remove("hidden");
    draftElement.classList.add("hidden");
    setupFormatStatus.innerText = "";
};

/* =====================================================
 * DRAFT
 * =====================================================
 */

const cardTemplate = document.getElementById("template__card").innerHTML;
const draftChoicesElement = document.getElementById("draft__choices");
const draftChoicesTitle = document.getElementById("draft__choices__title");
const draftChoicesTitleTemplate = draftChoicesTitle.innerHTML;
const draftChoicesCardContainer = document.getElementById("draft__choices__card-container");
const draftPickedTitle = document.getElementById("draft__picked__title");
const draftPickedTitleTemplate = draftPickedTitle.innerHTML;
const draftPickedCardContainer = document.getElementById("draft__picked__card-container");
const draftSideboardTitle = document.getElementById("draft__sideboard__title");
const draftSideboardTitleTemplate = draftSideboardTitle.innerHTML;
const draftSideboardCardContainer = document.getElementById("draft__sideboard__card-container");
const draftBotPickedCardContainer = document.getElementById("draft__bot-picked__card-container");

let botStates = [];

const createNewDraftState = (numberOfRounds, cardsPerPack, numberOfSeats) => {
    const newState = {
        mode: "draft",
        round: 0,
        activeRoundPickNumber: 0,
        cardsPerPack: cardsPerPack,
        numberOfSeats: numberOfSeats,
        packsInActiveRound: [],
        packsInOtherRounds: [],
        playerData: Array.from({ length: numberOfSeats }, () => ({ deck: [], sideboard: [] })),
    };
    
    botStates = Array.from({ length: numberOfSeats }, () => ({
        hasBuildAround: false,
        archetypeWeights: {},
    }));

    const shuffledCards = getShuffledArray(cardIds);
    let currentCardIndex = 0;
    
    for (let roundI = 0; roundI < numberOfRounds; ++roundI) {
        const round = roundI === 0 ? newState.packsInActiveRound : [];
        if (roundI !== 0) newState.packsInOtherRounds.push(round);
        
        for (let seatI = 0; seatI < numberOfSeats; ++seatI) {
            const pack = [];
            round.push(pack);

            for (let cardI = 0; cardI < cardsPerPack; ++cardI) {
                pack.push(shuffledCards[currentCardIndex]);
                ++currentCardIndex;
            }
        }
    }

    return newState;
};

const createCardDisplayElement = cardId => {
    const cardData = cardsById[cardId];
    return createElement(
        formatString(cardTemplate, {
            cardId: cardId,
            debugTextTopLeft: cardId,
            debugTextTopRight: cardData.manaCost.toString(),
            debugTextBottom: cardData.debugText ?? "",
        })
    );
};

const getPackForPlayer = playerIndex => state.packsInActiveRound[
    (state.activeRoundPickNumber + playerIndex) % state.numberOfSeats
];

const givePlayerCardFromPack = (pack, chosenCardIndex, playerIndex) => {
    const cardId = pack[chosenCardIndex];
    pack.splice(chosenCardIndex, 1);
    state.playerData[playerIndex].deck.push(cardId);
};

const botGetChoiceWeight = (botState, cardData) => {
    if (!botState.hasBuildAround && cardData.tags.includes("build-around")) return 99999;
    
    let weight = 0;
    if (cardData.tags.includes("good")) weight += 5;
    for (const archetype of cardData.archetypes) weight += botState.archetypeWeights[archetype] ?? 0;
    return weight;
};

const botRunChoiceAlgorithm = (botState, pack) => {
    let currentOptimalWeight = -1;
    let currentOptimalChoices = [];
    
    for (const cardId of pack) {
        const cardData = cardsById[cardId];
        const weight = botGetChoiceWeight(botState, cardData);
        if (weight < currentOptimalWeight) continue;
        if (weight > currentOptimalWeight) {
            currentOptimalWeight = weight;
            currentOptimalChoices = [];
        }
        currentOptimalChoices.push(cardId);
    }
    
    return currentOptimalChoices[Math.floor(Math.random() * currentOptimalChoices.length)];
};

const botUpdateWeights = (botState, chosenCardData) => {
    const weightToAdd = !botState.hasBuildAround && chosenCardData.tags.includes("build-around")
        ? 10
        : 1;
    for (const archetype of chosenCardData.archetypes)
        botState.archetypeWeights[archetype] = (botState.archetypeWeights[archetype] ?? 0) + weightToAdd;
};

const botPickCard = playerIndex => {
    const botState = botStates[playerIndex];
    const pack = getPackForPlayer(playerIndex);
    const chosenCardId = botRunChoiceAlgorithm(botState, pack);
    const chosenCardIndex = pack.indexOf(chosenCardId);
    const chosenCardData = cardsById[chosenCardId];

    givePlayerCardFromPack(pack, chosenCardIndex, playerIndex);
    botUpdateWeights(botState, chosenCardData);
    if (!botState.hasBuildAround && chosenCardData.tags.includes("build-around")) botState.hasBuildAround = true;
};

const handlePackCardPicked = (activePack, i) => {
    givePlayerCardFromPack(activePack, i, 0);
    for (let i = 1; i < state.numberOfSeats; ++i) botPickCard(i);
    
    ++state.activeRoundPickNumber;
    
    if (
        state.activeRoundPickNumber === state.cardsPerPack &&
        state.packsInOtherRounds.length !== 0
    ) {
        ++state.round;
        state.activeRoundPickNumber = 0;
        state.packsInActiveRound = state.packsInOtherRounds.pop();
    }
    
    refreshDisplay();
};

const refreshActivePackDisplay = () => {
    const activePack = getPackForPlayer(0);
    if (activePack.length === 0) {
        draftChoicesElement.classList.add("hidden");
        return;
    }
    
    draftChoicesTitle.innerHTML = formatString(
        draftChoicesTitleTemplate, 
        { packNumber: state.round + 1, pickNumber: state.activeRoundPickNumber + 1 }
    );

    draftChoicesElement.classList.remove("hidden");
    const newChildren = [];

    for (let i = 0; i !== activePack.length; ++i) {
        const element = createCardDisplayElement(activePack[i]);
        const anchor = element.querySelector("a");
        anchor.addEventListener("click", () => handlePackCardPicked(activePack, i));
        newChildren.push(element);
    }

    draftChoicesCardContainer.replaceChildren(...newChildren);
};

const handlePickedCardPicked = (i) => {
    const deck = state.playerData[0].deck;
    const cardId = deck[i];
    deck.splice(i, 1);
    state.playerData[0].sideboard.push(cardId);
    refreshDisplay();
};

const refreshPickedDisplay = () => {
    const cardsInSideboard = state.playerData[0].sideboard.length;
    const sideboardCountText = cardsInSideboard === 0 ? "" : ` (${cardsInSideboard} cards in sideboard)`;
    draftPickedTitle.innerHTML = formatString(
        draftPickedTitleTemplate,
        {
            pickedCount: state.playerData[0].deck.length + cardsInSideboard,
            sideboardCount: sideboardCountText
        }
    );
    
    const newChildren = [];
    const deck = state.playerData[0].deck;
    for (let i = 0; i !== deck.length; ++i) {
        const element = createCardDisplayElement(deck[i]);
        const anchor = element.querySelector("a");
        anchor.addEventListener("click", () => handlePickedCardPicked(i));
        newChildren.push(element);
    }
    draftPickedCardContainer.replaceChildren(...newChildren);
};

const handleSideboardCardPicked = (i) => {
    const sideboard = state.playerData[0].sideboard;
    const cardId = sideboard[i];
    sideboard.splice(i, 1);
    state.playerData[0].deck.push(cardId);
    refreshDisplay();
};

const refreshSideboardDisplay = () => {
    draftSideboardTitle.innerHTML = formatString(
        draftSideboardTitleTemplate,
        { sideboardCount: state.playerData[0].sideboard.length }
    );

    const newChildren = [];
    const sideboard = state.playerData[0].sideboard;
    for (let i = 0; i !== sideboard.length; ++i) {
        const element = createCardDisplayElement(sideboard[i]);
        const anchor = element.querySelector("a");
        anchor.addEventListener("click", () => handleSideboardCardPicked(i));
        newChildren.push(element);
    }
    draftSideboardCardContainer.replaceChildren(...newChildren);
};

const refreshBotPickedDisplay = () => {
    const newChildren = [];
    const deck = state.playerData[1].deck;
    for (let i = 0; i !== deck.length; ++i) {
        const element = createCardDisplayElement(deck[i]);
        newChildren.push(element);
    }
    draftBotPickedCardContainer.replaceChildren(...newChildren);
};

const refreshDraftDisplay = () => {
    draftElement.classList.remove("hidden");
    setupElement.classList.add("hidden");
    
    refreshActivePackDisplay();
    refreshPickedDisplay();
    refreshSideboardDisplay();
    refreshBotPickedDisplay();
};

/* =====================================================
 * GLOBAL
 * =====================================================
 */

const refreshDisplay = () => {
    if (state.mode === "specifyFormat") refreshFormatDisplay();
    else if (state.mode === "draft") refreshDraftDisplay();
};

const useNewState = (newState) => {
    state = newState;
    refreshDisplay();
};

refreshDisplay();