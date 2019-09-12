const fs = require('fs');
const path = require('path');

const servicename = process.argv[2];
const servicename_nonplural = process.argv[3];
const servicedescription = process.argv[4];
const serviceport = parseInt(process.argv[5]);
const servicename_lowercase = servicename.toLowerCase();
const servicename_nonplural_lowercase = servicename_nonplural.toLowerCase();
const servicename_key = '${{servicename}}';
const servicename_nonplural_key = '${{servicename_nonplural}}';
const servicedescription_key = '${{servicedescription}}';
const serviceport_key = '${{serviceport}}';
const servicename_lowercase_key = '${{servicename_lowercase}}';
const servicename_nonplural_lowercase_key = '${{servicename_nonplural_lowercase}}';

if (servicename.trim() == '') {
    throw 'service name cannot be blank';
}

if (servicename_nonplural.trim() == '') {
    throw 'service name (plural) cannot be blank';
} 

if (servicedescription.trim() == '') {
    throw 'service description cannot be blank';
}

if (isNaN(serviceport)) {
    throw 'service port must be a number';
}

const StampFile = (filepath) => {
    console.info(`Stamping file: ${filepath}`);
    return fs.writeFileSync(filepath, fs.readFileSync(filepath).toString()
                                        .replace(/\$\{\{servicename\}\}/g, servicename)
                                        .replace(/\$\{\{servicename_nonplural\}\}/g, servicename_nonplural)
                                        .replace(/\$\{\{servicedescription\}\}/g, servicedescription)
                                        .replace(/\$\{\{servicename_lowercase\}\}/g, servicename_lowercase)
                                        .replace(/\$\{\{servicename_nonplural_lowercase\}\}/g, servicename_nonplural_lowercase)
                                        .replace(/\$\{\{serviceport\}\}/g, serviceport));
}

const StampPackageJsonFile = () => {

    const packageJsonPath = path.join(__dirname, '/../package.json');

    StampFile(packageJsonPath);

    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

    const nameParts = packageJson.name.split('.').filter(s => s.trim() !== '');
    nameParts[nameParts.length - 1] = servicename_lowercase;

    packageJson.name = nameParts.join('.');

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
}

const WriteReadMeFile = () => {
    const content = `# Pseudonym.Node.Ecommerce.Service.${servicename}\r\nRESTful API compliant micro-service for managing ${servicename_lowercase} in node.js\r\n${servicedescription}`
    return fs.writeFileSync(path.join(__dirname, '/../README.md'), content);
}

const Walk = (dir) => {
    for (let item of fs.readdirSync(dir)) {
        fullPath = path.join(dir, item);

        if (item.includes('.')) {
            srcFiles.push({
                Path: dir,
                Name: item,
                FullPath: fullPath
            });
        }
        else {
            Walk(fullPath);
        }
    }
}

const RenameFile = (oldPath, newPath) => {
    console.info(`Renaming File ${oldPath} -> ${newPath}`);
    return fs.renameSync(oldPath, newPath);
}

StampPackageJsonFile();
WriteReadMeFile();

const srcFiles = [];

Walk(path.join(__dirname, '/../src'));

for (let fileInfo of srcFiles) {

    StampFile(fileInfo.FullPath);

    if (fileInfo.Name.includes(servicename_key)) {
        
        RenameFile(fileInfo.FullPath, path.join(fileInfo.Path, fileInfo.Name.replace(servicename_key, servicename)));
    }
    else if (fileInfo.Name.includes(servicename_nonplural_key)) {
        RenameFile(fileInfo.FullPath, path.join(fileInfo.Path, fileInfo.Name.replace(servicename_nonplural_key, servicename_nonplural)));
    }
    else if (fileInfo.Name.includes(servicedescription_key)) {
        RenameFile(fileInfo.FullPath, path.join(fileInfo.Path, fileInfo.Name.replace(servicedescription_key, servicedescription)));
    }
    else if (fileInfo.Name.includes(servicename_lowercase_key)) {
        RenameFile(fileInfo.FullPath, path.join(fileInfo.Path, fileInfo.Name.replace(servicename_lowercase_key, servicename_lowercase)));
    }
    else if (fileInfo.Name.includes(servicename_nonplural_lowercase_key)) {
        RenameFile(fileInfo.FullPath, path.join(fileInfo.Path, fileInfo.Name.replace(servicename_nonplural_lowercase_key, servicename_nonplural_lowercase)));
    }
}

console.info(`Scaffolding Complete processed ${srcFiles.length} files`);