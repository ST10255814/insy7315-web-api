export async function downloadFiles(files) {
    for (const file of files) {
        try {
        // Handle both string URLs and file objects
        const fileUrl =
            typeof file === "string" ? file : file.url || file.path || file.src;
        const fileName =
            typeof file === "string"
            ? fileUrl.split("/").pop()
            : file.name || file.filename || fileUrl.split("/").pop();
        if (!fileUrl) {
            console.error("Invalid file URL");
            continue;
        }
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        } catch (error) {
        console.error("Error downloading file:", error);
        }
    }
}