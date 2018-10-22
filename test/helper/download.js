const expect = require("chai").expect;
const os = require('os');
const fs = require('fs');
const targetPath = os.tmpdir()+'/test-download';

const download = require('../../helper/download');

describe("Testing download", function () {
    beforeEach(function(){
    });

    afterEach(function(){
        if ( fs.existsSync(targetPath) ){
            fs.unlinkSync(targetPath);
        }
    });


    /* check dataset.name */
    it("should download a file to temp dir", async function () {
        await download({
            sourceUrl: 'https://raw.githubusercontent.com/mborne/satis-gitlab/master/composer.json',
            targetPath: targetPath
        });
        expect(fs.existsSync(targetPath)).to.equals(true);
        let content = fs.readFileSync(targetPath,'utf-8');
        expect(content).to.contains("guzzlehttp/guzzle");
    });
});

