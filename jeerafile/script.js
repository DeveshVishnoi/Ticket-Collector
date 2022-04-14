/** @format */
// first creat modal

let addbtn = document.querySelector(".addbtn");
let removebtn = document.querySelector(".removebtn");
let maincont = document.querySelector(".main-cont");
let textarea = document.querySelector(".textarea-cont");
let modalcont = document.querySelector(".modal-cont");
let allprioritycolor = document.querySelectorAll(".priority-color");
let toolboxcolor = document.querySelectorAll(".color");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalprioritycolor = colors[colors.length - 1];
let lockelem = document.querySelector(".ticket-lock");

let addflag = false;
let removeflag = false;

let lockclass = "fa-lock";
let unlockclass = "fa-lock-open";

let arr = [];

if (localStorage.getItem("jeera_ticket")) {
  // retrive and display the ticket
  arr = JSON.parse(localStorage.getItem("jeera_ticket"));
  arr.forEach((ticketobj) => {
    createTicket(
      ticketobj.ticketcolor,
      ticketobj.tickettask,
      ticketobj.ticketid
    );
  });
}

// listener for modal priority coloring changes

allprioritycolor.forEach((colorelem, idx) => {
  colorelem.addEventListener("click", (e) => {
    allprioritycolor.forEach((prioritycolorelem, idx) => {
      prioritycolorelem.classList.remove("border");
    });
    colorelem.classList.add("border");

    modalprioritycolor = colorelem.classList[0];
  });
}); // now finally by border is toggeling
addbtn.addEventListener("click", (e) => {
  //Display modal
  //Generate Ticket

  // AddFlag is True then I show mY modal
  // if Addflag is False then I show None means remove Modal

  addflag = !addflag;
  if (addflag) {
    modalcont.style.display = "flex";
    // for this command it shows flex otherwise shows none
  } else {
    modalcont.style.display = "none";
  }
});

removebtn.addEventListener("click", (e) => {
  removeflag = !removeflag;
});

for (let i = 0; i < toolboxcolor.length; i++) {
  toolboxcolor[i].addEventListener("click", (e) => {
    let currtoolboxcolor = toolboxcolor[i].classList[0];
    let filtertickets = arr.filter((ticketobj, idx) => {
      return currtoolboxcolor === ticketobj.ticketcolor;
    });

    // remove tickets
    let allticketcont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allticketcont.length; i++) {
      allticketcont[i].remove();
    }

    //display new filtered tickets
    filtertickets.forEach((ticketobj, idx) => {
      createTicket(
        ticketobj.ticketcolor,
        ticketobj.tickettask,
        ticketobj.ticketid
      );
    });
  });

  toolboxcolor[i].addEventListener("dblclick", (e) => {
    let allticketcont = document.querySelectorAll(".ticket-cont");
    for (let i = 0; i < allticketcont.length; i++) {
      allticketcont[i].remove();
    }
    arr.forEach((ticketobj, idx) => {
      createTicket(
        ticketobj.ticketcolor,
        ticketobj.tickettask,
        ticketobj.ticketid
      );
    });
  });
}

modalcont.addEventListener("keydown", (e) => {
  let key = e.key;
  if (key === "Shift") {
    createTicket(modalprioritycolor, textarea.value);
    addflag = false;
    setmodaltodefault();
  }
});

function createTicket(ticketcolor, tickettask, ticketid) {
  let id = ticketid || shortid();
  let ticketcont = document.createElement("div");
  ticketcont.setAttribute("class", "ticket-cont");
  ticketcont.innerHTML = `

      <div class="ticket-color ${ticketcolor}"></div>
      <div class="ticket-id">#${ticketid}</div>
      <div class="task-area">${tickettask}</div> 
      <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>
  `;
  maincont.appendChild(ticketcont);

  // create object of ticket and add to array
  if (!ticketid) {
    arr.push({ ticketcolor, tickettask, ticketid: id });
    localStorage.setItem("jeera_ticket", JSON.stringify(arr));
  }

  handelremove(ticketcont, id);
  handellock(ticketcont, id);
  handelcolor(ticketcont, id);
}
//remove function
function handelremove(ticket, id) {
  //remove.flag > true then remove
  ticket.addEventListener("click", (e) => {
    if (!removeflag) return;

    let idx = getticketid(id);
    arr.splice(idx, 1); // DB removal
    let strarr = JSON.stringify(arr);
    localStorage.setItem("jeera_ticket", strarr);
    ticket.remove(); // Ui removal
  });
}
// lock function
function handellock(ticket, id) {
  let ticketlockelem = ticket.querySelector(".ticket-lock");
  let ticketlock = ticketlockelem.children[0];
  let tickettaskarea = ticket.querySelector(".task-area");

  ticketlock.addEventListener("click", (e) => {
    let ticketid = getticketid(id);

    if (ticketlock.classList.contains(lockclass)) {
      ticketlock.classList.remove(lockclass);
      ticketlock.classList.add(unlockclass);
      //lock krne ke baad content change krnma
      tickettaskarea.setAttribute("contenteditable", "true");
    } else {
      ticketlock.classList.remove(unlockclass);
      ticketlock.classList.add(lockclass);
      //unlock hone ke baad content change na krna
      tickettaskarea.setAttribute("contenteditable", "false");
    }

    //Modify data iin local storage(ticket task)
    arr[ticketid].tickettask = tickettaskarea.innerText;
    localStorage.setItem("jeera_ticket", JSON.stringify(arr));
  });
}

function handelcolor(ticket, id) {
  let ticketcolor = ticket.querySelector(".ticket-color");
  ticketcolor.addEventListener("click", (e) => {
    //get ticket index fron ticket arr

    let ticketid = getticketid(id);
    let currticketcolor = ticketcolor.classList[1];

    // get ticket color index
    let currcolorticketidx = colors.findIndex((color) => {
      return currticketcolor === color;
    });

    currcolorticketidx++;
    let newticketcoloridx = currcolorticketidx % colors.length;
    let newticketcolor = colors[newticketcoloridx];
    ticketcolor.classList.remove(currticketcolor);
    ticketcolor.classList.add(newticketcolor);

    //modify data in local storage (proortiy color change)
    arr[ticketid].ticketcolor = newticketcolor;
    localStorage.setItem("jeera_ticket", JSON.stringify(arr));
  });
}

function getticketid(id) {
  let ticketid = arr.findIndex((ticketobj) => {
    return ticketobj.ticketid === id;
  });
  return ticketid;
}

function setmodaltodefault() {
  modalcont.style.display = "none";
  textarea.value = "";
  modalprioritycolor = color[color.length - 1];
  allprioritycolor.forEach((prioritycolorelem, idx) => {
    prioritycolorelem.classList.remove("border");
  });
  allprioritycolor[allprioritycolor.length - 1].classList.add("border");
}
