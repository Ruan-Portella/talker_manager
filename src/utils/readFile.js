const fs = require('fs/promises');
const path = require('path');

const talkerPath = path.resolve(__dirname, '../talker.json');

const readFile = async () => {
    try {
        const data = await fs.readFile(talkerPath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Não foi possível ler o arquivo');
    }
};

const readFileById = async (id) => {
    try {
        const talkers = await readFile();
        const filterById = talkers.filter((talker) => talker.id === id);
        return filterById;
    } catch (error) {
        console.error('Não foi possível ler o arquivo');
    }
};

const filterByTalker = async (q, rate, date) => {
    const talkers = await readFile();
    let talkersByQuery = talkers;

    if (q) {
        talkersByQuery = talkersByQuery.filter((talker) => talker.name.toLowerCase()
        .includes(q.toLowerCase()));
    }

    if (rate) {
        talkersByQuery = talkersByQuery.filter((talker) => talker.talk.rate === rate);
    }

    if (date) {
        talkersByQuery = talkersByQuery.filter((talker) => talker.talk.watchedAt === date);
    }

    return talkersByQuery;
};

module.exports = { readFile, readFileById, filterByTalker };