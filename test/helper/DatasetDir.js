const expect = require("chai").expect;
const fs = require('fs');

const DatasetDir = require('../../helper/DatasetDir');

describe("Test DataDir...", function () {

    describe("test with 'test' datasetName",function(){
        var datasetDir = null;
        it("should have path ending with /test", function () {
            datasetDir = new DatasetDir("test");
            expect(datasetDir.getPath()).to.contains("/test");
        });
        it("should have created directory", function () {
            expect(fs.existsSync(datasetDir.getPath())).to.be.true;
        });
        it("should remove file for remove", function () {
            datasetDir.remove();
            expect(fs.existsSync(datasetDir.getPath())).to.be.false;
        });
    });

    describe("test with 'test/01' datasetName",function(){
        var datasetDir = null;
        it("should have path ending with /test/01", function () {
            datasetDir = new DatasetDir("test/01");
            expect(datasetDir.getPath()).to.contains("/test/01");
        });
        it("should have created directory", function () {
            expect(fs.existsSync(datasetDir.getPath())).to.be.true;
        });
        it("should remove file for remove", function () {
            datasetDir.remove();
            expect(fs.existsSync(datasetDir.getPath())).to.be.false;
        });
    });


});

