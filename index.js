import express, { json, urlencoded } from "express";
import { readFile, writeFile } from "fs";
import open from "open";
// variables
const PORT = process.env.PORT || 3000;

// declaring app and all the middleware
const app = express();
app.use(express.static("static"));
app.use(json());
app.use(urlencoded({ extended: true }));

//=====================CUSTOM_FUNCTION_END==================================
const delay = (ms, callbackFunc = () => {}) => {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(32)), 0, 0, ms);
	callbackFunc();
};

//=======================CUSTOM_FUNCTION_END=================================

// get previously saved data in json
app.get("/saved", (req, res) => {
	readFile("saved.json", (err, data) => {
		if (err) {
			console.log(err);
			return res.send({
				commandList: [
					"page.goto('https://google.com')",
					"console.log('hello world')",
				],
				restartInstance: false,
				runFromStart: false,
				saveCommands: true,
			}); // send a dummy object if file not found
		} else {
			// console.log(JSON.parse(data));
			return res.send(JSON.parse(data));
		}
	});
});

// save sent data in json
app.post("/", (req, res) => {
	res.sendStatus(201);
	let data = req.body;
	// console.log(data);

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

// puppeteer code injection starts here
// import puppeteer from "puppeteer";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

const USER_AGENT =
	"Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36";
let options = {
	headless: false, // For debugging purpose
	defaultViewport: {
		width: 320,
		height: 570,
	},
};
const browser = await puppeteer.launch(options);
let page = await browser.newPage();

// keep all the data here for runtime purposes, canbe accessed from the virtual console
let keep = {};

// check mark to tell if the puppeteer is ready
let ready = true; // at first puppeteer is ready

// puppeteer runs from this function
const runInPuppeteer = (command) => {
	if (ready) {
		try {
			ready = false; // set ready to false so we can delay the next puppeteer command
			eval(command); // magic happens in this line :)
		} catch (error) {
			console.log(error);
		}
		console.log(`completed task: ${command}`);
		ready = true;
	} else {
		console.log("Maximum 1 request per second");
	}
};
// ======================== PUPPETEER_____SECTION____END ===========================

// Get new command from here
app.post("/newCommand", (req, res) => {
	res.sendStatus(201);
	let newCommand = req.body;
	runInPuppeteer(newCommand.command); // run command in puppeteer
});

// runs all the commands one by one
app.post("/runAll", (req, res) => {
	res.sendStatus(201);
	const allCommands = req.body;
	console.log(`\n\n\nrunning ${allCommands.length} commands...`);

	allCommands.forEach((command) => {
		runInPuppeteer(command);
		delay(3000);
	});
});

// generate Script
app.post("/generate",(req,res)=>{
    console.log("generated...")
    res.send({
	    link: "https://google.com"
    })
    console.log(req.body)
})

// app listens on port 3000
app.listen(PORT, () => {
	console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
	console.log("=======================*******==========================");
	console.log("\n\n\n");
	console.log("Open in browser: ");
	console.log("SERVER STARTED AT:>>>>>> http://localhost:" + PORT);
	console.log("\n\n\n");
});
// open app in a browser
// await open("http://localhost:" + PORT);
