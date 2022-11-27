const path = require('path');
const programDir = path.join(__dirname,'programs','staking_attempt_1');
const idlDir = path.join(__dirname,'target','idl');
const sdkDir = path.join(programDir,'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'anchor',
  programName: 'ember_bed',
  programId: '4P2k37Nde5YmCHhBsCWu7wC4FpMpQuW2Vscdohsy2b6D',
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};