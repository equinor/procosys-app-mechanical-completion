const mimeTypes = {
  "audio/aac": [".aac"],
  "application/x-abiword": [".abw"],
  "application/x-freearc": [".arc"],
  "video/x-msvideo": [".avi"],
  "application/vnd.amazon.ebook": [".azw"],
  "application/octet-stream": [".bin"],
  "image/bmp": [".bmp"],
  "application/x-bzip": [".bz"],
  "application/x-bzip2": [".bz2"],
  "application/x-csh": [".csh"],
  "text/css": [".css"],
  "text/csv": [".csv"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-fontobject": [".eot"],
  "application/epub+zip": [".epub"],
  "image/gif": [".gif"],
  "text/html": [".html"],
  "image/vnd.microsoft.icon": [".ico"],
  "text/calendar": [".ics"],
  "application/java-archive": [".jar"],
  "image/jpeg": [".jpeg", ".jpg"],
  "text/javascript": [".js"],
  "application/json": [".json"],
  "audio/midi audio/x-midi": [".midi"],
  "application/javascript": [".mjs"],
  "audio/mpeg": [".mp3"],
  "video/mpeg": [".mpeg"],
  "application/vnd.apple.installer+xml": [".mpkg"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],
  "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
  "application/vnd.oasis.opendocument.text": [".odt"],
  "audio/ogg": [".oga"],
  "video/ogg": [".ogv"],
  "application/ogg": [".ogx"],
  "font/otf": [".otf"],
  "image/png": [".png"],
  "application/pdf": [".pdf"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/x-rar-compressed": [".rar"],
  "application/rtf": [".rtf"],
  "application/x-sh": [".sh"],
  "image/svg+xml": [".svg"],
  "application/x-shockwave-flash": [".swf"],
  "application/x-tar": [".tar"],
  "image/tiff": [".tiff"],
  "font/ttf": [".ttf"],
  "text/plain": [".txt"],
  "application/vnd.visio": [".vsd"],
  "audio/wav": [".wav"],
  "audio/webm": [".weba"],
  "video/webm": [".webm"],
  "image/webp": [".webp"],
  "font/woff": [".woff"],
  "font/woff2": [".woff2"],
  "application/xhtml+xml": [".xhtml"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/xml": [".xml"],
  "text/xml": [".xml"],
  "application/vnd.mozilla.xul+xml": [".xul"],
  "application/zip": [".zip"],
  "video/3gpp": [".3gp"],
  "audio/3gpp": [".3gp"],
  "video/3gpp2": [".3g2"],
  "audio/3gpp2": [".3g2"],
  "application/x-7z-compressed": [".7z"]
};

const getFileExtensionForMimeType = (mimeType) => {
  return mimeTypes[mimeType][0] || null;
}

const getMimeTypeForFileExtension = (extension) => {
  if (!extension.startsWith(".")) {
    extension = "." + extension;
  }
  let hit = null; 
  Object.keys(mimeTypes).some((mimeType) => {
    if (mimeTypes[mimeType].indexOf(extension) != -1) {
      hit = mimeType;
      return true;
    } 
  });
  return hit;

}

export default {
  getFileExtensionForMimeType,
  getMimeTypeForFileExtension
}
