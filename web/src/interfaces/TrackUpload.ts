export interface TrackUpload {
    name: string
    description: string
    file: File | undefined
    isDownloadable: boolean
    isExplicit: boolean
    tags: string[]
    album: undefined
    trackNumber: number
    genres: string[]
    artist: undefined
    trackArtwork: File | undefined
}

export interface TrackUploadProps {
    uploadTrack: (data: TrackUpload) => {}
}
