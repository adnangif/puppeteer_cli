import express, { json, urlencoded } from "express";
import { readFile, writeFile } from "fs";
import open from "open";

// variables
const PORT = process.env.PORT || 3000;

// logs error to the console
var previous_task_ok = true;
var error_msg = "";
const callback_for_process = (err) => {
	console.log("   error found >>>");
	console.log("       " + err.message);
	error_msg = err.message;
	previous_task_ok = false;
};
process.on("uncaughtException", callback_for_process);

// declaring app and all the middleware
const app = express();
app.use(express.static("static"));
app.use(json());
app.use(urlencoded({ extended: true }));

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
			return res.send(JSON.parse(data));
		}
	});
});

// save sent data in json
app.post("/", (req, res) => {
	res.sendStatus(201);
	let data = req.body;

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
import puppeteer from "puppeteer-extra"; 
import StealthPlugin from "puppeteer-extra-plugin-stealth";   // Some stealthy thing, I don't know what it does but it actually works
puppeteer.use(StealthPlugin());

// the website will think you are on SAMSUNG GALAXY S9
// useful for insta posting
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

// puppeteer runs from this function

const runInPuppeteer = (command) => {
	console.log("");
	console.log("<========>");
	console.log(`At task: ${command}`);
	try {
		let cmd = command
		if (cmd.includes("await page")){
			cmd = cmd.replace("await ","")
		}
		eval(cmd); // magic happens in this line :)
		previous_task_ok = true;
	} catch (error) {
		// throw error;
		error_msg = error.message;
		console.log(error_msg);
		previous_task_ok = false;
	}

};
// ======================== PUPPETEER_____SECTION____END ===========================


// check if previous task succeeded
app.get("/previous", (req, res) => {
	if (previous_task_ok) {
		res.send({ message: "success" });
	} else {
		res.send({ message: error_msg });
	}
});

// Get new command from here
app.post("/newCommand", (req, res) => {
	res.sendStatus(201);
	let newCommand = req.body;
	runInPuppeteer(newCommand.command); // run command in puppeteer

});

// app listens on port 3000
app.listen(PORT, () => {
	console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
	console.log("=======================*******==========================");
	console.log("\n\n\n");
	console.log("Opening browser: ");
	console.log("SERVER STARTED AT:>>>>>> http://localhost:" + PORT);
	console.log("\n\n\n");
});
// open app in a browser
await open("http://localhost:" + PORT);
