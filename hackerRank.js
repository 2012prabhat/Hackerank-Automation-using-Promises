//npm i puppeteer;

let puppeteer = require("puppeteer");
const { answers } = require("./codes");
const emailPassObj = require("./secrets");
let browserStartPromise = puppeteer.launch({
    // to visible the browser we need to set the headless to the false.
    headless:false,
    defaultViewport : null,
    args:["--start-fullscreen","--disable-notification"],
    // slowMo:100,
});
let page, browser;
browserStartPromise
.then(function(browserObj){
    console.log("Browser Opened");
    browser = browserObj;
    let browserTabOpenPromise = browserObj.newPage();
    return browserTabOpenPromise;
})
   .then(function (newTab){
       page = newTab;
        console.log("new tab opened");
        let gPageOpenPromise = newTab.goto('https://www.hackerrank.com/auth/login');
        return gPageOpenPromise;
   })
   .then(function (){
            console.log("HackerRank page opened");
        
        let emailEnterPromise =page.type("input[id='input-1']",emailPassObj.email,{delay:50});
        return emailEnterPromise;
    })
    .then(function (){
    let passwordEnterPromise =page.type("input[type='password']",emailPassObj.password,{delay:50});
    return passwordEnterPromise;
})
.then(function () {
    let loginWillBeDOnepromise =
        page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
    return loginWillBeDOnepromise;
})
.then(function () {
    let clickedOnAlgoPromise =
        waitAndClick(".track-card a[data-attr2='algorithms']", page);
    return clickedOnAlgoPromise;
}).then(function () {
    let getToWarmUp =
        waitAndClick("input[value='warmup']", page);
    return getToWarmUp;
}).then(function () {
    let waitFor3SecondsPromise = page.waitFor(3000);
    return waitFor3SecondsPromise;
}).then(function () {
    let AllChallengesArrPromise =
        page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled"
            , { delay: 100 });
    return AllChallengesArrPromise;
}).then(function (questionsArr) {
    // n number of question first 
    console.log("number of questions", questionsArr.length);
    let qWillBeSolvedPromise = questionSolver(page, questionsArr[1], answers[1]);
    return qWillBeSolvedPromise;
}).then(function () {
    console.log("question is solved");
})
function waitAndClick(selector, cPage) {
return new Promise(function (resolve, reject) {
    let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
    waitForModalPromise
        .then(function () {
            let clickModal =
                cPage.click(selector, { delay: 100 });
            return clickModal;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err)
        })
}
)
}

// return a promise -> that will submit a given question 
function questionSolver(page, question, answer) {
return new Promise(function (resolve, reject) {
    let qWillBeCLickedPromise = question.click();

    qWillBeCLickedPromise
        //click
        // code type 
        // ctrl A+ ctrl x
        // click on editor 
        // ctrl A+ctrl v
        //  reached to editor
        .then(function () {
            // focus 
            let waitFOrEditorToBeInFocus =
                waitAndClick(".monaco-editor.no-user-select.vs", page);
            return waitFOrEditorToBeInFocus;
        })
        // click
        .then(function () {
            return waitAndClick(".checkbox-input", page);
        }).then(function () {
 return page.waitForSelector("textarea.custominput", { visible: true });
        })
        .then(function () {
            return page.type("textarea.custominput", answer, { delay: 10 });
        }).then(function () {
            let ctrlIsPressedP = page.keyboard.down("Control");
            return ctrlIsPressedP;
        }).then(function () {
            let AIsPressedP = page.keyboard.press("A", { delay: 100 });
            return AIsPressedP;
        }).then(function () {
            return page.keyboard.press("X", { delay: 100 });
        }).then(function () {
            let ctrlIsPressedP = page.keyboard.up("Control");
            return ctrlIsPressedP;
        })
        .then(function () {
            // focus 
            let waitFOrEditorToBeInFocus =
                waitAndClick(".monaco-editor.no-user-select.vs", page);
            return waitFOrEditorToBeInFocus;
        })
        .then(function () {
            let ctrlIsPressedP = page.keyboard.down("Control");
            return ctrlIsPressedP;
        }).then(function () {
            let AIsPressedP = page.keyboard.press("A", { delay: 100 });
            return AIsPressedP;
        }).then(function () {
            let AIsPressedP = page.keyboard.press("V", { delay: 100 });
            return AIsPressedP;
        }).then(function () {
            let ctrlIsPressedP = page.keyboard.up("Control");
            return ctrlIsPressedP;
        }).then(function () {
            return page.click(".hr-monaco__run-code", { delay: 50 });
        })
        .then(function () {
            resolve();
        }).catch(function (err) {
            console.log(err)
            reject(err);
        })
})
}


