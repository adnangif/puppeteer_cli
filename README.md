# Puppeteer on steroids :muscle: !!!

**jupyter notebook** like development environment for puppeteer. Build puppeteer apps with least effort and best result.

## installation

**requirements:**

* nodejs latest version
* Google Chrome or Chromium browser

### How to install:

```bash
# clone this repo
git clone https://github.com/adnangif/puppeteer_ui

# navigate to puppeteer_ui folder
cd puppeteer_ui 

# install yarn
npm install -g yarn

# install dependancy
yarn install

# now to run the APP
node index.js
```

Or,
```bash

# install yarn, this is optional but recommended
npm install -g yarn

# Now use yarn to install 
yarn global add puppeteer_steroids  # may take upto 20minutes depending on internet connection

# run from command line
puppeteer_ui


```


After running this code, a link should open on your default browser At: http://localhost:3000
And another blank page chromium or google chrome browser instance will open with puppeteer in charge. 

## Usage:
By default, **page** object is given to do any kind of operation, for Example:

```javascript
await page.goto("https://google.com/")
await page.type("input", "github.com/adnangif",{delay:200})
await page.type("input", "\n",{delay:200})
await page.click("h3")
await page.click("span[title='puppeteer_ui']")

```
## Demo

0.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_0.png)
1.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_21.png)
2.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_23.png)
3.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_24.png)
4.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_25.png)
5.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_26.png)
6.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_27.png)
7.
![first img](https://github.com/adnangif/puppeteer_ui/blob/final/demo/demo_goto_this_repo/demo_28.png)


> special thanks to **zbz343** for creating this awesome readme