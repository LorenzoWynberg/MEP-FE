import React, { useEffect, useRef, useState } from 'react'
import Froala from '../../../../components/Froala/index'

import SettingsIcon from '@material-ui/icons/Settings'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeleteIcon from '@material-ui/icons/Delete'
import { Typography, Button } from '@material-ui/core'
import { cloneDeep } from 'lodash'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import ViewQuestion from './index'
import EditIcon from '@material-ui/icons/Edit'
import ItemMenu from '../Edit/OptionsMenu'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

type IProps = {
    question: object;
    isActive: boolean;
    handleImagesOpen: (object) => void;
    onChange: (any) => void;
    uploadUrl: string;
    resourcesUrl: string;
    deleteResourceUrl: string;
    removeActiveElement: () => void;
}

const QuestionEditorContainer: React.FC<IProps> = (props) => {
  const questionRef = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    props.addQuestionRef(props.question.id, questionRef)
  }, [questionRef])

  const handleModelChange = (value) => {
    props.onChange(value, 'label')
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div
      style={{
        paddingBottom: '5px',
        paddingRight: '1rem',
        paddingLeft: '1rem',
        backgroundColor: !preview ? '#eaeaea' : '',
        position: 'relative',
        boxShadow: !preview ? '0 14px 15px rgb(0 0 0 / 12%), 0 1px 6px rgb(0 0 0 / 4%)' : '',
        borderRadius: '15px',
        marginBottom: '4rem'
      }}
      id={`${props.question.id}-${props.question.idx}`}
      className='draggableQuestions'
      index={props.idx}
      key={`${props.question.id}-${props.question.idx}`}
      draggable={props.questionHovered && !preview}
      onDragStart={async (e) => {
        e.stopPropagation()
        props.dragStart(`${props.question.id}-${props.question.idx}`, 'draggableQuestions', props.parentDOMId, e)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setPreview(false)
      }}
      ref={questionRef}
      onDragEnd={(e) => {
        e.stopPropagation()
        props.dragEnd(e, props.form.questions[props.parentId], async (elements) => {
          const questions = props.getQuestionIndexes({ ...props.form, questions: { ...props.form.questions, [props.parentId]: elements } })
          const questionContainers = cloneDeep(props.form.questionContainers)
          await props.setForm({ ...props.form, questionContainers: [], questions: { ...props.form.questions, [props.parentId]: [] } })
          props.setForm({ ...props.form, questionContainers, questions })
        })
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {!preview
        ? <>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem', padding: '1rem' }}>
            <Typography variant='body1'>
              {props.question.idx + 1}.
            </Typography>
            <Button color='primary' variant='contained' onClick={handleClick}>
              <span style={{ marginRight: '1rem' }}><EditIcon /></span> {props.question.typeLabel}
            </Button>
          </div>
          <Froala
            zIndex={10}
            uploadUrl={props.uploadUrl}
            resourcesUrl={props.resourcesUrl}
            deleteResourceUrl={props.deleteResourceUrl}
            value={props.question.label}
            onChange={handleModelChange}
          />
        </>
        : <div style={{ display: 'flex', width: '100%' }}>
          <Typography variant='body1'>
            {props.question.idx + 1}.
          </Typography>
          <div style={{ paddingTop: '3px' }}>
            <FroalaEditorView model={props.question.label} />
          </div>

        </div>}
        {
          preview && (
            <div
              onClick={() => setPreview(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  setPreview(false)
                }
              }}
              style={{
                cursor: 'pointer'
              }}
            >
              <VisibilityOff />
            </div>
          )
        }
      <div style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%' }}>
        <ViewQuestion
          parentId={props.parentId}
          handleImagesOpen={props.handleImagesOpen}
          active={!preview}
          question={props.question}
          preview={preview}
          {...props.dragAndDropUtils}
          onChange={props.onChange}
        />
      </div>
      {!preview &&
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <VisibilityIcon
              style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setPreview(true)
              }}
            />
            <SettingsIcon style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => props.openSettings()} />
            <FileCopyIcon style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => props.openDuplicates()} />
            <DeleteIcon style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => props.deleteQuestion()} />
          </div>
        </>}
      <ItemMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        addQuestion={props.changeQuestion}
        handleClose={() => setAnchorEl(null)}
        onClose={() => setAnchorEl(null)}
        getIcon={props.getIcon}
        questionId={props.question.id}
        fields={props.fields}
        changePopUp
        parentId={props.parentId}
      />
    </div>
  )
}

export default QuestionEditorContainer
