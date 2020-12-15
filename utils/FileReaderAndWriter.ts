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
        const fullFilePath = __dirname + filePath;
        console.log(`filePath: ${fullFilePath}`)
        try {
            return JSON.parse(fs.readFileSync(fullFilePath, { encoding: 'utf-8' }));
        } catch (err) {
            console.log('Could not read file.');
            return null;
        }
    }
}
