function sendNotification( notiName, title, message, iconUrl = "icon48.png") {
    chrome.notifications.create( notiName ,{
        type: "basic",
        iconUrl: iconUrl,
        title: title,
        message: message,
    });
    setTimeout(() => {
        chrome.notifications.clear(notiName);
    }, 500);
}