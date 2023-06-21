let outputText;
let original_lines; // Define original_lines here

function convertText() {
    let azureDef = document.getElementById("azure-name").value;
    let hyperVDef = document.getElementById("hyperV-name").value;
    let lines = document.getElementById("text-input").value.split("\n");

    original_lines = [...lines]; // Store the original lines here

    let modified_lines = [];
    
    let start_time = Date.now();

    lines.forEach(line => {
        
        let modified_line = line
            .replace(/\*\*\[\`/g, '<span style="color: #3c5fde;">!!</span>') // **[` = !!
            .replace(/\`\]\(urn:gd:lg:a:send-vm-keys\)\*\*/g, '<span style="color: #3c5fde;">!!</span>') // `](urn:gd:lg:a:send-vm-keys)** = !!
            .replace(/\*\*\[/g, '<span style="color: #3c5fde;">!!</span>') // **[ = !!
            .replace(/\]\(urn:gd:lg:a:send-vm-keys\)\*\*/g, '<span style="color: #3c5fde;">!!</span>') // ](urn:gd:lg:a:send-vm-keys)** = !!
            .replace(/\(hyperVLab\)\.vm/g, '<span style="color: #3c5fde;">(' + hyperVDef + ').vm</span>') // hyperVLab.vm = hyperVDef.vm
            .replace(/\.user\((\d+)\)\.username/g, '<span style="color: #3c5fde;">.credentials($1).username</span>') // .user(n).username = .credentials(n).username
            .replace(/\.user\((\d+)\)\.password/g, '<span style="color: #3c5fde;">.credentials($1).password</span>') // .user(n).password = .credentials(n).password
            .replace(/\(azure\)\.username/g, '<span style="color: #3c5fde;">(' + azureDef + ').credentials(0).username</span>') // (azure).username = (azureDef).credentials(0).username
            .replace(/\(azure\)\.password/g, '<span style="color: #3c5fde;">(' + azureDef + ').credentials(0).password</span>') // (azure).password = (azureDef).credentials(0).password
            .replace(/\!\!\$gd\.com\(azure\)\.credentials\(0\)\.username\!\!/g, '!!$gd.com(<span style="color: #3c5fde;">' + azureDef + '</span>).credentials(0).username!!') // !!$gd.com(azure).credentials(0).username!! = !!$gd.com(azureDef).credentials(0).username!!
            .replace(/\!\!\$gd\.com\(azure\)\.credentials\(0\)\.password\!\!/g, '!!$gd.com(<span style="color: #3c5fde;">' + azureDef + '</span>).credentials(0).password!!') // !!$gd.com(azure).credentials(0).password!! = !!$gd.com(azureDef).credentials(0).password!!
            .replace(/\!\!\$gd\.com\(hyperVLab\)\.vm\((.+?)\)\.credentials\(0\)\.username\!\!/g, '!!$$gd.com(' + hyperVDef + ').vm($1).credentials(0).username!!') // !!$gd.com(hyperVLab).vm(LON-CL1).credentials(0).username!! = !!$$gd.com(hyperVDef).vm(LON-CL1).credentials(0).username!!
            .replace(/\!\!\$gd\.com\(hyperVLab\)\.vm\((.+?)\)\.credentials\(0\)\.password\!\!/g, '!!$$gd.com(' + hyperVDef + ').vm($1).credentials(0).password!!') // !!$gd.com(hyperVLab).vm(LON-CL1).credentials(0).password!! = !!$$gd.com(hyperVDef).vm(LON-CL1).credentials(0).password!!
                        .replace(/\(azure\)\.subscriptionName/g, '<span style="color: #3c5fde;">(' + azureDef + ').subscriptionName</span>') // (azure).subscriptionName = (azureDef).subscriptionName
            .replace(/\(azure\)\.subscriptionId/g, '<span style="color: #3c5fde;">(' + azureDef + ').subscriptionId</span>') // (azure).subscriptionId = (azureDef).subscriptionId
            .replace(/\$gd\.com\(azure\)\.resourceGroups\(/g, '$gd.com(<span style="color: #3c5fde;">' + azureDef + '</span>).resourceGroups(') // $gd.com(azure).resourceGroups( = $gd.com(azureDef).resourceGroups(
            

        if (modified_line.includes('resourceGroups') && !modified_line.includes(".name")) {
            modified_line = modified_line.replace(/(\.resourceGroups\(.+?\))/g, '$1.name');
        }
        modified_lines.push(modified_line);
    });

    outputText = modified_lines.join("\n"); // Set outputText here

    let end_time = Date.now();
    let elapsed_time = end_time - start_time;

    document.getElementById("text-output").innerHTML = '<pre>' + modified_lines.join("\n") + '</pre>';

    console.log(`The process took ${elapsed_time / 1000} seconds.`);

    // Store the original text in a data attribute for later use
    document.getElementById("text-output").dataset.outputText = original_lines.join("\n");
}

function successToast() {
    var x = document.getElementById("snackbarSuccess");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function errorToast() {
    var x = document.getElementById("snackbarError");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function clearText() {
    document.getElementById("text-input").value = "";
    document.getElementById("text-output").innerHTML = "";
    document.getElementById("azure-name").value = "";
    document.getElementById("hyperV-name").value = "";

    var x = document.getElementById("snackbarUpdated");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

document.getElementById('convert-button').addEventListener('click', function() {
    let azureDef = document.getElementById("azure-name").value;
    let hyperVDef = document.getElementById("hyperV-name").value;
    let lines = document.getElementById("text-input").value;

    if (azureDef === "" || hyperVDef === "" || lines === "") {
        errorToast();
    } else {
        convertText();
    }
});

function removeHtmlTags(text) {
    var div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || div.innerText || "";
}

document.getElementById('copy-button').addEventListener('click', function() {
    const hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.style.position = 'fixed';
    hiddenTextarea.style.top = '0';
    hiddenTextarea.style.left = '0';
    hiddenTextarea.style.opacity = '0';
    hiddenTextarea.value = removeHtmlTags(outputText); // Use removeHtmlTags function here
    document.body.appendChild(hiddenTextarea);
    hiddenTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(hiddenTextarea);

    successToast();
});

//darkmode 

var toggleSwitch = document.getElementById('toggle');

if (localStorage.getItem('darkMode')) {

    document.body.classList.add('dark-mode');

    toggleSwitch.checked = true;
}

toggleSwitch.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {

        localStorage.setItem('darkMode', true);
    } else {
        
        localStorage.removeItem('darkMode');
    }
});

