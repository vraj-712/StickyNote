document.addEventListener("DOMContentLoaded", () => {
const saveBtn = document.getElementById("saveBtn");
const tagInput = document.getElementById("tagInput");
const tagList = document.getElementById("tagList");

saveBtn.addEventListener("click", () => {
  const tagValue = tagInput.value;
  if (tagValue && tagValue.trim() !== "") {
    chrome.storage.local.get({ notes: [] }, (result) => {
      const updatedNotes = [...result.notes, { tag: tagValue, list: [], plainList:[] }];
      chrome.storage.local.set({ notes: updatedNotes }, () => {
        displayTags(updatedNotes);
        chrome.storage.local.set({ selectedTag: tagValue }, () => {
            let pText = document.querySelector(".navbar p");
          let tempSpanText = tagValue.slice(0, 15);
          tagValue.length > 15 ? (tempSpanText += "...") : tempSpanText;
          pText.innerHTML = `Showing All the notes of &nbsp;"<span>${tempSpanText}</span>"&nbsp; tag`;
        })
        tagInput.value = ""; // Clear the input field
      });
    });
  }
});

function displayTags(notes) {
  tagList.innerHTML = "";
  notes.forEach((note, index) => {
    const p = document.createElement("p");
    p.textContent = note.tag;
    p.style.color = "#D6C0B3";
    p.style.padding = "5px";
    p.style.color = "white";
    p.style.fontWeight = "bold";
    p.style.backgroundColor = "#493628";
    p.style.cursor = "pointer";
    p.addEventListener("click", () => {
      let pText = document.querySelector(".navbar p");
      if (p) {
        let tempSpanText = note.tag.slice(0, 15);
        note.tag.length > 15 ? (tempSpanText += "...") : tempSpanText;
        pText.innerHTML = `Showing All the notes of &nbsp;"<span>${tempSpanText}</span>"&nbsp; tag`;
        chrome.storage.local.set({ selectedTag: note.tag }, () => {
          console.log("===============================");
          console.info("Tag saved:", note.tag);
          console.log("===============================");
        });
        displayNotes(note)
      }
    });
    tagList.append(p);
  });
}

// Load notes when the popup opens
chrome.storage.local.get(["notes", "selectedTag"], (result) => {
  let selectedTag = result.selectedTag;
  let pText = document.querySelector(".navbar p");
  let noteObject = [];
  if (selectedTag) {
    let tempSpanText = selectedTag.slice(0, 15);
    selectedTag.length > 15 ? (tempSpanText += "...") : tempSpanText;
    pText.innerHTML = `Showing All the notes of &nbsp;"<span>${tempSpanText}</span>"&nbsp; tag`;
    noteObject = result.notes.filter((note) => note.tag == selectedTag);
  } else {
      if(result.notes) {
        pText.innerHTML = `Showing All the notes of &nbsp;"<span>${'General'}</span>"&nbsp; tag`;
        noteObject = result.notes.filter((note) => note.tag == 'General');
      } else {
        pText.innerHTML = "No notes found."
      }
  }
  displayTags(result.notes || []);
  displayNotes(noteObject.length > 0 ? noteObject[0] : null)
});

function displayNotes(note) {
  let notesHtml = document.querySelector(".notes")
  notesHtml.innerHTML = '';
  if(note) {
    note?.plainList.forEach((ele, index) => {

      let div = document.createElement('div')
      div.classList.add('note')

      let delP = document.createElement('p')
      delP.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#D6C0B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#D6C0B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#D6C0B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#D6C0B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#D6C0B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
      delP.style.display = "flex"
      delP.style.justifyContent = "center"
      delP.style.alignItems = "center"
      delP.style.cursor = "pointer"

      delP.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.storage.local.get({ notes: [] }, (result) => {
          const updatedNotes = [...result.notes];
          updatedNotes.forEach((ele, eleIndex) => {
            if (ele.tag == note.tag) {
              ele.list = ele.list.filter((_, Listindex) => Listindex != index);
              ele.plainList = ele.plainList.filter((_, Listindex) => Listindex != index);
            }
          });
          chrome.storage.local.set({ notes: updatedNotes }, () => {
            console.log("Notes Deleted SuccessFully");
          });
          chrome.storage.local.get(["notes"], (result) => {
            let tempArr = result.notes.filter((noteObj) => noteObj.tag == note.tag)
            displayNotes(tempArr.length > 0 ? tempArr[0] : null);
            displayTags(result.notes);
          });
        })
      })


      let p1 = document.createElement('p')
      p1.textContent = index;
  
      let p2 = document.createElement('p')
      p2.textContent = ele.slice(0,70) + "..."
      p2.style.paddingInlineStart = "10px"
      
      div.append(delP);
      div.append(p1);
      div.append(p2);
      div.addEventListener('click', () => {
        window.location.href = `../HTML/singlenote.html?tagname=${note.tag}&noteindex=${index}`
      })


      notesHtml.append(div);
    })
  }

}
});