const fs = require('fs');
console.log(fs.readFileSync('./testsprite_tests/tmp/raw_report.md', 'utf8').substring(0, 1000));
