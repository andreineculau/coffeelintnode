/*jshint node:true, strict:false*/

/* HTTP interface to coffeelint
 *
 * Basically copied from lintnode.git: https://github.com/keturn/lintnode

   Invoke from bash script like:

     curl --form source='<${1}' --form filename='${1}' ${COFFEELINT_URL}

   or use the provided coffeelint.curl

     coffeelint.curl <file>

*/

var express = require('express'),
    COFFEELINT = require('coffeelint'),
    fs = require('fs'),
    _ = require('underscore'),
    app,
    coffeelintPort = 3004,
    coffeelintrc,
    coffeelintOptions,
    parseCommandLine,
    outputErrors,
    exampleFunc;


parseCommandLine = function() {
    var port_index,
        coffeelintrc_index,
        properties;

    port_index = process.argv.indexOf('--port');
    coffeelintrc_index = process.argv.indexOf('--coffeelintrc');
    if (port_index > -1) {
        coffeelintPort = process.argv[port_index + 1];
    }
    if (coffeelintrc_index > -1) {
        coffeelintrc = process.argv[coffeelintrc_index + 1];
        coffeelintOptions = JSON.parse(fs.readFileSync(coffeelintrc, 'utf8'));
    }
    console.log(coffeelintOptions);
};

outputErrors = function (errors) {
    var e,
        i,
        output = [],
        write;

    //console.log('Handling ' + errors.length + 'errors' + '\n');
    write = function(s) {
        output.push(s + '\n');
    };

    /* This formatting is copied from JSLint's rhino.js, to be compatible with
       the command-line invocation. */
    for (i = 0; i < errors.length; i++) {
        e = errors[i];
        //console.log(e);
        if (e) {
            write('Lint at line ' + e.lineNumber + ': ' + e.message);
            write((e.context || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1'));
            write('');
        }
    }

    return output.join('');
};

/* This action always return some JSLint problems. */
exampleFunc = function (req, res) {
    var errors = COFFEELINT.lint('a = () -> alert "end of line - no need for ;";',
                                 coffeelintOptions);
    res.send(outputErrors(errors),
             {'Content-Type': 'text/plain'});
};


app = express();

app.configure(function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(express.bodyParser());
});

app.get('/', function (req, res) {
    res.send('lintnode');
});

app.post('/coffeelint', function (req, res) {
    function doLint(sourcedata) {
        var errors, results;
        errors = COFFEELINT.lint(sourcedata, coffeelintOptions);
        //console.log(errors);
        if (!errors.length) {
            results = 'coffeelint: No problems found in ' + req.body.filename + '\n';
        } else {
            results = outputErrors(errors);
        }
        return results;
    }
    res.send(doLint(req.body.source), {'Content-Type': 'text/plain'});
});

app.get('/example/errors', exampleFunc);
app.post('/example/errors', exampleFunc);

/* This action always returns JSLint's a-okay message. */
app.post('/example/ok', function (req, res) {
    res.send('coffeelint: No problems found in example.js\n',
        {'Content-Type': 'text/plain'});
});

process.on('SIGINT', function () {
    console.log('\n[coffeelintnode] received SIGINT, shutting down');
    process.exit(0);
});

parseCommandLine();
console.log('[lintnode]');
app.listen(coffeelintPort, function () {
    console.log('[coffeelintnode] server running on port', coffeelintPort);
});
