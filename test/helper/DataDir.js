const expect = require("chai").expect;
const fs = require('fs');

const DataDir = require('../../helper/DataDir');

describe("Test DataDir...", async function () {

    describe("test with 'test-a' datasetName", async function(){
        var dataDir = await DataDir.createDataDir("test-a");
        expect(dataDir.getPath()).to.contains("/test-a");
        expect(fs.existsSync(dataDir.getPath())).to.be.true;
        await dataDir.remove();
        expect(fs.existsSync(dataDir.getPath())).to.be.false;
    });

    describe("test with 'test-b/01' datasetName", async function(){
        var dataDir = await DataDir.createDataDir("test-b/01");
        expect(dataDir.getPath()).to.contains(
            "/test-b/01",
            "path should end with /test-b/01"
        );
        expect(fs.existsSync(dataDir.getPath())).to.be.true;
        await dataDir.remove();
        expect(fs.existsSync(dataDir.getPath())).to.be.false;
    });


});

