import * as fs from 'fs';

export class FileReaderAndWriter {
    static writeFile(jsonObject, filePath) {
        const fullFilePath = __dirname + filePath;
        console.log(`Full Path: ${fullFilePath}`);
        const jsonString = JSON.stringify(jsonObject);

        fs.writeFile(fullFilePath, jsonString, (err) => {
            if (err) {
                console.log(`ERROR: ${err.message}`);
                throw err;
            }

            console.log('File saved!');
            return jsonObject;
        });
    }

    static readFile(filePath) {
        filePath = __dirname + filePath;
        try {
            return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }
}
