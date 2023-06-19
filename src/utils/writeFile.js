const fs = require('fs/promises');
const path = require('path');
const { readFile } = require('./readFile');
const talkerPath = path.resolve(__dirname, '../talker.json');

const writeFile = async (talker) => {
    try {
        const talkers = await readFile();
        const talkerWrited = await fs.writeFile(talkerPath, JSON.stringify([...talkers, talker]));
        return talkerWrited;
    } catch (error) {
        console.log('Não foi possível escrever no arquivo');
    }
}

module.exports = { writeFile }