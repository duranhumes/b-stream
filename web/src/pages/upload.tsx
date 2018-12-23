import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { Header, Wrapper } from '../components'
import * as trackActions from '../store/actions/track'
import { TrackUpload, TrackUploadProps } from '../interfaces'

type CustomInput =
    | React.FormEvent<HTMLInputElement>
    | React.FormEvent<HTMLTextAreaElement>

class Upload extends React.Component<TrackUploadProps, TrackUpload> {
    formData: FormData | undefined

    constructor(props: TrackUploadProps) {
        super(props)

        this.state = {
            name: '',
            description: '',
            file: undefined,
            isDownloadable: false,
            isExplicit: false,
            tags: [],
        }

        this.formData = undefined
    }

    loadAudioFile = (audioSrc: any) => {
        const audioElement = new Audio()
        audioElement.src = audioSrc
        audioElement.load()
        const setAudioDuration = () =>
            this.formData!.append('duration', String(audioElement.duration))
        audioElement.addEventListener('loadedmetadata', setAudioDuration)
        audioElement.removeEventListener('loadedmetadata', setAudioDuration)
    }

    handleInputUpdates = (e: CustomInput) => {
        const { name, value } = e.currentTarget
        if (name === 'isDownloadable' || name === 'isExplicit') {
            // @ts-ignore
            const checked = e.currentTarget.checked
            this.setState(prevState => ({ ...prevState, [name]: checked }))
            this.formData!.append(name, Number(checked).toString())
        } else if (name === 'file') {
            // @ts-ignore
            const file = e.currentTarget.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            // Load up audio to get pertinent metadata
            reader.addEventListener('load', () =>
                this.loadAudioFile(reader.result)
            )
            reader.removeEventListener('load', () =>
                this.loadAudioFile(reader.result)
            )

            this.setState(prevState => ({ ...prevState, [name]: file }))
            this.formData!.append(name, file)
        } else {
            this.setState(prevState => ({ ...prevState, [name]: value }))
            this.formData!.append(name, value)
        }
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // @ts-ignore
        this.props.uploadTrack(this.formData)
    }

    componentDidMount() {
        this.formData = new FormData()
    }

    render() {
        const {
            name,
            description,
            file,
            isDownloadable,
            isExplicit,
            tags,
        } = this.state

        return (
            <>
                <Header />
                <Wrapper>
                    <div className="container mt-8 pb-5">
                        <h1>Upload</h1>
                        <div className="row">
                            <form
                                role="form"
                                encType="multipart/form-data"
                                onSubmit={this.handleSubmit}>
                                <div className="form-group mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Name"
                                            name="name"
                                            value={name}
                                            onChange={this.handleInputUpdates}
                                            autoFocus={true}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group">
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            placeholder="Description"
                                            value={description}
                                            onChange={this.handleInputUpdates}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            id="file"
                                            name="file"
                                            accept="audio/mp3"
                                            className="custom-file-input"
                                            onChange={this.handleInputUpdates}
                                            required={true}
                                        />
                                        <label
                                            htmlFor="file"
                                            className="custom-file-label">
                                            {file && file.name ? (
                                                <p>{file.name}</p>
                                            ) : (
                                                <p>Choose a track</p>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="isDownloadable"
                                            name="isDownloadable"
                                            checked={isDownloadable}
                                            onChange={this.handleInputUpdates}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="isDownloadable">
                                            <span className="text-muted">
                                                Is it available for download?
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="isExplicit"
                                            name="isExplicit"
                                            checked={isExplicit}
                                            onChange={this.handleInputUpdates}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="isExplicit">
                                            <span className="text-muted">
                                                Does it have explicit words?
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Tags"
                                            name="tags"
                                            value={tags}
                                            onChange={this.handleInputUpdates}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block my-4">
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Wrapper>
            </>
        )
    }
}

const mapStateToProps = ({ track }: any) => ({ track })
const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(trackActions, dispatch)

const mergeProps = (state: any, dispatch: any) => ({
    ...state,
    ...dispatch,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Upload)
