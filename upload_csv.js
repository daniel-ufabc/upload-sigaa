function docReady(fn) {
    // Vanilla flavor of $('document').ready( ... )
    if (document.readyState === "complete" ||
	document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


var ra2row = {};
var name2row = {};
var grade2index = {"O": 0, "F": 1, "D": 2, "C": 3, "B": 4, "A": 5};
var new_li = null;


function discover_students() {
    // specific to SIGAA
    var tbody = document.getElementById("linha_0").parentElement;
    var len = tbody.children.length;
    var tr, ra, name;

    for (var i = 0; i < len; i ++) {
	tr = tbody.children[i];
	if (tr.nodeName != "TR") {
	    continue;
	}

	ra = tr.children[1].innerText.trim().replace(/\s*--/, "");
	name = tr.children[2].innerText.trim();
	ra2row[ra] = tr;
	name2row[name] = tr;
    }
}


function fill(grade, hours_missed, tr) {
    // specific to SIGAA
    tr.children[6].children[0].value = hours_missed;
    tr.children[3].children[0].value = grade2index[grade];
    tr.children[3].children[0].dispatchEvent(new Event('change'));

    // A flag to make it easy to find students
    //     that were not assigned any grades:
    tr.setAttribute("data-filled", true);
}


function highlight_ignored() {
    // specific to SIGAA
    var tbody = document.getElementById("linha_0").parentElement;
    var len = tbody.children.length;
    var tr, ra, name;

    for (var i = 0; i < len; i ++) {
	tr = tbody.children[i];
	if (tr.nodeName != "TR") {
	    continue;
	}

	if (! tr.hasAttribute('data-filled')) {
	    tr.style.backgroundColor = "#FFFF00";
	}
    }
}


function show_not_processed(text) {
    console.log("Alunos não processados:\n");
    console.log(text);
}


function assign(data) {
    // data contains the whole csv content
    var rows = data.split("\n");
    var n = rows.length;
    var m = rows[0].split(";").length;
    var not_processed = [];
    
    for (var i = 0; i < n; i ++) {
	var row = rows[i].split(";");
	if (row.length < 3) {
	    not_processed.push(rows[i]);
	    continue;
	}
	
	var first = row[0].toString().trim().toUpperCase();
	var second = row[1].toString().trim().toUpperCase();
	var tr = null;

	if (first in ra2row) 
	    tr = ra2row[first];
	else if (first in name2row) 
	    tr = name2row[first];
	else if (m > 3) {
	    if (second in ra2row)
		tr = ra2row[second];
	    else if (second.toUpperCase() in name2row) 
		tr = name2row[second];
	}

	var grade = row[m - 2].trim().toUpperCase();
	var hours_missed = parseInt(row[m - 1]);
	if (tr == null || ! (grade in grade2index) || isNaN(hours_missed)) {
	    not_processed.push(rows[i]);
	    continue;
	}

	fill(grade, hours_missed, tr);
    }

    highlight_ignored();

    if (not_processed.length) {
	var text = "";
	for (var i = 0; i < not_processed.length; i ++)
	    text += not_processed[i] + "\n";
	show_not_processed(text);
    }    
}


function read_file() {
    var file_input = document.getElementById("import_csv_file_input");
    var files = file_input.files;
    
    if (!files.length) {
	alert("Por favor, selecione um arquivo csv.");
	return;
    }

    var file = files[0];
    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
	if (evt.target.readyState == FileReader.DONE) {
	    // console.log(evt.target.result);
            assign(evt.target.result);

	    // If the user (prof.) changes the file on disk and wishes to reload
	    // the same file, we need the onchange event of the file input to
	    // fire again. So let us reset the file input:
	    file_input.value = "";
	}
    };

    var blob = file.slice(0, file.size);
    reader.readAsText(blob);
}


docReady(function () {
    // specific to SIGAA
    discover_students();

    var div = document.querySelector(".descricaoOperacao");

    // create and append file input field
    var file_input = document.getElementById("import_csv_file_input");
    if (file_input != null) {
	    return;
    }

    file_input = document.createElement("input");
    file_input.id = "import_csv_file_input"
    file_input.type = "file";
    file_input.style.display = "none";
    file_input.onchange = read_file;
    div.appendChild(file_input);

    var ul = div.children[0];

    // create and append new instruction in the yellow upper part
    //     with the link to upload csv file.
    var li = document.createElement("li");
    li.innerHTML = "- Para carregar um csv no formato do antigo portal clique ";
    
    var a = document.createElement("a");
    a.innerHTML = "aqui";
    a.style.cursor = "pointer";
    a.style.fontWeight = "bold";
    a.style.color = "#003390";
    li.appendChild(a);
    li.appendChild(document.createTextNode("."));
    
    ul.appendChild(li);
    new_li = li;
    
    a.onclick = function () {
	file_input.click();
	
	// prevent event bubbling
	return false;
    }
});

