const fs = require('fs/promises');
const path = require('path');
const { readFile, readFileById } = require('./readFile');

const talkerPath = path.resolve(__dirname, '../talker.json');

const writeFile = async (talker) => {
    try {
        const talkers = await readFile();
        const talkerWrited = await fs.writeFile(talkerPath, JSON.stringify([...talkers, talker]));
        return talkerWrited;
    } catch (error) {
        console.log('Não foi possível escrever no arquivo');
    }
};

const updateFile = async (id, talker) => {
    try {
        const talkersById = await readFileById(id);
        if (talkersById.length === 0) {
            return false;
           }
        const talkers = await readFile();
        const talkerIndex = talkers.findIndex((talke) => talke.id === id);
        talkers[talkerIndex] = { id, ...talker };
        await fs.writeFile(talkerPath, JSON.stringify(talkers));

        return talkers[talkerIndex];
    } catch (error) {
        console.log('Não foi possível atualizar o talker');
    }
};

const deleteFile = async (id) => {
    try {
        const talkers = await readFile();
        const removeTalker = talkers.filter((talker) => talker.id !== id);
        await fs.writeFile(talkerPath, JSON.stringify(removeTalker));

        return removeTalker;
    } catch (error) {
        console.error('Não foi possível deletar o talker');
    }
}

module.exports = { writeFile, updateFile, deleteFile };