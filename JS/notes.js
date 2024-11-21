document.addEventListener("DOMContentLoaded", () => {
  let navTitle = document.getElementById("navTitle");
  let createBtn = document.getElementById("createNote");
  const quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ font: ["serif", "sans-serif", "monospace", "fantasy"] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["code-block"],
        [{ blockquote: true }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        ["link"],
      ],
    },
  });
  let tagName = "";
  let flag = false;

  // Fetching notes and selected tags for some conditions
  chrome.storage.local.get(["notes", "selectedTag"], (result) => {
    if (result.selectedTag) {
      tagName = result.selectedTag;
    } else {
      tagName = "General";
    }

    if (!result.notes) {
      chrome.storage.local.set({ notes: [] }, () => {
        console.log(
          "================================================================="
        );
        console.info("Note has been created!!");
        console.warn(
          "Because User first time come and directly press create button !!"
        );
        console.log(
          "================================================================="
        );
      });
    } else {
      result.notes.forEach((note) => {
        if (note.tag == tagName) {
          flag = true;
        }
      });
    }

    // if there is no any tag selected than general tag is addd to tag list
    if (!flag) {
      chrome.storage.local.get({ notes: [] }, (result) => {
        const updatedNotes = [
          ...result.notes,
          { tag: tagName, list: [], plainList: [] },
        ];
        chrome.storage.local.set({ notes: updatedNotes }, () => {
          let spanText = tagName.split(0, 15);
          tagName.length > 15 ? (spanText += "...") : spanText;
          navTitle.innerHTML = `This note is added to &nbsp;"<span>${spanText}</span>"&nbsp;`;
        });
      });
    } else {
      let spanText = tagName.split(0, 15);
      tagName.length > 15 ? (spanText += "...") : spanText;
      navTitle.innerHTML = `This note is added to &nbsp;"<span>${spanText}</span>"&nbsp;`;
    }

    chrome.storage.local.set({ selectedTag: tagName }, () => {
      console.log("===================================");
      console.info("Tag saved:", tagName);
      console.log("===================================");
    });
  });

  createBtn.addEventListener("click", () => {
    const quillContent = quill.root.innerHTML;
    const quillPlainContent = quill.getText();
    if (
      !quillContent ||
      !quillPlainContent ||
      quillContent == "" ||
      quillPlainContent.trim() == ""
    ) {
      console.log("=======================================");
      console.warn("Can not add empty note");
      console.log("=======================================");
    } else {
      chrome.storage.local.get("notes", (result) => {
        const notes = [...result.notes];
        notes.forEach((ele, index) => {
          if (ele.tag == tagName) {
            ele.list.push(quillContent);
            ele.plainList.push(quillPlainContent);
          }
        });
        chrome.storage.local.set({ notes: notes }, () => {
          console.log("=======================================");
          console.info("Note Added Successfully!!");
          console.log("=======================================");
        });
        quill.root.innerHTML = "";
      });
    }
  });
});
