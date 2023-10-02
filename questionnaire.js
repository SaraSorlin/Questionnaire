const prompt = require(`prompt-sync`)({ signit: true });
const fs = require(`fs`);
const questions = require(`./questions.json`);

console.clear()
let name = prompt(`Vad är ditt namn: `);

const user =
{
    Name: name,
    Date: new Date().toLocaleString(),
    Answers: [],
    Score: [0, 0, 0, 0],
    Percent: [0, 0, 0, 0],
    Bestmatch: []
};

let index = 0;

while (index < questions.length) {
    const answer = prompt(`${questions[index].question} [j/n]: `).toLowerCase();

    if (answer !== "j" && answer !== "n") {
        console.log("Var snäll och svara med 'j' eller 'n'.");
        continue;
    }

    if (answer === "j") {
        user.Answers.push(true);

        user.Score[0] += questions[index].yesscore[0];
        user.Score[1] += questions[index].yesscore[1];
        user.Score[2] += questions[index].yesscore[2];
        user.Score[3] += questions[index].yesscore[3];

    } else if (answer === "n") {
        user.Answers.push(false);
        user.Score[0] += questions[index].noscore[0];
        user.Score[1] += questions[index].noscore[1];
        user.Score[2] += questions[index].noscore[2];
        user.Score[3] += questions[index].noscore[3];
    }
    index++;
}

const sortedmaxindex = Array.from(user.Score.keys());
sortedmaxindex.sort((a, b) => user.Score[b] - user.Score[a]);

for (let index = 0; index < user.Score.length; index++) {
    user.Percent[index] = Math.round((user.Score[index] / 90) * 100);
}

user.Percent.sort((a, b) => b - a);

for (let index = 0; index < sortedmaxindex.length; index++) {

    if (sortedmaxindex[index] === 0) {
        user.Bestmatch.push("cat");
    }

    else if (sortedmaxindex[index] === 1) {
        user.Bestmatch.push("dog");
    }

    else if (sortedmaxindex[index] === 2) {
        user.Bestmatch.push("rabbit");
    }

    else if (sortedmaxindex[index] === 3) {
        user.Bestmatch.push("fish");
    }
}

let befintligdata = [];


try {
    const datajson = fs.readFileSync("./answers.json", "utf8");
    befintligdata = JSON.parse(datajson);

    if (!Array.isArray(befintligdata)) {
        befintligdata = [];
    }
} catch (err) {
}

befintligdata.push(user);

console.clear()
console.log("Det husdjur som passar dig bäst är enligt nedan! ")

for (let index = 0; index < user.Bestmatch.length; index++) {
    console.log(`${user.Bestmatch[index]} : ${user.Percent[index]} %`)
}

fs.writeFileSync("./answers.json", JSON.stringify(befintligdata, null, 2));
console.log("Databasen är uppdaterad med resultatet");


