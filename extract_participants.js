function docReady(fn) {
    // Vanilla flavor of $('document').ready( ... )
    if (document.readyState === "complete" ||
	document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

var table = []

function record(td) {
    // console.log(td)
    const name = td.children[1].innerText.trim()
    const ra = td.children[5].innerText.trim()
    const username = td.children[7].innerText.trim()
    const email = td.children[9].innerText.trim()

    table.push({ name, ra, username, email })
}


function discover_students() {
    // specific to SIGAA > Turma > Participantes
    const tbls = document.getElementsByClassName('participantes');
    const tbl = tbls[1]  // tbls[0] contém os dados do docente

    var tbody = tbl.children[0];
    var trs = tbody.children

    var len = trs.length;
    var ra, name, email, username;

    
    for (var i = 1; i < len; i ++) {
        const tr = trs[i];
        const td_len = tr.children.length;
        record(tr.children[1]);
        if (td_len > 4) {
            record(tr.children[4]);
        }
    }   
}


docReady(function () {
    discover_students();
    var text = ''
    table.forEach((row) => {
        text += row.ra + ',' + row.name + ',' + row.username + ',' + row.email + '\n'
    })
    console.log(text)
});

