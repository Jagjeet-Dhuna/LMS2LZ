function convertText() {
    let azureDef = document.getElementById("azure-name").value;
    let hyperVDef = document.getElementById("hyperV-name").value;
    let lines = document.getElementById("text-input").value.split("\n");

    let modified_lines = [];
    let start_time = Date.now();

    lines.forEach(line => {
        let modified_line = line
            .replace(/\*\*\[\`/g, '<span style="color: #3c5fde;">!!</span>')
            .replace(/\`\]\(urn:gd:lg:a:send-vm-keys\)\*\*/g, '<span style="color: #3c5fde;">!!</span>')
            .replace(/\*\*\[/g, '<span style="color: #3c5fde;">!!</span>')
            .replace(/\]\(urn:gd:lg:a:send-vm-keys\)\*\*/g, '<span style="color: #3c5fde;">!!</span>')
            .replace(/\(hyperVLab\)\.vm/g, '<span style="color: #3c5fde;">(' + hyperVDef + ').vm</span>')
            .replace(/\.user\((\d+)\)\.username/g, '<span style="color: #3c5fde;">.credentials($1).username</span>')
            .replace(/\.user\((\d+)\)\.password/g, '<span style="color: #3c5fde;">.credentials($1).password</span>')
            .replace(/\(azure\)\.username/g, '<span style="color: #3c5fde;">(' + azureDef + ').credentials(0).username</span>')
            .replace(/\(azure\)\.password/g, '<span style="color: #3c5fde;">(' + azureDef + ').credentials(0).password</span>')
            .replace(/\(azure\)\.subscriptionName/g, '<span style="color: #3c5fde;">(' + azureDef + ').subscriptionName</span>')
            .replace(/\$gd\.com\(azure\)\.resourceGroups\(/g, "$gd.com(" + azureDef + ").resourceGroups(");

        if (modified_line.includes('resourceGroups')) {
            modified_line = modified_line.replace(/(\.resourceGroups\(.+?\))/g, '$1.name');
        }
        modified_lines.push(modified_line);
    });

    let end_time = Date.now();
    let elapsed_time = end_time - start_time;

    // Use pre tag for output
    document.getElementById("text-output").innerHTML = '<pre>' + modified_lines.join("\n") + '</pre>';

    console.log(`The process took ${elapsed_time / 1000} seconds.`);
}

document.getElementById('convert-button').addEventListener('click', convertText);

document.getElementById('copy-button').addEventListener('click', function() {
    const outputText = document.getElementById('text-output').innerText;
    const hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.style.position = 'fixed';
    hiddenTextarea.style.top = '0';
    hiddenTextarea.style.left = '0';
    hiddenTextarea.style.opacity = '0';
    hiddenTextarea.value = outputText;
    document.body.appendChild(hiddenTextarea);
    hiddenTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(hiddenTextarea);
    console.log('Text copied to clipboard.');
});


// Dark mode

/* ... rest of your JS ... */

// Get the toggle switch
var toggleSwitch = document.getElementById('toggle');

// Check for saved 'darkMode' in localStorage
if (localStorage.getItem('darkMode')) {
    // If 'darkMode' is found in localStorage, apply it to body
    document.body.classList.add('dark-mode');

    // Update the checkbox state
    toggleSwitch.checked = true;
}

// Add event listener to the checkbox
toggleSwitch.addEventListener('change', function() {
    // When checkbox is clicked, toggle the 'dark-mode' class
    document.body.classList.toggle('dark-mode');
    
    // Save the current mode to localStorage
    if (document.body.classList.contains('dark-mode')) {
        // Save 'darkMode'
        localStorage.setItem('darkMode', true);
    } else {
        // Remove 'darkMode' from localStorage
        localStorage.removeItem('darkMode');
    }
});

