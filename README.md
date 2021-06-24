# Puppeteer on steroids :muscle: !!!

**jupyter notebook** like development environment for puppeteer. Build puppeteer apps with least effort and best result.

## installation

**requirements:**

* nodejs latest version

### How to install:

```bash
# clone this repo
git clone https://github.com/adnangif/puppeteer_cli 

# navigate to puppeteer_cli folder
cd puppeteer_cli 

# install yarn
npm install -g yarn

# install dependancy
yarn install

# now to run the APP
node index.js
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
await page.click("span[title='puppeteer_cli']")

```
