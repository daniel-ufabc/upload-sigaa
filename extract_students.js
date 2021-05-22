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


function discover_students() {
    // specific to SIGAA
    var table = [];

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
        table.push({ ra, name});
        ra2row[ra] = tr;
        name2row[name] = tr;
    }

    return table;
}


docReady(function () {
    // specific to SIGAA
    const table = discover_students()
    text = ''
    table.forEach((element) => {
        text += element.ra + ',' + element.name + '\n';
    })
    console.log(text)

    
    

});

