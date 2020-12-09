import {FileReaderAndWriter} from "./FileSaveRequest";

export class ErrorLogger {
    static log(err) {
        const date = new Date();
        const timestamp = date.getTime().toString();
        const formattedDateTime = date.toISOString();
        FileReaderAndWriter.writeFile({
                message: err.message,
                time: formattedDateTime
            },
            `/../logs/error-${timestamp}.json`
        )
    }
}