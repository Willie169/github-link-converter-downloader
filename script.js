function githubUrlConverter(url) {
    const releaseTagPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/releases\/tag\/([\d\.]+)\/([\w\-\.]+)$/;
    const blobPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/blob\/([\w\/\-\.]+)$/;
    const releaseDownloadPattern = /https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/releases\/download\/([\d\.]+)\/([\w\-\.]+)$/;
    const rawPattern = /https:\/\/raw\.githubusercontent\.com\/([\w-]+)\/([\w-]+)\/([\w\/\-\.]+)$/;
    if (releaseTagPattern.test(url)) {
        return url.replace(releaseTagPattern, 'https://github.com/$1/$2/releases/download/$3/$4');
    }
    if (blobPattern.test(url)) {
        return url.replace(blobPattern, 'https://raw.githubusercontent.com/$1/$2/$3');
    }
    if (releaseDownloadPattern.test(url)) {
        return url.replace(releaseDownloadPattern, 'https://github.com/$1/$2/releases/tag/$3/$4');
    }
    if (rawPattern.test(url)) {
        return url.replace(rawPattern, 'https://github.com/$1/$2/blob/$3');
    }
    return 'Invalid Input.';
}

function output(event) {
    event.preventDefault();
    const result = githubUrlConverter(document.getElementById('input').value.trim());
    document.getElementById('result').textContent = result;
    console.log(result);
}