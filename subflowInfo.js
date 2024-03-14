// List of domains you exported with conductor
let exportedDomains = ['01one'];
let myFlows = [];
let pathDirs = [];

function scrapeDirectory(dirName, children, path) {
    console.log(`Looking through ${dirName}`)
    children.forEach(child => {
        if(child.type === 'FOLDER') {
            pathDirs.push(child.name)
            scrapeDirectory(child, `${path}/${child.name}`)
        } 
    })
    children.forEach(child => {
        if(child.type === 'DESIGNER') {
            updatedPath = `${path}flow_models/${dirName}/`
            pathDirs.forEach(pathDir => { updatedPath += `${pathDir}/`})
            childProcess(child, updatedPath)
        } 
    })
    pathDirs.pop()
}

function childProcess(flow, path) {
    console.log(`Adding ${flow.name}`)
    if(!myFlows.includes(flow.name)) {
        let fullFlow = require(`${path}${flow.name}/${flow.name}.json`);
        myFlows.push(fullFlow);
    }
}

exportedDomains.forEach(domain => {
    let domainFlows = require(`./${domain}/deb_flow/deb_flow_list`);
    domainFlows.forEach(flow => {
        let path = `./${domain}/deb_flow/`;
        if(flow.type === 'FOLDER') {
            scrapeDirectory(flow.name, flow.children, path);
        }
    })
});

// console.log(myFlows)

let scriptLibrary = [];
let subflows = [];

myFlows.forEach(flow => {
    let flowName = flow.name;
    let blocks = flow.blocks;
    blocks.forEach(block => {
        if(block.type === 'Script') {
            if(block.includedScripts.length) {
                block.includedScripts.forEach(scriptLib => scriptLibrary.push({
                    "flow": flowName,
                    "blockName": block.name,
                    "scriptLib": scriptLib
                }))
            }
        } else if(block.type === 'SubFlow') {
            subflows.push({
                "flow": flowName,
                "subflow": block.flowName
            })
        }
    })
})

console.log(scriptLibrary);
console.log(subflows);