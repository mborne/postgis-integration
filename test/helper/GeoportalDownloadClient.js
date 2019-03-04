const expect = require("chai").expect;

const GeoportalDownloadClient = require('../../helper/GeoportalDownloadClient');
const client = new GeoportalDownloadClient({
    url: 'https://wxs-telechargement.ign.fr/x02uy2aiwjo9bm8ce5plwqmr/telechargement/prepackage'
});


describe("Testing GeoportalDownloadClient with adminexpress", function () {
    this.timeout(5000);

    describe("Testing GeoportalDownloadClient#getResources()", function(){
        it("should be return an array", async function () {
            let resources = await client.getResources();
            expect(resources).to.be.an('array');
            resources.forEach(resource => {
                expect(resource).to.have.property('name');
                expect(resource.name.startsWith("ADMINEXPRESS")).equals(true);
                expect(resource).to.have.property('url');
            });
        });
    });

    describe("Testing GeoportalDownloadClient#getLatestResource() and resolveFiles()", function(){
        it("should return a single resource", async function () {
            let resource = await client.getLatestResource();
            expect(resource).to.have.property('name');
            expect(resource.name.startsWith("ADMINEXPRESS")).equals(true);
            expect(resource).to.have.property('url');

            await client.resolveFiles(resource);
            expect(resource).to.have.property('version');
            expect(resource.files).to.be.an('array');
            resource.files.forEach(file => {
                expect(file).to.have.property('type');
                expect(file).to.have.property('name');
                expect(file).to.have.property('md5');
                expect(file).to.have.property('size');
                expect(file).to.have.property('url');                
            });
        });
    });    

    describe("Testing GeoportalDownloadClient#resolveFiles(resource)", function(){
        it("should be return an array", async function () {
            let resources = await client.getResources();
            expect(resources).to.be.an('array');
            resources.forEach(resource => {
                expect(resource).to.have.property('name');
                expect(resource.name.startsWith("ADMINEXPRESS")).equals(true);
                expect(resource).to.have.property('url');                
            });
        });
    });
});

