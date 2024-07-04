import React, { useEffect } from 'react'
import axios from 'axios'

import FroalaEditor from 'react-froala-wysiwyg'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/languages/es.js'
import 'froala-editor/js/third_party/spell_checker.min.js'
import 'froala-editor/js/third_party/image_tui.min.js'
import 'froala-editor/css/third_party/image_tui.min.css'

// import { envVariables } from "../../constants/enviroment";
import { useSelector } from 'react-redux'

type IProps = {
    value: string;
    resourcesUrl: string;
    uploadUrl: string;
    onChange: Function;
    companyId: number;
    deleteResourceUrl: string;
    id: number;
    zIndex?: number;
    heightMin?: number;
    redactar?: boolean;
}

const Froala: React.FC<IProps> = (props) => {
  let pr
  useEffect(() => {
    if (props.redactar) {
      pr = 10
    } else {
      pr = 50
    }
  }, [])

  const userToken = useSelector((store) => store.authUser.authObject.user.token)

  // update change
  const handleModelChange = (values: string) => {
    props.onChange(values)
  }

  // handle resource delete
  const handleDeleteResource = async (resource: string) => {
    // `${envVariables.BACKEND_URL}companies/${props.companyId}/editor/delete-resource`
    await axios.delete(props.deleteResourceUrl,
      {
        data: { url: resource }
      }
    )
  }

  return (
    <FroalaEditor
      model={props.value}
      onModelChange={handleModelChange}
      config={{
        heightMin: props.heightMin,
        key: '9KH3cB3D4A3F3G3A2zPAENHMf1JPQRFZBTBf1WWEPYDbB3H3E2A17A19B7B4C6D3E2==',
        spellcheck: false,
        attribution: false,
        imagePaste: true,
        language: 'es',
        zIndex: props.zIndex,
        requestHeaders: { Authorization: `Bearer ${userToken}` },
        imageDefaultWidth: '100%',
        videoDefaultWidth: '100%',

        // Videos
        videoUploadParam: 'file',
        videoUploadURL: props.uploadUrl,
        videoUploadParams: {
          name: props.id,
          type: 'video',
          froala: true
        },
        videoUploadMethod: 'POST',
        videoMaxSize: pr * 1024 * 1024, // 50MB
        videoAllowedTypes: ['webm', 'jpg', 'ogg', 'mp4'],

        // Manager
        imageManagerLoadURL: props.resourcesUrl,
        imageManagerPageSize: 10,
        imageManagerLoadMethod: 'GET',
        // imageManagerLoadParams: {
        //     name: props.id
        // },
        //  `${envVariables.BACKEND_URL}companies/${props.companyId}/editor/delete-resource`
        imageManagerDeleteURL: props.deleteResourceUrl,
        imageManagerDeleteMethod: 'DELETE',

        // Images
        imageUploadParam: 'file',
        imageUploadParams: {
          name: props.id,
          type: 'image',
          froala: true
        },
        imageUploadURL: props.uploadUrl,
        imageUploadMethod: 'POST',
        imageMaxSize: pr * 1024 * 1024, // 50MB

        // File uploading params
        fileUploadParam: 'file',
        fileUploadParams: {
          name: props.id,
          type: 'file',
          froala: true
        },
        fileUploadURL: props.uploadUrl,
        fileUploadMethod: 'POST',
        fileMaxSize: pr * 1024 * 1024, // 50MB
        fileAllowedTypes: ['*'],
        filesManagerMaxSize: 50 * 1024 * 1024, // 50MB
        filesManagerUploadParams: {
          name: props.id | 0,
          type: 'file',
          froala: true
        },
        filesManagerUploadURL: props.uploadUrl,
        events: {
          'file.error': function (error, response) {
            if (error.code == 3) {
              alert('Se ha producido un error subiendo el archivo.')
            }
          },
          'image.removed': function ($img) {
            handleDeleteResource($img.attr('src'))
          },
          'image.error': function (error, response) {
            if (error.code == 3) {
              alert('Se ha producido un error subiendo la imagen.')
            }
          },
          'video.removed': function ($img) {
            handleDeleteResource($img.attr('src'))
          },
          'video.error': function (error, response) {
            if (error.code == 3) {
              alert('Se ha producido un error subiendo el video.')
            }
          },
          'imageManager.beforeDeleteImage': function ($img) {
          },
          'imageManager.imageDeleted': function (data) {
          }
        }
      }}
    />
  )
}

export default Froala
