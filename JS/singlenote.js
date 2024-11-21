document.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(window.location.search);
    const tagName = params.get("tagname");
    const noteIndex = params.get("noteindex");

    chrome.storage.local.get(["notes"], (result) => {
        if(!result.notes) {
            alert("No Notes Found")
        } else {
            const notes = [...result.notes];
            const note = notes.find((note) => note.tag === tagName && note.list[noteIndex]);
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
            }
        }
})
});