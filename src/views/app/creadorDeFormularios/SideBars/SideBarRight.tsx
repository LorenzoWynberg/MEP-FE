import React from 'react'

import {
  Contenedor,
  SimpleText,
  TextArea,
  SeleccionUnica,
  Checklist,
  Radio,
  Date,
  SwitchInput,
  MultiSelect,
  Location,
  Coordinates,
  ImageUpload,
  FileUpload,
  NestedContainer,
  CRUDTable,
  ReactTable
} from '../SideBars/Propiedades/index.tsx'
import '../styles.scss'

type Props = {
  elemento: number;
  propiedades?: Any;
  show: boolean;
  handleShow: Function;
  handleChange: Function;
};

const SideBarRight: React.FC<Props> = (props) => {
  return (
    <section className='sidebar-right'>
      <header className='sidebar-header'>
        <span className='close-sidebar' onClick={props.handleShow}>
          x
        </span>
        <h4>Propiedades</h4>
      </header>
      <main className='sidebar-main'>
        {
          {
            containerParent: (
              <Contenedor
                {...props.propiedades}
                removeContainer={props.removeContainer}
                handleChange={props.handleContainerChange}
                container={props.item}
              />
            ),
            container: (
              <NestedContainer
                {...props.propiedades}
                removeContainer={props.removeContainer}
                handleChange={props.handleContainerChange}
                container={props.item}
              />
            ),
            text: (
              <SimpleText
                field={props.item}
                handleChange={props.handleChange}
              />
            ),
            textArea: (
              <TextArea field={props.item} handleChange={props.handleChange} />
            ),
            unic: (
              <SeleccionUnica
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            ),
            multiple: (
              <MultiSelect
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            ),
            checklist: (
              <Checklist
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            ),
            radio: (
              <Radio
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            ),
            switch: (
              <SwitchInput
                field={props.item}
                handleChange={props.handleChange}
              />
            ),
            date: <Date field={props.item} handleChange={props.handleChange} />,
            location: (
              <Location field={props.item} handleChange={props.handleChange} />
            ),
            locationExact: (
              <Location field={props.item} handleChange={props.handleChange} />
            ),
            coordinates: (
              <Coordinates
                field={props.item}
                handleChange={props.handleChange}
              />
            ),
            image: (
              <ImageUpload
                field={props.item}
                handleChange={props.handleChange}
              />
            ),
            uploadFile: (
              <FileUpload
                field={props.item}
                handleChange={props.handleChange}
              />
            ),
            crudTable: (
              <CRUDTable
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            ),
            reactTable: (
              <ReactTable
                field={props.item}
                handleChange={props.handleChange}
                selects={props.selects}
              />
            )
          }[props.item.type]
        }
      </main>
    </section>
  )
}

export default SideBarRight
