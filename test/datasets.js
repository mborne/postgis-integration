const expect = require("chai").expect;

const fs   = require('fs');
const path = require('path');

const datasets = require('../datasets');

const DATASETS_DIR = path.resolve(__dirname,'../datasets');

describe("Check conventions for datasets...", function () {
    Object.keys(datasets).map(function (datasetName) {
        const dataset = datasets[datasetName];

        describe("Check conventions for "+datasetName, function () {

            /* check dataset.name */
            it("should have property 'name'", function () {
                expect(dataset).to.have.property('name');
            });
            it("dataset.name should be equal to " + datasetName, function () {
                expect(dataset.name).to.equal(datasetName);
            });

            /* check dataset.description */
            it("should have property 'description'", function () {
                expect(dataset).to.have.property('description');
            });

            /* check dataset.homepage */
            it("should have property 'homepage'", function () {
                expect(dataset).to.have.property('homepage');
            });

            /* check dataset.url */
            it("should have property 'url'", function () {
                expect(dataset).to.have.property('url');
            });

            /* check dataset.version */
            it("should have property 'version'", function () {
                expect(dataset).to.have.property('version');
            });

            /* check import.js script */
            it("should have import.js script", function () {
                let path = DATASETS_DIR+'/'+datasetName+'/import.js';
                expect(fs.existsSync(path)).to.be.true;
            });
        });

    });

});
