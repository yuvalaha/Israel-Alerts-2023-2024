const yargs = require('yargs');
const notes = require("./notes.js");


// Customize yargs version
yargs.version("1.1.0");


// Read Command
yargs.command({
    command: "read",
    description: "Reading.",
    builder: {
        city: {
            describe: "Reading a note",
            demandOption: true,
            type: "string",
        },
    },
    handler (argv) {
        notes.readNote(argv.city)
    }
})




yargs.parse();
