var now = require("performance-now")
let itArr = [], beforeEachArr = [], describeArr = [], itOnlyArr = [], saveFailedStr = [];
let level = 1, failed = 0, passed = 0, isItOnly = false, id = 0, totalTimeOfTest = 0, printTime = false



const myPromise = (timeout, callback) => {
  return new Promise((resolve, reject) => {
      // Set up the timeout
      const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
      }, timeout);

      // Set up the real work
      callback(
          (value) => {
              clearTimeout(timer);
              resolve(value);
          },
          (error) => {
              clearTimeout(timer);
              reject(error);
          }
      );
  });
}

const executeTest = async (func) => {
  //myPromise(10000, async (resolve, reject) => {
    await func()
  //}).catch(err => {
    //throw err
  //})
}


const printResult = (printTime, millis, description) => {
  if (printTime) {
    console.log("%s✓ %s (%sms)", Array(level + 1).join("  "), description, millis);
    totalTimeOfTest += millis
  } else {
    console.log("%s✓ %s", Array(level + 1).join("  "), description);
  }
}

const start = async () => {
  await executeTree(root);
  console.log('');
  if (printTime) {
    console.log(`  ${passed} passing (${totalTimeOfTest}ms)`);
  } else {
    console.log(`  ${passed} passing`);
  }
  if (failed > 0) {
    console.log(`  ${failed} failing`)
    console.log('');
    printErrors(saveFailedStr);
  }
}

const haveAPathToItOnly = (node) => {
  if (node.itsOnly.length > 0) return true
  for (let i = 0; i < node.children.length; i++) {
    if (haveAPathToItOnly(node.children[i]) == true)
      return true
  }
  return false
}

const executeBefores = async (befores) => {
  for (let i = 0; i < befores.length; i++) {
    let before = befores[i];
    await before();
  }
}

const printErrors = (errorArr) => {
  for (let i = 1; i < errorArr.length; i++) {
    console.log(`  ${i}) ${errorArr[i].description}:`)
    console.log('')
    console.log(`      ${errorArr[i].errStr}`)
    if (i != errorArr.length - 1) {
      console.log('')
    }
  }
}

const executeIt =  async (its, itsOnly, before, isItOnly) => {
  let arrToExecute =  isItOnly? itsOnly : its

  for (let i = 0; i < arrToExecute.length; i++) {
    let toExec = arrToExecute[i]
    await executeBefores(before)
    try{
      var start = now()
      await toExec.fn()
      var end = now()
      const millis = (end-start).toFixed(3) * 1000;
      printResult(printTime, millis, toExec.description)
      passed++;
    } catch (err) {
      failed++;
      console.log("%s%s) %s", Array(level + 1).join("  "), failed, toExec.description);
      saveFailedStr[failed] = {description: toExec.description, errStr: err.toString()}
    }
  }
}

const executeDescribe = (name) => {
    console.log("%s%s", Array(level + 1).join("  "), name);
    level++;
}


const executeTree = async (node) => {
  if (node !== null) {
    let { name, before, its, itsOnly, children, isItOnly } = node
    if (name != null) {
      if (!isItOnly || (isItOnly && haveAPathToItOnly(node)))
        executeDescribe(name)
    }
    await executeIt(its, itsOnly, before, isItOnly)
  }
  for (let i = 0; i < node.children.length; i++) {
    await executeTree(node.children[i])
  }
}

const buildTree = (node) => {
  //delete all elements in the queues:
  itArr = []
  beforeEachArr = []
  describeArr = []
  itOnlyArr = []
  for (let i = 0; i < node.children.length; i++) {
    let currDescribe = node.children[i];
    let description = currDescribe.description;
    let beforeEach =  node.before;
    let fn = currDescribe.fn
    fn()
    node.children[i] = {name: description, before: beforeEach.concat(beforeEachArr), its: itArr, itsOnly: itOnlyArr, children: describeArr, isItOnly: isItOnly || node.isItOnly}
    buildTree(node.children[i])
  }
}

global.it = function(description, fn) {
  itArr.push({description, fn, id})
  id++;
};

global.describe = function(description, fn) {
  describeArr.push({description, fn})
};

global.it.only = function(description, fn) {
  itOnlyArr.push({description, fn})
  isItOnly = true
}

global.beforeEach = function(fn) {
  beforeEachArr.push(fn)
};


require(process.argv[2]);

if (process.argv[3] != undefined) {
  printTime = true
}

let root = {name: null, before: beforeEachArr, its: itArr, itsOnly: itOnlyArr, children: describeArr, isItOnly: isItOnly}
isItOnly = false
buildTree(root)
start()


