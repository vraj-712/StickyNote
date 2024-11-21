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
  
      let p1 = document.createElement('p')
      p1.textContent = index;
  
      let p2 = document.createElement('p')
      p2.textContent = ele.slice(0,120) + "..."
      
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
