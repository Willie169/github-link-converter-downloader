const { exec } = require('child_process');
const path = require('path');

function githubLinkConverter(link) {
    const releaseTagPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/releases\/tag\/([\d\.]+)\/([\w\-\.]+)$/;
    const blobPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([\w\/\-\.]+)$/;
    const releaseDownloadPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/releases\/download\/([\d\.]+)\/([\w\-\.]+)$/;
    const rawPattern = /https:\/\/raw\.githubusercontent\.com\/([\w-]+)\/([\w-]+)\/([\w\/\-\.]+)$/;
    if (releaseTagPattern.test(link)) {
        return link.replace(releaseTagPattern, 'https://github.com/$1/$2/releases/download/$3/$4');
    }
    if (blobPattern.test(link)) {
        return link.replace(blobPattern, 'https://raw.githubusercontent.com/$1/$2/$3');
    }
    if (releaseDownloadPattern.test(link)) {
        return link.replace(releaseDownloadPattern, 'https://github.com/$1/$2/releases/tag/$3/$4');
    }
    if (rawPattern.test(link)) {
        return link.replace(rawPattern, 'https://github.com/$1/$2/blob/$3');
    }
    return 'Invalid Input.';
}

function downloadFile(link, method) {
    const transformedLink = githubLinkConverter(link);
    if (method === 'wget') {
        exec(`wget -O ${path.basename(transformedLink)} ${transformedLink}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`Downloaded with wget: ${stdout}`);
        });
    } else if (method === 'clink') {
        exec(`clink -o ${path.basename(transformedLink)} ${transformedLink}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`Downloaded with clink: ${stdout}`);
        });
    }
}

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: node githubLinkConverter.js <link1> <link2> ... [-w|--wget | -c|--clink]");
    process.exit(1);
}

let method = null;

if (args.includes('-w') || args.includes('--wget')) {
    method = 'wget';
} else if (args.includes('-c') || args.includes('--clink')) {
    method = 'clink';
}

const links = args.filter(arg => !arg.startsWith('-'));

if (method) {
    links.forEach((link) => {
        downloadFile(link, method);
    });
} else {
    links.forEach((link) => {
        const transformedLink = githubLinkConverter(link);
        console.log(`${transformedLink}\n`);
    });
}
