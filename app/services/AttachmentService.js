// import { getAccessToken } from '../Auth/userManager';
import FileSystem from 'react-native-fs';
import MimeTypeService from './MimeTypeService';
import Analytics from './AnalyticsService';
import Qs from 'qs';
import {
  ApiBaseUrl,
  ApiVersion,
  AzureADClientId,
  ApiResourceIdentifier
} from '../settings';
import { ReactNativeAD } from 'react-native-azure-ad';
const getAccessToken = () => ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier);

const AttachmentFolder = FileSystem.CachesDirectoryPath + "/attachment_cache";

(function ensureCacheFolderExists() {
  console.group("AttachmentService - Setup")
  FileSystem.mkdir(AttachmentFolder, {NSURLIsExcludedFromBackupKey: true})
  .then(() => {
    console.log("Successfully created the backup folder");
  })
  .catch(err => {
    console.log("Failed to setup cache folder");
  });
  console.groupEnd("AttachmentService - Setup")

})();

const globalConfig = { plant: null };

export function setPlant(plant) {
  globalConfig.plant = plant.Id;
}

const paramSerializer = (params) => {
  return Qs.stringify(params, { arrayFormat: 'brackets' });
}

const getUrlForEndpoint = (apiEndpoint, params) => {
  let serializedParams = paramSerializer({...params, "api-version": ApiVersion, plantId: globalConfig.plant});
  return `${ApiBaseUrl}${apiEndpoint}?${serializedParams}`
}


// Documentation located at : 
// https://github.com/itinance/react-native-fs
// const downloadOtions = {
//   fromUrl: string;          // URL to download file from
//   toFile: string;           // Local filesystem path to save the file to
//   headers?: Headers;        // An object of headers to be passed to the server
//   background?: boolean;     // Continue the download in the background after the app terminates (iOS only)
//   discretionary?: boolean;  // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
//   cacheable?: boolean;      // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
//   progressDivider?: number;
//   begin?: (res: DownloadBeginCallbackResult) => void;
//   progress?: (res: DownloadProgressCallbackResult) => void;
//   resumable?: () => void;    // only supported on iOS yet
//   connectionTimeout?: number // only supported on Android yet
//   readTimeout?: number       // supported on Android and iOS
// }


/**
 * 
 * @param {Number} checklistId Checklist ID
 * @param {Number} attachmentId Attachment ID
 * @param {String} mimeType ex. "Image/png"
 * @param {Function<DownloadProgressCallbackResult>} onProgressUpdate Function that gets called during downloading of file
 * 
 * @returns {Promise<String>}  Promise with the local file URL after download
 */
export const downloadChecklistAttachment = (checklistId, attachmentId, mimeType, onProgressUpdate = null) => {
    let remoteUrl = getUrlForEndpoint("CheckList/Attachment", {checkListId: checklistId, attachmentId});
    Analytics.trackEvent('ATTACHMENT_DOWNLOAD_CHECKLIST', {
      mimeType 
    });
    return downloadFromUrl(remoteUrl, attachmentId, mimeType, onProgressUpdate);
}

/**
 * 
 * @param {Number} punchId Punch ID
 * @param {Number} attachmentId Attachment ID
 * @param {String} mimeType ex. "Image/png"
 * @param {Function<DownloadProgressCallbackResult>} onProgressUpdate Function that gets called during downloading of file
 * 
 * @returns {Promise<String>}  Promise with the local file URL after download
 */
export const downloadPunchItemAttachment = (punchId, attachmentId, mimeType, onProgressUpdate = null) => {
  let remoteUrl = getUrlForEndpoint("PunchListItem/Attachment", {punchItemId: punchId, attachmentId});
  Analytics.trackEvent('ATTACHMENT_DOWNLOAD_PUNCHITEM', {
    mimeType 
  });
  return downloadFromUrl(remoteUrl, attachmentId, mimeType, onProgressUpdate);
}

/**
 * Download a file from any given URL
 * 
 * @param {String} remoteUrl Remote location or stream of file
 * @param {Number} fileId local unique ID to be used when caching
 * @param {String} mimeType MimeType
 * @param {Function} onProgressUpdate Callback function that will be executed when progress updates
 * 
 * @returns {Promise<String>}  Promise with the local file URL after download
 */
