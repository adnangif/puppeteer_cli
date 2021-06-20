// const dot = require("dotenv");
// dot.config();
import express, { json, urlencoded } from "express";
import { join } from "path";
import { readFile, writeFile } from "fs";
// variables
const PORT = process.env.PORT || 3000;
// const pathToIndex = join(__dirname, "/static/index.html");

// declaring app and all the middleware
const app = express();
app.use(express.static("static"));
app.use(json());
app.use(urlencoded({ extended: true }));

// get previously saved data in json
app.get("/saved", (req, res) => {
	readFile("saved.json", (err, data) => {
		if (err) {
			throw err;
		} else {
			console.log(JSON.parse(data));
			return res.send(JSON.parse(data));
		}
	});
});

// save sent data in json
app.post("/", (req, res) => {
	res.sendStatus(201);
	let data = req.body;
	console.log(data);

	// checks if the frontend wants to save the commands
	if (data.saveCommands) {
		data = JSON.stringify(data);
		writeFile("saved.json", data, (err) => {
			if (err) {
				throw err;
			} else {
				console.log("saved in a file!");
			}
		});
	} else {
		console.log("no saving");
	}
});

// ======================== PUPPETEER_____SECTION__START =================================
// check mark to tell if the puppeteer is ready
let ready = true; // at first puppeteer is ready
app.get('/ready',(req,res)=>{
	res.send({"ready": ready})
})
// puppeteer code injection starts here
import puppeteer from "puppeteer";
const USER_AGENT =
	"Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36";
let options = {
	// For debugging purpose
	headless: false,

	defaultViewport: {
		width: 320,
		height: 570,
	},
};
const browser = await puppeteer.launch(options);
let page = await browser.newPage();
// keep all the data here
const keep = {};
// puppeteer runs from this function
const runInPuppeteer = (command) => {
	if (ready) {
		try {
			ready = false; // set ready to false so we can delay the next puppeteer command 
			console.log("running in puppeteer : " + command);
			eval(command);
		} catch (error) {
			console.log(error);
		}
		setTimeout(() => {
			console.log("timeout was set to 1 sec");
			ready = true;
		}, 2000);
	} else {
		console.log("Maximum 1 request per second");
	}
};
// ======================== PUPPETEER_____SECTION____END ===========================

// Get new command from here
app.post("/newCommand", (req, res) => {
	res.sendStatus(201);
	let newCommand = req.body;

	// run command in puppeteer
	runInPuppeteer(newCommand.command);
});

app.post("/runAll",(req,res)=>{
	res.sendStatus(201)
	console.log(req.body)
})

// app listens on port 3000
app.listen(PORT, () => {
	console.log("started server at port " + PORT);
});
