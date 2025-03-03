export interface UploadFileContextType {
    downloadUrl: string ;
    downloadFilename: string ;
    setDownloadLink: (url: string, filename: string) => void;
  }