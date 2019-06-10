//Globals var
const levels = {
  easy: 9,
  medium: 6,
  hard: 3
};

//default is easy
let currentLevel = levels[localStorage.getItem('defaultLevel')] || levels.easy;
let time;
let score = 0;
let isPlaying;
let stopped;
let cd;
let gamesCounter = 0;

const wordInput = document.querySelector("#word-input");
const currentWord = document.querySelector("#current-word");
const scoreDisplay = document.querySelector("#score");
const timeDisplay = document.querySelector("#time");
const message = document.querySelector("#message");
const seconds = document.querySelector("#seconds");
const startGameBtn = document.querySelector("#startGameBtn");
const stopGameBtn = document.querySelector("#stopGameBtn");
const chooseLevel = document.querySelector("#chooseLevel");
const bestScoreModal = document.querySelector("#bestScoreModal");
const bestscore = document.querySelector("#bestScore");
const bestscoreEm = document.querySelector("#bestscoreEm");
const bestScoreModalBody = document.querySelector("#bestScoreModalBody");
const yourScoresModal = document.querySelector("#yourScoresModal");
const yourScoresTbody = document.querySelector("#yourScoresTbody");
const words = [
  "Software Design and Development",
  "Social and Ethical Issues",
  "Impact of software",
  "inappropriate data structures",
  "Y2K problem",
  "computer malware",
  "viruses",
  "social networking",
  "cyber safety",
  "Rights and responsibilities",
  "software developers",
  "intellectual property",
  "software solutions",
  "user-identified problems",
  "code of conduct",
  "ergonomic issues",
  "inclusivity issues",
  "Software piracy and copyright",
  "plagiarism",
  "copyright laws",
  "licensing issues",
  "licence conditions",
  "shareware",
  "public domain",
  "open source",
  "ownership versus licensing",
  "reverse engineering",
  "decompilation",
  "current tehnologies",
  "emerging technologies",
  "non-copyable data sheet",
  "use of serial numbers",
  "site licence",
  "installation counter",
  "encryption key",
  "registration code",
  "back-to-base authentication",
  "Use of networks",
  "ease of communication",
  "productivity",
  "response times",
  "interface design",
  "privacy and security issues",
  "software market task",
  "market position",
  "RACV vs Unisys",
  "Microsoft vs Netscape",
  "NSW T Card system",
  "search engines",
  "Metallica vs Napster",
  "Applications of SW Development Approaches",
  "Software development approaches",
  "Structured approach",
  "Agile approach",
  "Prototyping approach",
  "RAD approach",
  "End user approach",
  "Computer Aided Software Engineering",
  "software version control",
  "test data generation",
  "production of documentation",
  "production of code",
  "direct cut over strategy",
  "parallel strategy",
  "phased strategy",
  "pilot strategy",
  "outsourcing",
  "contract programmers",
  "web-based software ",
  "learning objects",
  "widgets",
  "apps and applets",
  "Web 2.0 tools",
  "cloud computing",
  "mobile phone technology",
  "collaborative environments",
  "social networking software",
  "Defining & Understand the Problem",
  "Defining the problem",
  "identifying the problem",
  "functionality requirements",
  "performance issues",
  "boundaries of the problem",
  "Issues of proposed solution",
  "determining an existing solution",
  "social and ethical considerations",
  "existing software products",
  "existing software solutions",
  "cost effectiveness",
  "licensing considerations",
  "Design specifications",
  "specifications of proposed system",
  "data structures",
  "algorithms",
  "System documentation",
  "modeling tools",
  "IPO diagrams",
  "context diagrams",
  "data flow diagrams",
  "storyboards",
  "structure charts",
  "system flowcharts",
  "data dictionaries",
  "modules and subroutines",
  "test data",
  "expected output",
  "client and developer",
  "Quality assurance",
  "Planning and Design The Solution",
  "Standard algorithms",
  "Standard logic",
  "maximum and minimum values",
  "arrays",
  "processing strings",
  "extracting",
  "inserting",
  "deleting",
  "generating",
  "processing of sequential files",
  "sentinel value",
  "priming read",
  "input",
  "output",
  "appending records",
  "processing relative files",
  "relative access",
  "linear search",
  "binary search",
  "bubble sort",
  "insertion sort",
  "selection sort",
  "off-the-shelf packages",
  "appropriate package",
  "library routines",
  "parameters",
  "local and global variables",
  "benchmarking",
  "Implementation",
  "programming languages",
  "syntactically correct code",
  "Language syntax required for software solutions",
  "EBNF and railroad diagrams",
  "machine code",
  "source code",
  "compilation",
  "interpretation",
  "lexical analysis",
  "token generation",
  "code generation",
];

