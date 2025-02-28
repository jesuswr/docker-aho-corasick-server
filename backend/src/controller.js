const service = require('./service');
const db = require('./db');

function validInput(word) {
    return /^[A-Za-z]+$/.test(word);
}

async function insertWord(req, res) {
    const { word } = req.body;
    if (validInput(word)) {
        try {
            await service.insertWord(word);
            res.status(200).send({ msg: 'Word inserted!' });
        } catch (error) {
            res.status(500).send(`An internal error occurred: ${error}`);
        }
    } else {
        res.status(400).send('Invalid word');
    }
}

async function runAhoCorasick(req, res) {
    try {
        const { text } = req.body;
        const result = await service.runAhoCorasick(text);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).send(`Error running Aho-Corasick: ${error}`);
    }
}

async function deleteWord(req, res) {
    const { word } = req.body;
    try {
        const success = await service.deleteWord(word);
        if (success) {
            res.status(200).send(`Word "${word}" deleted successfully.`);
        } else {
            res.status(404).send(`Word "${word}" not found.`);
        }
    } catch (error) {
        res.status(500).send(`Error deleting word: ${error}`);
    }
}

async function listAllWords(req, res) {
    try {
        const words = await service.listAllWords();
        const result = words.map(w => w.word);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(`Error fetching words: ${error}`);
    }
}

module.exports = {
    insertWord,
    runAhoCorasick,
    deleteWord,
    listAllWords
};