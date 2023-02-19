const fs = require('fs');

try {
  let rawdata = fs.readFileSync('package-lock.json');
  let student = JSON.parse(rawdata);
  const regExp = /git\+ssh:\/\/git@bitbucket.org/;
  const correctPath = 'git+https://bitbucket.org';
  let original = student.packages['node_modules/@boom-platform/globals'].resolved;
  student.packages['node_modules/@boom-platform/globals'].resolved = original.replace(
    regExp,
    correctPath
  );
  original = student.dependencies['@boom-platform/globals'].version;
  student.dependencies['@boom-platform/globals'].version = original.replace(regExp, correctPath);
  fs.writeFileSync('package-lock.json', JSON.stringify(student, null, 2));
  console.log('package-lock.json fixed');
} catch (e) {
  console.log('Error fixing package-lock.json', e);
}
process.exit(0);
