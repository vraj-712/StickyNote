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
          console.log("Tag saved:", note.tag);
        });
      }
    });
    tagList.append(p);
  });
}

// Load notes when the popup opens
chrome.storage.local.get(["notes", "selectedTag"], (result) => {
  let selectedTag = result.selectedTag;
  let pText = document.querySelector(".navbar p");
  if (selectedTag) {
    let tempSpanText = selectedTag.slice(0, 15);
    selectedTag.length > 15 ? (tempSpanText += "...") : tempSpanText;
    pText.innerHTML = `Showing All the notes of &nbsp;"<span>${tempSpanText}</span>"&nbsp; tag`;
  } else {
    pText.textContent = "Showing all the notes";
  }
  // let noteList = result.notes.filter((note) => note.tag === selectedTag);
  displayTags(result.notes || []);
});

// chrome.storage.local.clear(() => {
//   if (chrome.runtime.lastError) {
//     console.error("Error clearing storage:", chrome.runtime.lastError);
//   } else {
//     console.log("Storage cleared successfully!");
//   }
// });
