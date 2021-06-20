const app = Vue.createApp({
	data() {
		return {
			base_url: "//localhost:3000",
			commandDB: {
				commandList: [
					"this is command1",
					"this is command2",
					"this is command 3",
				],
				restartInstance: false,
				runFromStart: false,
				saveCommands: false,
			},
			command: "",
			cmd_count: 0,
			data: {},
		};
	},
	created() {
		this.updateDB();
	},
	methods: {
		// update command list
		updateDB() {
			console.log("Got saved data from the server");
			// get saved data from the server
			const url = this.base_url + "/saved";
			fetch(url, {
				method: "GET",
				accept: "application/json",
				"content-type": "application/json",
			})
				.then((res) => res.json())
				.then((res) => {
					// temporarily save the data
					this.commandDB = res;
					console.log("updated commandDB");
				})
				.catch((err) => console.log(err));
		},

		// add new command to the list
		// this also saves the command list to the backend
		addCommand() {
			if (this.command != "") {
				this.commandDB.commandList.unshift(this.command);

				(async () => {
					const url = this.base_url + "/newCommand";
					const res = await fetch(url, {
						method: "POST",
						headers: {
							Accept: "application/json",
							"content-type": "application/json",
						},
						body: JSON.stringify({ command: this.command }),
					});
				})();

				this.command = "";
                this.cmd_count = 0; // resetting 
			}
		},
		// removes command from the list
		removeCommand(commandIndex) {
			this.commandDB.commandList = this.commandDB.commandList.filter(
				(item, index) => {
					return index != commandIndex;
				}
			);
		},
		// post request to /
		postCommand() {
			(async () => {
				const url = this.base_url;
				const res = await fetch(url, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify(this.commandDB),
				});
			})();
		},
		restartNow() {
			this.commandDB.restartInstance = true;
			this.postCommand();
			this.commandDB.restartInstance = false;
		},
		// save commands to the backend
		save() {
			this.commandDB.saveCommands = true;
			this.postCommand();
			this.commandDB.saveCommands = false;
		},
		// Redo a command
		redoCommand(index) {
			console.log("redo command index " + index);
			const newC = this.commandDB.commandList[index];
			// disable the button for some time
			const btn = document
				.querySelector("ul")
				.children[index].querySelector(".safe");
			const waitDisk = document
				.querySelector("ul")
				.children[index].querySelector(".no-click");

			btn.classList.toggle("hide");
			waitDisk.classList.toggle("hide");
			setTimeout(() => {
				btn.classList.toggle("hide");
				waitDisk.classList.toggle("hide");
			}, 1000);

			console.log(newC);
			(async () => {
				const url = this.base_url + "/newCommand";
				const res = await fetch(url, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"content-type": "application/json",
					},
					body: JSON.stringify({ command: newC }),
				});
			})();
		},

		// delaying Function
		// blocks main eventLoop to simulate synchronous sleep
		delay(ms, callbackFunc = () => {}) {
			Atomics.wait(new Int32Array(new SharedArrayBuffer(32)), 0, 0, ms);
			callbackFunc();
		},

		// adding accessing history feature
		arrowUp() {
			if (this.cmd_count == 0) {
				// do nothing
			} else {
				this.cmd_count--;
				if (this.cmd_count == 0) {
					this.command = "";
				} else {
					this.command = this.commandDB.commandList[this.cmd_count - 1];
				}
			}
		},
		arrowDown() {
			const command_list_len = this.commandDB.commandList.length;
			if (this.cmd_count == command_list_len) {
				// do nothing
			} else {
				this.cmd_count++;
				this.command = this.commandDB.commandList[this.cmd_count - 1];
			}
		},

		// run all the commands one by one
		runAll() {
			console.log("clicked runAll");

			let data = [...this.commandDB.commandList];
			data.reverse();
			console.log(data);

			const url = this.base_url + "/runAll";
			fetch(url, {
				method: "POST",
				headers: {
					accept: "application/json",
					"content-type": "application/json",
				},
				body: JSON.stringify(data),
			});
		},
	},
});

app.mount("#app");
