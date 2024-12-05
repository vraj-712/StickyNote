document.addEventListener("DOMContentLoaded", () => {
  let params = new URLSearchParams(window.location.search);
  const tagName = params.get("tagname");
  const noteIndex = params.get("noteindex");
  const copyEle = document.getElementById("copy");
  let noteData = ""

  chrome.storage.local.get(["notes"], (result) => {
    if (!result.notes) {
      alert("No Notes Found");
      noteData = "";
    } else {
      const notes = [...result.notes];
      const note = notes.find(
        (note) => note.tag === tagName && note.list[noteIndex]
      );
      if (note) {
        const textArea = document.querySelector(".area");
        const quill = new Quill(textArea, {
          theme: "snow",
          readOnly: true,
          modules: {
            toolbar: false,
          },
        });
        quill.root.innerHTML = note.list[noteIndex];
        noteData = note.plainList[noteIndex];
      }
    }
  });

  copyEle.addEventListener("click", () => {
    navigator.clipboard.writeText(noteData);
    const parentEle = copyEle.parentElement;
    console.log(parentEle);
    parentEle.innerHTML = `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"  xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#493628"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#493628" d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z"></path></g></svg>`
  });


});
