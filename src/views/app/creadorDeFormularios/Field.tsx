import React, { useRef, useEffect, useMemo } from 'react'
import { DisplayField } from '../../../components/JSONFormParser/utils/fieldsFunction.tsx'
import { useHoverDirty } from 'react-use'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import creadorItems from 'Constants/creadorElementos'
import IntlMessages from '../../../helpers/IntlMessages'
import DeleteIcon from '@material-ui/icons/Delete'
import { injectIntl } from 'react-intl'
import { Col } from 'reactstrap'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'

const Field = ({
  currentField,
  field,
  removeItem,
  handleCreateCol,
  handleCreateRow,
  handleFieldChange,
  multiSelects,
  intl,
  setMultiSelects,
  handleMultiSelectsOptions,
  layout,
  setCurrentField,
  setCurrentContainer,
  setShowSidebarRight,
  showCol,
  children,
  isFirst,
  setCurrentNestedContainer,
  currentNestedContainer,
  dataForm,
  removeNestedContainer,
  control
}) => {
  const { messages } = intl
  const itemRef = useRef(null)
  const isHovering = useHoverDirty(itemRef)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showTimeout, setShowTimeout] = React.useState(null)
  const [type, setType] = React.useState(null)
  const [show, setShow] = React.useState(false)

  const handleClick = (event, currentCreteFunction) => {
    setAnchorEl(event.currentTarget)
    setType(currentCreteFunction)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (isHovering) {
      clearTimeout(showTimeout)
      setShow(isHovering)
    } else {
      setShowTimeout(setTimeout(() => {
        setShow(isHovering)
      }, 400))
    }
  }, [isHovering])
  if (!field) return null
  if (field.type == 'container') {
    return (
      <Col
        xs={12}
        md={field.config.size || 6}
        onClick={() => {
          setCurrentNestedContainer(field)
        }}
      >
        <div
          ref={itemRef}
        >
          <div
            className={`item--relative ${currentNestedContainer.i == field.i && 'h_gray'}`}
            style={{ paddingTop: '3rem' }}
          >
            <DisplayField
              field={field}
              active={currentField?.id === field.id}
              register={() => {}}
              setValue={() => {}}
              watch={() => {}}
              currentContainer={{}}
              files={[]}
              errors={{}}
              pageData={{}}
              getValues={{}}
              currentItem={currentField}
              sendStepperData={() => {}}
              setOpenLayout={() => {}}
              handleSubmit={() => {}}
              multiSelects={multiSelects}
              setMultiSelects={setMultiSelects}
              handleMultiSelectsOptions={handleMultiSelectsOptions}
              tablesData={{}}
              editing
              dataForm={dataForm}
            >
              {children}
            </DisplayField>
            {(show || anchorEl) && !field.row &&
              <AddNewFieldMenu
                anchorEl={anchorEl}
                field={field}
                layout={layout}
                handleClick={handleClick}
                handleClose={handleClose}
                setCurrentField={setCurrentField}
                removeItem={removeNestedContainer}
                col={field.col}
                messages={messages}
                showCol
                nested
              />}
          </div>
        </div>
      </Col>
    )
  }

  return (
    <div
      ref={itemRef}
    >
      <div
        className={`item--relative ${currentField?.id === field.id && 'h_gray'}`}
        onClick={() => {
          setCurrentField(field)
          setShowSidebarRight(true)
        }}
      >
        <DisplayField
          field={field}
          active={currentField?.id === field.id}
          register={() => {}}
          setValue={() => {}}
          watch={() => {}}
          currentContainer={{}}
          files={[]}
          errors={{}}
          pageData={{}}
          getValues={{}}
          currentItem={currentField}
          sendStepperData={() => {}}
          setOpenLayout={() => {}}
          handleSubmit={() => {}}
          multiSelects={multiSelects}
          setMultiSelects={setMultiSelects}
          control={control}
          handleMultiSelectsOptions={handleMultiSelectsOptions}
          tablesData={{}}
        >
          {children}
        </DisplayField>
        {(show || anchorEl) &&
          <AddNewFieldMenu
            anchorEl={anchorEl}
            field={field}
            layout={layout}
            handleClick={handleClick}
            handleClose={handleClose}
            handleCreate={type == 'col' ? handleCreateCol : type == 'change' ? handleFieldChange : handleCreateRow}
            removeItem={removeItem}
            col={field.col}
            messages={messages}
            showCol={showCol}
            isFirst={isFirst}
          />}
      </div>
    </div>
  )
}

const AddNewFieldMenu = ({
  anchorEl,
  handleClick,
  handleClose,
  handleCreate,
  field,
  removeItem,
  layout,
  col,
  messages,
  showCol,
  nested,
  setCurrentField,
  isFirst
}) => {
  return (
    <StyledAddContainer>
      {layout.w >= 2 && isFirst && !nested && <IconBox aria-controls='simple-menu' onClick={(e) => handleClick(e, 'row')} style={{ cursor: 'pointer' }}>
        <ArrowRightAltIcon />
                                              </IconBox>}
      {layout.w >= 2 && showCol && !nested && <IconBox aria-controls='simple-menu' onClick={(e) => handleClick(e, 'col')} style={{ cursor: 'pointer' }}>
        <ArrowDownwardIcon />
                                              </IconBox>}
      <IconBox aria-controls='simple-menu' onClick={(e) => removeItem(field)} style={{ cursor: 'pointer' }}>
        <DeleteIcon />
      </IconBox>
      <IconBox
        aria-controls='simple-menu' style={{ width: 110 }} onClick={() => {
          nested && setCurrentField({})
        }}
      >
        <p style={{ paddingTop: '15px', fontSize: '12px', textAlign: 'center' }}>{`${messages[creadorItems.find(item => item.id == field.type)?.label]}`}</p>
      </IconBox>
      <IconBox aria-controls='simple-menu' onClick={(e) => handleClick(e, 'change')} style={{ cursor: 'pointer' }}>
        <CompareArrowsIcon />
      </IconBox>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose(col)}
      >
        {creadorItems.filter((_, i) => i != 0).map(option => {
          return (
            <MenuItem onClick={() => {
              handleCreate(layout, field, option)
              handleClose(col)
            }}
            >
              <IntlMessages id={option.label} />
            </MenuItem>
          )
        })}
      </Menu>
    </StyledAddContainer>
  )
}

const StyledAddContainer = styled.div`
    position: absolute;
    display: flex;
    top: -6px;
    right: 0;
    background-color: white;
    border-radius: 9px;
    border: 1px solid rgba(194, 191, 191, 0.317);
    justify-content: space-evenly;
    overflow: hidden;
    height: 25px;
`

const IconBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    border-right: 1px solid rgba(236, 235, 235, 0.317);
    border-left: 1px solid rgba(236, 235, 235, 0.317);
    width:40;
    &:hover{
        background-color: rgba(236, 235, 235, 0.317);
    }
`

export default injectIntl(Field)
