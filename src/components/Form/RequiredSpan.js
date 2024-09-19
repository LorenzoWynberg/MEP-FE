import React from 'react'; 
import { UncontrolledTooltip } from 'reactstrap';

function RequiredSpan() {

    return <> <span style={{ color: "red" }} id="tooltipRef">*</span>
        <UncontrolledTooltip style={{color:'red'}} placement="top" target="tooltipRef">
            Requerido
        </UncontrolledTooltip>
    </>
}

export default RequiredSpan;