const downloadFromUrl = async (remoteUrl, fileId, mimeType, onProgressUpdate) => {
  let accessToken = await getAccessToken();
  return new Promise((resolve,reject) => {
    let filetype = MimeTypeService.getFileExtensionForMimeType(mimeType);

    if (!filetype) return null;

    let localFilePath = `${AttachmentFolder}/${fileId}${filetype}`;

    let startTime = new Date();
    // Check if file exists
    FileSystem.exists(localFilePath)
    .then(fileExists => {
      if (fileExists) {
        console.log("File exists, using cached version");
        Analytics.trackEvent('ATTACHMENT_DOWNLOAD_FROM_CACHE');
        resolve(localFilePath);
      }

      return !fileExists
    }).then(shouldDownload => {
      if (!shouldDownload) return;
      
      //Download the file
      FileSystem.downloadFile({
        fromUrl: remoteUrl,
        toFile: localFilePath,
        headers: {
          'Authorization': `bearer ${accessToken}`,
        },
        progress: onProgressUpdate,
        begin: () => {startTime = new Date();}
      }).promise.then(result => {
        if (result.statusCode !== 200) {
          Analytics.trackEvent('ATTACHMENT_DOWNLOAD_FAILED', {
            mimeType,
            responseTime: new Date() - startTime,
            responseCode: result.statsCode
          });
          switch(result.statusCode) {
            case 403: 
              return reject("Unauthorized");
            case 500:
              return reject("Unable to locate file on server");
            default: 
              return reject("Unknown error");
          }
        }
        Analytics.trackEvent('ATTACHMENT_DOWNLOAD_COMPLETE', {
           mimeType,
           responseTime: new Date() - startTime,
           bytesWritten: result.bytesWritten
        });
        resolve(localFilePath);
      }).catch(err => {
        Analytics.trackEvent('ATTACHMENT_DOWNLOAD_FAILED', {
          mimeType,
          responseTime: new Date() - startTime
        });
        console.log("Error downloading file", err);
        reject(err);
      });
    })
    
  });
}

/**
 * Upload an attachment to a specific Checklist
 * 
 * @param {String} localFileUri Filepath for local file
 * @param {Number} checklistId Checklist ID to attach the file to
 * @param {String} mimeType MimeType of the file to upload ex. image/jpeg
 * @param {String} filename Name of file, including file extension
 * @param {String} title Optional title for the file
 * 
 * @returns {Promise<Response>}  Fetch promise
 */
export const uploadChecklistAttachment = (localFileUri, checklistId, mimeType, filename,  title = null) => {
  let params = {checkListId: checklistId};
  if (title) {
    params.title = title;
  }
  let remoteUrl = getUrlForEndpoint("CheckList/Attachment", params);
  return uploadFile(remoteUrl, localFileUri, mimeType, filename)
}

/**
 * Upload an attachment to a specific Punch Item
 * 
 * @param {String} localFileUri Filepath for local file
 * @param {Number} punchId Checklist ID to attach the file to
 * @param {String} mimeType MimeType of the file to upload ex. image/jpeg
 * @param {String} filename Name of file, including file extension
 * @param {String} title Any given title for the file
 * 
 * @returns {Promise<Response>}  Fetch promise
 */
export const uploadPunchItemAttachment = (localFileUri,punchId, mimeType, filename, title = null) => {
  let params = {punchItemId: punchId};
  if (title) {
    params.title = title;
  }
  let remoteUrl = getUrlForEndpoint("PunchListItem/Attachment", params);
  return uploadFile(remoteUrl, localFileUri, mimeType, filename)
}

/**
 * Upload attachment to a temporary storage
 * 
 * @param {String} localFileUri Filepath for local file
 * @param {String} mimeType MimeType of the file to upload ex. image/jpeg
 * @param {String} filename Name of file, including file extension
 * 
 * @returns {{Id: String}} A Promise resolving Json object with ID property
 * 
 * @returns {Promise<Response>}  Fetch promise
 */
export const uploadTemporaryAttachment = (localFileUri, type, filename) => {
  let remoteUrl = getUrlForEndpoint("PunchListItem/TempAttachment");

  return uploadFile(remoteUrl, localFileUri, type, filename)
}

/**
 * Generic helper for uploading files
 * 
 * @param {String} remoteUrl Endpoint to upload to
 * @param {String} localFileUri Local filepath of file to upload
 * @param {String} mimeType MimeType of the file to upload ex. image/jpeg
 * @param {String} filename Name of file, including file extension
 */
const uploadFile = async (remoteUrl, localFileUri, mimeType, filename) => {
  localFileUri = localFileUri.replace('file://','');
  let accessToken = await getAccessToken();
  let data = new FormData();
  data.append("ImportImage", {
    uri: localFileUri,
    type: mimeType,
    name: filename
  });
  
  const startTime = new Date();
  let request =  fetch(remoteUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `bearer ${accessToken}`
    },
    body: data
  }).then(response => {
    console.log('Upload response: ', response);
    Analytics.trackEvent('ATTACHMENT_UPLOAD_COMPLETED', {
      mimeType,
      responseTime: new Date() - startTime
    });
    return response;
  })
  .catch(err => {
    console.log('Error uploading file: ', err.message);
    Analytics.trackEvent('ATTACHMENT_UPLOAD_FAILED', {
      mimeType,
      responseTime: new Date() - startTime
    });
    return err;
  })

  return request;
}

/**
 * List out all files in the cache directory to the console
 * 
 * Currently serves as a reminder that we need to clean up after ourself (called upon start of the app)
 */
export const listAllFiles = () => {
  FileSystem.readDir(AttachmentFolder).then(result => {
    console.log("Files in cache: ", result);
  })
  .catch(err => {
    console.log("Error reading files from cache - ", err);
  })
}

export default {
  downloadChecklistAttachment,
  downloadPunchItemAttachment, 
  listAllFiles, 
  uploadChecklistAttachment, 
  uploadPunchItemAttachment,
  uploadTemporaryAttachment
}
