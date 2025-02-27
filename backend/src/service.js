const db = require('./db');
const { ACfixed } = require('./aho');

async function insertWord(word) {
    return db.insert(word);
}

async function runAhoCorasick(text) {
    const words = await db.getAllWords();
    const aho = new ACfixed();

    for (let i = 0; i < words.length; i++) {
        aho.add(words[i].word, i);
    }
    aho.init();
    const matches = aho.query(text);

    for (let i = 0; i < words.length; i++) {
        words[i].counter = matches.get(i) || 0;
    }

    return words;
}

async function deleteWord(word) {
    const success = await db.deleteWord(word);
    return success;
}

async function listAllWords() {
    const result = await db.getAllWords();
    return result;
}

module.exports = {
    insertWord,
    runAhoCorasick,
    deleteWord,
    listAllWords
};