//setting bestScore
bestscore.innerHTML = localStorage.getItem("bestScore") || 0;
//listener for change level
chooseLevel.addEventListener("change", changeLevel);
//when pressed game start
startGameBtn.addEventListener("click", init);
//when press game stop
stopGameBtn.addEventListener("click", stopGame);
//when input starts
wordInput.addEventListener('input', clearMessage);
//initialize seconds
seconds.innerHTML = currentLevel;
//initialize level
chooseLevel.value = localStorage.getItem('defaultLevel') || 'easy';

function changeLevel() {
  //update values
  currentLevel = levels[chooseLevel.value];
  seconds.innerHTML = currentLevel;
  time = currentLevel;
  //set in local storage
  localStorage.setItem('defaultLevel', chooseLevel.value);
}
//Initialize Game
function init() {
  message.innerHTML = "";
  //assign time
  time = currentLevel;
  //game is started
  stopped = false;
  //hide start Btn
  startGameBtn.classList.add("d-none");
  //show stop btn
  stopGameBtn.classList.remove("d-none");
  //disable choose level
  chooseLevel.disabled = true;
  //show a random word
  showWord(words);
  //Start matching on word input
  wordInput.addEventListener("input", startMatch);
  //Countdwon
  cd = setInterval(countDown, 1000);
  //Check game status
  setInterval(checkStatus, 50);
}

function startMatch() {
  if (!stopped) {
    if (matchWords()) {
      isPlaying = true;
      time = currentLevel + 1;
      showWord(words);
      wordInput.value = "";
      score++;
    }
    if (score === -1) scoreDisplay.innerHTML = 0;
    else scoreDisplay.innerHTML = score;
  }
}

function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = "Correct";
    message.style.color = "green";
    return true;
  } else {
    return false;
  }
}

function showWord(words) {
  const randIndex = Math.floor(Math.random() * words.length);
  currentWord.innerHTML = words[randIndex];
}

function countDown() {
  if (!stopped) {
    if (time > 0) {
      //Decrement
      time--;
    } else if (time === 0) {
      //increment game Counter
      gamesCounter++;
      //Register score in table
      addNewScore(score);
      //Register score in local storage if is the best

      if (score > localStorage.getItem("bestScore")) {
        newBestScore();
      }
      $(stopGameBtn).trigger("click");
      message.innerHTML = "";
      // Game is over
      isPlaying = false;
    }
    //Show time
    timeDisplay.innerHTML = time;
  }
}

function checkStatus() {
  if (!stopped) {
    if (!isPlaying && time === 0) {
      message.innerHTML = "Game Over";
      message.style.color = "red";
      score = -1;
    }
  }
}

function stopGame() {
  //hide stop btn
  stopGameBtn.classList.add("d-none");
  //show start btn
  startGameBtn.classList.remove("d-none");
  //clear message
  clearMessage();
  //enable choose level
  chooseLevel.disabled = false;
  //stopping all
  stopped = true;
  //increment game Counter
  gamesCounter++;
  //Register score in table
  addNewScore(score);
  //Register score in local storage if is the best
  if (score > localStorage.getItem("bestScore")) {
    newBestScore();
  }
  //reset score
  score = 0;
  scoreDisplay.innerHTML = 0;
  //reset time
  clearInterval(cd);
}

function newBestScore() {
  //set new best score
  localStorage.setItem("bestScore", score);
  //show message
  $(bestScoreModal).modal("toggle");
  bestscoreEm.innerHTML = score;
  bestscore.innerHTML = score;
}

function addNewScore(score) {
  //first col
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let content = document.createTextNode(gamesCounter);
  td.appendChild(content);
  tr.appendChild(td);
  //second col
  td = document.createElement("td");
  content = document.createTextNode(score);
  td.appendChild(content);
  tr.appendChild(td);
  yourScoresTbody.prepend(tr);
}

function clearMessage() {
  message.innerHTML = '';
}
